/**
 * Home of Smiles Dental - 284 Master Frame Manifest
 * Sequential 3D Scroll Journey: ezgif-frame-001.png -> ezgif-frame-284.png
 */

export interface FrameManifestEntry {
  globalIndex: number; // 0 to 283
  frameNumber: number; // 1 to 284
  frameStr: string;    // "001" to "284"
  path: string;        // "/assets/sequence/ezgif-frame-001.png"
}

export const TOTAL_FRAMES = 284;

function build284Manifest(): FrameManifestEntry[] {
  const entries: FrameManifestEntry[] = new Array(TOTAL_FRAMES);

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const frameNumber = i + 1;
    const frameStr = String(frameNumber).padStart(3, '0');
    entries[i] = {
      globalIndex: i,
      frameNumber,
      frameStr,
      path: `/assets/sequence/ezgif-frame-${frameStr}.png`,
    };
  }

  return entries;
}

export const FRAME_MANIFEST: FrameManifestEntry[] = build284Manifest();
