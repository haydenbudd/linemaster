import { X } from 'lucide-react';
import LiquidGlass from 'liquid-glass-react';

interface FilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
}

export function FilterChip({ label, value, onRemove }: FilterChipProps) {
  return (
    <LiquidGlass
      cornerRadius={999}
      padding="6px 12px"
      blurAmount={0.15}
      saturation={140}
      displacementScale={20}
      overLight
      className="inline-flex"
    >
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-muted-foreground font-medium text-xs">
          {label}:
        </span>
        <span className="text-foreground font-semibold text-xs">
          {value}
        </span>
        <button
          onClick={onRemove}
          className="ml-0.5 p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label={`Remove ${label} filter`}
        >
          <X className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
    </LiquidGlass>
  );
}
