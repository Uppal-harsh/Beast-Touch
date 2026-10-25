export type SneakerVariant = 'Oxblood' | 'Forest' | 'Indigo';
export type SneakerId = 'origin' | 'weave' | 'night';
export type Vec3 = [number, number, number];

export const courtConfig = {
  colors: { background: '#080b0e', accent: '#D85D3A', secondary: '#8CB9D0', paper: '#F3EEDC', floor: '#9b7150' },
  variants: { Oxblood: '#8c302a', Forest: '#34594a', Indigo: '#344f82' },
  durations: { intro: 2.5, focus: 1.2, tint: 0.4 },
  camera: {
    fov: 40,
    intro: [17, 18, 23] as Vec3,
    stops: [[13, 8.5, 18], [8.5, 5.2, 9], [6.5, 4.5, 4.5], [10, 6.5, -6]] as Vec3[],
    targets: [[0, 1.2, 0], [-1, 1.2, -2], [0, 1.5, -4], [0, 1, -5]] as Vec3[],
  },
  sneakers: [
    { id: 'origin', name: 'BT—01 / The Origin', label: 'OXBLOOD · FIRST EXPRESSION', position: [-3.6, 1.7, 1.2] as Vec3, rotation: 0.3, variant: 'Oxblood' },
    { id: 'weave', name: 'BT—01 / The Weave', label: 'FOREST · WOVEN ROOTS', position: [0.2, 1.7, -3.3] as Vec3, rotation: -0.25, variant: 'Forest' },
    { id: 'night', name: 'BT—01 / After Hours', label: 'INDIGO · CITY NIGHTS', position: [4, 1.7, -6.6] as Vec3, rotation: 0.4, variant: 'Indigo' },
  ] satisfies { id: SneakerId; name: string; label: string; position: Vec3; rotation: number; variant: SneakerVariant }[],
  performance: { desktopDpr: 1.75, mobileDpr: 1.25, dustCount: 180 },
} as const;

export type CourtCanvasProps = {
  progress: number;
  reducedMotion: boolean;
  focusedSneaker: SneakerId | null;
  variant: SneakerVariant;
  onSelectSneaker: (id: SneakerId) => void;
  onFocusComplete: (id: SneakerId) => void;
  suspended?: boolean;
};
