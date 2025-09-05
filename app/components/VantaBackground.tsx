"use client";

import { useEffect, useRef, useState } from "react";

type VantaEffect = "waves" | "clouds";

export default function VantaBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);
  const [debugMessage, setDebugMessage] = useState("Initializing...");
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentEffect, setCurrentEffect] = useState<VantaEffect>(() => {
    // Try to get from URL param first, then localStorage
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const bgParam = urlParams.get("bg");
      if (bgParam === "waves" || bgParam === "clouds") {
        return bgParam;
      }
      
      const savedEffect = localStorage.getItem("vanta-effect");
      if (savedEffect === "waves" || savedEffect === "clouds") {
        return savedEffect;
      }
    }
    return "waves"; // Default
  });

  // Effect to save selection to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("vanta-effect", currentEffect);
    }
  }, [currentEffect]);

  useEffect(() => {
    // Set a timeout to detect if the effect doesn't load
    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        console.warn("Vanta effect didn't load within 5 seconds");
        setDebugMessage("Loading timed out - using fallback");
      }
    }, 5000);

    // Force a black background while loading
    document.body.style.backgroundColor = "#000";

    // Helper function to remove scripts to avoid conflicts
    const removeExistingScripts = () => {
      const scripts = ["three-js-script", "vanta-waves-script", "vanta-clouds-script"];
      scripts.forEach(id => {
        const script = document.getElementById(id);
        if (script) {
          script.remove();
        }
      });
    };

    // Helper function to load a script
    const loadScript = (src: string, id: string) => {
      return new Promise<void>((resolve, reject) => {
        // Remove existing script if it exists
        const existingScript = document.getElementById(id);
        if (existingScript) {
          existingScript.remove();
        }

        const script = document.createElement("script");
        script.id = id;
        script.src = src;
        script.async = true;
        script.onload = () => {
          console.log(`Script loaded: ${id}`);
          resolve();
        };
        script.onerror = (e) => {
          console.error(`Script failed to load: ${id}`, e);
          reject(new Error(`Failed to load ${src}`));
        };
        document.head.appendChild(script);
      });
    };

    // Initialize Vanta effect
    const initVantaEffect = async () => {
      if (!containerRef.current) {
        setDebugMessage("Error: Container ref not available");
        return;
      }

      // First destroy any existing effect
      if (vantaEffectRef.current) {
        try {
          vantaEffectRef.current.destroy();
        } catch (e) {
          console.error("Error destroying previous effect:", e);
        }
        vantaEffectRef.current = null;
      }
      
      setDebugMessage(`Loading ${currentEffect} effect...`);
      
      try {
        // Remove existing scripts to avoid conflicts
        removeExistingScripts();
        
        // First load THREE.js
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js", 
          "three-js-script"
        );
        
        // Small delay to ensure THREE is properly initialized
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Make sure THREE is globally available
        if (typeof window.THREE === 'undefined') {
          console.error("THREE not available on window after loading script");
          setDebugMessage("Error: THREE not available");
          return;
        }
        
        // Then load the appropriate Vanta effect
        await loadScript(
          `https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.${currentEffect}.min.js`, 
          `vanta-${currentEffect}-script`
        );

        // Small delay to ensure VANTA is properly initialized
        await new Promise(resolve => setTimeout(resolve, 100));

        // Ensure Vanta is available
        if (!window.VANTA) {
          throw new Error("Vanta not loaded after script inclusion");
        }

        setDebugMessage(`Creating ${currentEffect} effect...`);

        // Create the Vanta effect with the appropriate type
        const options = {
          el: containerRef.current,
          THREE: window.THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundAlpha: 0.0 // Transparent background
        };

        // Updated colors to match color scheme
        if (currentEffect === "waves") {
          vantaEffectRef.current = window.VANTA.WAVES({
            ...options,
            // Updated to match modern portfolio color scheme
            color: 0x3b82f6, // Tailwind blue-500
            waveHeight: 15.0,
            waveSpeed: 1.0,
            zoom: 1.0,
            shininess: 35
          });
        } else if (currentEffect === "clouds") {
          vantaEffectRef.current = window.VANTA.CLOUDS({
            ...options,
            skyColor: 0x1e293b, // Tailwind slate-800
            cloudColor: 0x60a5fa, // Tailwind blue-400
            cloudShadowColor: 0x0f172a, // Tailwind slate-900
            speed: 0.6
          });
        }
        
        setIsLoaded(true);
        setDebugMessage(`${currentEffect.toUpperCase()} loaded successfully!`);
      } catch (error: any) {
        console.error("Vanta initialization error:", error);
        setDebugMessage(`Error initializing: ${error?.message || 'Unknown error'}`);
      }
    };

    // Run the initialization
    initVantaEffect();

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      
      if (vantaEffectRef.current) {
        try {
          vantaEffectRef.current.destroy();
          vantaEffectRef.current = null;
        } catch (error) {
          console.warn("Error destroying Vanta effect:", error);
        }
      }
    };
  }, [currentEffect, isLoaded]); // Re-run when effect type changes

  return (
    <>
      {/* Debug message in development */}
      {process.env.NODE_ENV !== "production" && (
        <div className="fixed top-2 left-2 z-[999] bg-black/70 text-white text-xs px-3 py-2 rounded shadow-lg">
          Status: {debugMessage}
          <br />
          Loaded: {isLoaded ? "✓" : "✗"}
        </div>
      )}

      {/* Effect switcher (dev-only) */}
      {process.env.NODE_ENV !== "production" && (
        <div className="fixed top-2 right-2 z-[999] bg-black/70 text-white text-xs px-3 py-2 rounded shadow-lg">
          <div className="mb-1">Background Effect:</div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentEffect("waves")}
              className={`px-2 py-1 rounded ${
                currentEffect === "waves" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Waves
            </button>
            <button
              onClick={() => setCurrentEffect("clouds")}
              className={`px-2 py-1 rounded ${
                currentEffect === "clouds" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Clouds
            </button>
          </div>
        </div>
      )}

      {/* Fallback gradient background */}
      <div className="fixed inset-0 z-[-2] bg-gradient-to-b from-slate-800 to-black" />
      
      {/* Vanta container - improved z-index */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-[-1] pointer-events-none"
        style={{ zIndex: -1 }}
      />
    </>
  );
}

// Add TypeScript definitions for the VANTA global
declare global {
  interface Window {
    VANTA?: {
      WAVES: (opts: any) => any;
      CLOUDS: (opts: any) => any;
    };
    THREE?: any;
  }
}