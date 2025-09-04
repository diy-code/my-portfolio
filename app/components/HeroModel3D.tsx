"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function HeroModel3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    
    // Set initial size
    const size = Math.min(window.innerWidth * 0.3, 400);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(size, size);
    containerRef.current.appendChild(renderer.domElement);
    
    // Set output color space for modern Three.js
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Controls for interactivity
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5; // Base rotation speed
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x222244, 0.8);
    scene.add(ambientLight);
    
    // Directional lights for each face to enhance glow effect
    const createDirectionalLight = (x: number, y: number, z: number, color: number) => {
      const light = new THREE.DirectionalLight(color, 0.7);
      light.position.set(x, y, z);
      scene.add(light);
      return light;
    };
    
    createDirectionalLight(5, 0, 0, 0x60a5fa); // Right
    createDirectionalLight(-5, 0, 0, 0x60a5fa); // Left
    createDirectionalLight(0, 5, 0, 0x3b82f6); // Top
    createDirectionalLight(0, -5, 0, 0x3b82f6); // Bottom
    createDirectionalLight(0, 0, 5, 0x2563eb); // Front
    createDirectionalLight(0, 0, -5, 0x2563eb); // Back
    
    // Point light in center of cube for extra glow
    const pointLight = new THREE.PointLight(0x60a5fa, 0.8);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);
    
    // For future texture loading
    // const textureLoader = new THREE.TextureLoader();
    
    // Note: We're using placeholder colors for now, but in the future 
    // we can load actual textures with these commented functions
    /*
    const loadTexture = (url: string) => {
      return textureLoader.load(url);
    };
    
    // Create materials for each face
    const createFaceMaterial = (logoTexture: THREE.Texture) => {
      return new THREE.MeshPhysicalMaterial({
        map: logoTexture,
        transparent: true,
        transmission: 0.7, // Glass transparency
        roughness: 0.2,
        metalness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.2,
        emissive: 0x1e3a8a,
        emissiveIntensity: 0.2,
        opacity: 0.95,
      });
    };
    */
    
    // Placeholder colored materials while textures load
    const placeholderMaterials = [
      new THREE.MeshPhysicalMaterial({ color: 0x5E97D0, transparent: true, transmission: 0.7, roughness: 0.2, clearcoat: 1 }), // C++ (blue)
      new THREE.MeshPhysicalMaterial({ color: 0x4B8BBE, transparent: true, transmission: 0.7, roughness: 0.2, clearcoat: 1 }), // Python (blue)
      new THREE.MeshPhysicalMaterial({ color: 0x68217A, transparent: true, transmission: 0.7, roughness: 0.2, clearcoat: 1 }), // C# (purple)
      new THREE.MeshPhysicalMaterial({ color: 0xF89820, transparent: true, transmission: 0.7, roughness: 0.2, clearcoat: 1 }), // Java (orange)
      new THREE.MeshPhysicalMaterial({ color: 0x00758F, transparent: true, transmission: 0.7, roughness: 0.2, clearcoat: 1 }), // SQL (teal)
      new THREE.MeshPhysicalMaterial({ color: 0xF0DB4F, transparent: true, transmission: 0.7, roughness: 0.2, clearcoat: 1 }), // JavaScript (yellow)
    ];
    
    // Create cube with placeholder materials
    const geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    const cube = new THREE.Mesh(geometry, placeholderMaterials);
    scene.add(cube);
    
    // Glowing edges
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ 
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.8,
      linewidth: 2 // Note: linewidth only works in Firefox/Safari, not Chrome
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    
    // Add the edges to the cube
    cube.add(edges);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate cube slowly
      cube.rotation.y += 0.005;
      cube.rotation.x += 0.0025;
      
      // Update controls
      controls.update();
      
      // Render
      renderer.render(scene, camera);
    };
    
    // Handle mouse movement for parallax effect
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = event.clientX - centerX;
      const mouseY = event.clientY - centerY;
      
      // Move camera slightly based on mouse position
      camera.position.x = mouseX * 0.01;
      camera.position.y = -mouseY * 0.01;
    };
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    handleResize();
    
    animate();
    
    // Store reference to avoid React warning
    const currentRef = containerRef.current;
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Dispose resources
      geometry.dispose();
      edgesGeometry.dispose();
      edgesMaterial.dispose();
      
      // Dispose materials
      if (Array.isArray(cube.material)) {
        cube.material.forEach(material => material.dispose());
      } else if (cube.material) {
        (cube.material as THREE.Material).dispose();
      }
      
      // Clear scene and dispose renderer
      scene.clear();
      renderer.dispose();
      
      // Remove canvas
      if (currentRef && renderer.domElement) {
        currentRef.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
      style={{ height: '100vh' }}
    />
  );
}