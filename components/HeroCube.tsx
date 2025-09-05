"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Text } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";

type NodeData = {
  id: string;
  label: string;
  size: number;
  color: string;
  link?: string;
  position: [number, number, number];
  connections: string[];
};

// Update the props type to include the original HeroCube props
type HeroCubeProps = {
  size?: number;
  speed?: number;
  accent?: string;
  density?: number;
  scrollProgress?: number;
  onNodeClick?: (nodeId: string, link?: string) => void;
};

const Node = ({ 
  position, 
  size, 
  color, 
  id, 
  label, 
  isHovered, 
  isPulsing, 
  onClick, 
  onHover, 
  onUnhover 
}: { 
  position: [number, number, number]; 
  size: number; 
  color: string; 
  id: string;
  label: string;
  isHovered: boolean;
  isPulsing: boolean;
  onClick: () => void;
  onHover: () => void;
  onUnhover: () => void;
}) => {
  const nodeRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const scale = isHovered ? 1.4 : isPulsing ? 1.2 : 1;
  const intensity = isHovered ? 1.0 : isPulsing ? 0.8 : 0.5;
  const actualSize = size * scale;
  
  useFrame(({ clock }) => {
    if (nodeRef.current) {
      // Subtle floating animation
      const offset = Math.sin(clock.getElapsedTime() * 0.5 + parseInt(id)) * 0.0003;
      nodeRef.current.position.y += offset;
    }
    
    if (pulseRef.current && (isHovered || isPulsing)) {
      pulseRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 3) * 0.1);
      pulseRef.current.material.opacity = 0.2 + Math.sin(clock.getElapsedTime() * 3) * 0.1;
    }
  });
  
  return (
    <group position={position}>
      {/* Node core */}
      <mesh 
        ref={nodeRef}
        onClick={onClick}
        onPointerOver={onHover}
        onPointerOut={onUnhover}
      >
        <sphereGeometry args={[actualSize, 16, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.9}
          metalness={0.4}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={intensity}
        />
      </mesh>
      
      {/* Outer glow for hover/pulse state */}
      {(isHovered || isPulsing) && (
        <mesh ref={pulseRef}>
          <sphereGeometry args={[actualSize * 1.5, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
      
      {/* Label that appears on hover */}
      {isHovered && (
        <Text
          position={[0, actualSize * 1.8, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {label}
        </Text>
      )}
    </group>
  );
};

const Connection = ({ 
  startPos, 
  endPos, 
  color, 
  thickness = 0.01, 
  isActive = false 
}: { 
  startPos: [number, number, number]; 
  endPos: [number, number, number]; 
  color: string;
  thickness?: number;
  isActive?: boolean;
}) => {
  const lineRef = useRef<THREE.Line>(null);
  
  // Calculate midpoint with slight curve
  const midPoint = useMemo(() => {
    const mid = [
      (startPos[0] + endPos[0]) / 2,
      (startPos[1] + endPos[1]) / 2 + 0.2,
      (startPos[2] + endPos[2]) / 2
    ];
    return mid;
  }, [startPos, endPos]);
  
  // Create a curved path
  const curve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...startPos),
      new THREE.Vector3(...midPoint),
      new THREE.Vector3(...endPos)
    );
  }, [startPos, endPos, midPoint]);
  
  // Generate points along the curve
  const points = useMemo(() => curve.getPoints(20), [curve]);
  
  useFrame(({ clock }) => {
    if (lineRef.current && isActive) {
      (lineRef.current.material as THREE.LineBasicMaterial).opacity = 
        0.6 + Math.sin(clock.getElapsedTime() * 5) * 0.4;
    }
  });
  
  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={isActive ? 0.8 : 0.3}
        linewidth={thickness}
      />
    </line>
  );
};

const GalaxyBrain = ({ 
  size = 1.8,
  speed = 0.15,
  accent = "#60a5fa",
  density = 1, 
  scrollProgress = 0,
  onNodeClick 
}: HeroCubeProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pulsingNode, setPulsingNode] = useState<string | null>(null);
  const [activeConnections, setActiveConnections] = useState<Set<string>>(new Set());
  const [lastReconfig, setLastReconfig] = useState(0);
  const [doubleClickedNode, setDoubleClickedNode] = useState<string | null>(null);
  const { viewport } = useThree();
  
  // Use accent color from props
  const accentColor = accent;
  
  // Calculate actual density based on scroll progress
  // Start with at least 0.3 density even at 0 scroll progress
  const actualDensity = Math.min(0.3 + (scrollProgress || 0) * 0.7, density);
  
  // Define node data - skills, projects, interests
  const allNodes = useMemo<NodeData[]>(() => [
    // Core nodes (always visible)
    { id: "ai", label: "AI", size: 0.12, color: "#60a5fa", position: [0, 0.2, 0], connections: ["ml", "python", "curiosity"] },
    { id: "cpp", label: "C++", size: 0.14, color: "#5E97D0", link: "/projects/metagym", position: [-0.6, -0.3, 0.2], connections: ["performance", "systems", "gamedev"] },
    { id: "curiosity", label: "Curiosity", size: 0.13, color: "#a78bfa", position: [0.5, 0.4, -0.3], connections: ["learning", "innovation", "ai"] },
    
    // Secondary nodes (mid-density)
    { id: "ml", label: "Machine Learning", size: 0.11, color: "#60a5fa", position: [-0.3, 0.5, 0.4], connections: ["ai", "data", "python"] },
    { id: "python", label: "Python", size: 0.12, color: "#4B8BBE", link: "/projects/dataviz", position: [0.7, -0.2, 0.3], connections: ["ai", "automation", "ml"] },
    { id: "systems", label: "Systems", size: 0.10, color: "#f87171", position: [-0.8, 0.1, -0.4], connections: ["cpp", "performance", "architecture"] },
    { id: "innovation", label: "Innovation", size: 0.11, color: "#a78bfa", position: [0.4, 0.7, 0.1], connections: ["curiosity", "creativity"] },
    
    // High-density nodes (appear at higher scroll)
    { id: "performance", label: "Performance", size: 0.09, color: "#f87171", position: [-0.5, -0.6, -0.3], connections: ["cpp", "systems", "optimization"] },
    { id: "data", label: "Data Science", size: 0.10, color: "#60a5fa", position: [0, 0.8, -0.5], connections: ["ml", "visualization", "python"] },
    { id: "architecture", label: "Architecture", size: 0.09, color: "#f87171", position: [-0.9, -0.2, 0.6], connections: ["systems", "design"] },
    { id: "gamedev", label: "Game Dev", size: 0.10, color: "#5E97D0", link: "/projects/games", position: [-0.2, -0.7, -0.4], connections: ["cpp", "creativity"] },
    { id: "automation", label: "Automation", size: 0.08, color: "#4B8BBE", position: [0.9, -0.4, -0.2], connections: ["python", "efficiency"] },
    { id: "visualization", label: "Visualization", size: 0.09, color: "#60a5fa", position: [0.3, 0.9, 0.3], connections: ["data", "creativity"] },
    { id: "creativity", label: "Creativity", size: 0.11, color: "#a78bfa", position: [0.6, 0.3, 0.7], connections: ["innovation", "visualization", "gamedev"] },
    { id: "design", label: "Design", size: 0.08, color: "#f87171", position: [-0.7, -0.5, 0.7], connections: ["architecture", "creativity"] },
    { id: "learning", label: "Learning", size: 0.10, color: "#a78bfa", position: [0.8, 0.6, -0.6], connections: ["curiosity", "growth"] },
    { id: "efficiency", label: "Efficiency", size: 0.08, color: "#4B8BBE", position: [0.2, -0.8, 0.5], connections: ["automation", "performance"] },
    { id: "growth", label: "Growth", size: 0.09, color: "#a78bfa", position: [0.1, -0.4, -0.8], connections: ["learning", "curiosity"] },
    { id: "optimization", label: "Optimization", size: 0.08, color: "#f87171", position: [-0.4, 0, -0.9], connections: ["performance", "efficiency"] },
  ], []);
  
  // Filter nodes based on density
  const visibleNodes = useMemo(() => {
    // Core nodes (first 3) are always visible
    const coreCount = 3;
    // Calculate how many additional nodes to show based on density
    const additionalCount = Math.floor((allNodes.length - coreCount) * actualDensity);
    return allNodes.slice(0, coreCount + additionalCount);
  }, [allNodes, actualDensity]);
  
  // Generate connections between visible nodes
  const connections = useMemo(() => {
    const result: { id: string; start: NodeData; end: NodeData }[] = [];
    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
    
    visibleNodes.forEach(node => {
      node.connections.forEach(targetId => {
        // Only create connection if target node is visible
        if (visibleNodeIds.has(targetId)) {
          const targetNode = visibleNodes.find(n => n.id === targetId);
          if (targetNode && node.id < targetId) { // Avoid duplicate connections
            result.push({
              id: `${node.id}-${targetId}`,
              start: node,
              end: targetNode
            });
          }
        }
      });
    });
    
    return result;
  }, [visibleNodes]);
  
  // Initial pulse effect
  useEffect(() => {
    // Trigger a pulse on a random node when component mounts
    if (visibleNodes.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(3, visibleNodes.length));
      const randomNodeId = visibleNodes[randomIndex].id;
      
      setPulsingNode(randomNodeId);
      
      // Find connections for this node
      const nodeConnections = new Set<string>();
      connections.forEach(conn => {
        if (conn.start.id === randomNodeId || conn.end.id === randomNodeId) {
          nodeConnections.add(conn.id);
        }
      });
      
      setActiveConnections(nodeConnections);
      
      // Reset after animation
      setTimeout(() => {
        setActiveConnections(new Set());
        setPulsingNode(null);
      }, 1500);
    }
  }, [visibleNodes, connections]);
  
  // Handle node click
  const handleNodeClick = useCallback((nodeId: string, link?: string) => {
    // Trigger signal wave through connections
    const nodeConnections = new Set<string>();
    connections.forEach(conn => {
      if (conn.start.id === nodeId || conn.end.id === nodeId) {
        nodeConnections.add(conn.id);
      }
    });
    
    setActiveConnections(nodeConnections);
    setPulsingNode(nodeId);
    
    // Reset after animation
    setTimeout(() => {
      setActiveConnections(new Set());
      setPulsingNode(null);
    }, 1500);
    
    // Check for double click
    const now = Date.now();
    if (now - lastReconfig < 300 && doubleClickedNode === nodeId) {
      // Double click detected - trigger reconfiguration
      setDoubleClickedNode(null);
      // Implementation of reconfiguration animation would go here
    } else {
      setLastReconfig(now);
      setDoubleClickedNode(nodeId);
    }
    
    // Call external handler if provided
    if (onNodeClick && link) {
      onNodeClick(nodeId, link);
    }
  }, [connections, lastReconfig, doubleClickedNode, onNodeClick]);
  
  // Animation and random pulse effect
  useFrame(({ clock }) => {
    // Parallax effect following mouse
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      
      // Gentle floating movement with speed from props
      const rotationSpeed = speed * 0.1;
      groupRef.current.rotation.y = Math.sin(time * rotationSpeed) * 0.1;
      groupRef.current.rotation.x = Math.cos(time * rotationSpeed) * 0.05;
      
      // Random supernova pulses when idle
      if (!hoveredNode && !pulsingNode && Math.random() < 0.002) {
        if (visibleNodes.length > 0) {
          const randomNodeIndex = Math.floor(Math.random() * visibleNodes.length);
          const randomNodeId = visibleNodes[randomNodeIndex].id;
          
          // Trigger pulse animation
          setPulsingNode(randomNodeId);
          
          // Find connections for this node
          const nodeConnections = new Set<string>();
          connections.forEach(conn => {
            if (conn.start.id === randomNodeId || conn.end.id === randomNodeId) {
              nodeConnections.add(conn.id);
            }
          });
          
          setActiveConnections(nodeConnections);
          
          // Reset after animation
          setTimeout(() => {
            setActiveConnections(new Set());
            setPulsingNode(null);
          }, 1500);
        }
      }
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Outer sphere shell */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          metalness={0.2}
          roughness={0.1}
          clearcoat={1}
          transmission={0.95}
          thickness={0.2}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Connections between nodes */}
      {connections.map(conn => (
        <Connection
          key={conn.id}
          startPos={conn.start.position}
          endPos={conn.end.position}
          color={activeConnections.has(conn.id) ? accentColor : "#ffffff"}
          thickness={0.01}
          isActive={activeConnections.has(conn.id)}
        />
      ))}
      
      {/* Nodes */}
      {visibleNodes.map(node => (
        <Node
          key={node.id}
          id={node.id}
          position={node.position}
          size={node.size}
          color={node.color}
          label={node.label}
          isHovered={hoveredNode === node.id}
          isPulsing={pulsingNode === node.id}
          onClick={() => handleNodeClick(node.id, node.link)}
          onHover={() => setHoveredNode(node.id)}
          onUnhover={() => setHoveredNode(null)}
        />
      ))}
    </group>
  );
};

// Main component wrapper with Canvas
const GalaxyBrainComponent = (props: HeroCubeProps) => {
  return (
    <div
      className="pointer-events-auto w-44 h-44 md:w-60 md:h-60 lg:w-80 lg:h-80
                 [filter:drop-shadow(0_10px_30px_rgba(96,165,250,0.35))]"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{ 
          alpha: true, 
          antialias: true, 
          powerPreference: "high-performance"
        }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          // Use the newer THREE.js API for color space
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <color attach="background" args={["#000000"]} transparent opacity={0} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <directionalLight position={[-3, -2, -4]} intensity={0.5} />
        <Environment preset="city" />
        <GalaxyBrain {...props} />
      </Canvas>
    </div>
  );
};

// Export with dynamic to handle SSR issues
const HeroCube = dynamic(() => Promise.resolve(GalaxyBrainComponent), {
  ssr: false
});

export default HeroCube;
