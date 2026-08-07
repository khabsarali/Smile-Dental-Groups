import { FRAME_MANIFEST, TOTAL_FRAMES, getResolutionTierPath, PREVIEW_POSTER_PATH } from './FrameManifest';

export type FrameAsset = ImageBitmap | HTMLImageElement;

export interface FrameLoaderConfig {
  maxRamCacheFrames?: number;
  lookaheadWindow?: number;
  lookbehindWindow?: number;
  maxConcurrentDownloads?: number;
}

export class FrameLoader {
  private cache: Map<number, FrameAsset> = new Map();
  private loadingPromises: Map<number, Promise<FrameAsset | null>> = new Map();
  private queue: number[] = [];
  private activeDownloads = 0;
  private previewPoster: HTMLImageElement | null = null;

  private maxRamCacheFrames: number;
  private lookaheadWindow: number;
  private lookbehindWindow: number;
  private maxConcurrentDownloads: number;
  private lastTargetFrame = 0;
  private scrollDirection: 'down' | 'up' = 'down';

  constructor(config: FrameLoaderConfig = {}) {
    this.maxRamCacheFrames = config.maxRamCacheFrames || 30; // Strict RAM ceiling (< 25MB)
    this.lookaheadWindow = config.lookaheadWindow || 15;
    this.lookbehindWindow = config.lookbehindWindow || 6;
    this.maxConcurrentDownloads = config.maxConcurrentDownloads || 6;

    // Load ultra-lightweight preview poster (< 8 KB) immediately on init
    if (typeof window !== 'undefined') {
      const poster = new Image();
      poster.src = PREVIEW_POSTER_PATH;
      this.previewPoster = poster;
    }
  }

  public isFrameLoaded(index: number): boolean {
    return this.cache.has(index);
  }

  public getCachedFrame(index: number): FrameAsset | null {
    if (this.cache.has(index)) {
      return this.cache.get(index)!;
    }

    // Bidirectional nearest neighbor lookup (instant fallback, never blank)
    for (let offset = 1; offset <= 14; offset++) {
      if (this.cache.has(index - offset)) {
        return this.cache.get(index - offset)!;
      }
      if (this.cache.has(index + offset)) {
        return this.cache.get(index + offset)!;
      }
    }

    return this.cache.get(0) || this.previewPoster || null;
  }

  public async loadFrame(index: number): Promise<FrameAsset | null> {
    if (index < 0 || index >= TOTAL_FRAMES) return null;

    if (this.cache.has(index)) {
      return this.cache.get(index)!;
    }

    // Reuse existing in-flight Promise to prevent duplicate network requests
    if (this.loadingPromises.has(index)) {
      return this.loadingPromises.get(index)!;
    }

    const path = getResolutionTierPath(index);
    if (!path) return null;

    const promise = (async () => {
      try {
        const response = await fetch(path, { cache: 'force-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();

        const w = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const resizeWidth = w < 768 ? 768 : w < 1280 ? 1280 : 1920;

        if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
          // Off-thread hardware GPU decoding
          const bitmap = await createImageBitmap(blob, {
            resizeWidth,
            resizeQuality: 'medium',
          });
          this.cache.set(index, bitmap);
          return bitmap;
        } else {
          const img = new Image();
          img.src = path;
          if ('decode' in img) {
            await img.decode();
          }
          this.cache.set(index, img);
          return img;
        }
      } catch {
        return new Promise<FrameAsset | null>((resolve) => {
          const img = new Image();
          img.src = path;
          img.onload = () => {
            this.cache.set(index, img);
            resolve(img);
          };
          img.onerror = () => {
            resolve(null);
          };
        });
      } finally {
        this.loadingPromises.delete(index);
        this.activeDownloads = Math.max(0, this.activeDownloads - 1);
        this.processQueue();
      }
    })();

    this.loadingPromises.set(index, promise);
    this.activeDownloads++;
    return promise;
  }

  public unloadFrame(index: number): void {
    // Protect Anchor Frame 0 and Frame 149
    if (index === 0 || index === TOTAL_FRAMES - 1) return;

    if (this.cache.has(index)) {
      const asset = this.cache.get(index);
      if (asset && 'close' in asset && typeof (asset as ImageBitmap).close === 'function') {
        try {
          (asset as ImageBitmap).close();
        } catch {
          // ignore
        }
      }
      this.cache.delete(index);
    }
  }

  public preloadFrames(start: number, end: number, isHighPriority = false): void {
    const min = Math.max(0, Math.min(start, end));
    const max = Math.min(TOTAL_FRAMES - 1, Math.max(start, end));

    for (let i = min; i <= max; i++) {
      if (this.cache.has(i) || this.loadingPromises.has(i)) continue;

      if (isHighPriority) {
        this.queue = [i, ...this.queue.filter((q) => q !== i)];
      } else {
        if (!this.queue.includes(i)) {
          this.queue.push(i);
        }
      }
    }

    this.processQueue();
  }

  private processQueue(): void {
    while (this.queue.length > 0 && this.activeDownloads < this.maxConcurrentDownloads) {
      const nextIndex = this.queue.shift();
      if (nextIndex !== undefined && !this.cache.has(nextIndex) && !this.loadingPromises.has(nextIndex)) {
        this.loadFrame(nextIndex);
      }
    }
  }

  public evictDistantFrames(currentFrame: number): void {
    if (this.cache.size <= this.maxRamCacheFrames) return;

    for (const [idx] of this.cache.entries()) {
      if (idx === 0 || idx === TOTAL_FRAMES - 1) continue;

      const distance = Math.abs(idx - currentFrame);
      if (distance > 20) {
        this.unloadFrame(idx);
      }
    }
  }

  public onScrollProgress(currentFrameIndex: number): void {
    const direction = currentFrameIndex >= this.lastTargetFrame ? 'down' : 'up';
    this.lastTargetFrame = currentFrameIndex;
    this.scrollDirection = direction;

    this.evictDistantFrames(currentFrameIndex);

    // Immediate Priority 1: Current frame & next adjacent frame
    this.preloadFrames(currentFrameIndex, currentFrameIndex + (direction === 'down' ? 1 : -1), true);

    // Priority 2: Directional Streamer
    if (direction === 'down') {
      const forwardEnd = Math.min(TOTAL_FRAMES - 1, currentFrameIndex + this.lookaheadWindow);
      this.preloadFrames(currentFrameIndex + 2, forwardEnd, false);

      const backwardStart = Math.max(0, currentFrameIndex - this.lookbehindWindow);
      this.preloadFrames(backwardStart, currentFrameIndex - 1, false);
    } else {
      const backwardStart = Math.max(0, currentFrameIndex - this.lookaheadWindow);
      this.preloadFrames(backwardStart, currentFrameIndex - 2, false);

      const forwardEnd = Math.min(TOTAL_FRAMES - 1, currentFrameIndex + this.lookbehindWindow);
      this.preloadFrames(currentFrameIndex + 1, forwardEnd, false);
    }
  }

  public async initialBootstrap(): Promise<void> {
    // Step 1: Immediate Frame 001 (< 0.05s)
    await this.loadFrame(0);

    // Step 2: Priority 1 to 5
    this.preloadFrames(1, 5, true);

    // Step 3: Anchor Frame 150 (Smiling Woman) in background
    this.preloadFrames(TOTAL_FRAMES - 1, TOTAL_FRAMES - 1, false);

    // Step 4: Scene 1 Background Streamer (Frames 6 to 25)
    this.preloadFrames(6, 25, false);
  }
}

// Global Singleton FrameLoader instance
export const globalFrameLoader = new FrameLoader();
