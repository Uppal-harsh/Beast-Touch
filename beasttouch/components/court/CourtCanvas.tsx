'use client';

import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import Court from './Court';
import SneakerModel from './SneakerModel';
import CameraRig from './CameraRig';
import Hotspot from './Hotspot';
import { courtConfig, type CourtCanvasProps, type SneakerId } from './config';
import { initialQuality, maxDpr, type SceneQuality } from './quality';

const Effects = lazy(() => import('./Effects'));

function FrameMetrics({ target }: { target: RefObject<HTMLDivElement | null> }) {
  const frames = useRef(0);
  const started = useRef(0);
  useFrame(({ gl }) => {
    const drawCalls = gl.info.render.calls;
    const triangles = gl.info.render.triangles;
    gl.info.reset();
    const now = performance.now();
    if (!started.current) started.current = now;
    frames.current++;
    if (now - started.current < 1000 || !target.current) return;
    Object.assign(target.current.dataset, {
      renderFps: (frames.current * 1000 / (now - started.current)).toFixed(1),
      drawCalls: String(drawCalls),
      triangles: String(triangles),
      textures: String(gl.info.memory.textures),
      geometries: String(gl.info.memory.geometries),
      dpr: gl.getPixelRatio().toFixed(2),
    });
    frames.current = 0;
    started.current = now;
  });
  return null;
}

function ReadySignal({ onReady, onError }: { onReady?: () => void; onError?: () => void }) {
  const { gl } = useThree();
  const notified = useRef(false);
  const ready = useRef(onReady);
  const readyFrame = useRef<number | null>(null);
  ready.current = onReady;
  useFrame(() => {
    if (notified.current) return;
    notified.current = true;
    readyFrame.current = requestAnimationFrame(() => ready.current?.());
  });
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onError?.(); };
    gl.domElement.addEventListener('webglcontextlost', lost);
    return () => {
      gl.domElement.removeEventListener('webglcontextlost', lost);
      if (readyFrame.current !== null) cancelAnimationFrame(readyFrame.current);
    };
  }, [gl, onError]);
  return null;
}

function DustAndCones() {
  const atmosphere = courtConfig.atmosphere;
  const positions = useMemo(() => {
    const values = new Float32Array(courtConfig.performance.dustCount * 3);
    let seed = 8237;
    const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let index = 0; index < courtConfig.performance.dustCount; index++) {
      values[index * 3] = (random() - 0.5) * atmosphere.dustWidth;
      values[index * 3 + 1] = 0.6 + random() * atmosphere.dustHeight;
      values[index * 3 + 2] = 5 - random() * atmosphere.dustDepth;
    }
    return values;
  }, []);
  return <>
    <points frustumCulled={false}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color={atmosphere.dustColor} size={atmosphere.dustSize} transparent opacity={atmosphere.dustOpacity} depthWrite={false} sizeAttenuation />
    </points>
    {atmosphere.cones.map((cone) => <mesh key={cone.color} position={cone.position}>
      <coneGeometry args={[cone.radius, cone.height, 28, 1, true]} />
      <meshBasicMaterial color={cone.color} transparent opacity={cone.opacity} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>)}
  </>;
}

function ContactShadows() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    const settings = courtConfig.contactShadow;
    canvas.width = canvas.height = settings.textureSize;
    const context = canvas.getContext('2d');
    if (context) {
      const center = settings.textureSize / 2;
      const gradient = context.createRadialGradient(center, center, settings.innerRadius, center, center, settings.outerRadius);
      for (const [stop, color] of settings.gradient) gradient.addColorStop(stop, color);
      context.fillStyle = gradient;
      context.fillRect(0, 0, settings.textureSize, settings.textureSize);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return <>
    {courtConfig.sneakers.map((sneaker) => <mesh key={sneaker.id} position={[sneaker.position[0], courtConfig.contactShadow.y, sneaker.position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={courtConfig.contactShadow.size} />
      <meshBasicMaterial map={texture} transparent opacity={courtConfig.contactShadow.opacity} depthWrite={false} polygonOffset polygonOffsetFactor={-1} />
    </mesh>)}
  </>;
}

function SceneLights({ quality, focused }: { quality: SceneQuality; focused: boolean }) {
  const lights = courtConfig.lighting;
  const ambient = useRef<THREE.AmbientLight>(null);
  const warm = useRef<THREE.SpotLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  useFrame((_, delta) => {
    const factor = 1 - Math.exp(-Math.min(delta, 0.05) * lights.damping);
    if (ambient.current) ambient.current.intensity = THREE.MathUtils.lerp(ambient.current.intensity, focused ? lights.ambient.focusedIntensity : lights.ambient.intensity, factor);
    if (warm.current) warm.current.intensity = THREE.MathUtils.lerp(warm.current.intensity, focused ? lights.warmSpot.focusedIntensity : lights.warmSpot.intensity, factor);
    if (rim.current) rim.current.intensity = THREE.MathUtils.lerp(rim.current.intensity, focused ? lights.coolRim.focusedIntensity : lights.coolRim.intensity, factor);
  });
  return <>
    <ambientLight ref={ambient} color={lights.ambient.color} intensity={lights.ambient.intensity} />
    <hemisphereLight args={[lights.hemisphere.sky, lights.hemisphere.ground, lights.hemisphere.intensity]} />
    <spotLight ref={warm} position={lights.warmSpot.position} angle={lights.warmSpot.angle} penumbra={lights.warmSpot.penumbra} intensity={lights.warmSpot.intensity} color={lights.warmSpot.color} castShadow={quality === 'high'} shadow-mapSize={[lights.warmSpot.shadowMapSize, lights.warmSpot.shadowMapSize]} shadow-bias={lights.warmSpot.shadowBias} />
    <directionalLight ref={rim} position={lights.coolRim.position} color={lights.coolRim.color} intensity={lights.coolRim.intensity} />
    <pointLight position={lights.fill.position} color={lights.fill.color} intensity={quality === 'high' ? lights.fill.highIntensity : lights.fill.lowIntensity} distance={lights.fill.distance} decay={lights.fill.decay} />
  </>;
}

function Scene({ progress, reducedMotion, focusedSneaker, variant, onSelectSneaker, onFocusComplete, quality, pointer, active, onReady, onError }: CourtCanvasProps & {
  quality: SceneQuality;
  pointer: RefObject<{ x: number; y: number }>;
  active: boolean;
}) {
  const [hoveredSneaker, setHoveredSneaker] = useState<SneakerId | null>(null);
  useEffect(() => setHoveredSneaker(null), [focusedSneaker]);
  return <>
    <color attach="background" args={[courtConfig.colors.background]} />
    <fogExp2 attach="fog" args={[courtConfig.colors.background, courtConfig.fog.density]} />
    <ReadySignal onReady={onReady} onError={onError} />
    <CameraRig progress={progress} focusedSneaker={focusedSneaker} reducedMotion={reducedMotion} pointer={pointer} active={active} onFocusComplete={onFocusComplete} />
    <SceneLights quality={quality} focused={focusedSneaker !== null} />
    {quality === 'high' && <Suspense fallback={null}><Environment frames={1} resolution={courtConfig.lighting.environment.resolution} background={false}>
      <Lightformer form="rect" color={courtConfig.lighting.environment.warm.color} intensity={courtConfig.lighting.environment.warm.intensity} position={courtConfig.lighting.environment.warm.position} scale={courtConfig.lighting.environment.warm.scale} />
      <Lightformer form="rect" color={courtConfig.lighting.environment.cool.color} intensity={courtConfig.lighting.environment.cool.intensity} position={courtConfig.lighting.environment.cool.position} scale={courtConfig.lighting.environment.cool.scale} />
    </Environment></Suspense>}
    <Court quality={quality} reducedMotion={reducedMotion} />
    <ContactShadows />
    {courtConfig.sneakers.map((sneaker) => <group key={sneaker.id} position={sneaker.position}>
      <SneakerModel variant={focusedSneaker === sneaker.id ? variant : sneaker.variant} highlighted={focusedSneaker !== null ? focusedSneaker === sneaker.id : hoveredSneaker === sneaker.id} reducedMotion={reducedMotion} rotation={sneaker.rotation} />
      <Hotspot id={sneaker.id} focusedSneaker={focusedSneaker} onSelect={onSelectSneaker} onHover={setHoveredSneaker} />
    </group>)}
    {quality === 'high' && <DustAndCones />}
    {quality === 'high' && !reducedMotion && <Suspense fallback={null}><Effects /></Suspense>}
  </>;
}

export default function CourtCanvas({ progress, reducedMotion, focusedSneaker, variant, onSelectSneaker, onFocusComplete, suspended = false, onReady, onError }: CourtCanvasProps) {
  const stage = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [quality, setQuality] = useState<SceneQuality>(initialQuality);
  const [offscreen, setOffscreen] = useState(false);

  useEffect(() => {
    const element = stage.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting), { threshold: 0.01 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const updatePointer = useCallback((clientX: number, clientY: number) => {
    const rect = stage.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    pointer.current.x = THREE.MathUtils.clamp((clientX - rect.left) / rect.width * 2 - 1, -1, 1);
    pointer.current.y = THREE.MathUtils.clamp(1 - (clientY - rect.top) / rect.height * 2, -1, 1);
  }, []);

  useEffect(() => {
    if (reducedMotion || suspended || offscreen) { pointer.current.x = 0; pointer.current.y = 0; return; }
    const moved = (event: PointerEvent) => updatePointer(event.clientX, event.clientY);
    window.addEventListener('pointermove', moved, { passive: true });
    return () => window.removeEventListener('pointermove', moved);
  }, [reducedMotion, suspended, offscreen, updatePointer]);

  const demand = reducedMotion || offscreen || suspended;
  return <div
    ref={stage}
    className="court-stage"
    data-quality={quality}
    data-progress={THREE.MathUtils.clamp(progress, 0, 1).toFixed(3)}
    data-focused={focusedSneaker ?? 'none'}
    data-frameloop={demand ? 'demand' : 'always'}
    style={{ width: '100%', height: '100%' }}
  >
      <Canvas
        shadows={quality === 'high'}
        dpr={[1, maxDpr(quality)]}
        frameloop={demand ? 'demand' : 'always'}
        camera={{ position: courtConfig.camera.intro, fov: courtConfig.camera.fov, near: courtConfig.camera.near, far: courtConfig.camera.far }}
        gl={{ antialias: quality === 'low', alpha: false, powerPreference: quality === 'low' ? 'default' : 'high-performance' }}
        onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = courtConfig.renderer.exposure; gl.outputColorSpace = THREE.SRGBColorSpace; gl.info.autoReset = false; }}
      >
        <FrameMetrics target={stage} />
        <PerformanceMonitor onDecline={() => setQuality('low')} />
        <Scene progress={progress} reducedMotion={reducedMotion} focusedSneaker={focusedSneaker} variant={variant} onSelectSneaker={onSelectSneaker} onFocusComplete={onFocusComplete} suspended={suspended} quality={quality} pointer={pointer} active={!offscreen} onReady={onReady} onError={onError} />
      </Canvas>
  </div>;
}
