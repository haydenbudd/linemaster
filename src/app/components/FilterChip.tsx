import { X } from 'lucide-react';
import { GlassCard } from '@/app/components/GlassCard';

interface FilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
}

export function FilterChip({ label, value, onRemove }: FilterChipProps) {
  return (
    <GlassCard
      cornerRadius={999}
      padding="6px 12px"
      blurAmount={0.15}
      saturation={140}
      displacementScale={20}
      overLight
      className="inline-flex"
    >
      <div className="flex items-center gap-1.5 text-sm max-w-[200px]">
        <span className="text-muted-foreground font-medium text-xs flex-shrink-0">
          {label}:
        </span>
        <span className="text-foreground font-semibold text-xs truncate">
          {value}
        </span>
        <button
          onClick={onRemove}
          className="ml-0.5 w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/15 transition-colors"
          aria-label={`Remove ${label} filter`}
        >
          <X className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
    </GlassCard>
  );
}
