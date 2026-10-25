'use client';

import { Bloom, EffectComposer, Noise, SMAA, Vignette } from '@react-three/postprocessing';
import { courtConfig } from './config';

export default function Effects() {
  const { effects } = courtConfig;
  return <EffectComposer multisampling={effects.multisampling}>
    <SMAA />
    <Bloom mipmapBlur luminanceThreshold={effects.bloom.luminanceThreshold} intensity={effects.bloom.intensity} />
    <Vignette eskil={false} offset={effects.vignette.offset} darkness={effects.vignette.darkness} />
    <Noise opacity={effects.noiseOpacity} />
  </EffectComposer>;
}
