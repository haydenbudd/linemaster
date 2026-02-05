import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  cornerRadius?: number;
  padding?: string;
  blurAmount?: number;
  saturation?: number;
  displacementScale?: number;
  overLight?: boolean;
  tiltOnHover?: boolean;
  children: React.ReactNode;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      cornerRadius = 20,
      padding = '24px 32px',
      blurAmount = 0.2,
      saturation = 150,
      displacementScale = 40,
      overLight = false,
      tiltOnHover = false,
      children,
      className = '',
      style,
      onClick,
      ...rest
    },
    ref
  ) => {
    const [isDark, setIsDark] = useState(false);
    const innerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
      const check = () => setIsDark(document.documentElement.classList.contains('dark'));
      check();
      const observer = new MutationObserver(check);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const el = innerRef.current;
      if (!el) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const tiltX = y * -8;
        const tiltY = x * 8;
        el.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
      });
    }, []);

    const handleMouseLeave = useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      cancelAnimationFrame(rafRef.current);
      el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
    }, []);

    const blurPx = (overLight ? 12 : 4) + blurAmount * 32;

    const bg = isDark
      ? overLight
        ? 'rgba(30, 30, 35, 0.65)'
        : 'rgba(30, 30, 35, 0.4)'
      : overLight
        ? 'rgba(255, 255, 255, 0.5)'
        : 'rgba(255, 255, 255, 0.08)';

    const shadow = isDark
      ? overLight
        ? '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 8px 40px rgba(0,0,0,0.3)'
        : '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 4px 20px rgba(0,0,0,0.2)'
      : overLight
        ? '0 1px 0 0 rgba(255,255,255,0.5) inset, 0 8px 40px rgba(0,0,0,0.08)'
        : '0 1px 0 0 rgba(255,255,255,0.1) inset, 0 4px 20px rgba(0,0,0,0.1)';

    const borderColor = isDark
      ? overLight
        ? 'rgba(255,255,255,0.1)'
        : 'rgba(255,255,255,0.06)'
      : overLight
        ? 'rgba(255,255,255,0.5)'
        : 'rgba(255,255,255,0.12)';

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`relative ${onClick ? 'cursor-pointer' : ''} ${className}`}
        style={style}
        {...rest}
      >
        <div
          ref={innerRef}
          onMouseMove={tiltOnHover ? handleMouseMove : undefined}
          onMouseLeave={tiltOnHover ? handleMouseLeave : undefined}
          className="relative overflow-hidden will-change-transform"
          style={{
            borderRadius: `${cornerRadius}px`,
            padding,
            backdropFilter: `blur(${blurPx}px) saturate(${saturation}%)`,
            WebkitBackdropFilter: `blur(${blurPx}px) saturate(${saturation}%)`,
            background: bg,
            boxShadow: shadow,
            border: `1px solid ${borderColor}`,
            transition: 'transform 0.15s ease-out, box-shadow 0.2s ease',
          }}
        >
          {/* Subtle color orbs for glass depth */}
          {overLight && (
            <>
              <div
                className="absolute pointer-events-none rounded-full mix-blend-multiply dark:mix-blend-screen"
                style={{
                  width: '40%',
                  height: '40%',
                  top: '-10%',
                  right: '-5%',
                  background: 'radial-gradient(circle, rgba(0,113,227,0.06) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />
              <div
                className="absolute pointer-events-none rounded-full mix-blend-multiply dark:mix-blend-screen"
                style={{
                  width: '35%',
                  height: '35%',
                  bottom: '-8%',
                  left: '-3%',
                  background: 'radial-gradient(circle, rgba(175,82,222,0.05) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />
            </>
          )}
          <div className="relative">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;
