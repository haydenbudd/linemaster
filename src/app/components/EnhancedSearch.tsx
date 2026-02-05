import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Product } from '@/app/lib/api';
import { GlassCard } from '@/app/components/GlassCard';

interface EnhancedSearchProps {
  products: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: 'relevance' | 'duty' | 'ip';
  setSortBy: (sort: 'relevance' | 'duty' | 'ip') => void;
  dutyFilter: string[];
  setDutyFilter: (filter: string[]) => void;
  cordedFilter: 'all' | 'corded' | 'cordless';
  setCordedFilter: (filter: 'all' | 'corded' | 'cordless') => void;
  onFilteredChange?: (filtered: Product[]) => void;
}

export function EnhancedSearch({
  products,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  dutyFilter,
  setDutyFilter,
  cordedFilter,
  setCordedFilter,
}: EnhancedSearchProps) {
  const toggleDutyFilter = (duty: string) => {
    if (dutyFilter.includes(duty)) {
      setDutyFilter(dutyFilter.filter(d => d !== duty));
    } else {
      setDutyFilter([...dutyFilter, duty]);
    }
  };

  const activeFilterCount = dutyFilter.length + (cordedFilter !== 'all' ? 1 : 0) + (sortBy !== 'relevance' ? 1 : 0);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSortBy('relevance');
    setDutyFilter([]);
    setCordedFilter('all');
  };

  return (
    <GlassCard
      cornerRadius={20}
      padding="20px"
      blurAmount={0.2}
      saturation={150}
      displacementScale={30}
      overLight
      className="w-full"
    >
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black/[0.03] dark:bg-white/[0.04] border border-foreground/5 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all text-sm"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-primary text-primary-foreground rounded-full">
                {activeFilterCount}
              </span>
            )}
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="ml-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'relevance' | 'duty' | 'ip')}
            className="px-3 py-1.5 text-xs bg-black/[0.03] dark:bg-white/[0.04] border border-foreground/5 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="duty">Sort: Duty Rating</option>
            <option value="ip">Sort: IP Rating</option>
          </select>

          {/* Duty Chips */}
          <div className="flex flex-wrap gap-2">
            {['heavy', 'medium', 'light'].map((duty) => (
              <button
                key={duty}
                onClick={() => toggleDutyFilter(duty)}
                className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full border transition-all duration-200 ${
                  dutyFilter.includes(duty)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent text-muted-foreground border-foreground/10 hover:border-primary/30 hover:text-foreground'
                }`}
              >
                {duty}
              </button>
            ))}
          </div>

          {/* Corded Filter */}
          <select
            value={cordedFilter}
            onChange={(e) => setCordedFilter(e.target.value as 'all' | 'corded' | 'cordless')}
            className="px-3 py-1.5 text-xs bg-black/[0.03] dark:bg-white/[0.04] border border-foreground/5 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Connections</option>
            <option value="corded">Pre-Wired</option>
            <option value="cordless">Terminals/Leads</option>
          </select>
        </div>
      </div>
    </GlassCard>
  );
}
