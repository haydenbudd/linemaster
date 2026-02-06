import { X } from 'lucide-react';
import { Filters } from '@/app/hooks/useFilterState';
import { GlassCard } from '@/app/components/GlassCard';

interface OptionLookup {
  id: string;
  label: string;
}

interface ActiveFiltersProps {
  filters: Filters;
  clearFilter: (key: keyof Filters) => void;
  clearAll: () => void;
  toggleFeature: (featureId: string) => void;
  activeFilterCount: number;
  applications: OptionLookup[];
  technologies: OptionLookup[];
  actions: OptionLookup[];
  environments: OptionLookup[];
  duties: OptionLookup[];
  materials: OptionLookup[];
  connections: OptionLookup[];
  features: OptionLookup[];
}

function Chip({ label, value, onRemove }: { label: string; value: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/8 text-primary text-xs font-semibold rounded-full border border-primary/15 transition-all hover:bg-primary/12">
      <span className="text-primary/60">{label}:</span>
      <span>{value}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="ml-0.5 p-0.5 rounded-full hover:bg-primary/15 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

export function ActiveFilters({
  filters,
  clearFilter,
  clearAll,
  toggleFeature,
  activeFilterCount,
  applications,
  technologies,
  actions,
  environments,
  duties,
  materials,
  connections,
  features,
}: ActiveFiltersProps) {
  if (activeFilterCount === 0) return null;

  const lookup = (list: OptionLookup[], id: string) =>
    list.find(o => o.id === id)?.label || id;

  return (
    <GlassCard cornerRadius={16} padding="12px 16px" blurAmount={0.15} saturation={140} displacementScale={30} overLight className="w-full">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mr-1">
          Filters:
        </span>

        {filters.application && (
          <Chip label="App" value={lookup(applications, filters.application)} onRemove={() => clearFilter('application')} />
        )}
        {filters.technology && (
          <Chip label="Tech" value={lookup(technologies, filters.technology)} onRemove={() => clearFilter('technology')} />
        )}
        {filters.action && (
          <Chip label="Action" value={lookup(actions, filters.action)} onRemove={() => clearFilter('action')} />
        )}
        {filters.environment && (
          <Chip label="IP" value={lookup(environments, filters.environment)} onRemove={() => clearFilter('environment')} />
        )}
        {filters.duty && (
          <Chip label="Duty" value={lookup(duties, filters.duty)} onRemove={() => clearFilter('duty')} />
        )}
        {filters.material && (
          <Chip label="Material" value={filters.material} onRemove={() => clearFilter('material')} />
        )}
        {filters.connection && (
          <Chip label="Connection" value={lookup(connections, filters.connection)} onRemove={() => clearFilter('connection')} />
        )}
        {filters.guard && (
          <Chip label="Guard" value={filters.guard === 'yes' ? 'Safety Guard' : 'No Guard'} onRemove={() => clearFilter('guard')} />
        )}
        {filters.features.map(fId => (
          <Chip key={fId} label="Feature" value={lookup(features, fId)} onRemove={() => toggleFeature(fId)} />
        ))}

        <button
          onClick={clearAll}
          className="ml-auto text-xs text-primary hover:text-primary/80 font-semibold transition-colors flex-shrink-0"
        >
          Clear all
        </button>
      </div>
    </GlassCard>
  );
}
