"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function HeroModel3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 30;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(500, 500);
    containerRef.current.appendChild(renderer.domElement);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x60a5fa, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create neural network node geometry
    const nodes = [];
    const lines = [];
    const nodeGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const nodeMaterial = new THREE.MeshPhongMaterial({ color: 0x60a5fa });
    
    // Create connection line material
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.4 
    });
    
    // Generate random nodes in 3D space
    for (let i = 0; i < 50; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      // Position in a roughly spherical pattern
      const radius = 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      node.position.x = radius * Math.sin(phi) * Math.cos(theta);
      node.position.y = radius * Math.sin(phi) * Math.sin(theta);
      node.position.z = radius * Math.cos(phi);
      
      // Add slight random variation
      node.position.x += (Math.random() - 0.5) * 8;
      node.position.y += (Math.random() - 0.5) * 8;
      node.position.z += (Math.random() - 0.5) * 8;
      
      scene.add(node);
      nodes.push(node);
    }
    
    // Connect nearby nodes with lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < 8) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            nodes[i].position,
            nodes[j].position
          ]);
          const line = new THREE.Line(geometry, lineMaterial);
          scene.add(line);
          lines.push(line);
        }
      }
    }
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Pulse effect on nodes
      const time = Date.now() * 0.001;
      nodes.forEach((node, i) => {
        node.scale.x = 0.8 + 0.4 * Math.sin(time + i * 0.1);
        node.scale.y = 0.8 + 0.4 * Math.sin(time + i * 0.1);
        node.scale.z = 0.8 + 0.4 * Math.sin(time + i * 0.1);
      });
      
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
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      
      // Dispose resources
      nodes.forEach(node => {
        node.geometry.dispose();
        (node.material as THREE.Material).dispose();
      });
      
      lines.forEach(line => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });
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