import { Search, SlidersHorizontal } from 'lucide-react';
import { Product } from '@/app/lib/api';

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

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-sm p-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products by name, material, or feature..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-accent/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-muted-foreground">Filters:</span>
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'relevance' | 'duty' | 'ip')}
          className="px-3 py-1.5 text-sm bg-accent/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="relevance">Sort: Relevance</option>
          <option value="duty">Sort: Duty Rating</option>
          <option value="ip">Sort: IP Rating</option>
        </select>

        {/* Duty Chips */}
        {['heavy', 'medium', 'light'].map((duty) => (
          <button
            key={duty}
            onClick={() => toggleDutyFilter(duty)}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border transition-all ${
              dutyFilter.includes(duty)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-accent/50 text-muted-foreground border-border hover:border-primary/50'
            }`}
          >
            {duty}
          </button>
        ))}

        {/* Corded Filter */}
        <select
          value={cordedFilter}
          onChange={(e) => setCordedFilter(e.target.value as 'all' | 'corded' | 'cordless')}
          className="px-3 py-1.5 text-sm bg-accent/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">All Connections</option>
          <option value="corded">Pre-Wired</option>
          <option value="cordless">Terminals/Leads</option>
        </select>
      </div>
    </div>
  );
}
