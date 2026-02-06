import { useState } from 'react';
import { ChevronDown, X, Search, Factory, Heart, Car, Hammer, Palette, Coffee, Zap, Wind, Radio, CircleDot, ToggleLeft, Gauge, Shield, Footprints } from 'lucide-react';
import { GlassCard } from '@/app/components/GlassCard';
import { Filters } from '@/app/hooks/useFilterState';

interface FilterOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  isMedical?: boolean;
}

interface FilterGroupProps {
  title: string;
  filterKey: keyof Filters;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClear: () => void;
  getCount: (filterKey: keyof Filters, value: string) => number;
  defaultOpen?: boolean;
}

const iconMap: Record<string, any> = {
  Factory, Heart, Car, Hammer, Palette, Coffee,
  Zap, Wind, Radio, CircleDot, ToggleLeft, Gauge,
  Shield, Footprints,
};

function FilterGroup({ title, filterKey, options, selectedValue, onSelect, onClear, getCount, defaultOpen = false }: FilterGroupProps) {
  const [open, setOpen] = useState(defaultOpen || !!selectedValue);

  return (
    <div className="border-b border-foreground/5 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 px-1 text-left group"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground tracking-tight">{title}</span>
          {selectedValue && (
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              1
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="pb-3 space-y-1">
          {selectedValue && (
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 px-1 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear selection
            </button>
          )}
          {options.map(option => {
            const count = getCount(filterKey, option.id);
            const isSelected = selectedValue === option.id;
            const isDisabled = count === 0 && !isSelected;
            const Icon = option.icon ? iconMap[option.icon] : null;

            return (
              <button
                key={option.id}
                onClick={() => {
                  if (isDisabled) return;
                  onSelect(isSelected ? '' : option.id);
                }}
                disabled={isDisabled}
                className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-xl text-left transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                    : isDisabled
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04] text-foreground'
                }`}
              >
                {Icon && (
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate">{option.label}</div>
                </div>
                <span className={`text-[11px] font-semibold tabular-nums flex-shrink-0 ${
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface MultiFilterGroupProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  getCount: (filterKey: keyof Filters, value: string) => number;
}

function MultiFilterGroup({ title, options, selectedValues, onToggle, getCount }: MultiFilterGroupProps) {
  const [open, setOpen] = useState(selectedValues.length > 0);

  return (
    <div className="border-b border-foreground/5 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 px-1 text-left group"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground tracking-tight">{title}</span>
          {selectedValues.length > 0 && (
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {selectedValues.length}
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="pb-3 space-y-1">
          {options.map(option => {
            const count = getCount('features', option.id);
            const isSelected = selectedValues.includes(option.id);
            const isDisabled = count === 0 && !isSelected;

            return (
              <button
                key={option.id}
                onClick={() => {
                  if (isDisabled) return;
                  onToggle(option.id);
                }}
                disabled={isDisabled}
                className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-xl text-left transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                    : isDisabled
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04] text-foreground'
                }`}
              >
                <div className={`w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-primary' : 'border border-foreground/15'
                }`}>
                  {isSelected && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate">{option.label}</div>
                </div>
                <span className={`text-[11px] font-semibold tabular-nums flex-shrink-0 ${
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface FilterSidebarProps {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  toggleFeature: (featureId: string) => void;
  clearFilter: (key: keyof Filters) => void;
  clearAll: () => void;
  activeFilterCount: number;
  totalProducts: number;
  filteredCount: number;
  getOptionCount: (filterKey: keyof Filters, value: string) => number;
  // Option data
  applications: FilterOption[];
  technologies: FilterOption[];
  actions: FilterOption[];
  environments: FilterOption[];
  duties: FilterOption[];
  materials: FilterOption[];
  connections: FilterOption[];
  features: FilterOption[];
  // Mobile
  isOpen: boolean;
  onClose: () => void;
}

export function FilterSidebar({
  filters,
  setFilter,
  toggleFeature,
  clearFilter,
  clearAll,
  activeFilterCount,
  totalProducts,
  filteredCount,
  getOptionCount,
  applications,
  technologies,
  actions,
  environments,
  duties,
  materials,
  connections,
  features,
  isOpen,
  onClose,
}: FilterSidebarProps) {
  const guardOptions: FilterOption[] = [
    { id: 'yes', label: 'Safety Guard', icon: 'Shield' },
    { id: 'no', label: 'No Guard', icon: 'Footprints' },
  ];

  const sidebar = (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-foreground/5">
        <div>
          <h2 className="text-base font-bold text-foreground tracking-tight">Narrow Results</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Showing <span className="font-semibold text-foreground">{filteredCount}</span> of {totalProducts} products
          </p>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="py-3 border-b border-foreground/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, part #..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-black/[0.03] dark:bg-white/[0.04] border border-foreground/5 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all text-[13px]"
          />
          {filters.search && (
            <button
              onClick={() => setFilter('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Groups */}
      <FilterGroup
        title="Application"
        filterKey="application"
        options={applications}
        selectedValue={filters.application}
        onSelect={(v) => setFilter('application', v)}
        onClear={() => clearFilter('application')}
        getCount={getOptionCount}
        defaultOpen
      />

      <FilterGroup
        title="Technology"
        filterKey="technology"
        options={technologies}
        selectedValue={filters.technology}
        onSelect={(v) => setFilter('technology', v)}
        onClear={() => clearFilter('technology')}
        getCount={getOptionCount}
      />

      <FilterGroup
        title="Switch Action"
        filterKey="action"
        options={actions}
        selectedValue={filters.action}
        onSelect={(v) => setFilter('action', v)}
        onClear={() => clearFilter('action')}
        getCount={getOptionCount}
      />

      <FilterGroup
        title="Environment / IP"
        filterKey="environment"
        options={environments}
        selectedValue={filters.environment}
        onSelect={(v) => setFilter('environment', v)}
        onClear={() => clearFilter('environment')}
        getCount={getOptionCount}
      />

      <FilterGroup
        title="Duty Class"
        filterKey="duty"
        options={duties}
        selectedValue={filters.duty}
        onSelect={(v) => setFilter('duty', v)}
        onClear={() => clearFilter('duty')}
        getCount={getOptionCount}
      />

      <FilterGroup
        title="Material"
        filterKey="material"
        options={materials}
        selectedValue={filters.material}
        onSelect={(v) => setFilter('material', v)}
        onClear={() => clearFilter('material')}
        getCount={getOptionCount}
      />

      {connections.length > 0 && (
        <FilterGroup
          title="Connection Type"
          filterKey="connection"
          options={connections}
          selectedValue={filters.connection}
          onSelect={(v) => setFilter('connection', v)}
          onClear={() => clearFilter('connection')}
          getCount={getOptionCount}
        />
      )}

      <FilterGroup
        title="Safety Guard"
        filterKey="guard"
        options={guardOptions}
        selectedValue={filters.guard}
        onSelect={(v) => setFilter('guard', v)}
        onClear={() => clearFilter('guard')}
        getCount={getOptionCount}
      />

      <MultiFilterGroup
        title="Features"
        options={features.filter(f => f.id !== 'custom_cable' && f.id !== 'custom_connector')}
        selectedValues={filters.features}
        onToggle={toggleFeature}
        getCount={getOptionCount}
      />

      {/* Sort */}
      <div className="pt-3">
        <label className="text-sm font-semibold text-foreground tracking-tight block mb-2 px-1">Sort By</label>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilter('sortBy', e.target.value as Filters['sortBy'])}
          className="w-full px-3 py-2 text-[13px] bg-black/[0.03] dark:bg-white/[0.04] border border-foreground/5 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="relevance">Relevance</option>
          <option value="duty">Duty Rating</option>
          <option value="ip">IP Rating</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[280px] flex-shrink-0">
        <div className="sticky top-[72px]">
          <GlassCard cornerRadius={22} padding="16px 20px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full max-h-[calc(100vh-88px)] overflow-y-auto">
            {sidebar}
          </GlassCard>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <div className="absolute left-0 top-0 bottom-0 w-[320px] max-w-[85vw] bg-background overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Filters</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}
    </>
  );
}
