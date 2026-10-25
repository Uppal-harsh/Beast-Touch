'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

function Court({ area, reduced }: { area:number; reduced:boolean }) {
  const { camera, pointer } = useThree();
  const target = useMemo(()=>new THREE.Vector3(),[]);
  const group = useRef<THREE.Group>(null);
  const texture = useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
    const ctx=canvas.getContext('2d')!;ctx.fillStyle='#b3a797';ctx.fillRect(0,0,512,512);
    let seed=42;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
    for(let i=0;i<42000;i++){const v=rand();ctx.fillStyle=`rgba(${v>.5?'255,250,235':'44,32,24'},${rand()*.09})`;ctx.fillRect(rand()*512,rand()*512,rand()*3,rand()*2)}
    const t=new THREE.CanvasTexture(canvas);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(5,5);t.colorSpace=THREE.SRGBColorSpace;return t;
  },[]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  useFrame((_,dt)=>{
    const dx=reduced?0:pointer.x*.22;const dy=reduced?0:pointer.y*.1;
    target.set(area===1?2.3+dx:area===2?-1.6+dx:.6+dx,3.5+dy,11.8);
    camera.position.lerp(target,1-Math.exp(-dt*2));camera.lookAt(0,1,-3);
  });
  const lines = useMemo(()=>{
    const pts:THREE.Vector3[][]=[];
    pts.push([new THREE.Vector3(-12,.025,-6),new THREE.Vector3(12,.025,-6),new THREE.Vector3(12,.025,13),new THREE.Vector3(-12,.025,13),new THREE.Vector3(-12,.025,-6)]);
    pts.push([new THREE.Vector3(-12,.025,3),new THREE.Vector3(12,.025,3)]);
    pts.push(Array.from({length:97},(_,i)=>new THREE.Vector3(Math.cos(i/96*Math.PI*2)*3.2,.025,3+Math.sin(i/96*Math.PI*2)*3.2)));
    pts.push([new THREE.Vector3(-4,.025,-6),new THREE.Vector3(-4,.025,-.5),new THREE.Vector3(4,.025,-.5),new THREE.Vector3(4,.025,-6)]);
    return pts.map(points=>new THREE.BufferGeometry().setFromPoints(points));
  },[]);
  useEffect(()=>()=>lines.forEach(x=>x.dispose()),[lines]);
  const wallColor=area===1?'#aa8c6f':area===2?'#b4a998':'#b7aa98';
  return <group ref={group}>
    <color attach="background" args={['#c5b8a4']}/>
    <fog attach="fog" args={['#c5b8a4',20,47]}/>
    <ambientLight intensity={1.25}/><hemisphereLight args={['#fff8e8','#635343',2]}/>
    <directionalLight position={[-6,10,6]} intensity={3} color="#fff4d7" castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-14}/>
    <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[70,70]}/><meshStandardMaterial color="#aa9c87" map={texture} roughness={.86}/></mesh>
    <mesh position={[0,6,-9]} receiveShadow><boxGeometry args={[36,12,.5]}/><meshStandardMaterial color={wallColor} map={texture} roughness={1}/></mesh>
    <mesh position={[0,1.2,-8.7]}><boxGeometry args={[36,2.4,.08]}/><meshStandardMaterial color={area===1?'#696754':'#863e35'} roughness={1}/></mesh>
    <mesh position={[0,2.45,-8.64]}><boxGeometry args={[36,.06,.09]}/><meshStandardMaterial color="#ddd0b5"/></mesh>
    {[-15,-10,-5,0,5,10,15].map((x)=><mesh key={x} position={[x,6,-8.65]}><boxGeometry args={[.18,12,.28]}/><meshStandardMaterial color="#9a8e7b" roughness={1}/></mesh>)}
    {lines.map((g,i)=><primitive key={i} object={new THREE.Line(g,new THREE.LineBasicMaterial({color:'#e5d5ae',transparent:true,opacity:.65}))}/>)}
    <group position={[7.3,4.7,-8.1]}>
      <mesh><boxGeometry args={[3.1,1.85,.14]}/><meshStandardMaterial color="#ccc1a7" roughness={.8}/></mesh>
      <mesh position={[0,-.2,.09]}><planeGeometry args={[1.2,.85]}/><meshBasicMaterial color="#7b302c"/></mesh>
      <mesh position={[0,-.2,.1]}><planeGeometry args={[1.06,.71]}/><meshBasicMaterial color="#d1c6ae"/></mesh>
      <mesh position={[0,-.75,.58]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.48,.035,8,40]}/><meshStandardMaterial color="#652820"/></mesh>
      {Array.from({length:12},(_,i)=><mesh key={i} position={[Math.cos(i/12*Math.PI*2)*.38,-1.08,.58+Math.sin(i/12*Math.PI*2)*.38]} rotation={[0,0,Math.sin(i)*.15]}><cylinderGeometry args={[.012,.012,.65,4]}/><meshStandardMaterial color="#e6d9b9"/></mesh>)}
    </group>
    <group position={[-9,.2,-5]} rotation={[0,.2,0]}><mesh castShadow><boxGeometry args={[3.2,.2,.8]}/><meshStandardMaterial color="#675e4b"/></mesh>{[-1.2,1.2].map(x=><mesh key={x} position={[x,-.15,0]}><boxGeometry args={[.12,.5,.6]}/><meshStandardMaterial color="#493e31"/></mesh>)}</group>
    {[0,1,2].map(i=><mesh key={i} position={[10+i*.8,.38,-6]} rotation={[0,0,.1]} castShadow><coneGeometry args={[.2,.75,16]}/><meshStandardMaterial color="#c36a2d"/></mesh>)}
    <mesh position={[-6,8,2]} rotation={[0,.3,-.5]}><boxGeometry args={[.15,16,.2]}/><meshStandardMaterial color="#756d5b"/></mesh>
  </group>
}

export default function CourtScene({area,reduced}:{area:number;reduced:boolean}) {
 return <Canvas shadows dpr={[1,1.5]} camera={{position:[.6,3.5,11.8],fov:48}} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}} aria-label="Interactive three-dimensional neighborhood basketball court"><Court area={area} reduced={reduced}/></Canvas>
}
