"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/** ---------- Performance Configuration ---------- */
const PERFORMANCE_CONFIG = {
  // Progressive Quality Levels
  quality: {
    ultra: { quantity: 5, speed: 0.65, zoom: 1.05, dpr: 1.8 },
    high: { quantity: 4, speed: 0.55, zoom: 1.04, dpr: 1.5 },
    medium: { quantity: 3, speed: 0.45, zoom: 1.02, dpr: 1.25 },
    low: { quantity: 2, speed: 0.35, zoom: 1.0, dpr: 1 },
    potato: { quantity: 1, speed: 0.25, zoom: 0.98, dpr: 0.9 }
  },
  
  // Loading Strategy
  loading: {
    preloadDelay: 100,      // Start preload early
    initDelay: 300,         // Initialize after critical content
    fadeInDuration: 800,    // Smooth fade-in
  },
  
  // System Defaults
  heroOnly: true,
  heroHeight: "100dvh",
  offscreenDamp: 0.25,
};

/** ---------- Twilight Color Palette ---------- */
const PALETTE = {
  gradientFrom: "#1b2438",
  gradientTo:   "#121a2c",
  sky:          "1b2438",
  cloud:        "7a9bcf",
  shadow:       "0e1424",

  // very subtle, non-orange warmth (kept close to sky)
  sun:          "1b2438",
  sunGlare:     "2a3652",
  sunlight:     "24324a",
};

/** ---------- Performance Detection Utility ---------- */
function detectPerformanceLevel(): keyof typeof PERFORMANCE_CONFIG.quality {
  // Device detection
  const isMobile = typeof window !== 'undefined' && (
    window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
  
  // Reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  
  // Memory constraints - Chrome only
  const limitedMemory = typeof performance !== 'undefined' && 
    (performance as any).memory?.jsHeapSizeLimit < 2147483648; // < 2GB
  
  // Simple logic for performance tier
  if (prefersReducedMotion) return 'potato';
  if (isMobile) return limitedMemory ? 'potato' : 'low';
  
  // Desktop tiers
  const highDPR = typeof window !== 'undefined' && window.devicePixelRatio > 2;
  if (highDPR && limitedMemory) return 'medium';
  if (highDPR) return 'high';
  
  return 'medium'; // Safe default
}

/** ---------- Vanta Loading Utility ---------- */
function loadVantaCloudsOnce(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).__vantaCloudsPromise) return (window as any).__vantaCloudsPromise;

  // Preload with link hint for faster fetch
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = 'https://unpkg.com/vanta@0.5.24/dist/vanta.clouds.min.js';
  document.head.appendChild(link);

  (window as any).THREE = THREE;
  (window as any).__vantaCloudsPromise = new Promise<void>((resolve, reject) => {
    const id = "vanta-clouds-script";
    if (document.getElementById(id)) return resolve();

    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = "https://unpkg.com/vanta@0.5.24/dist/vanta.clouds.min.js";
    s.onload = () => resolve();
    s.onerror = () => {
      // fallback CDN
      const b = document.createElement("script");
      b.id = id;
      b.async = true;
      b.src = "https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.clouds.min.js";
      b.onload = () => resolve();
      b.onerror = () => reject(new Error("Failed to load Vanta CLOUDS"));
      document.head.appendChild(b);
    };
    document.head.appendChild(s);
  });

  return (window as any).__vantaCloudsPromise;
}

type Vanta = { 
  destroy: () => void; 
  setOptions?: (o: any) => void; 
  renderer?: { setPixelRatio?: (r:number)=>void } 
};

export default function CloudBackground({
  heroOnly = PERFORMANCE_CONFIG.heroOnly,
  heroHeight = PERFORMANCE_CONFIG.heroHeight,
}: { heroOnly?: boolean; heroHeight?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<Vanta | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [perfLevel, setPerfLevel] = useState<keyof typeof PERFORMANCE_CONFIG.quality>('medium');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!hostRef.current) return;

    // Base fallback gradient (cheap) while we idle-init
    document.body.style.backgroundColor = PALETTE.gradientFrom;
    
    // Detect performance level once
    const detectedLevel = detectPerformanceLevel();
    setPerfLevel(detectedLevel);
    
    // Make container initially transparent for fade-in
    if (hostRef.current) {
      hostRef.current.style.opacity = '0';
      hostRef.current.style.transition = `opacity ${PERFORMANCE_CONFIG.loading.fadeInDuration}ms ease-out`;
    }

    const create = async () => {
      await loadVantaCloudsOnce();
      if (!hostRef.current || !(window as any).VANTA?.CLOUDS) return;

      // Clean any previous instance
      try { effectRef.current?.destroy(); } catch {}
      effectRef.current = null;

      // Get quality settings based on detected performance level
      const qualitySettings = PERFORMANCE_CONFIG.quality[detectedLevel];

      // Ensure host has size before init (prevents flicker)
      const el = hostRef.current;
      if (heroOnly) {
        el.style.top = "0";
        el.style.height = heroHeight;
      } else {
        el.style.inset = "0";
      }

      // Initialize with quality-appropriate settings
      const inst: Vanta = (window as any).VANTA.CLOUDS({
        el,
        THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.0,
        scaleMobile: detectedLevel === 'potato' || detectedLevel === 'low' ? 0.5 : 0.8,
        quantity: qualitySettings.quantity,
        backgroundAlpha: 0.0,
        backgroundColor: 0x000000,
        skyColor: parseInt(PALETTE.sky, 16),
        cloudColor: parseInt(PALETTE.cloud, 16),
        cloudShadowColor: parseInt(PALETTE.shadow, 16),
        
        // Sunset-twilight sun colors
        sunColor: parseInt(PALETTE.sun, 16),
        sunGlareColor: parseInt(PALETTE.sunGlare, 16),
        sunlightColor: parseInt(PALETTE.sunlight, 16),
        
        
        // Add subtle movement
        speed: qualitySettings.speed,
        zoom: qualitySettings.zoom,
      });

      effectRef.current = inst;

      // Cap DPR based on quality setting
      try {
       const dpr = Math.min(qualitySettings.dpr, window.devicePixelRatio || 1);
       inst.renderer?.setPixelRatio?.(dpr);
      } catch {}

      // Fade in effect once loaded
      el.style.opacity = '1';
      setIsLoaded(true);

      // Slow/stop when hidden for battery saving
      const onVis = () => {
        inst.setOptions?.({ 
          speed: document.hidden ? 0 : qualitySettings.speed
        });
      };
      document.addEventListener("visibilitychange", onVis);

      // Slow when hero off-screen for performance
      let io: IntersectionObserver | null = null;
      if (heroOnly) {
        io = new IntersectionObserver(
          (entries) => {
            const visible = entries.some((e) => e.isIntersecting);
            inst.setOptions?.({ 
              speed: visible ? qualitySettings.speed : qualitySettings.speed * PERFORMANCE_CONFIG.offscreenDamp
            });
          },
          { rootMargin: "0px 0px -20% 0px", threshold: 0.1 }
        );
        io.observe(el);
      }

      // Handle resize events for responsive behavior
      const onResize = () => {
        try {
          inst.renderer?.setPixelRatio?.(qualitySettings.dpr);
        } catch {}
      };
      window.addEventListener("resize", onResize, { passive: true });

      // Add subtle animated sun movement - gentle twilight effect
      // Only run this animation if performance level allows it
      if (detectedLevel !== 'potato' && !document.hidden) {
        let phase = 0;
        const animate = () => {
          phase += 0.0005; // Very slow movement
          
          // Subtle oscillation of sun position for gentle movement
          if (inst.setOptions) {
            inst.setOptions({
              sunPositionOffset: 0.2 + Math.sin(phase) * 0.02, // Very subtle movement
            });
          }
          
          animFrameRef.current = requestAnimationFrame(animate);
        };
        
        animate();
      }

      // Cleanup
      return () => {
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("resize", onResize);
        io?.disconnect();
        
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
        
        try { inst.destroy(); } catch {}
      };
    };

    // Delayed initialization for better page loading
    const timer = setTimeout(() => {
      // Use requestIdleCallback for non-blocking loading when browser is idle
      const idle = (cb: () => void) =>
        (window as any).requestIdleCallback 
          ? (window as any).requestIdleCallback(cb, { timeout: 1200 }) 
          : setTimeout(cb, 180);
      
      const handle = idle(() => { create(); });
      
      return () => {
        (window as any).cancelIdleCallback 
          ? (window as any).cancelIdleCallback(handle) 
          : clearTimeout(handle);
      };
    }, PERFORMANCE_CONFIG.loading.initDelay);

    return () => {
      clearTimeout(timer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      try { effectRef.current?.destroy(); } catch {}
      effectRef.current = null;
    };
  }, [heroOnly, heroHeight]);

  // DOM with progressive loading visual states
  return (
    <>
      {/* Twilight gradient behind canvas */}
      <div
        aria-hidden
        className="fixed inset-0 z-[-3]"
        style={{ background: `linear-gradient(180deg, ${PALETTE.gradientFrom} 0%, ${PALETTE.gradientTo} 100%)` }}
      />

      {/* VANTA host with optimized compositing hints */}
      <div
        ref={hostRef}
        aria-hidden
        className={`fixed left-0 right-0 z-[-2] pointer-events-none`}
        style={{
          contain: "layout paint size",
          willChange: "transform, opacity",
          minHeight: 200,
          isolation: "isolate",
          transform: "translateZ(0)", // GPU composite
        }}
      />
      
      {/* Twilight horizon glow */}
      <div
        aria-hidden
        className="fixed left-0 right-0 z-[-1] pointer-events-none opacity-20"
        style={{
          top: "40%",
          height: "5%",
          background: "linear-gradient(180deg, rgba(242,116,97,0) 0%, rgba(242,116,97,0.15) 50%, rgba(242,116,97,0) 100%)",
          transform: "translateZ(0)",
        }}
      />

      {/* Contrast guard: twilight vignette */}
      <div
        aria-hidden
        className="fixed left-0 right-0 z-[-1] pointer-events-none"
        style={{
          top: heroOnly ? "0" : undefined,
          height: heroOnly ? heroHeight : undefined,
          inset: heroOnly ? undefined : 0,
          backgroundImage:
            "radial-gradient(120% 80% at 50% 10%, rgba(20,27,48,0) 0%, rgba(20,27,48,0.22) 40%, rgba(20,27,48,0.48) 100%)",
          opacity: 0.32,
        }}
      />

      {/* Smooth fade into static bg below hero */}
      {heroOnly && (
        <div
          aria-hidden
          className="fixed z-[-2] left-0 right-0"
          style={{ top: heroHeight, bottom: 0, background: PALETTE.gradientTo }}
        />
      )}
    </>
  );
}
