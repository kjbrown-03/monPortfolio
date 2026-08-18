import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { navItems } from "./navItems.js";

const PHI = (1 + Math.sqrt(5)) / 2;

function normalize([x, y, z]) {
  const len = Math.sqrt(x * x + y * y + z * z);
  return [x / len, y / len, z / len];
}

// The 12 real face-normal directions of a regular dodecahedron (cyclic
// permutations of (0, ±1, ±phi)). We only build meshes for 5 of them — one
// per real section of the portfolio — picked so no two are opposite/mirrored
// faces, so the partial shell reads as one coherent cluster from any angle.
const FACE_NORMALS = [
  [0, 1, PHI], [0, 1, -PHI], [0, -1, PHI], [0, -1, -PHI],
  [1, PHI, 0], [1, -PHI, 0], [-1, PHI, 0], [-1, -PHI, 0],
  [PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, 1], [-PHI, 0, -1],
].map(normalize);

const FACE_INDICES = [0, 4, 6, 9, 11];
const FACE_DISTANCE = 1.55;
const FACE_RADIUS = 1.05;
const DRAG_CLICK_THRESHOLD = 6;

function Face({ normalVec, href, label, onSelect, dragDistanceRef }) {
  const [hovered, setHovered] = useState(false);

  const { position, quaternion } = useMemo(() => {
    const normal = new THREE.Vector3(...normalVec);
    return {
      position: normal.clone().multiplyScalar(FACE_DISTANCE),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal),
    };
  }, [normalVec]);

  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.CircleGeometry(FACE_RADIUS, 5)),
    []
  );

  const handleClick = (event) => {
    event.stopPropagation();
    if (dragDistanceRef.current > DRAG_CLICK_THRESHOLD) return;
    onSelect(href);
  };

  return (
    <group position={position} quaternion={quaternion}>
      <mesh
        onClick={handleClick}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        <circleGeometry args={[FACE_RADIUS, 5]} />
        <meshPhysicalMaterial
          color={hovered ? "#16213d" : "#0a0d16"}
          transparent
          opacity={hovered ? 0.78 : 0.52}
          roughness={0.28}
          metalness={0.15}
          clearcoat={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={hovered ? "#9d62ff" : "#79aaff"} transparent opacity={0.9} />
      </lineSegments>
      <Html center distanceFactor={6} style={{ pointerEvents: "none" }} occlude>
        <span className={`hub-face-label ${hovered ? "hovered" : ""}`}>{label}</span>
      </Html>
    </group>
  );
}

function HubScene({ onSelect, t }) {
  const groupRef = useRef(null);
  const dragDistanceRef = useRef(0);
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const pointerOffset = useRef({ x: 0, y: 0 });
  const dragRotation = useRef({ x: 0, y: 0 });
  const autoAngle = useRef(0);
  const { gl } = useThree();

  const reducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerMove = (event) => {
      if (dragging.current) {
        const dx = event.clientX - lastPointer.current.x;
        const dy = event.clientY - lastPointer.current.y;
        dragDistanceRef.current += Math.abs(dx) + Math.abs(dy);
        dragRotation.current = {
          x: dragRotation.current.x + dy * 0.008,
          y: dragRotation.current.y + dx * 0.008,
        };
        lastPointer.current = { x: event.clientX, y: event.clientY };
      } else if (event.pointerType === "mouse") {
        pointerOffset.current = {
          x: (event.clientX / window.innerWidth - 0.5) * 2,
          y: (event.clientY / window.innerHeight - 0.5) * 2,
        };
      }
    };

    const handlePointerDown = (event) => {
      dragging.current = true;
      dragDistanceRef.current = 0;
      lastPointer.current = { x: event.clientX, y: event.clientY };
    };

    const handlePointerUp = () => {
      dragging.current = false;
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    canvas.style.touchAction = "none";

    return () => {
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (!reducedMotion) autoAngle.current += delta * 0.16;

    const targetX = dragRotation.current.x - pointerOffset.current.y * 0.3;
    const targetY = autoAngle.current + dragRotation.current.y + pointerOffset.current.x * 0.3;

    group.rotation.x += (targetX - group.rotation.x) * 0.07;
    group.rotation.y += (targetY - group.rotation.y) * 0.07;
  });

  return (
    <group ref={groupRef}>
      {FACE_INDICES.map((normalIndex, i) => {
        const [key, href] = navItems[i];
        return (
          <Face
            key={key}
            normalVec={FACE_NORMALS[normalIndex]}
            href={href}
            label={t.nav[key]}
            onSelect={onSelect}
            dragDistanceRef={dragDistanceRef}
          />
        );
      })}
    </group>
  );
}

export default function DodecahedronMenu({ open, onSelect, t }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), 700);
    return () => window.clearTimeout(timer);
  }, [open]);

  if (!mounted) return null;

  return (
    <div className={`hub-overlay ${visible ? "visible" : ""}`}>
      <div className="hub-canvas-wrap">
        <Canvas camera={{ position: [0, 0, 5.2], fov: 45 }} dpr={[1, 1.8]}>
          <ambientLight intensity={0.55} />
          <pointLight position={[4, 3, 5]} intensity={45} color="#79aaff" />
          <pointLight position={[-4, -2, -3]} intensity={35} color="#9d62ff" />
          <Sparkles count={90} scale={7} size={2.2} speed={0.25} color="#79aaff" opacity={0.5} />
          <HubScene onSelect={onSelect} t={t} />
        </Canvas>
      </div>
      <p className="hub-hint">{t.hubHint}</p>
    </div>
  );
}
