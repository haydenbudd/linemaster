import { Check } from 'lucide-react';
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
  // Handle icons as either string names (lucide-react lookup) or direct React components
  const IconComponent = (() => {
    if (!option.icon) return null;
    if (typeof option.icon === 'string') {
      return (Icons as any)[option.icon] || null;
    }
    // Already a React component (e.g., from static data)
    if (typeof option.icon === 'function' || typeof option.icon === 'object') {
      return option.icon;
    }
    return null;
  })();

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 min-h-[48px] group ${
        selected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border bg-card hover:border-primary/30 hover:shadow-md'
      } ${option.isMedical ? 'ring-1 ring-[#ff2d55]/30' : ''}`}
    >
      <div className="flex items-start gap-4">
        {IconComponent && (
          <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${
            selected
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
          }`}>
            <IconComponent className="w-5 h-5" />
          </div>
        )}

        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground mb-0.5 text-[15px] tracking-tight">{option.label}</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{option.description}</p>
        </div>

        <div className="flex-shrink-0 ml-1 self-center">
          {multiSelect ? (
            <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 ${
              selected
                ? 'bg-primary'
                : 'border border-border bg-transparent'
            }`}>
              {selected && <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />}
            </div>
          ) : (
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                selected
                  ? 'border-[5px] border-primary bg-white'
                  : 'border-2 border-border bg-transparent'
              }`}
            />
          )}
        </div>
      </div>
    </button>
  );
}
