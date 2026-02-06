import { CheckCircle2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Option } from '@/app/lib/api';

interface OptionCardProps {
  option: Option;
  selected: boolean;
  multiSelect?: boolean;
  productCount?: number;
  onSelect: () => void;
}

export function OptionCard({
  option,
  selected,
  multiSelect = false,
  productCount,
  onSelect,
}: OptionCardProps) {
  // Get icon from lucide-react by name
  const IconComponent = option.icon ? (Icons as any)[option.icon] : null;

  return (
    <button
      onClick={onSelect}
      className={`
        group relative w-full p-6 text-left transition-all duration-300
        rounded-[var(--radius)] border backdrop-blur-xl shadow-lg
        hover:shadow-xl hover:scale-[1.01]
        before:absolute before:inset-0 before:rounded-[var(--radius)] before:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] before:pointer-events-none before:content-['']
        ${
          selected
            ? 'border-primary bg-card/60 shadow-xl ring-1 ring-primary'
            : 'border-white/20 dark:border-white/10 bg-card/40 hover:bg-card/60'
        }
        ${option.isMedical ? 'ring-offset-2' : ''}
      `}
    >
      {/* ISO Certified Badge */}
      {option.isMedical && (
        <div className="absolute -top-3 right-6 px-3 py-1 bg-gradient-to-r from-[#ff2056] to-[#f6339a] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md z-10">
          ISO Certified
        </div>
      )}

      <div className="flex items-start gap-4 h-full">
        {/* Icon Container */}
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-[calc(var(--radius)-8px)] flex items-center justify-center transition-colors ${selected ? 'bg-primary/20 text-primary' : 'bg-secondary text-foreground/70 group-hover:bg-primary/10 group-hover:text-primary'}`}>
            {IconComponent ? (
              <IconComponent className="w-6 h-6 stroke-[2]" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/20" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col items-start gap-1">
          <h3 className="text-lg font-bold text-foreground leading-tight">
            {option.label}
          </h3>

          {productCount !== undefined && (
            <div className="bg-secondary px-2 py-0.5 rounded-full text-xs font-semibold text-foreground inline-flex items-center">
              {productCount} matches
            </div>
          )}

          <p className="text-sm font-medium text-muted-foreground leading-relaxed mt-1">
            {option.description}
          </p>
        </div>

        {/* Selection Indicator (Radio/Checkbox) */}
        <div className="flex-shrink-0 self-start mt-1">
          {multiSelect ? (
            <div
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                selected
                  ? 'border-primary bg-primary'
                  : 'border-muted-foreground/30 bg-transparent group-hover:border-primary/50'
              }`}
            >
              {selected && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
            </div>
          ) : (
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                selected
                  ? 'border-primary'
                  : 'border-muted-foreground/30 group-hover:border-primary/50'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-primary transition-transform duration-200 ${
                  selected ? 'scale-100' : 'scale-0'
                }`}
              />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
