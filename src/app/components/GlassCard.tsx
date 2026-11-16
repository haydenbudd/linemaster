import { forwardRef } from 'react';

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
      cornerRadius,
      padding = '24px 32px',
      blurAmount,
      saturation,
      displacementScale,
      overLight,
      tiltOnHover,
      children,
      className = '',
      style,
      onClick,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`bg-card rounded-2xl border border-border shadow-lg ${onClick ? 'cursor-pointer' : ''} ${className}`}
        style={{ padding, ...style }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;
