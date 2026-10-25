'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { courtConfig, type SneakerId } from './config';

type Transition = {
  fromPosition: THREE.Vector3;
  fromAim: THREE.Vector3;
  toPosition: THREE.Vector3;
  toAim: THREE.Vector3;
  elapsed: number;
  id: SneakerId | null;
};

type CameraRigProps = {
  progress: number;
  focusedSneaker: SneakerId | null;
  reducedMotion: boolean;
  pointer: RefObject<{ x: number; y: number }>;
  active: boolean;
  onFocusComplete: (id: SneakerId) => void;
};

const easeInOut = (value: number, power: number) => {
  const factor = 2 ** (power - 1);
  return value < 0.5 ? factor * value ** power : 1 - factor * (1 - value) ** power;
};

export default function CameraRig({ progress, focusedSneaker, reducedMotion, pointer, active, onFocusComplete }: CameraRigProps) {
  const { camera, invalidate } = useThree();
  const path = useMemo(() => new THREE.CatmullRomCurve3(courtConfig.camera.stops.map((point) => new THREE.Vector3(...point))), []);
  const aimPath = useMemo(() => new THREE.CatmullRomCurve3(courtConfig.camera.targets.map((point) => new THREE.Vector3(...point))), []);
  const pathPosition = useMemo(() => new THREE.Vector3(), []);
  const pathAim = useMemo(() => new THREE.Vector3(), []);
  const currentAim = useRef(new THREE.Vector3(...courtConfig.camera.targets[0]));
  const introElapsed = useRef(reducedMotion ? courtConfig.durations.intro : 0);
  const transition = useRef<Transition | null>(null);
  const previousFocus = useRef<SneakerId | null>(focusedSneaker);
  const dampedPointer = useRef({ x: 0, y: 0 });
  const completion = useRef(onFocusComplete);
  completion.current = onFocusComplete;

  useEffect(() => {
    if (reducedMotion) introElapsed.current = courtConfig.durations.intro;
    invalidate();
  }, [reducedMotion, invalidate]);

  useEffect(() => {
    if (previousFocus.current === focusedSneaker && focusedSneaker === null) return;
    previousFocus.current = focusedSneaker;
    if (focusedSneaker) introElapsed.current = courtConfig.durations.intro;
    const target = courtConfig.sneakers.find((item) => item.id === focusedSneaker);
    const focusOffset = courtConfig.camera.focusOffset;
    const aimOffset = courtConfig.camera.focusAimOffset;
    const toPosition = target
      ? new THREE.Vector3(target.position[0] + focusOffset[0], target.position[1] + focusOffset[1], target.position[2] + focusOffset[2])
      : path.getPoint(THREE.MathUtils.clamp(progress, 0, 1));
    const toAim = target
      ? new THREE.Vector3(target.position[0] + aimOffset[0], target.position[1] + aimOffset[1], target.position[2] + aimOffset[2])
      : aimPath.getPoint(THREE.MathUtils.clamp(progress, 0, 1));
    transition.current = {
      fromPosition: camera.position.clone(),
      fromAim: currentAim.current.clone(),
      toPosition,
      toAim,
      elapsed: 0,
      id: focusedSneaker,
    };
    invalidate();
    // Progress changes are sampled continuously during ordinary travel. Focus changes own timed transitions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedSneaker, camera, aimPath, path, invalidate]);

  useFrame((_, rawDelta) => {
    if (!active) return;
    const delta = Math.min(rawDelta, courtConfig.camera.maxFrameDelta);
    const t = THREE.MathUtils.clamp(progress, 0, 1);
    path.getPoint(t, pathPosition);
    aimPath.getPoint(t, pathAim);

    if (transition.current) {
      const flight = transition.current;
      flight.elapsed = reducedMotion ? courtConfig.durations.focus : Math.min(courtConfig.durations.focus, flight.elapsed + delta);
      const eased = easeInOut(flight.elapsed / courtConfig.durations.focus, courtConfig.camera.easingPower);
      camera.position.copy(flight.fromPosition).lerp(flight.toPosition, eased);
      currentAim.current.copy(flight.fromAim).lerp(flight.toAim, eased);
      if (flight.elapsed >= courtConfig.durations.focus) {
        transition.current = null;
        if (flight.id) completion.current(flight.id);
      }
    } else if (focusedSneaker === null) {
      introElapsed.current = reducedMotion ? courtConfig.durations.intro : Math.min(courtConfig.durations.intro, introElapsed.current + delta);
      const intro = easeInOut(introElapsed.current / courtConfig.durations.intro, courtConfig.camera.easingPower);
      const source = courtConfig.camera.intro;
      if (introElapsed.current < courtConfig.durations.intro) {
        camera.position.set(
          THREE.MathUtils.lerp(source[0], pathPosition.x, intro),
          THREE.MathUtils.lerp(source[1], pathPosition.y, intro),
          THREE.MathUtils.lerp(source[2], pathPosition.z, intro),
        );
      } else {
        camera.position.lerp(pathPosition, reducedMotion ? 1 : 1 - Math.exp(-delta * courtConfig.camera.pathDamping));
      }
      currentAim.current.lerp(pathAim, reducedMotion ? 1 : 1 - Math.exp(-delta * courtConfig.camera.pathDamping));
    }

    const targetX = reducedMotion || focusedSneaker ? 0 : pointer.current.x;
    const targetY = reducedMotion || focusedSneaker ? 0 : pointer.current.y;
    dampedPointer.current.x = THREE.MathUtils.damp(dampedPointer.current.x, targetX, courtConfig.camera.pointerDamping, delta);
    dampedPointer.current.y = THREE.MathUtils.damp(dampedPointer.current.y, targetY, courtConfig.camera.pointerDamping, delta);
    const point = dampedPointer.current;
    const magnitude = Math.max(1, Math.hypot(point.x, point.y));
    const radius = Math.tan(THREE.MathUtils.degToRad(courtConfig.camera.maxPointerAngleDeg)) * camera.position.distanceTo(currentAim.current);
    camera.lookAt(currentAim.current.x + point.x * radius / magnitude, currentAim.current.y + point.y * radius / magnitude, currentAim.current.z);

    if (transition.current || introElapsed.current < courtConfig.durations.intro) invalidate();
  });

  useEffect(() => { invalidate(); }, [progress, active, invalidate]);
  return null;
}
