import { courtConfig } from './config';

export type SceneQuality = 'high' | 'low';

export function initialQuality(): SceneQuality {
  if (typeof window === 'undefined') return 'high';
  const device = navigator as Navigator & { deviceMemory?: number };
  const smallScreen = window.innerWidth <= courtConfig.performance.lowScreenWidth;
  const reducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches;
  return smallScreen || reducedData || (device.hardwareConcurrency ?? 8) <= courtConfig.performance.lowCpuCores || (device.deviceMemory ?? 8) <= courtConfig.performance.lowMemoryGb ? 'low' : 'high';
}

export function maxDpr(quality: SceneQuality): number {
  const deviceDpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  if (quality === 'low') return Math.min(deviceDpr, courtConfig.performance.mobileDpr);
  return Math.min(deviceDpr, courtConfig.performance.desktopDpr);
}
