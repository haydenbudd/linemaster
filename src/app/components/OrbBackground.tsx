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

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
      {/* Mouse-following orb */}
      <div
        ref={mouseOrbRef}
        className="absolute w-[600px] h-[600px] rounded-full bg-primary/15 blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-90 will-change-transform"
      />

      {/* Orb 1 - Primary blue - Top Left, 12s cycle */}
      <motion.div
        animate={{
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
        className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] bg-primary/25 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen opacity-80"
      />

      {/* Orb 2 - Purple - Bottom Right, 15s cycle */}
      <motion.div
        animate={{
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
        className="absolute bottom-[-10%] right-[-5%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] bg-chart-5/25 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen opacity-80"
      />

      {/* Orb 3 - Green accent - Center, 18s cycle */}
      <motion.div
        animate={{
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
        className="absolute top-[25%] left-[25%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] bg-chart-2/15 rounded-full blur-[90px] mix-blend-multiply dark:mix-blend-screen opacity-70"
      />
    </div>
  );
}
