/**
 * Home of Smiles Dental - 150 High-Quality Keyframe Manifest
 * Intelligently sampled from original 284 master images to preserve the full 6-phase dental journey.
 */

export interface FrameManifestEntry {
  globalIndex: number; // 0 to 149
  frameNumber: number; // 1 to 150
  frameStr: string;    // "001" to "150"
  path: string;        // "/assets/optimized-150/frame-001.png"
}

export const TOTAL_FRAMES = 150;

function build150Manifest(): FrameManifestEntry[] {
  const entries: FrameManifestEntry[] = new Array(TOTAL_FRAMES);

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const frameNumber = i + 1;
    const frameStr = String(frameNumber).padStart(3, '0');
    entries[i] = {
      globalIndex: i,
      frameNumber,
      frameStr,
      path: `/assets/optimized-150/frame-${frameStr}.png`,
    };
  }

  return entries;
}

export const FRAME_MANIFEST: FrameManifestEntry[] = build150Manifest();

// 6 Transformation Phases breakdown within the 150 frames
export const PHASES = [
  { phase: 1, name: 'Damaged Jaw & Crooked Teeth Diagnostics', startFrame: 1, endFrame: 30 },
  { phase: 2, name: 'Digital 3D CBCT Holographic X-Ray & Root Mapping', startFrame: 31, endFrame: 58 },
  { phase: 3, name: 'Orthodontic Braces & Laser Treatment', startFrame: 59, endFrame: 90 },
  { phase: 4, name: 'Healthy Porcelain Teeth & Whitening Alignment', startFrame: 91, endFrame: 112 },
  { phase: 5, name: 'Jaw to Face 360° Transformation & Mouth Integration', startFrame: 113, endFrame: 132 },
  { phase: 6, name: 'Smiling Woman Reveal & Radiant Confident Smile', startFrame: 133, endFrame: 150 },
];
