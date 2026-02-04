import { motion } from 'motion/react';

export function OrbBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
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
