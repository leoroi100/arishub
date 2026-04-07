"use client";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Preload, useFBO, useGLTF } from "@react-three/drei";
import { easing } from "maath";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./fluid-navbar.module.css";

type FluidNavbarProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

function joinClasses(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type BarGeometryNodes = {
  Cube: THREE.Mesh;
};

function BackgroundField({ scene }: { scene: THREE.Scene }) {
  const { viewport } = useThree();

  const layers = useMemo(
    () => [
      { position: [0, 0, -3] as [number, number, number], scale: [viewport.width, viewport.height, 1] as [number, number, number], color: "#090608", opacity: 1 },
      { position: [0, viewport.height * 0.1, -2.2] as [number, number, number], scale: [viewport.width * 0.94, viewport.height * 0.4, 1] as [number, number, number], color: "#8f1738", opacity: 0.2 },
      { position: [viewport.width * 0.22, viewport.height * 0.16, -1.8] as [number, number, number], scale: [viewport.width * 0.26, viewport.height * 0.16, 1] as [number, number, number], color: "#ffffff", opacity: 0.08 },
      { position: [-viewport.width * 0.2, -viewport.height * 0.08, -1.5] as [number, number, number], scale: [viewport.width * 0.3, viewport.height * 0.18, 1] as [number, number, number], color: "#d44474", opacity: 0.08 }
    ],
    [viewport.height, viewport.width],
  );

  return createPortal(
    <>
      {layers.map((layer, index) => (
        <mesh key={index} position={layer.position} scale={layer.scale}>
          <planeGeometry />
          <meshBasicMaterial color={layer.color} transparent opacity={layer.opacity} />
        </mesh>
      ))}
    </>,
    scene,
  );
}

function FluidBarMesh() {
  const ref = useRef<THREE.Mesh>(null);
  const { nodes } = useGLTF("/assets/3d/bar.glb") as unknown as { nodes: BarGeometryNodes };
  const buffer = useFBO();
  const { viewport, camera, gl } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef(1);

  useEffect(() => {
    const geometry = nodes.Cube.geometry;
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    geoWidthRef.current = box ? box.max.x - box.min.x || 1 : 1;
  }, [nodes]);

  useFrame((state, delta) => {
    const visible = state.viewport.getCurrentViewport(camera, [0, 0, 15]);
    const targetScale = Math.min(0.17, (visible.width * 0.92) / geoWidthRef.current);

    if (ref.current) {
      easing.damp3(ref.current.position, [0, 0, 15], 0.18, delta);
      easing.damp3(ref.current.scale, [targetScale, targetScale, targetScale], 0.18, delta);
    }

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  return (
    <>
      <BackgroundField scene={scene} />

      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>

      <mesh ref={ref} rotation-x={Math.PI / 2} geometry={nodes.Cube.geometry}>
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          transmission={1}
          roughness={0}
          thickness={10}
          ior={1.15}
          chromaticAberration={0.04}
          anisotropy={0.01}
          color="#ffffff"
          attenuationColor="#f7d3dc"
          attenuationDistance={0.22}
        />
      </mesh>
    </>
  );
}

useGLTF.preload("/assets/3d/bar.glb");

export function FluidNavbar({
  children,
  className,
  contentClassName,
}: FluidNavbarProps) {
  return (
    <div className={joinClasses(styles.shell, className)}>
      <div aria-hidden="true" className={styles.canvas}>
        <Canvas
          camera={{ position: [0, 0, 20], fov: 15 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <FluidBarMesh />
          <Preload all />
        </Canvas>
      </div>

      <div className={joinClasses(styles.content, contentClassName)}>{children}</div>
    </div>
  );
}
