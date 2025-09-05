"use client";
// Auto-floating Three.js neural network background

import * as THREE from "three";
import { useRef, useState, useCallback, useEffect } from "react";

type Props = {
  density?: number; // ~0.6..1 on desktop, ~0.5..0.8 on mobile
};

/** ===================== Component ===================== */
export default function NeuralBackground({ density = 1 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const rafId = useRef<number | null>(null);
  const reduceMotion = useRef(false);
  // Track initialization to prevent double setup in StrictMode
  const initialized = useRef(false);

  // -------------------- Scene setup --------------------
  const setupScene = useCallback(() => {
    // Prevent multiple initializations (e.g., during StrictMode double-mount)
    if (initialized.current || !containerRef.current) return null;
    initialized.current = true;
    
    // Clear any existing canvases (important for hot reloading)
    if (containerRef.current.hasChildNodes()) {
      containerRef.current.innerHTML = '';
    }

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: isMobile ? "low-power" : "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);

    // Scene + Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    // Nodes
    const nodeCount = Math.floor((isMobile ? 48 : 70) * density);
    const connectionDistance = (isMobile ? 9.5 : 12) * Math.sqrt(density);

    const nodes: THREE.Mesh[] = [];
    const nodeGeometry = new THREE.SphereGeometry(0.25, 8, 8);
    const nodeMaterial = new THREE.MeshPhongMaterial({
      color: 0x60a5fa,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.2,
      shininess: 30,
    });

    // Lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.2,
    });
    const linesGroup = new THREE.Group();
    scene.add(linesGroup);

    // Distribute nodes in a soft ellipsoid
    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      const radius = 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      node.position.x = radius * 1.5 * Math.sin(phi) * Math.cos(theta);
      node.position.y = radius * 0.8 * Math.sin(phi) * Math.sin(theta);
      node.position.z = radius * Math.cos(phi);

      node.position.x += (Math.random() - 0.5) * 8;
      node.position.y += (Math.random() - 0.5) * 8;
      node.position.z += (Math.random() - 0.5) * 8;

      scene.add(node);
      nodes.push(node);
    }

    // Build connections (single LineSegments for perf)
    const positions: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const p = nodes[i].position;
      positions.push(p.x, p.y, p.z);
    }

    const connPairs: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) < connectionDistance) {
          connPairs.push([i, j]);
        }
      }
    }

    const linePositions: number[] = [];
    for (const [i, j] of connPairs) {
      linePositions.push(
        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
      );
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    linesGroup.add(lines);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x60a5fa, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Resize
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return {
      scene,
      camera,
      renderer,
      nodes,
      linesGroup,
      cleanup: () => {
        initialized.current = false; // Allow re-initialization after cleanup
        window.removeEventListener("resize", handleResize);
        
        // Clean up DOM
        if (containerRef.current?.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }
        
        // Properly release WebGL context
        renderer.forceContextLoss();
        renderer.dispose();
        (renderer.domElement as HTMLCanvasElement | null) = null;
        
        // Dispose other resources
        nodeGeometry.dispose();
        nodeMaterial.dispose();
        lineMaterial.dispose();
        lineGeometry.dispose();
        scene.clear();
      },
    };
  }, [density]);

  // -------------------- Animate --------------------
  useEffect(() => {
    setMounted(true);
    
    // Ensure there's a black background during loading to prevent white flashes
    document.body.style.backgroundColor = "#000";
    
    const data = setupScene();
    if (!data) return;

    const { scene, camera, renderer, nodes, linesGroup, cleanup } = data;

    // Fade in the background over 1.5 seconds
    setTimeout(() => setOpacity(1), 100);

    // reduced-motion
    let mqListener: ((e: MediaQueryListEvent) => void) | undefined;
    try {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      reduceMotion.current = mq.matches;
      mqListener = (e) => (reduceMotion.current = e.matches);
      mq.addEventListener?.("change", mqListener);
    } catch {}

    let last = performance.now();
    
    // Autonomous gentle floating animation
    const animate = () => {
      const t = performance.now() / 1000;
      rafId.current = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      // Self-driven gentle rotation with multi-layered drift
      // Primary rotation (very slow)
      scene.rotation.y = Math.sin(t * 0.05) * 0.1 + Math.sin(t * 0.02) * 0.05;
      scene.rotation.x = Math.sin(t * 0.07) * 0.05 + Math.cos(t * 0.03) * 0.03;
      
      // Very subtle swirl (optional)
      scene.rotation.z = Math.sin(t * 0.01) * 0.01;

      // Gentle breathing on lines - multi-layered for organic feel
      const floatY = Math.sin(t * 0.3) * 0.3 + Math.sin(t * 0.17) * 0.15;
      linesGroup.position.y += (floatY - linesGroup.position.y) * 0.02;
      
      // Subtle horizontal drift
      const floatX = Math.sin(t * 0.11) * 0.2;
      linesGroup.position.x += (floatX - linesGroup.position.x) * 0.01;

      // Node pulsing (respect reduced motion)
      if (!reduceMotion.current) {
        for (let i = 0; i < nodes.length; i++) {
          // Multi-frequency pulsing for more organic feel
          const s = 0.95 + 
                  0.05 * Math.sin(t * 0.5 + i * 0.11) + 
                  0.03 * Math.sin(t * 0.23 + i * 0.3);
          nodes[i].scale.setScalar(s);
        }
      }

      renderer.render(scene, camera);
    };

    const onVis = () => {
      if (document.hidden) {
        if (rafId.current) { 
          cancelAnimationFrame(rafId.current); 
          rafId.current = null; 
        }
      } else {
        last = performance.now();
        rafId.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    // Start animation
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (mqListener) {
        try {
          window.matchMedia("(prefers-reduced-motion: reduce)")
            .removeEventListener?.("change", mqListener);
        } catch {}
      }
      if (rafId.current) cancelAnimationFrame(rafId.current);
      cleanup();
    };
  }, [setupScene]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[-1] pointer-events-none"
      aria-hidden="true"
      style={{ 
        transition: "opacity 1.5s ease-in", 
        opacity: opacity,
        backgroundColor: "#000" // Ensure black background before WebGL loads
      }}
    />
  );
}
