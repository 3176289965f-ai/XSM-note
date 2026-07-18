import React, { useState, useEffect, useRef } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

/**
 * A highly interactive, Apple-style click ripple component.
 * It automatically attaches to its parent container's mouse down event
 * without blocking any child pointer interactions.
 */
export const InteractiveRipple: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Find relative coordinates to the parent
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2.2; // Extra large expanding ripple

      const newRipple: Ripple = {
        id: Math.random(),
        x,
        y,
        size,
      };

      setRipples((prev) => [...prev, newRipple]);
    };

    parent.addEventListener("mousedown", handleMouseDown);
    return () => {
      parent.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  useEffect(() => {
    if (ripples.length === 0) return;
    const latest = ripples[ripples.length - 1];
    // Keep clean-up duration matching the CSS animation of 0.85s
    const timer = setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== latest.id));
    }, 900);
    return () => clearTimeout(timer);
  }, [ripples]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 ripple-canvas pointer-events-none"
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple-circle"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </div>
  );
};
