export type SneakerVariant = 'Oxblood' | 'Forest' | 'Indigo';
export type SneakerId = 'origin' | 'weave' | 'night';
export type Vec3 = [number, number, number];

export const courtConfig = {
  colors: { background: '#080b0e', accent: '#D85D3A', secondary: '#8CB9D0', paper: '#F3EEDC', floor: '#9b7150' },
  variants: { Oxblood: '#8c302a', Forest: '#34594a', Indigo: '#344f82' },
  durations: { intro: 2.5, focus: 1.2, tint: 0.4 },
  camera: {
    fov: 40,
    near: 0.05,
    far: 75,
    intro: [14, 11.4, 24] as Vec3,
    stops: [[13, 8.5, 18], [8.5, 5.2, 9], [6.5, 4.5, 4.5], [10, 6.5, -6]] as Vec3[],
    targets: [[0, 1.2, 0], [-1, 1.2, -2], [0, 1.5, -4], [0, 1, -5]] as Vec3[],
    focusOffset: [3.4, 2.2, 5.4] as Vec3,
    focusAimOffset: [0, 0.25, 0] as Vec3,
    maxPointerAngleDeg: 3,
    pointerDamping: 3,
    pathDamping: 4,
    easingPower: 4, // GSAP power3.inOut equivalent.
    maxFrameDelta: 0.25,
  },
  fog: { density: 0.022 },
  lighting: {
    damping: 5,
    ambient: { color: '#b6bdc5', intensity: 0.35, focusedIntensity: 0.1 },
    hemisphere: { sky: '#d7c7ad', ground: '#101419', intensity: 0.38 },
    warmSpot: { position: [-4, 11, 3] as Vec3, angle: 0.52, penumbra: 0.85, intensity: 58, focusedIntensity: 24, color: '#f1bf81', shadowMapSize: 2048, shadowBias: -0.0002 },
    coolRim: { position: [6, 8, -8] as Vec3, intensity: 2.8, focusedIntensity: 1.2, color: '#8cb9d0' },
    fill: { position: [1.5, 4, 5] as Vec3, color: '#dfa879', highIntensity: 18, lowIntensity: 11, distance: 13, decay: 2 },
    environment: {
      resolution: 128,
      warm: { position: [-5, 8, 1] as Vec3, scale: [7, 4, 1] as Vec3, color: '#f3d4a8', intensity: 2.5 },
      cool: { position: [5, 7, -8] as Vec3, scale: [5, 4, 1] as Vec3, color: '#8cb9d0', intensity: 1.6 },
    },
  },
  effects: {
    multisampling: 0,
    bloom: { luminanceThreshold: 1.05, intensity: 0.55 },
    vignette: { offset: 0.25, darkness: 0.45 },
    noiseOpacity: 0.025,
  },
  hotspot: { offset: [0, 1.55, 0] as Vec3, distanceFactor: 12, zIndexRange: [10, 0] as [number, number] },
  contactShadow: {
    y: 0.035, size: [4.2, 2.3] as [number, number], opacity: 0.5,
    textureSize: 128, innerRadius: 5, outerRadius: 62,
    gradient: [[0, '#00000099'], [0.45, '#00000055'], [1, '#00000000']] as [number, string][],
  },
  atmosphere: {
    dustColor: '#f1dec0', dustSize: 0.035, dustOpacity: 0.28,
    dustWidth: 27, dustHeight: 8, dustDepth: 26,
    cones: [
      { position: [-4.5, 5.8, -1] as Vec3, radius: 2.8, height: 10, color: '#e8ad6b', opacity: 0.022 },
      { position: [5.8, 5.8, -8] as Vec3, radius: 2.6, height: 10, color: '#8cb9d0', opacity: 0.017 },
    ],
  },
  sneakers: [
    { id: 'origin', name: 'BT—01 / The Origin', label: 'OXBLOOD · FIRST EXPRESSION', position: [-3.6, 1.7, 1.2] as Vec3, rotation: 0.3, variant: 'Oxblood' },
    { id: 'weave', name: 'BT—01 / The Weave', label: 'FOREST · WOVEN ROOTS', position: [0.2, 1.7, -3.3] as Vec3, rotation: -0.25, variant: 'Forest' },
    { id: 'night', name: 'BT—01 / After Hours', label: 'INDIGO · CITY NIGHTS', position: [4, 1.7, -6.6] as Vec3, rotation: 0.4, variant: 'Indigo' },
  ] satisfies { id: SneakerId; name: string; label: string; position: Vec3; rotation: number; variant: SneakerVariant }[],
  performance: { desktopDpr: 1.75, mobileDpr: 1.25, dustCount: 180, lowScreenWidth: 820, lowCpuCores: 4, lowMemoryGb: 4 },
  renderer: { exposure: 1.05 },
} as const;

export type CourtCanvasProps = {
  progress: number;
  reducedMotion: boolean;
  focusedSneaker: SneakerId | null;
  variant: SneakerVariant;
  onSelectSneaker: (id: SneakerId) => void;
  onFocusComplete: (id: SneakerId) => void;
  onReady?: () => void;
  onError?: () => void;
  suspended?: boolean;
};
