/**
 * Home of Smiles Dental - 150 High-Quality Keyframe Manifest
 * Maps global scroll indices 0..149 to sequential scene frames.
 */

export interface FrameManifestEntry {
  globalIndex: number; // 0 to 149
  frameNumber: number; // 1 to 150
  frameStr: string;    // "001" to "150"
  path: string;        // "/assets/optimized-150/frame-001.png"
  sceneId: number;     // 1 to 6
}

export const TOTAL_FRAMES = 150;

export interface SceneDefinition {
  id: number;
  name: string;
  startFrame: number; // 0-based
  endFrame: number;   // 0-based
}

export const SCENES: SceneDefinition[] = [
  { id: 1, name: 'Damaged Jaw & Initial Pathology', startFrame: 0, endFrame: 29 },
  { id: 2, name: 'Digital 3D CBCT X-Ray Scan', startFrame: 30, endFrame: 57 },
  { id: 3, name: 'Orthodontic Braces & Laser Treatment', startFrame: 58, endFrame: 89 },
  { id: 4, name: 'Healthy Porcelain Teeth & Whitening', startFrame: 90, endFrame: 111 },
  { id: 5, name: 'Jaw to Face 360° Transformation', startFrame: 112, endFrame: 131 },
  { id: 6, name: 'Smiling Woman & Final Confident Smile', startFrame: 132, endFrame: 149 },
];

function build150Manifest(): FrameManifestEntry[] {
  const entries: FrameManifestEntry[] = new Array(TOTAL_FRAMES);

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const frameNumber = i + 1;
    const frameStr = String(frameNumber).padStart(3, '0');
    
    let sceneId = 1;
    for (const scene of SCENES) {
      if (i >= scene.startFrame && i <= scene.endFrame) {
        sceneId = scene.id;
        break;
      }
    }

    entries[i] = {
      globalIndex: i,
      frameNumber,
      frameStr,
      path: `/assets/optimized-150/frame-${frameStr}.png`,
      sceneId,
    };
  }

  return entries;
}

export const FRAME_MANIFEST: FrameManifestEntry[] = build150Manifest();
