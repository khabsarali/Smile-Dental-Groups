/**
 * Home of Smiles Dental - 1,199 Master Frame Manifest
 * Maps global scroll indices 0..1198 to sequential scene frame paths.
 */

export interface FrameManifestEntry {
  globalIndex: number;
  sceneId: number;
  localIndex: number;
  folder: string;
  path: string;
}

export interface SceneDefinition {
  id: number;
  folder: string;
  name: string;
  frameCount: number;
}

export const SCENES: SceneDefinition[] = [
  { id: 1, folder: 'scene-1', name: 'Damaged Jaw Anti-Gravity Rotation', frameCount: 300 },
  { id: 2, folder: 'scene-2', name: 'Digital 3D Holographic CBCT Scan', frameCount: 299 },
  { id: 3, folder: 'scene-3', name: 'Orthodontic Aligners & Laser Surgery', frameCount: 300 },
  { id: 4, folder: 'scene-4', name: 'Healthy Enamel & Radiant Smile Reveal', frameCount: 300 },
];

export const TOTAL_FRAMES = 1199; // 300 + 299 + 300 + 300

// Generate complete 1,199 frame manifest with O(1) direct index lookup
function buildManifest(): FrameManifestEntry[] {
  const entries: FrameManifestEntry[] = new Array(TOTAL_FRAMES);
  let globalIndex = 0;

  for (const scene of SCENES) {
    for (let local = 1; local <= scene.frameCount; local++) {
      const frameStr = String(local).padStart(3, '0');
      entries[globalIndex] = {
        globalIndex,
        sceneId: scene.id,
        localIndex: local,
        folder: scene.folder,
        path: `/assets/scenes/${scene.folder}/ezgif-frame-${frameStr}.png`,
      };
      globalIndex++;
    }
  }

  return entries;
}

export const FRAME_MANIFEST: FrameManifestEntry[] = buildManifest();

// Scene boundary helpers for scene-aware streaming
export const SCENE_BOUNDARIES = {
  SCENE_1_START: 0,
  SCENE_1_END: 299,
  SCENE_2_START: 300,
  SCENE_2_END: 598,
  SCENE_3_START: 599,
  SCENE_3_END: 898,
  SCENE_4_START: 899,
  SCENE_4_END: 1198,
};
