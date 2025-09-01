"use client";
import { useEffect, useRef, useState } from "react";
import "./InteractiveBackground.css";

export default function InteractiveBackground() {
  const blobsRef = useRef<HTMLDivElement>(null);

  // Start with empty arrays to avoid server/client mismatch
  const [stars, setStars] = useState<Array<{
    id: number;
    left: number;
    top: number;
    animationDelay: number;
    animationDuration: number;
    opacity: number;
  }>>([]);

  // Generate random stars ONLY on the client side after component mounts
  useEffect(() => {
    const newStars = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 6,
      animationDuration: 4 + Math.random() * 6,
      opacity: 0.15 + Math.random() * 0.35,
    }));

    setStars(newStars);
  }, []);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!blobsRef.current) return;
      const { innerWidth, innerHeight } = window;
      const xRatio = (e.clientX / innerWidth - 0.5) * 2;
      const yRatio = (e.clientY / innerHeight - 0.5) * 2;
      blobsRef.current.style.setProperty("--parallax-x", `${xRatio * 18}px`);
      blobsRef.current.style.setProperty("--parallax-y", `${yRatio * 18}px`);
    };
    window.addEventListener("pointermove", handle, { passive: true });
    return () => window.removeEventListener("pointermove", handle);
  }, []);

  return (
    <div className="ib-root pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
      <div className="ib-stars">
        {stars.map((star) => (
          <span
            key={star.id}
            className="ib-star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.animationDelay}s`,
              animationDuration: `${star.animationDuration}s`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>
      <div ref={blobsRef} className="ib-blobs">
        <div className="ib-blob ib-blob-a" />
        <div className="ib-blob ib-blob-b" />
        <div className="ib-blob ib-blob-c" />
      </div>
      <div className="ib-vignette" />
    </div>
  );
}
