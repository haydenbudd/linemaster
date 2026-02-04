import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';

export function OrbBackground() {
  const mouseOrbRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const animate = useCallback(() => {
    // Elastic easing toward mouse position
    const ease = 0.08;
    currentPos.current.x += (mousePos.current.x - currentPos.current.x) * ease;
    currentPos.current.y += (mousePos.current.y - currentPos.current.y) * ease;

    if (mouseOrbRef.current) {
      mouseOrbRef.current.style.transform = `translate(${currentPos.current.x - 250}px, ${currentPos.current.y - 250}px)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Start centered
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
      {/* Mouse-following orb - soft glow that tracks cursor */}
      <div
        ref={mouseOrbRef}
        className="absolute w-[500px] h-[500px] rounded-full bg-primary/12 blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-80 will-change-transform"
      />

      {/* Orb 1 - Primary - Top Left */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, 50, -100, 0],
          scale: [1, 1.2, 0.9, 1],
          rotate: [0, 90, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.33, 0.66, 1],
        }}
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-primary/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70"
      />

      {/* Orb 2 - Purple (Chart 5) - Bottom Right */}
      <motion.div
        animate={{
          x: [0, -100, 50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.1, 0.9, 1],
          rotate: [0, -60, 120, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.33, 0.66, 1],
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] bg-chart-5/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70"
      />

      {/* Orb 3 - Accent/Blue (Chart 1) - Center/Moving */}
      <motion.div
        animate={{
          x: [0, 150, -150, 0],
          y: [0, 100, -100, 0],
          scale: [1, 1.3, 0.8, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.33, 0.66, 1],
        }}
        className="absolute top-[30%] left-[30%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-chart-1/15 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-60"
      />
    </div>
  );
}
