import { Check } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Option } from '@/app/lib/api';
import { GlassCard } from '@/app/components/GlassCard';

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
  const IconComponent = option.icon ? (Icons as any)[option.icon] : null;

  return (
    <GlassCard
      cornerRadius={18}
      padding="20px"
      blurAmount={selected ? 0.25 : 0.15}
      saturation={selected ? 170 : 140}
      displacementScale={selected ? 50 : 35}
      overLight
      tiltOnHover
      onClick={onSelect}
      className={`w-full cursor-pointer transition-all duration-300 min-h-[48px] group ${
        selected ? 'ring-2 ring-primary/40' : ''
      } ${option.isMedical ? 'ring-1 ring-[#ff2d55]/30' : ''}`}
    >
      <div className="flex items-start gap-4">
        {IconComponent && (
          <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5 ${
            selected
              ? 'bg-primary text-primary-foreground'
              : 'bg-black/[0.04] dark:bg-white/[0.06] text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
          }`}>
            <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
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
                : 'border border-black/15 dark:border-white/15 bg-transparent'
            }`}>
              {selected && <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />}
            </div>
          ) : (
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                selected
                  ? 'border-[5px] border-primary bg-white'
                  : 'border-2 border-black/15 dark:border-white/15 bg-transparent'
              }`}
            />
          )}
        </div>
      </div>
    </GlassCard>
  );
}
