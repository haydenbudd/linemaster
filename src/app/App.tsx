import { useState, Suspense, lazy } from 'react';
import { Router } from '@/app/components/Router';
import { Header } from '@/app/components/Header';
import { ProductCard } from '@/app/components/ProductCard';
import { FilterSidebar } from '@/app/components/FilterSidebar';
import { ActiveFilters } from '@/app/components/ActiveFilters';
import { TrustBadges } from '@/app/components/TrustBadges';
import { SlidersHorizontal, Download, Send, Search, Footprints, ArrowUp } from 'lucide-react';
import { useProductData } from '@/app/hooks/useProductData';
import { useFilterState } from '@/app/hooks/useFilterState';
import { trackPDFDownload } from '@/app/utils/analytics';
import { GlassCard } from '@/app/components/GlassCard';
import { OrbBackground } from '@/app/components/OrbBackground';
import jsPDF from 'jspdf';

// Lazy load admin panel
const AdminContainer = lazy(() =>
  import('@/app/components/admin/AdminContainer').then(module => ({
    default: module.AdminContainer
  }))
);

function ProductFinder() {
  const {
    products,
    applications,
    technologies,
    actions,
    environments,
    features,
    materials,
    connections,
    duties,
    loading,
    error,
    refresh,
  } = useProductData();

  const {
    filters,
    setFilter,
    toggleFeature,
    clearFilter,
    clearAll,
    activeFilterCount,
    filteredProducts,
    getOptionCount,
  } = useFilterState(products);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleReset = () => {
    clearAll();
  };

  const generatePDF = () => {
    trackPDFDownload('faceted', {
      application: filters.application,
      technology: filters.technology,
      action: filters.action,
      environment: filters.environment,
      features: filters.features,
    });

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('LINEMASTER', 15, 12);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Product Finder Results', 15, 20);
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFontSize(9);
    doc.text(`Generated: ${date}`, pageWidth - 15, 20, { align: 'right' });
    doc.setTextColor(0, 0, 0);

    let yPos = 35;

    // Active Filters Summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Your Selections', 15, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    if (filters.application) {
      const label = applications.find(a => a.id === filters.application)?.label || filters.application;
      doc.text(`Application: ${label}`, 20, yPos);
      yPos += 6;
    }
    if (filters.technology) {
      const label = technologies.find(t => t.id === filters.technology)?.label || filters.technology;
      doc.text(`Technology: ${label}`, 20, yPos);
      yPos += 6;
    }
    if (filters.action) {
      const label = actions.find(a => a.id === filters.action)?.label || filters.action;
      doc.text(`Action Type: ${label}`, 20, yPos);
      yPos += 6;
    }
    if (filters.environment) {
      const label = environments.find(e => e.id === filters.environment)?.label || filters.environment;
      doc.text(`Environment: ${label}`, 20, yPos);
      yPos += 6;
    }
    if (filters.duty) {
      const label = duties.find(d => d.id === filters.duty)?.label || filters.duty;
      doc.text(`Duty Class: ${label}`, 20, yPos);
      yPos += 6;
    }
    if (filters.material) {
      doc.text(`Material: ${filters.material}`, 20, yPos);
      yPos += 6;
    }
    if (filters.guard) {
      doc.text(`Safety Guard: ${filters.guard === 'yes' ? 'Required' : 'Not needed'}`, 20, yPos);
      yPos += 6;
    }
    if (filters.features.length > 0) {
      const featureLabels = filters.features
        .map(fId => features.find(f => f.id === fId)?.label || fId)
        .join(', ');
      doc.text(`Features: ${featureLabels}`, 20, yPos);
      yPos += 6;
    }

    // Products
    yPos += 5;
    if (filteredProducts.length > 0) {
      doc.setFillColor(240, 245, 255);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(99, 102, 241);
      doc.text(`Matching Products (${filteredProducts.length})`, 20, yPos + 5.5);
      yPos += 12;
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');

      filteredProducts.slice(0, 10).forEach((product, idx) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        const title = product.part_number ? `${product.series} (#${product.part_number})` : product.series;
        doc.text(`${idx + 1}. ${title}`, 20, yPos);
        yPos += 5;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(product.description, 25, yPos);
        yPos += 5;
        doc.text(`IP Rating: ${product.ip}`, 25, yPos);
        doc.text(`Duty: ${product.duty}`, 80, yPos);
        doc.text(`Material: ${product.material}`, 135, yPos);
        yPos += 8;
      });

      if (filteredProducts.length > 10) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`+ ${filteredProducts.length - 10} more products available`, 20, yPos);
        yPos += 6;
      }
    }

    // Footer
    const footerY = 280;
    doc.setFillColor(245, 245, 245);
    doc.rect(0, footerY, pageWidth, 17, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('Linemaster Switch Corporation', 15, footerY + 5);
    doc.setFont('helvetica', 'normal');
    doc.text('Tel: (860) 974-1000 | linemaster.com', 15, footerY + 10);
    doc.setTextColor(99, 102, 241);
    doc.text('Contact us: linemaster.com/contact/', 15, footerY + 15);

    doc.save(`linemaster-product-finder-${Date.now()}.pdf`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen mesh-gradient-light flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Loading Product Finder</h3>
          <p className="text-sm text-muted-foreground">Please wait...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    const isBackendError = error.includes('Failed to fetch') || error.includes('backend') || error.includes('timeout');

    return (
      <div className="min-h-screen mesh-gradient-light flex items-center justify-center p-4">
        <GlassCard cornerRadius={28} padding="32px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="max-w-2xl mx-auto w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3 text-center">Backend Connection Error</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed text-center">{error}</p>

          {isBackendError && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                Deployment Required
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                The Supabase Edge Function needs to be deployed. Follow these steps:
              </p>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Install Supabase CLI: <code className="px-2 py-1 bg-card rounded text-xs">npm install -g supabase</code></li>
                <li>Login: <code className="px-2 py-1 bg-card rounded text-xs">supabase login</code></li>
                <li>Link project: <code className="px-2 py-1 bg-card rounded text-xs">supabase link --project-ref dhaqigiwkmsjrchrbllu</code></li>
                <li>Deploy: <code className="px-2 py-1 bg-card rounded text-xs">supabase functions deploy server</code></li>
              </ol>
              <p className="text-xs text-muted-foreground mt-4">
                See <span className="font-mono">DEPLOY_BACKEND.md</span> for detailed instructions.
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => refresh()}
              className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Retry Connection
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-gradient-light relative z-10">
      <OrbBackground />
      <Header onReset={handleReset} />

      {/* Hero Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Footprints className="w-3.5 h-3.5" />
            {products.length}+ Foot Switches
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 tracking-tight">
            Find Your Perfect Foot Switch
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Use the filters to narrow down from {products.length}+ products to the exact switch you need.
            Filter in any order — results update instantly.
          </p>
        </div>

        <TrustBadges />
      </div>

      {/* Active Filters Bar */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <ActiveFilters
          filters={filters}
          clearFilter={clearFilter}
          clearAll={clearAll}
          toggleFeature={toggleFeature}
          activeFilterCount={activeFilterCount}
          applications={applications}
          technologies={technologies}
          actions={actions}
          environments={environments}
          duties={duties}
          materials={materials}
          connections={connections}
          features={features}
        />
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden max-w-[1400px] mx-auto px-4 sm:px-6 pb-4">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl transition-all text-sm w-full justify-center"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-white text-primary rounded-full">
              {activeFilterCount}
            </span>
          )}
          <span className="text-primary-foreground/70 ml-1">
            ({filteredProducts.length} results)
          </span>
        </button>
      </div>

      {/* Main Content: Sidebar + Product Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex gap-8 items-start">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            setFilter={setFilter}
            toggleFeature={toggleFeature}
            clearFilter={clearFilter}
            clearAll={clearAll}
            activeFilterCount={activeFilterCount}
            totalProducts={products.length}
            filteredCount={filteredProducts.length}
            getOptionCount={getOptionCount}
            applications={applications}
            technologies={technologies}
            actions={actions}
            environments={environments}
            duties={duties}
            materials={materials}
            connections={connections}
            features={features}
            isOpen={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
          />

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-foreground tracking-tight">
                  {filteredProducts.length === products.length
                    ? 'All Products'
                    : `${filteredProducts.length} Result${filteredProducts.length !== 1 ? 's' : ''}`}
                </h2>
                {activeFilterCount > 0 && filteredProducts.length < products.length && (
                  <span className="text-xs text-muted-foreground">
                    of {products.length} total
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={generatePDF}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] rounded-xl transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export PDF
                </button>
              </div>
            </div>

            {/* Product Cards */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 auto-rows-fr">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              /* No results */
              <GlassCard cornerRadius={28} padding="48px 32px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-primary/40" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No Matches Found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Your current filter combination doesn't match any products.
                    Try removing some filters or contact our team for custom solutions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={clearAll}
                      className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-colors"
                    >
                      Clear All Filters
                    </button>
                    <button
                      onClick={() => window.open('https://linemaster.com/contact/', '_blank')}
                      className="px-6 py-3 bg-foreground/5 hover:bg-foreground/10 text-foreground font-semibold rounded-xl transition-colors"
                    >
                      Contact Us
                    </button>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Back to top on long lists */}
            {filteredProducts.length > 9 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] rounded-xl transition-all"
                >
                  <ArrowUp className="w-4 h-4" />
                  Back to top
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <GlassCard cornerRadius={28} padding="32px" blurAmount={0.25} saturation={150} displacementScale={40} className="w-full bg-[#1e293b]">
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Need Help Choosing?</h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Our team has 70+ years of experience helping customers find the right foot switch for any application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={generatePDF}
                className="px-8 py-3 bg-white hover:bg-gray-100 text-[#1e293b] font-semibold rounded-xl transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Specs PDF
                </span>
              </button>
              <button
                onClick={() => window.open('https://linemaster.com/contact/', '_blank')}
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Contact Us
                </span>
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      {(path, navigate) => {
        if (path.startsWith('/admin')) {
          return <Suspense fallback={<div>Loading...</div>}>
            <AdminContainer />
          </Suspense>;
        }
        return <ProductFinder />;
      }}
    </Router>
  );
}
