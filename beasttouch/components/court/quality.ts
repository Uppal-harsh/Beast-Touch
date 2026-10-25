import { courtConfig } from './config';

export type SceneQuality = 'high' | 'low';

export function initialQuality(): SceneQuality {
  if (typeof window === 'undefined') return 'high';
  const device = navigator as Navigator & { deviceMemory?: number };
  const smallScreen = window.matchMedia('(max-width: 700px)').matches;
  const reducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches;
  return smallScreen || reducedData || (device.hardwareConcurrency ?? 8) <= 4 || (device.deviceMemory ?? 8) <= 4 ? 'low' : 'high';
}

export function maxDpr(quality: SceneQuality): number {
  if (quality === 'low') return Math.min(window.devicePixelRatio || 1, courtConfig.performance.mobileDpr);
  return Math.min(window.devicePixelRatio || 1, courtConfig.performance.desktopDpr);
}
