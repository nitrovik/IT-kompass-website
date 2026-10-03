"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Line, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function NetworkScene() {
  const group = useRef<THREE.Group>(null);
  const { mouse } = useThree();
  const points = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < 180; i++) {
      const t = i / 179;
      arr.push(Math.sin(t * 10) * 2.2, (t - .5) * 6, Math.cos(t * 7) * 1.6);
    }
    return new Float32Array(arr);
  }, []);
  const curveA = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.5, -1.4, 0), new THREE.Vector3(-2, 0.7, .3), new THREE.Vector3(0, -.4, -.2), new THREE.Vector3(2.2, 1.2, .2), new THREE.Vector3(4.4, .1, 0),
    ]);
    return c.getPoints(80);
  }, []);
  const curveB = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.2, 1.4, -.2), new THREE.Vector3(-2.4, -.7, .1), new THREE.Vector3(-.2, .9, -.3), new THREE.Vector3(2.3, -.9, .25), new THREE.Vector3(4.1, 1.1, 0),
    ]);
    return c.getPoints(80);
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * .03;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouse.y * .08, .04);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, mouse.x * -.05, .04);
  });

  return (
    <group ref={group}>
      <Line points={curveA} color="#269BFF" lineWidth={1.4} transparent opacity={.55} />
      <Line points={curveB} color="#6EC5FF" lineWidth={1.05} transparent opacity={.3} />
      <Points positions={points} stride={3} frustumCulled>
        <PointMaterial transparent color="#6EC5FF" size={0.04} sizeAttenuation depthWrite={false} opacity={.7} />
      </Points>
      <Float speed={1.2} rotationIntensity={.05} floatIntensity={.25}>
        <mesh position={[0, 0, .15]}>
          <torusGeometry args={[1.42, .008, 8, 96]} />
          <meshBasicMaterial color="#6EC5FF" transparent opacity={.65} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[.025, 2.5, 3]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </Float>
    </group>
  );
}

export function HeroSceneCanvas() {
  return (
    <Canvas camera={{ position: [0, 0.4, 9], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: "high-performance" }}>
      <ambientLight intensity={.28} />
      <pointLight position={[0, 0, 3]} intensity={4} distance={12} color="#269BFF" />
      <NetworkScene />
    </Canvas>
  );
}
