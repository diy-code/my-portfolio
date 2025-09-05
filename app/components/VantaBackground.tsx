"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

/** Performance tuning parameters */
const PIXEL_RATIO_CAP = 1.25;           // hard cap for DPR
const TARGET_FPS_HIDDEN = 0.0;          // "paused" when hidden
const SPEED_DAMP_OFFSCREEN = 0.25;      // slow when hero not visible
const HERO_ONLY = true;                 // set true to render only top section

export default function CloudBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<any>(null);
  const idleHandle = useRef<number | null>(null);
  const resizeHandler = useRef<() => void>();
  const [mounted, setMounted] = useState(false);
  const [debugMsg, setDebugMsg] = useState<string>("");

  // single source of truth for accent theme config
  const cfg = {
    speed: 0.65,                // faster for cloud movement
    skyColor: "0e1626",         // dark blue-black
    cloudColor: "4273b9",       // accent blue
    cloudShadowColor: "0a0e17", // deep shadow
    overlayOpacity: 0.30,       // slightly reduced for visibility
    zoom: 1.05,                 // slightly zoomed in
  };

  // Performance detection
  const isMobile = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1024 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
  }, []);

  /** clamp the renderer DPR after VANTA creates it */
  const clampPixelRatio = useCallback(() => {
    try {
      const pr = Math.min(PIXEL_RATIO_CAP, window.devicePixelRatio || 1);
      vantaRef.current?.renderer?.setPixelRatio?.(pr);
    } catch {}
  }, []);

  /** speed controller (visible vs hidden / on-screen) */
  const setSpeed = useCallback((s: number) => {
    try {
      vantaRef.current?.setOptions?.({ speed: s });
    } catch {}
  }, []);

  useEffect(() => {
    setMounted(true);
    if (!containerRef.current) {
      console.warn("Container ref not available");
      return;
    }

    // Background base while loading
    document.body.style.backgroundColor = "#0e1626";

    // full Singleton guard for dev/HMR
    if ((window as any).__vantaInstance?.destroy) {
      try { (window as any).__vantaInstance.destroy(); } catch {}
      (window as any).__vantaInstance = undefined;
    }
    if (vantaRef.current) {
      try { vantaRef.current.destroy(); } catch {}
      vantaRef.current = null;
      containerRef.current.replaceChildren();
    }

    // init (deferred to idle)
    const init = async () => {
      try {
        setDebugMsg("Setting up THREE...");
        (window as any).THREE = THREE;

        // load script only once per effect type
        const id = "vanta-clouds-script";
        if (!document.getElementById(id)) {
          setDebugMsg("Loading Vanta script...");
          const s = document.createElement("script");
          s.id = id;
          // Use unpkg as primary, jsdelivr as backup
          s.src = "https://unpkg.com/vanta@0.5.24/dist/vanta.clouds.min.js";
          s.async = true;
          
          await new Promise<void>((res, rej) => {
            s.onload = () => {
              setDebugMsg("Vanta script loaded!");
              res();
            };
            s.onerror = () => {
              setDebugMsg("Primary CDN failed, trying backup...");
              // If first CDN fails, try backup
              const backupScript = document.createElement("script");
              backupScript.id = id;
              backupScript.src = "https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.clouds.min.js";
              backupScript.async = true;
              
              backupScript.onload = () => {
                setDebugMsg("Backup script loaded!");
                res();
              };
              backupScript.onerror = () => rej(new Error("Both CDNs failed"));
              document.head.appendChild(backupScript);
            };
            document.head.appendChild(s);
          });
          
          // Allow time for script to initialize
          await new Promise(r => setTimeout(r, 100));
        }

        if (!(window as any).VANTA) {
          setDebugMsg("VANTA not available after loading script!");
          return;
        }

        setDebugMsg("Creating effect...");
        const mobile = isMobile();
        const prefersReduced =
          window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
        const perfMode = mobile || prefersReduced;

        // Make sure container is correctly sized before initialization
        if (containerRef.current) {
          // Force container to have size
          if (containerRef.current.clientHeight < 100 || containerRef.current.clientWidth < 100) {
            containerRef.current.style.minHeight = '100vh';
            containerRef.current.style.minWidth = '100vw';
          }
        }

        // Create effect - with more visible settings
        vantaRef.current = (window as any).VANTA.CLOUDS({
          el: containerRef.current,
          THREE,
          mouseControls: false,
          touchControls: false,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1.0,
          scaleMobile: perfMode ? 0.5 : 0.8,
          quantity: perfMode ? 3 : 4,         // Fewer clouds on mobile
          backgroundAlpha: 0.0,
          backgroundColor: 0x000000,

          skyColor: parseInt(cfg.skyColor, 16),
          cloudColor: parseInt(cfg.cloudColor, 16),
          cloudShadowColor: parseInt(cfg.cloudShadowColor, 16),
          sunColor: parseInt(cfg.skyColor, 16),
          sunGlareColor: parseInt(cfg.skyColor, 16),
          sunlightColor: parseInt(cfg.skyColor, 16),

          speed: perfMode ? Math.max(0.15, cfg.speed * 0.4) : cfg.speed,
          zoom: cfg.zoom,
        });

        if (!vantaRef.current) {
          setDebugMsg("Failed to create Vanta effect!");
          return;
        }

        setDebugMsg("Effect created successfully!");
        (window as any).__vantaInstance = vantaRef.current;

        // clamp DPR now and on resize
        clampPixelRatio();
        resizeHandler.current = () => clampPixelRatio();
        window.addEventListener("resize", resizeHandler.current!, { passive: true });

        // pause/slow when hidden
        const onVis = () => {
          if (document.hidden) setSpeed(TARGET_FPS_HIDDEN);
          else setSpeed(perfMode ? Math.max(0.15, cfg.speed * 0.4) : cfg.speed);
        };
        document.addEventListener("visibilitychange", onVis);

        // slow when hero not on screen
        let io: IntersectionObserver | undefined;
        if (HERO_ONLY) {
          io = new IntersectionObserver(
            (entries) => {
              const onScreen = entries.some((e) => e.isIntersecting);
              setSpeed(
                onScreen
                  ? (perfMode ? Math.max(0.15, cfg.speed * 0.4) : cfg.speed)
                  : cfg.speed * SPEED_DAMP_OFFSCREEN
              );
            },
            { rootMargin: "0px 0px -20% 0px", threshold: 0.15 }
          );
          io.observe(containerRef.current!);
        }

        // cleanup
        return () => {
          document.removeEventListener("visibilitychange", onVis);
          if (resizeHandler.current) {
            window.removeEventListener("resize", resizeHandler.current);
          }
          io?.disconnect();
        };
      } catch (e) {
        // More explicit error handling
        console.error("Error initializing Vanta:", e);
        setDebugMsg(`Error: ${e instanceof Error ? e.message : "Unknown error"}`);
      }
    };

    // Start initialization immediately (no defer) to see if that helps
    init();

    return () => {
      if (idleHandle.current) {
        (window as any).cancelIdleCallback?.(idleHandle.current);
        clearTimeout(idleHandle.current);
        idleHandle.current = null;
      }
      if (vantaRef.current) {
        try { vantaRef.current.destroy(); } catch {}
        vantaRef.current = null;
      }
      containerRef.current?.replaceChildren();
      if (resizeHandler.current) {
        window.removeEventListener("resize", resizeHandler.current);
      }
    };
    // deps intentionally empty (we don't want to re-create on every render)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Debug overlay in development only */}
      {process.env.NODE_ENV !== 'production' && debugMsg && (
        <div 
          className="fixed top-2 left-2 z-50 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Status: {debugMsg}
        </div>
      )}
    
      {/* base gradient (very cheap) */}
      <div
        className="fixed inset-0 z-[-3]"
        style={{
          background:
            "linear-gradient(180deg, #0e1626 0%, #0a0e17 100%)",
        }}
      />

      {/* VANTA host – hero only or full screen */}
      <div
        ref={containerRef}
        className={`fixed left-0 right-0 z-[-2] pointer-events-none ${
          HERO_ONLY ? "top-0 h-[80svh]" : "inset-0"
        }`}
        style={{ 
          contain: "layout paint size", // small perf hint
          minHeight: "200px" // Ensure minimum height for effect
        }}
      />

      {/* subtle vignette overlay */}
      <div
        className={`fixed left-0 right-0 z-[-1] pointer-events-none ${
          HERO_ONLY ? "top-0 h-[80svh]" : "inset-0"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(120% 80% at 50% 10%, rgba(10,14,23,0) 0%, rgba(10,14,23,0.2) 40%, rgba(10,14,23,0.45) 100%)",
          opacity: cfg.overlayOpacity,
        }}
      />

      {/* smooth fade from hero canvas into static gradient (hero mode only) */}
      {HERO_ONLY && (
        <div className="fixed top-[80svh] left-0 right-0 bottom-0 z-[-2] bg-gradient-to-b from-[#0a0e17] to-[#0a0e17]" />
      )}
    </>
  );
}

// types for window globals
declare global {
  interface Window {
    VANTA?: { CLOUDS: (o: any) => any };
    THREE?: typeof THREE;
    __vantaInstance?: { destroy: () => void } | undefined;
    requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  }
}