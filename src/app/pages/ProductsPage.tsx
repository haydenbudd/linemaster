import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from '@/app/components/Router';
import {
  Search, SlidersHorizontal, X, ChevronLeft, ChevronRight,
  ExternalLink, MessageSquareQuote, Zap, Wind, Gauge,
  Wifi, Activity, ShieldCheck, Grid3X3, Package, FileText,
  BookOpen, Video, Download, ArrowRight, Sparkles, Eye,
  Filter, RotateCcw
} from 'lucide-react';
import {
  catalogProducts, uniqueTypes, uniqueConfigurations, uniqueMaterials,
  type CatalogProduct
} from '@/app/data/productCatalog';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ITEMS_PER_PAGE = 24;

const typeColors: Record<string, { bg: string; text: string }> = {
  'Electrical': { bg: 'bg-blue-500/20', text: 'text-blue-300' },
  'Electrical Pneumatic': { bg: 'bg-emerald-500/20', text: 'text-emerald-300' },
  'Pneumatic Flow Control': { bg: 'bg-amber-500/20', text: 'text-amber-300' },
};

const typeLabels: Record<string, string> = {
  'Electrical': 'Electrical',
  'Electrical Pneumatic': 'Elec. Pneumatic',
  'Pneumatic Flow Control': 'PFC',
};

function TypeIcon({ type, className }: { type: string; className?: string }) {
  if (type === 'Electrical') return <Zap className={className} />;
  if (type === 'Pneumatic Flow Control') return <Wind className={className} />;
  return <Gauge className={className} />;
}

/* ------------------------------------------------------------------ */
/*  Filter Sidebar                                                     */
/* ------------------------------------------------------------------ */

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/5 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-white/80 font-semibold text-xs uppercase tracking-wider">
          {title}
        </span>
        <ChevronRight
          className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${
            open ? 'rotate-90' : ''
          }`}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group/cb py-0.5">
      <span
        onClick={onChange}
        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
          checked
            ? 'bg-[#2563EB] border-[#2563EB]'
            : 'border-white/20 group-hover/cb:border-white/40'
        }`}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span
        onClick={onChange}
        className="text-sm text-white/60 group-hover/cb:text-white/90 transition-colors truncate"
      >
        {label}
      </span>
    </label>
  );
}

function RadioOption({
  selected,
  onChange,
  label,
}: {
  selected: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group/rb py-0.5">
      <span
        onClick={onChange}
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
          selected
            ? 'border-[#2563EB]'
            : 'border-white/20 group-hover/rb:border-white/40'
        }`}
      >
        {selected && <span className="w-2 h-2 rounded-full bg-[#2563EB]" />}
      </span>
      <span
        onClick={onChange}
        className="text-sm text-white/60 group-hover/rb:text-white/90 transition-colors"
      >
        {label}
      </span>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  Product Card                                                       */
/* ------------------------------------------------------------------ */

function ProductCard({ product, index }: { product: CatalogProduct; index: number }) {
  const colors = typeColors[product.type] || typeColors['Electrical'];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: (index % 6) * 0.05, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="relative bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 group h-full flex flex-col">
        {/* Type badge */}
        <span className={`absolute top-4 right-4 ${colors.bg} ${colors.text} text-xs font-medium px-2 py-0.5 rounded-full`}>
          {typeLabels[product.type] || product.type}
        </span>

        {/* Feature badges top-left */}
        <div className="absolute top-4 left-4 flex gap-1.5">
          {product.wireless && (
            <span className="bg-blue-500/20 text-blue-300 text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <Wifi className="w-3 h-3" />
            </span>
          )}
          {product.linear && (
            <span className="bg-purple-500/20 text-purple-300 text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <Activity className="w-3 h-3" />
            </span>
          )}
        </div>

        {/* Icon area */}
        <div className="h-32 flex items-center justify-center bg-white/5 rounded-lg mb-4 mt-2">
          <TypeIcon type={product.type} className="w-12 h-12 text-white/20 group-hover:text-white/30 transition-colors" />
        </div>

        {/* Series name */}
        <h3 className="text-white font-semibold text-lg leading-tight">{product.series}</h3>
        {/* Part number */}
        <p className="text-white/50 text-sm mt-0.5">{product.part}</p>

        {/* Spec tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {product.configuration && (
            <span className="bg-white/5 text-white/60 text-xs px-2 py-0.5 rounded-md">{product.configuration}</span>
          )}
          {product.material && (
            <span className="bg-white/5 text-white/60 text-xs px-2 py-0.5 rounded-md">{product.material}</span>
          )}
          <span className="bg-white/5 text-white/60 text-xs px-2 py-0.5 rounded-md">
            {product.numberOfPedals === 2 ? 'Twin' : 'Single'} Pedal
          </span>
          {product.ipRating && product.ipRating !== 'IPXX' && (
            <span className="bg-white/5 text-white/60 text-xs px-2 py-0.5 rounded-md">{product.ipRating}</span>
          )}
        </div>

        {/* Feature badges */}
        <div className="flex gap-2 mt-2">
          {product.wireless && (
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">Wireless</span>
          )}
          {product.linear && (
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">Linear</span>
          )}
          {product.gated && (
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">Gated</span>
          )}
        </div>

        {/* Spacer to push buttons to bottom */}
        <div className="flex-1" />

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 bg-[#2563EB] hover:bg-[#3B82F6] text-white text-sm font-medium rounded-lg transition-all duration-200"
          >
            View Product <ExternalLink className="inline w-3 h-3 ml-1" />
          </a>
          <Link
            href="/custom-solutions"
            className="flex-1 text-center py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-sm font-medium rounded-lg transition-all duration-200"
          >
            Get Quote
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pagination                                                         */
/* ------------------------------------------------------------------ */

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | 'ellipsis')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5"
      >
        <ChevronLeft className="w-4 h-4" /> Previous
      </button>

      <div className="hidden sm:flex items-center gap-1">
        {pages.map((page, i) =>
          page === 'ellipsis' ? (
            <span key={`e-${i}`} className="px-2 text-white/30">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                currentPage === page
                  ? 'bg-[#2563EB] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <span className="sm:hidden text-sm text-white/40">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5"
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<string>('all');
  const [selectedConfigs, setSelectedConfigs] = useState<Set<string>>(new Set());
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedPedals, setSelectedPedals] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Toggle helpers
  const toggleInSet = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, value: string) => {
    setter(prev => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  // Count active filters
  const activeFilterCount =
    selectedConfigs.size +
    selectedMaterials.size +
    selectedFeatures.size +
    (selectedAction !== 'all' ? 1 : 0) +
    (selectedPedals !== 'all' ? 1 : 0);

  const clearAll = () => {
    setSelectedConfigs(new Set());
    setSelectedMaterials(new Set());
    setSelectedFeatures(new Set());
    setSelectedAction('all');
    setSelectedPedals('all');
  };

  // Filtering
  const filtered = useMemo(() => {
    return catalogProducts.filter(p => {
      // Type tab
      if (activeType !== 'all' && p.type !== activeType) return false;

      // Search
      if (search) {
        const q = search.toLowerCase();
        if (!p.series.toLowerCase().includes(q) && !p.part.toLowerCase().includes(q)) return false;
      }

      // Configuration
      if (selectedConfigs.size > 0 && !selectedConfigs.has(p.configuration)) return false;

      // Material
      if (selectedMaterials.size > 0 && !selectedMaterials.has(p.material)) return false;

      // Action
      if (selectedAction !== 'all' && p.onOff !== selectedAction) return false;

      // Pedals
      if (selectedPedals !== 'all' && p.numberOfPedals !== parseInt(selectedPedals)) return false;

      // Features
      if (selectedFeatures.has('wireless') && !p.wireless) return false;
      if (selectedFeatures.has('linear') && !p.linear) return false;
      if (selectedFeatures.has('gated') && !p.gated) return false;

      return true;
    });
  }, [search, activeType, selectedConfigs, selectedMaterials, selectedFeatures, selectedAction, selectedPedals]);

  // Type counts
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: catalogProducts.length };
    catalogProducts.forEach(p => {
      counts[p.type] = (counts[p.type] || 0) + 1;
    });
    return counts;
  }, []);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeType, selectedConfigs, selectedMaterials, selectedFeatures, selectedAction, selectedPedals]);

  // Scroll to top of grid on page change
  useEffect(() => {
    if (currentPage > 1) {
      document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  // Sidebar content (shared between mobile and desktop)
  const sidebarContent = (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filters
          {activeFilterCount > 0 && (
            <span className="bg-[#2563EB] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="text-[#2563EB] text-xs font-medium hover:underline flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      {/* Configuration */}
      <FilterSection title="Configuration">
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {uniqueConfigurations.map(c => (
            <Checkbox
              key={c}
              checked={selectedConfigs.has(c)}
              onChange={() => toggleInSet(setSelectedConfigs, c)}
              label={c}
            />
          ))}
        </div>
      </FilterSection>

      {/* Material */}
      <FilterSection title="Material">
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {uniqueMaterials.map(m => (
            <Checkbox
              key={m}
              checked={selectedMaterials.has(m)}
              onChange={() => toggleInSet(setSelectedMaterials, m)}
              label={m}
            />
          ))}
        </div>
      </FilterSection>

      {/* Action */}
      <FilterSection title="Action">
        <div className="space-y-1">
          <RadioOption selected={selectedAction === 'all'} onChange={() => setSelectedAction('all')} label="All" />
          <RadioOption selected={selectedAction === 'Maintained'} onChange={() => setSelectedAction('Maintained')} label="Maintained" />
          <RadioOption selected={selectedAction === 'Momentary'} onChange={() => setSelectedAction('Momentary')} label="Momentary" />
        </div>
      </FilterSection>

      {/* Pedals */}
      <FilterSection title="Pedals">
        <div className="space-y-1">
          <RadioOption selected={selectedPedals === 'all'} onChange={() => setSelectedPedals('all')} label="All" />
          <RadioOption selected={selectedPedals === '1'} onChange={() => setSelectedPedals('1')} label="Single (1)" />
          <RadioOption selected={selectedPedals === '2'} onChange={() => setSelectedPedals('2')} label="Twin (2)" />
        </div>
      </FilterSection>

      {/* Features */}
      <FilterSection title="Features">
        <div className="space-y-1">
          <Checkbox
            checked={selectedFeatures.has('wireless')}
            onChange={() => toggleInSet(setSelectedFeatures, 'wireless')}
            label="Wireless"
          />
          <Checkbox
            checked={selectedFeatures.has('linear')}
            onChange={() => toggleInSet(setSelectedFeatures, 'linear')}
            label="Linear"
          />
          <Checkbox
            checked={selectedFeatures.has('gated')}
            onChange={() => toggleInSet(setSelectedFeatures, 'gated')}
            label="Gated"
          />
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* ============================================================ */}
      {/*  1. HERO                                                      */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </div>
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#2563EB]/10 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-4"
          >
            Linemaster Switch Corporation
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Medical & Industrial
            <br />
            <span className="text-[#2563EB]">Foot Controls</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Browse our complete catalog of {catalogProducts.length}+ stock footswitches, or request a custom solution for your specific application.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#product-grid"
              className="inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors duration-200 shadow-lg shadow-[#2563EB]/20"
            >
              <Package className="w-5 h-5" />
              Shop Stock Products
            </a>
            <Link
              href="/custom-solutions"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors duration-200 border border-white/20"
            >
              <MessageSquareQuote className="w-5 h-5" />
              Request Custom Quote
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  2. CATEGORY TABS                                             */}
      {/* ============================================================ */}
      <div id="product-grid" className="sticky top-0 z-30 bg-[#0A1628]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3 -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { key: 'all', label: 'All Products', count: typeCounts['all'] || 0 },
              { key: 'Electrical', label: 'Electrical', count: typeCounts['Electrical'] || 0 },
              { key: 'Electrical Pneumatic', label: 'Elec. Pneumatic', count: typeCounts['Electrical Pneumatic'] || 0 },
              { key: 'Pneumatic Flow Control', label: 'PFC', count: typeCounts['Pneumatic Flow Control'] || 0 },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveType(tab.key)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 shrink-0 ${
                  activeType === tab.key
                    ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/20'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  3. RESULTS BAR                                               */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-white/50 shrink-0">
            Showing <span className="font-semibold text-white">{filtered.length}</span> of{' '}
            <span className="text-white/70">{catalogProducts.length}</span> products
          </p>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search series or part #..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB]/60 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Mobile filter button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-[#2563EB] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  4. CONTENT: SIDEBAR + GRID                                   */}
      {/* ============================================================ */}

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-[#0F1D32] z-50 p-6 overflow-y-auto shadow-2xl lg:hidden border-r border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-lg">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
              {sidebarContent}
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="mt-8 w-full bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Show {filtered.length} Products
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-16 bg-white/5 border border-white/10 rounded-xl p-5">
              {sidebarContent}
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {paginated.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {paginated.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-white font-semibold text-xl mb-2">No products match your filters</h3>
                <p className="text-white/50 mb-6 max-w-md mx-auto">
                  Try adjusting your search or filters to find what you need.
                </p>
                <button
                  onClick={() => {
                    clearAll();
                    setSearch('');
                    setActiveType('all');
                  }}
                  className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#3B82F6] text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Clear Filters
                </button>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/*  5. PAGINATION                                               */}
            {/* ============================================================ */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  6. PRODUCT FINDER CTA                                        */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-[#101c33] to-[#162240] rounded-3xl px-8 sm:px-12 py-12 sm:py-16 text-center overflow-hidden border border-white/10"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#2563EB]/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#2563EB]/10 rounded-full blur-[80px]" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 bg-[#2563EB]/20 text-[#60a5fa] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              Footswitch Finder
            </span>
            <h2 className="text-white text-3xl sm:text-4xl font-bold mb-4">
              Not sure what you need?
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Take our Footswitch Finder Quiz to get a personalized recommendation based on your exact application requirements.
            </p>
            <Link
              href="/switch-wizard"
              className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors duration-200 shadow-lg shadow-[#2563EB]/25"
            >
              Start the Quiz <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  7. SIGHTGUARD SPOTLIGHT                                      */}
      {/* ============================================================ */}
      <section className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-2 gap-10 items-center"
          >
            {/* Image / visual area */}
            <div className="relative">
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl aspect-[4/3] flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="w-24 h-24 bg-[#2563EB]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-12 h-12 text-[#2563EB]" />
                  </div>
                  <p className="text-white/30 text-sm">Product Image</p>
                </div>
              </div>
              <div className="absolute -top-3 -right-3 bg-[#D4A853] text-[#0A1628] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                NEW PRODUCT
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="inline-flex items-center gap-2 bg-[#D4A853]/15 text-[#D4A853] text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
                <Sparkles className="w-4 h-4" />
                New Release
              </span>
              <h2 className="text-white text-3xl sm:text-4xl font-bold mb-1">
                SightGuard
              </h2>
              <h3 className="text-white text-3xl sm:text-4xl font-bold mb-4">
                Foot Switch Guard
              </h3>
              <p className="text-[#D4A853] text-xl font-semibold mb-6 italic">
                Engineered to Protect, Designed to be Seen
              </p>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                The SightGuard foot switch guard is Linemaster's latest innovation in workplace safety. Its high-visibility design and rugged construction prevent accidental activation while integrating seamlessly with your existing foot controls.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: Eye, label: 'High Visibility' },
                  { icon: ShieldCheck, label: 'Impact Resistant' },
                  { icon: Grid3X3, label: 'Universal Fit' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5"
                  >
                    <Icon className="w-5 h-5 text-[#D4A853]" />
                    <span className="text-sm font-medium text-white/80">{label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://linemaster.com/sightguard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#D4A853] hover:bg-[#c49a48] text-[#0A1628] font-semibold px-6 py-3.5 rounded-xl transition-colors duration-200"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/custom-solutions"
                  className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors duration-200"
                >
                  <MessageSquareQuote className="w-4 h-4" /> Request a Quote
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  8. RESOURCES                                                 */}
      {/* ============================================================ */}
      <section className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-white text-3xl sm:text-4xl font-bold mb-4">
              Product Resources
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Download catalogs, data sheets, and instruction manuals for all Linemaster products.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              {
                icon: FileText,
                title: 'Product Catalogs',
                desc: 'Full-line catalog with specifications',
              },
              {
                icon: Download,
                title: 'Data Sheets',
                desc: 'Technical data for every product',
              },
              {
                icon: BookOpen,
                title: 'Instruction Manuals',
                desc: 'Installation & operation guides',
              },
              {
                icon: Video,
                title: 'Video Gallery',
                desc: 'Product demos & tutorials',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <a
                key={title}
                href="https://linemaster.com/resources"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-[#2563EB]/40"
              >
                <div className="w-12 h-12 bg-[#2563EB]/15 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2563EB]/25 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h3 className="text-white font-semibold text-base mb-1">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
                <span className="inline-flex items-center gap-1 text-[#2563EB] text-sm font-medium mt-3 group-hover:gap-2 transition-all duration-200">
                  Browse <ChevronRight className="w-4 h-4" />
                </span>
              </a>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
