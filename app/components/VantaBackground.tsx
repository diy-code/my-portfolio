"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/** ---------- Performance Configuration ---------- */
const PERFORMANCE_CONFIG = {
  quality: {
    ultra: { quantity: 5, speed: 0.65, zoom: 1.05, dpr: 1.8 },
    high: { quantity: 4, speed: 0.55, zoom: 1.04, dpr: 1.5 },
    medium: { quantity: 3, speed: 0.45, zoom: 1.02, dpr: 1.25 },
    low: { quantity: 2, speed: 0.35, zoom: 1.0, dpr: 1 },
    potato: { quantity: 1, speed: 0.25, zoom: 0.98, dpr: 0.9 },
  },
  loading: { preloadDelay: 100, initDelay: 300, fadeInDuration: 800 },
  heroOnly: true,
  heroHeight: "100dvh",
  offscreenDamp: 0.25,
} as const;

/** ---------- Twilight Color Palette ---------- */
const PALETTE = {
  gradientFrom: "#1b2438",
  gradientTo: "#121a2c",
  sky: "1b2438",
  cloud: "7a9bcf",
  shadow: "0e1424",
  sun: "1b2438",
  sunGlare: "2a3652",
  sunlight: "24324a",
} as const;

/** ---------- Vanta types (no idle-callback redeclare!) ---------- */
declare global {
  interface Window {
    VANTA?: { CLOUDS: (opts: VantaCloudsOptions) => VantaInstance };
    THREE?: typeof THREE;
    __vantaCloudsPromise?: Promise<void>;
  }
}

interface VantaInstance {
  destroy: () => void;
  setOptions?: (o: Partial<VantaCloudsOptions>) => void;
  renderer?: { setPixelRatio?: (r: number) => void };
}

interface VantaCloudsOptions {
  el: HTMLElement;
  THREE?: typeof THREE;
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  minHeight?: number;
  minWidth?: number;
  scale?: number;
  scaleMobile?: number;
  quantity?: number;
  backgroundAlpha?: number;
  backgroundColor?: number;
  skyColor?: number;
  cloudColor?: number;
  cloudShadowColor?: number;
  sunColor?: number;
  sunGlareColor?: number;
  sunlightColor?: number;
  speed?: number;
  zoom?: number;
  [key: string]: unknown;
}

/** ---------- Performance Detection ---------- */
function detectPerformanceLevel(): keyof typeof PERFORMANCE_CONFIG.quality {
  const isWindow = typeof window !== "undefined";
  const isMobile =
    isWindow &&
    (window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ));
  const prefersReducedMotion =
    isWindow && !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const perf = typeof performance !== "undefined" ? performance : undefined;
  const jsHeapLimit =
    (perf as Performance & { memory?: { jsHeapSizeLimit?: number } }).memory
      ?.jsHeapSizeLimit;
  const limitedMemory =
    typeof jsHeapLimit === "number" && jsHeapLimit < 2147483648;

  if (prefersReducedMotion) return "potato";
  if (isMobile) return limitedMemory ? "potato" : "low";

  const highDPR = isWindow && (window.devicePixelRatio || 1) > 2;
  if (highDPR && limitedMemory) return "medium";
  if (highDPR) return "high";
  return "medium";
}

/** ---------- Vanta Loader ---------- */
function loadVantaCloudsOnce(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.__vantaCloudsPromise) return window.__vantaCloudsPromise;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "script";
  link.href = "https://unpkg.com/vanta@0.5.24/dist/vanta.clouds.min.js";
  document.head.appendChild(link);

  window.THREE = THREE;

  window.__vantaCloudsPromise = new Promise<void>((resolve, reject) => {
    const id = "vanta-clouds-script";
    if (document.getElementById(id)) return resolve();

    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = "https://unpkg.com/vanta@0.5.24/dist/vanta.clouds.min.js";
    s.onload = () => resolve();
    s.onerror = () => {
      const b = document.createElement("script");
      b.id = id;
      b.async = true;
      b.src =
        "https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.clouds.min.js";
      b.onload = () => resolve();
      b.onerror = () => reject(new Error("Failed to load Vanta CLOUDS"));
      document.head.appendChild(b);
    };
    document.head.appendChild(s);
  });

  return window.__vantaCloudsPromise;
}

export default function CloudBackground({
  heroOnly = PERFORMANCE_CONFIG.heroOnly,
  heroHeight = PERFORMANCE_CONFIG.heroHeight,
}: {
  heroOnly?: boolean;
  heroHeight?: string;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const effectRef = useRef<VantaInstance | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    document.body.style.backgroundColor = PALETTE.gradientFrom;
    const detectedLevel = detectPerformanceLevel();

    const el = hostRef.current;
    el.style.opacity = "0";
    el.style.transition = `opacity ${PERFORMANCE_CONFIG.loading.fadeInDuration}ms ease-out`;

    let innerCleanup: (() => void) | null = null;
    let idleHandle: number | null = null;
    let io: IntersectionObserver | null = null;

    const create = async (): Promise<(() => void) | undefined> => {
      await loadVantaCloudsOnce();
      if (!hostRef.current || !window.VANTA?.CLOUDS) return;

      try {
        effectRef.current?.destroy();
      } catch {}
      effectRef.current = null;

      const q = PERFORMANCE_CONFIG.quality[detectedLevel];
      const elInner = hostRef.current;

      if (heroOnly) {
        elInner.style.top = "0";
        elInner.style.height = heroHeight;
      } else {
        elInner.style.inset = "0";
      }

      const inst = window.VANTA.CLOUDS({
        el: elInner,
        THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.0,
        scaleMobile:
          detectedLevel === "potato" || detectedLevel === "low" ? 0.5 : 0.8,
        quantity: q.quantity,
        backgroundAlpha: 0.0,
        backgroundColor: 0x000000,
        skyColor: parseInt(PALETTE.sky, 16),
        cloudColor: parseInt(PALETTE.cloud, 16),
        cloudShadowColor: parseInt(PALETTE.shadow, 16),
        sunColor: parseInt(PALETTE.sun, 16),
        sunGlareColor: parseInt(PALETTE.sunGlare, 16),
        sunlightColor: parseInt(PALETTE.sunlight, 16),
        speed: q.speed,
        zoom: q.zoom,
      });

      effectRef.current = inst;

      try {
        const dpr = Math.min(q.dpr, window.devicePixelRatio || 1);
        inst.renderer?.setPixelRatio?.(dpr);
      } catch {}

      elInner.style.opacity = "1";

      const onVis = () =>
        inst.setOptions?.({ speed: document.hidden ? 0 : q.speed });
      document.addEventListener("visibilitychange", onVis);

      if (heroOnly) {
        io = new IntersectionObserver(
          (entries) => {
            const visible = entries.some((e) => e.isIntersecting);
            inst.setOptions?.({
              speed: visible ? q.speed : q.speed * PERFORMANCE_CONFIG.offscreenDamp,
            });
          },
          { rootMargin: "0px 0px -20% 0px", threshold: 0.1 }
        );
        io.observe(elInner);
      }

      const onResize = () => {
        try {
          inst.renderer?.setPixelRatio?.(q.dpr);
        } catch {}
      };
      window.addEventListener("resize", onResize, { passive: true });

      let phase = 0;
      const animate = () => {
        phase += 0.0005;
        inst.setOptions?.({ sunPositionOffset: 0.2 + Math.sin(phase) * 0.02 });
        animFrameRef.current = requestAnimationFrame(animate);
      };
      if (detectedLevel !== "potato" && !document.hidden) {
        animFrameRef.current = requestAnimationFrame(animate);
      }

      return () => {
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("resize", onResize);
        io?.disconnect();
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
        try {
          inst.destroy();
        } catch {}
      };
    };

    const timer = window.setTimeout(() => {
      const runIdle = (cb: () => void): number => {
        if (typeof window.requestIdleCallback === "function") {
          return window.requestIdleCallback(() => cb(), { timeout: 1200 });
        }
        return window.setTimeout(cb, 180);
      };

      idleHandle = runIdle(async () => {
        innerCleanup = (await create()) ?? null;
      });
    }, PERFORMANCE_CONFIG.loading.initDelay);

    return () => {
      clearTimeout(timer);
      if (idleHandle !== null) {
        if (typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleHandle);
        } else {
          clearTimeout(idleHandle);
        }
        idleHandle = null;
      }
      try {
        innerCleanup?.();
      } catch {}
      try {
        effectRef.current?.destroy();
      } catch {}
      effectRef.current = null;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [heroOnly, heroHeight]);

  return (
    <>
      {/* Twilight gradient behind canvas */}
      <div
        aria-hidden
        className="fixed inset-0 z-[-3]"
        style={{
          background: `linear-gradient(180deg, ${PALETTE.gradientFrom} 0%, ${PALETTE.gradientTo} 100%)`,
        }}
      />
      {/* VANTA host */}
      <div
        ref={hostRef}
        aria-hidden
        className="fixed left-0 right-0 z-[-2] pointer-events-none"
        style={{
          contain: "layout paint size",
          willChange: "transform, opacity",
          minHeight: 200,
          isolation: "isolate",
          transform: "translateZ(0)",
        }}
      />
      {/* Horizon glow */}
      <div
        aria-hidden
        className="fixed left-0 right-0 z-[-1] pointer-events-none opacity-20"
        style={{
          top: "40%",
          height: "5%",
          background:
            "linear-gradient(180deg, rgba(242,116,97,0) 0%, rgba(242,116,97,0.15) 50%, rgba(242,116,97,0) 100%)",
          transform: "translateZ(0)",
        }}
      />
      {/* Vignette */}
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
      {/* Static bg below hero */}
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
