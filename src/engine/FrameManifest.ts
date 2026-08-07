/**
 * Home of Smiles Dental - 150 High-Quality Keyframe Manifest
 * Maps global scroll indices 0..149 to sequential scene frames.
 */

export interface FrameManifestEntry {
  globalIndex: number; // 0 to 149
  frameNumber: number; // 1 to 150
  frameStr: string;    // "001" to "150"
  path: string;        // "/assets/optimized-150/frame-001.png"
  sceneId: number;     // 1 to 5
}

export const TOTAL_FRAMES = 150;

export interface SceneDefinition {
  id: number;
  name: string;
  badge: string;
  title: string;
  tagline: string;
  startFrame: number; // 0-based
  endFrame: number;   // 0-based
}

export const SCENES: SceneDefinition[] = [
  {
    id: 1,
    name: 'INITIAL PATHOLOGY',
    badge: '01 // DIAGNOSIS',
    title: 'Damaged Jaw & Structural Misalignment',
    tagline: 'Deep enamel erosion, cavity formation, and crooked alignment requiring advanced restorative intervention.',
    startFrame: 0,
    endFrame: 29,
  },
  {
    id: 2,
    name: '3D CBCT DIAGNOSTICS',
    badge: '02 // 3D X-RAY SCAN',
    title: 'Sub-Surface Holographic Nerve & Root Mapping',
    tagline: 'Ultra-low radiation volumetric tomography reveals hidden internal root canals, nerve pathways, and bone density.',
    startFrame: 30,
    endFrame: 57,
  },
  {
    id: 3,
    name: 'LASER & ORTHODONTIC CARE',
    badge: '03 // TREATMENT',
    title: 'Painless Laser Sterilization & Teeth Alignment',
    tagline: 'Micro-decay eradication via Er:YAG laser followed by custom clear archwires gently guiding teeth into alignment.',
    startFrame: 58,
    endFrame: 89,
  },
  {
    id: 4,
    name: 'BIOMIMETIC RESTORATION',
    badge: '04 // PERFECT ENAMEL',
    title: 'Healthy Porcelain Enamel & Gingival Harmony',
    tagline: 'VITA BL1 lithium disilicate ceramic veneers restore flawless bite dynamics and diamond specular luster.',
    startFrame: 90,
    endFrame: 111,
  },
  {
    id: 5,
    name: '360° SMILE REVEAL',
    badge: '05 // YOUR NEW SMILE',
    title: 'Complete Facial Harmony & Confident Smile',
    tagline: 'The perfected 3D jaw smoothly rotates 360° and integrates seamlessly into a radiant, natural human smile.',
    startFrame: 112,
    endFrame: 149,
  },
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
