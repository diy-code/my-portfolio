"use client";
import React, { useEffect, useRef } from "react";

// Simple animated code stream / typewriter effect placeholder
const LINES = [
  "// Passionate about high-impact engineering",
  "const stack = ['C++', 'Python', 'C#/.NET', 'SQL', 'Java'];",
  "function solve(hardProblems) {",
  "  return hardProblems.map(rigor + creativity);",
  "}",
  "// Always learning. Always shipping." ,
];

export default function CodeStream() {
  const ref = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let i = 0;
    let lineIdx = 0;
    let current = "";
    let deleting = false;

    const tick = () => {
      const full = LINES[lineIdx];
      if (!deleting) {
        current = full.slice(0, i + 1);
        i++;
        if (i === full.length) {
          deleting = true;
          setTimeout(tick, 1500);
          el.innerText = current;
          return;
        }
      } else {
        current = full.slice(0, i - 1);
        i--;
        if (i === 0) {
          deleting = false;
          lineIdx = (lineIdx + 1) % LINES.length;
        }
      }
      el.innerText = current;
      const delay = deleting ? 30 : 55 + Math.random() * 80;
      setTimeout(tick, delay);
    };

    tick();
  }, []);

  return (
    /* Increased z-index to show above nav, reduced bottom margin */
    <div className="pointer-events-none select-none relative w-full flex justify-center z-100
                    mt-15 mb-0 opacity-[0.15] md:opacity-25 text-base md:text-xl lg:text-2xl font-mono leading-relaxed">
      <pre
        ref={ref}
        className="whitespace-pre-wrap px-10 md:px-12 max-w-4xl text-[#d1e9ff]"
      />
    </div>
  );
}
