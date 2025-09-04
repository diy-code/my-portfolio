"use client";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef, useState } from "react";

type Props = {
  size?: number;                       // world units
  speed?: number;                      // base rotation speed
  textures: [string, string, string, string, string, string]; // 6 face URLs
  accent?: string;                     // neon edge color (e.g. "#60a5fa")
};

function GlassCube({ size = 1.8, speed = 0.15, textures, accent = "#60a5fa" }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);

  const maps = useLoader(THREE.TextureLoader, textures);
  maps.forEach((t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; });

  const faceMaterials = useMemo(
    () =>
      maps.map(
        (map) =>
          new THREE.MeshPhysicalMaterial({
            map,
            transparent: true,
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.25,
            clearcoat: 1,
            clearcoatRoughness: 0.15,
            transmission: 0.2,   // subtle glass feel
            thickness: 0.6,
            envMapIntensity: 0.9,
          })
      ),
    [maps]
  );

  // thin neon edges
  const edgeMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: new THREE.Color(accent), linewidth: 1 }),
    [accent]
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const base = speed * (hover ? 1.8 : 1); // a touch faster on hover
    if (meshRef.current) {
      meshRef.current.rotation.y += base * delta;
      meshRef.current.rotation.x = 0.35 + Math.sin(t * 0.4) * 0.12;
    }
    // gentle parallax tilt to cursor
    if (groupRef.current) {
      const { x, y } = state.pointer; // -1..1
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.25, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.15, 0.08);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[size, size, size]} />
        {/* Apply materials to faces */}
        <primitive object={faceMaterials} attach="material" />
      </mesh>

      {/* outline */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(size + 0.001, size + 0.001, size + 0.001)]} />
        <primitive object={edgeMaterial} attach="material" />
      </lineSegments>
    </group>
  );
}

export default function HeroCube(props: Props) {
  return (
    <div
      className="
        pointer-events-auto
        w-44 h-44 md:w-60 md:h-60
        [filter:drop-shadow(0_10px_30px_rgba(96,165,250,0.35))]
      "
      aria-hidden
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.2], fov: 45 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={0.9} />
        <directionalLight position={[-3, -2, -4]} intensity={0.35} />
        <Environment preset="city" />
        <GlassCube {...props} />
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.35} />
      </Canvas>
    </div>
  );
}
