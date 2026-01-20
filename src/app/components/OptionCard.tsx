import { CheckCircle2, Circle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Option } from '@/app/lib/api';

interface OptionCardProps {
  option: Option;
  selected: boolean;
  multiSelect?: boolean;
  onSelect: () => void;
}

export function OptionCard({
  option,
  selected,
  multiSelect = false,
  onSelect,
}: OptionCardProps) {
  // Get icon from lucide-react by name
  const IconComponent = option.icon ? (Icons as any)[option.icon] : null;

  return (
    <button
      onClick={onSelect}
      className={`
        group relative w-full p-6 rounded-2xl border-2 text-left transition-all duration-300
        hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
        ${
          selected
            ? 'border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg ring-2 ring-primary/20'
            : 'border-border bg-card hover:border-primary/50 dark:hover:bg-card/80'
        }
        ${option.isMedical ? 'ring-2 ring-rose-500/30 ring-offset-2 dark:ring-offset-background' : ''}
      `}
    >
      {option.isMedical && (
        <div className="absolute -top-3 right-4 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
          ISO CERTIFIED
        </div>
      )}

      <div className="flex items-start gap-4">
        {IconComponent && (
          <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
            selected 
              ? 'bg-primary text-primary-foreground scale-110' 
              : 'bg-accent text-primary group-hover:bg-primary/10'
          }`}>
            <IconComponent className="w-6 h-6" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground mb-1.5 text-lg">{option.label}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{option.description}</p>
        </div>

        <div className="flex-shrink-0 ml-2">
          {multiSelect ? (
            selected ? (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
              </div>
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            )
          ) : (
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selected
                  ? 'border-primary bg-primary scale-110'
                  : 'border-muted-foreground/30 bg-transparent group-hover:border-primary'
              }`}
            >
              {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}