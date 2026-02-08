import { Product, Option } from '@/app/lib/api';
import { WizardState } from '@/app/hooks/useWizardState';
import { ProductCard } from '@/app/components/ProductCard';
import { FilterChip } from '@/app/components/FilterChip';
import { EnhancedSearch } from '@/app/components/EnhancedSearch';
import { GlassCard } from '@/app/components/GlassCard';
import { getProxiedImageUrl } from '@/app/utils/imageProxy';
import { getProcessedProducts } from '@/app/utils/productFilters';
import { ChevronLeft, ArrowRight, Download, Send, CheckCircle, Star } from 'lucide-react';

export interface ResultsPageProps {
  wizardState: WizardState;
  products: Product[];
  applications: Option[];
  technologies: Option[];
  actions: Option[];
  environments: Option[];
  features: Option[];
  duties: Option[];
  filterProducts: (overrides?: Partial<WizardState>) => Product[];
  getAlternativeProducts: () => { products: Product[]; relaxed: string };
  needsCustomSolution: boolean;
  onBack: () => void;
  onReset: () => void;
  onGeneratePDF: () => void;
  clearDownstreamSelections: (fromStep: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: 'relevance' | 'duty' | 'ip';
  setSortBy: (sort: 'relevance' | 'duty' | 'ip') => void;
  dutyFilter: string[];
  setDutyFilter: (filter: string[]) => void;
  cordedFilter: 'all' | 'corded' | 'cordless';
  setCordedFilter: (filter: 'all' | 'corded' | 'cordless') => void;
}

export function ResultsPage({
  wizardState,
  products,
  applications,
  technologies,
  actions,
  environments,
  features,
  duties,
  filterProducts,
  getAlternativeProducts,
  needsCustomSolution,
  onBack,
  onReset,
  onGeneratePDF,
  clearDownstreamSelections,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  dutyFilter,
  setDutyFilter,
  cordedFilter,
  setCordedFilter,
}: ResultsPageProps) {
  if (needsCustomSolution) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-8">
        <GlassCard cornerRadius={28} padding="0" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full overflow-hidden">
          {/* Banner */}
          <div
            className="p-8 text-white"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            }}
          >
            <div className="text-white/80 text-xs font-bold uppercase tracking-wide mb-3">
              CUSTOM SPECIFICATIONS
            </div>
            <h1 className="text-3xl font-bold mb-2">No Exact Match Found</h1>
            <p className="text-white/90">
              We couldn't find an exact match in our catalog, but our team can help find the right solution for you.
            </p>
          </div>

          {/* Summary */}
          <div className="p-8">
            <div className="divide-y divide-foreground/5">
              <div className="flex justify-between py-4">
                <span className="text-sm text-muted-foreground">Application</span>
                <span className="text-sm font-semibold text-foreground">
                  {applications.find(a => a.id === wizardState.selectedApplication)?.label || wizardState.selectedApplication}
                </span>
              </div>
              <div className="flex justify-between py-4">
                <span className="text-sm text-muted-foreground">Technology</span>
                <span className="text-sm font-semibold text-foreground">
                  {technologies.find(t => t.id === wizardState.selectedTechnology)?.label || wizardState.selectedTechnology}
                </span>
              </div>
              <div className="flex justify-between py-4">
                <span className="text-sm text-muted-foreground">Switch Action</span>
                <span className="text-sm font-semibold text-foreground">
                  {actions.find(a => a.id === wizardState.selectedAction)?.label || wizardState.selectedAction}
                </span>
              </div>
              <div className="flex justify-between py-4">
                <span className="text-sm text-muted-foreground">Environment</span>
                <span className="text-sm font-semibold text-foreground">
                  {environments.find(e => e.id === wizardState.selectedEnvironment)?.label || wizardState.selectedEnvironment}
                </span>
              </div>
              {wizardState.selectedFeatures.length > 0 && (
                <div className="flex justify-between py-4">
                  <span className="text-sm text-muted-foreground">Features</span>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {wizardState.selectedFeatures.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wide rounded-full"
                      >
                        {features.find(f => f.id === feature)?.label || feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 space-y-4">
              <button
                onClick={onGeneratePDF}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#1e293b] hover:bg-[#334155] text-white font-semibold rounded-xl transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Specifications PDF
              </button>

              <div className="text-center text-sm text-muted-foreground py-2">then</div>

              <button
                onClick={() =>
                  window.open('https://linemaster.com/contact/', '_blank')
                }
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#ff9500] hover:bg-[#ff9500]/90 text-white font-semibold rounded-xl transition-colors"
              >
                <Send className="w-5 h-5" />
                Contact Us
              </button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Attach your downloaded PDF when reaching out for faster processing.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  const exactMatches = filterProducts();
  const hasExactMatches = exactMatches.length > 0;

  // Pick best match: flagship products first, then by duty match
  const sortedMatches = hasExactMatches
    ? [...exactMatches].sort((a, b) => {
        // Flagship products always rank first
        if (a.flagship && !b.flagship) return -1;
        if (!a.flagship && b.flagship) return 1;
        // Then prefer exact duty match
        if (wizardState.selectedDuty) {
          const aMatch = a.duty === wizardState.selectedDuty ? 1 : 0;
          const bMatch = b.duty === wizardState.selectedDuty ? 1 : 0;
          if (aMatch !== bMatch) return bMatch - aMatch;
        }
        return 0;
      })
    : [];

  const bestMatch = sortedMatches.length > 0 ? sortedMatches[0] : null;
  const otherMatches = sortedMatches.length > 1 ? sortedMatches.slice(1) : [];
  const alternatives = hasExactMatches ? null : getAlternativeProducts();

  const relaxedMessages: Record<string, string> = {
    features: 'No exact matches with your selected features, but these products match all other criteria:',
    guard: 'No exact matches for your guard preference, but these products match your other criteria:',
    material: 'No exact matches for your material preference, but these products match your other criteria:',
    duty: 'No exact matches for your duty class, but these products match your other requirements:',
    environment: 'No exact matches for your environment rating, but these products match your other requirements:',
    action: 'No exact matches for your action type, but these products match your application and technology:',
    technology: 'No exact matches for your technology type, but these products are compatible with your application:',
    all: 'Here are all products available for your application:',
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-4 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] rounded-xl transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          {products.length} Products Analyzed
        </div>

        {hasExactMatches ? (
          <>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
              {exactMatches.length === 1
                ? <>We Found <span className="text-primary">The One.</span></>
                : <>We Found <span className="text-primary">{exactMatches.length} Matches.</span></>
              }
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {exactMatches.length === 1
                ? 'Based on your requirements, this is the exact switch you need.'
                : 'Based on your requirements, these switches match your needs.'
              }
            </p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff9500]/10 text-[#ff9500] rounded-full text-sm font-semibold mb-4">
              <span className="text-lg">💡</span>
              Alternative Suggestions
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              No Exact Matches Found
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {alternatives && relaxedMessages[alternatives.relaxed]}
            </p>
          </>
        )}
      </div>

      {/* Filter Summary Bar */}
      <GlassCard cornerRadius={20} padding="24px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="mb-12 w-full">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-bold text-foreground uppercase tracking-wider">
            Active Filters:
          </span>
          <button
            onClick={onReset}
            className="ml-auto text-xs text-primary hover:text-primary/80 font-semibold underline transition-colors"
          >
            Clear All & Start Over
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {wizardState.selectedApplication && (
            <FilterChip
              label="Application"
              value={applications.find(a => a.id === wizardState.selectedApplication)?.label || wizardState.selectedApplication}
              onRemove={() => {
                wizardState.setSelectedApplication('');
                wizardState.setSelectedTechnology('');
                clearDownstreamSelections(0);
                wizardState.setStep(0);
              }}
            />
          )}
          {wizardState.selectedTechnology && (
            <FilterChip
              label="Technology"
              value={technologies.find(t => t.id === wizardState.selectedTechnology)?.label || wizardState.selectedTechnology}
              onRemove={() => {
                wizardState.setSelectedTechnology('');
                clearDownstreamSelections(1);
                wizardState.setStep(1);
              }}
            />
          )}
          {wizardState.selectedAction && (
            <FilterChip
              label="Action"
              value={actions.find(a => a.id === wizardState.selectedAction)?.label || wizardState.selectedAction}
              onRemove={() => {
                wizardState.setSelectedAction('');
                clearDownstreamSelections(2);
                wizardState.setStep(2);
              }}
            />
          )}
          {wizardState.selectedEnvironment && (
            <FilterChip
              label="Environment"
              value={environments.find(e => e.id === wizardState.selectedEnvironment)?.label || wizardState.selectedEnvironment}
              onRemove={() => {
                wizardState.setSelectedEnvironment('');
                clearDownstreamSelections(3);
                wizardState.setStep(3);
              }}
            />
          )}
          {wizardState.selectedDuty && (
            <FilterChip
              label="Duty"
              value={duties.find(d => d.id === wizardState.selectedDuty)?.label || wizardState.selectedDuty}
              onRemove={() => {
                wizardState.setSelectedDuty('');
                clearDownstreamSelections(4);
                wizardState.setStep(4);
              }}
            />
          )}
          {wizardState.selectedMaterial && (
            <FilterChip
              label="Material"
              value={wizardState.selectedMaterial}
              onRemove={() => {
                wizardState.setSelectedMaterial('');
                clearDownstreamSelections(5);
                wizardState.setStep(5);
              }}
            />
          )}
          {wizardState.selectedGuard && (
            <FilterChip
              label="Guard"
              value={wizardState.selectedGuard === 'yes' ? 'Safety Guard' : 'No Guard'}
              onRemove={() => {
                wizardState.setSelectedGuard('');
                clearDownstreamSelections(7);
                wizardState.setStep(7);
              }}
            />
          )}
          {wizardState.selectedFeatures.map((featureId) => (
            <FilterChip
              key={featureId}
              label="Feature"
              value={features.find(f => f.id === featureId)?.label || featureId}
              onRemove={() => {
                wizardState.setSelectedFeatures(prev => prev.filter(id => id !== featureId));
              }}
            />
          ))}
        </div>
      </GlassCard>

      {/* Best Match Highlight */}
      {bestMatch && (
        <div className="mb-16 transform hover:scale-[1.01] transition-transform duration-500">
          <GlassCard cornerRadius={32} padding="0" blurAmount={0.25} saturation={150} displacementScale={50} overLight className="w-full overflow-hidden">
             <div className="grid grid-cols-1 lg:grid-cols-2">
               <div className="p-12 flex flex-col justify-center relative overflow-hidden">
                 <div className="relative z-10">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wider mb-6">
                      <Star className="w-4 h-4 fill-green-700" />
                      Top Recommendation
                   </div>
                   <h2 className="text-4xl font-bold text-foreground mb-4 leading-tight flex flex-wrap items-baseline gap-3">
                     {bestMatch.series}
                     {(bestMatch.part_number || bestMatch.id) && (
                       <span className="text-2xl font-medium text-muted-foreground">
                         # {bestMatch.part_number || String(bestMatch.id).toUpperCase()}
                       </span>
                     )}
                   </h2>
                   <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                     {bestMatch.description}
                   </p>

                   <div className="grid grid-cols-2 gap-6 mb-10">
                     <div>
                       <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">IP Rating</div>
                       <div className="font-medium text-foreground flex items-center gap-2">
                         {bestMatch.ip}
                         {bestMatch.ip === 'IP68' && <CheckCircle className="w-4 h-4 text-primary" />}
                       </div>
                     </div>
                     <div>
                       <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Duty Rating</div>
                       <div className="font-medium text-foreground">{bestMatch.duty.charAt(0).toUpperCase() + bestMatch.duty.slice(1)}</div>
                     </div>
                     <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Material</div>
                        <div className="font-medium text-foreground">{bestMatch.material}</div>
                     </div>
                     <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Action</div>
                        <div className="font-medium text-foreground">{bestMatch.actions.join(', ')}</div>
                     </div>
                     {bestMatch.voltage && (
                       <div>
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Voltage</div>
                          <div className="font-medium text-foreground">{bestMatch.voltage}</div>
                       </div>
                     )}
                     {bestMatch.certifications && (
                       <div>
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Certifications</div>
                          <div className="font-medium text-foreground">{bestMatch.certifications}</div>
                       </div>
                     )}
                   </div>

                   <div className="flex flex-col sm:flex-row gap-4">
                     <a
                       href={bestMatch.link || `https://linemaster.com/?s=${encodeURIComponent(bestMatch.part_number || bestMatch.series || bestMatch.id)}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary/30"
                     >
                       View Full Specifications
                       <ArrowRight className="w-5 h-5" />
                     </a>
                     <button
                        onClick={onGeneratePDF}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground/5 hover:bg-foreground/10 text-foreground font-bold rounded-xl transition-colors"
                     >
                       <Download className="w-5 h-5" />
                       Download PDF
                     </button>
                   </div>
                 </div>
               </div>
               <div className="bg-foreground/[0.03] p-12 flex items-center justify-center relative">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent dark:from-slate-800 opacity-60"></div>
                 <img
                   src={getProxiedImageUrl(bestMatch.image)}
                   alt={bestMatch.series}
                   className="w-full max-w-md object-contain drop-shadow-2xl relative z-10 transform hover:scale-105 transition-transform duration-500"
                 />
               </div>
             </div>
          </GlassCard>
        </div>
      )}

      {/* Enhanced Search and Filter */}
      <div className="mb-8">
         <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
           {bestMatch ? 'Other Compatible Options' : 'Available Products'}
           <span className="text-sm font-normal text-muted-foreground bg-foreground/5 px-3 py-1 rounded-full">
             {hasExactMatches ? exactMatches.length - 1 + (alternatives?.products.length || 0) : alternatives?.products.length || 0}
           </span>
         </h3>
         <EnhancedSearch
          products={hasExactMatches ? otherMatches : alternatives?.products || []}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          dutyFilter={dutyFilter}
          setDutyFilter={setDutyFilter}
          cordedFilter={cordedFilter}
          setCordedFilter={setCordedFilter}
          onFilteredChange={() => {}}
        />
      </div>

      {/* Product Results Grid */}
      {(() => {
        const baseProducts = hasExactMatches ? otherMatches : alternatives?.products || [];
        const filteredProducts = getProcessedProducts(baseProducts, {
          searchTerm,
          dutyFilter,
          cordedFilter,
          sortBy,
          selectedEnvironment: wizardState.selectedEnvironment,
        });

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {filteredProducts.map((product) => {
               const matchReasons = {
                 technology: technologies.find(t => t.id === wizardState.selectedTechnology)?.label,
                 action: actions.find(a => a.id === wizardState.selectedAction)?.label,
                 environment: environments.find(e => e.id === wizardState.selectedEnvironment)?.label,
                 features: wizardState.selectedFeatures
                   .filter(f => !f.includes('custom'))
                   .map(f => features.find(feat => feat.id === f)?.label)
                   .filter(Boolean) as string[],
               };

               return (
                 <ProductCard
                   key={product.id}
                   product={product}
                   matchReasons={matchReasons}
                 />
               );
            })}
          </div>
        );
      })()}

      {/* Alternative products notice */}
      {!hasExactMatches && alternatives && (
        <GlassCard cornerRadius={20} padding="24px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="mb-12 w-full">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#ff9500] rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
              ℹ️
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Need help choosing?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                We found these alternative products that closely match your requirements.
                Contact our team to discuss which option would work best for your specific application.
              </p>
              <button
                onClick={() => window.open('https://linemaster.com/contact/', '_blank')}
                className="px-6 py-2.5 bg-[#ff9500] hover:bg-[#ff9500]/90 text-white font-semibold rounded-lg transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Footer CTA */}
      <GlassCard cornerRadius={28} padding="32px" blurAmount={0.25} saturation={150} displacementScale={40} className="mt-16 w-full bg-[#1e293b]">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Can't find what you need?</h2>
          <p className="text-white/80 mb-6">
            Our team can help you find the right foot switch for your application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGeneratePDF}
              className="px-8 py-3 bg-white hover:bg-gray-100 text-[#1e293b] font-semibold rounded-xl transition-colors"
            >
              Download Specs PDF
            </button>
            <button
              onClick={() =>
                window.open('https://linemaster.com/contact/', '_blank')
              }
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
