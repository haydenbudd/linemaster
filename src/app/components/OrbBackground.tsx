import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';

export function OrbBackground() {
  const mouseOrbRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const animate = useCallback(() => {
    const ease = 0.06;
    currentPos.current.x += (mousePos.current.x - currentPos.current.x) * ease;
    currentPos.current.y += (mousePos.current.y - currentPos.current.y) * ease;

    if (mouseOrbRef.current) {
      mouseOrbRef.current.style.transform = `translate(${currentPos.current.x - 300}px, ${currentPos.current.y - 300}px)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    mousePos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    currentPos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Mouse-following orb */}
      <div
        ref={mouseOrbRef}
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] will-change-transform"
        style={{ background: 'rgba(0, 122, 255, 0.18)', opacity: 0.8 }}
      />

      {/* Orb 1 - Blue - Top Left */}
      <motion.div
        animate={prefersReducedMotion ? {} : {
          x: [0, 200, -120, 0],
          y: [0, 120, -200, 0],
          scale: [1, 1.3, 0.85, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.33, 0.66, 1],
        }}
        className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px]"
        style={{ background: 'rgba(0, 122, 255, 0.25)', opacity: 0.7 }}
      />

      {/* Orb 2 - Purple - Bottom Right */}
      <motion.div
        animate={prefersReducedMotion ? {} : {
          x: [0, -180, 100, 0],
          y: [0, -120, 180, 0],
          scale: [1, 1.2, 0.85, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.33, 0.66, 1],
        }}
        className="absolute bottom-[-10%] right-[-5%] w-[55vw] h-[55vw] max-w-[550px] max-h-[550px] rounded-full blur-[100px]"
        style={{ background: 'rgba(175, 82, 222, 0.22)', opacity: 0.65 }}
      />

      {/* Orb 3 - Teal accent - Center */}
      <motion.div
        animate={prefersReducedMotion ? {} : {
          x: [0, 250, -200, 0],
          y: [0, 180, -150, 0],
          scale: [1, 1.4, 0.75, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.33, 0.66, 1],
        }}
        className="absolute top-[25%] left-[25%] w-[45vw] h-[45vw] max-w-[450px] max-h-[450px] rounded-full blur-[100px]"
        style={{ background: 'rgba(52, 199, 89, 0.18)', opacity: 0.6 }}
      />

      {/* Orb 4 - Orange warm accent - Top Right */}
      <motion.div
        animate={prefersReducedMotion ? {} : {
          x: [0, -150, 80, 0],
          y: [0, 200, -100, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.33, 0.66, 1],
        }}
        className="absolute top-[5%] right-[10%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full blur-[100px]"
        style={{ background: 'rgba(255, 149, 0, 0.15)', opacity: 0.55 }}
      />
    </div>
  );
}
