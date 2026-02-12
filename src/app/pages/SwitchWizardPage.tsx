import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from '@/app/components/Router';
import {
  ArrowRight, ArrowLeft, RotateCcw, Zap, Wind, Gauge,
  Wifi, Activity, Shield, ChevronRight, ExternalLink,
  Sparkles, CheckCircle2, Factory, Stethoscope, HelpCircle,
  Footprints, Settings2, Package
} from 'lucide-react';
import {
  catalogProducts,
  type CatalogProduct,
} from '@/app/data/productCatalog';

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

interface WizardState {
  industry: string;
  application: string;
  type: string;
  pedals: string;
  features: Set<string>;
}

const initialState: WizardState = {
  industry: '',
  application: '',
  type: '',
  pedals: '',
  features: new Set(),
};

const TOTAL_STEPS = 6;

const industries = [
  {
    id: 'medical',
    label: 'Medical',
    description: 'Surgical suites, imaging, dental, and clinical equipment',
    icon: Stethoscope,
  },
  {
    id: 'industrial',
    label: 'Industrial',
    description: 'Manufacturing, metalworking, automation, and assembly',
    icon: Factory,
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Audio/video, tattooing, office equipment, and more',
    icon: HelpCircle,
  },
];

const applicationsByIndustry: Record<string, { id: string; label: string }[]> = {
  medical: [
    { id: 'surgical', label: 'Surgical Equipment' },
    { id: 'imaging', label: 'Medical Imaging' },
    { id: 'dental', label: 'Dental Equipment' },
    { id: 'laboratory', label: 'Laboratory Instruments' },
    { id: 'patient-handling', label: 'Patient Handling' },
    { id: 'medical-other', label: 'Other Medical' },
  ],
  industrial: [
    { id: 'machine-tools', label: 'Machine Tools' },
    { id: 'welding', label: 'Welding & Cutting' },
    { id: 'press-brake', label: 'Press Brakes & Stamping' },
    { id: 'packaging', label: 'Packaging & Assembly' },
    { id: 'robotics', label: 'Robotics & Automation' },
    { id: 'industrial-other', label: 'Other Industrial' },
  ],
  other: [
    { id: 'audio-video', label: 'Audio / Video Production' },
    { id: 'tattoo', label: 'Tattooing & Body Art' },
    { id: 'office', label: 'Office & Dictation' },
    { id: 'music', label: 'Musical Instruments' },
    { id: 'other-other', label: 'Other Application' },
  ],
};

const switchTypes = [
  {
    id: 'Electrical',
    label: 'Electrical',
    description: 'Standard electrical switching for most applications',
    icon: Zap,
  },
  {
    id: 'Pneumatic',
    label: 'Pneumatic',
    description: 'Air-powered controls for hazardous or wet environments',
    icon: Wind,
  },
  {
    id: 'either',
    label: 'Either / Not Sure',
    description: 'Show both electrical and pneumatic options',
    icon: Gauge,
  },
];

const pedalOptions = [
  { id: '1', label: 'Single Pedal', description: 'One foot control' },
  { id: '2', label: 'Twin Pedal', description: 'Two side-by-side pedals' },
  { id: 'any', label: 'Any / Not Sure', description: 'Show all options' },
];

const featureOptions = [
  {
    id: 'wireless',
    label: 'Wireless',
    description: 'No cord, RF-paired operation',
    icon: Wifi,
  },
  {
    id: 'linear',
    label: 'Linear / Variable Speed',
    description: 'Proportional output based on pedal position',
    icon: Activity,
  },
  {
    id: 'gated',
    label: 'Gated',
    description: 'Guard to prevent accidental activation',
    icon: Shield,
  },
  {
    id: 'ip-rated',
    label: 'IP Rated (Sealed)',
    description: 'Protection against dust and liquids',
    icon: Shield,
  },
];

/* ------------------------------------------------------------------ */
/*  Selection Card                                                     */
/* ------------------------------------------------------------------ */

function SelectionCard({
  selected,
  onClick,
  icon: Icon,
  label,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: React.ElementType;
  label: string;
  description?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left w-full p-5 rounded-xl border transition-all duration-200 group ${
        selected
          ? 'bg-[#2563EB]/15 border-[#2563EB]/50 ring-1 ring-[#2563EB]/30'
          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
      }`}
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${
              selected ? 'bg-[#2563EB]/25' : 'bg-white/5 group-hover:bg-white/10'
            }`}
          >
            <Icon
              className={`w-5 h-5 ${
                selected ? 'text-[#2563EB]' : 'text-white/40 group-hover:text-white/60'
              }`}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p
            className={`font-semibold text-base ${
              selected ? 'text-white' : 'text-white/80'
            }`}
          >
            {label}
          </p>
          {description && (
            <p className="text-white/40 text-sm mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {selected && (
          <CheckCircle2 className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
        )}
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Toggle Card (for multi-select features)                            */
/* ------------------------------------------------------------------ */

function ToggleCard({
  active,
  onToggle,
  icon: Icon,
  label,
  description,
}: {
  active: boolean;
  onToggle: () => void;
  icon: React.ElementType;
  label: string;
  description: string;
}) {
  return (
    <button
      onClick={onToggle}
      className={`text-left w-full p-5 rounded-xl border transition-all duration-200 group ${
        active
          ? 'bg-[#2563EB]/15 border-[#2563EB]/50 ring-1 ring-[#2563EB]/30'
          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${
            active ? 'bg-[#2563EB]/25' : 'bg-white/5 group-hover:bg-white/10'
          }`}
        >
          <Icon
            className={`w-5 h-5 ${
              active ? 'text-[#2563EB]' : 'text-white/40 group-hover:text-white/60'
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-base ${active ? 'text-white' : 'text-white/80'}`}>
            {label}
          </p>
          <p className="text-white/40 text-sm mt-0.5 leading-relaxed">{description}</p>
        </div>
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
            active ? 'bg-[#2563EB] border-[#2563EB]' : 'border-white/20'
          }`}
        >
          {active && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Result Product Card                                                */
/* ------------------------------------------------------------------ */

const typeColors: Record<string, { bg: string; text: string }> = {
  Electrical: { bg: 'bg-blue-500/20', text: 'text-blue-300' },
  'Electrical Pneumatic': { bg: 'bg-emerald-500/20', text: 'text-emerald-300' },
  'Pneumatic Flow Control': { bg: 'bg-amber-500/20', text: 'text-amber-300' },
};

function TypeIcon({ type, className }: { type: string; className?: string }) {
  if (type === 'Electrical') return <Zap className={className} />;
  if (type === 'Pneumatic Flow Control') return <Wind className={className} />;
  return <Gauge className={className} />;
}

function ResultCard({ product, index }: { product: CatalogProduct; index: number }) {
  const colors = typeColors[product.type] || typeColors['Electrical'];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className="relative bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 group h-full flex flex-col">
        {/* Type badge */}
        <span
          className={`absolute top-4 right-4 ${colors.bg} ${colors.text} text-xs font-medium px-2 py-0.5 rounded-full`}
        >
          {product.type}
        </span>

        {/* Icon area */}
        <div className="h-28 flex items-center justify-center bg-white/5 rounded-lg mb-4">
          <TypeIcon
            type={product.type}
            className="w-10 h-10 text-white/20 group-hover:text-white/30 transition-colors"
          />
        </div>

        {/* Content */}
        <h3 className="text-white font-semibold text-lg leading-tight">
          {product.series}
        </h3>
        <p className="text-white/50 text-sm mt-0.5">{product.part}</p>

        {/* Spec tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {product.configuration && (
            <span className="bg-white/5 text-white/60 text-xs px-2 py-0.5 rounded-md">
              {product.configuration}
            </span>
          )}
          <span className="bg-white/5 text-white/60 text-xs px-2 py-0.5 rounded-md">
            {product.numberOfPedals === 2 ? 'Twin' : 'Single'} Pedal
          </span>
          {product.ipRating && product.ipRating !== 'IPXX' && (
            <span className="bg-white/5 text-white/60 text-xs px-2 py-0.5 rounded-md">
              {product.ipRating}
            </span>
          )}
        </div>

        {/* Feature badges */}
        <div className="flex gap-2 mt-2">
          {product.wireless && (
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
              Wireless
            </span>
          )}
          {product.linear && (
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
              Linear
            </span>
          )}
          {product.gated && (
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
              Gated
            </span>
          )}
        </div>

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
/*  Progress Bar                                                       */
/* ------------------------------------------------------------------ */

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/40 text-xs font-medium">
          Step {step} of {total}
        </span>
        <span className="text-white/40 text-xs font-medium">{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#2563EB] rounded-full"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function SwitchWizardPage() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>({ ...initialState, features: new Set() });
  const [direction, setDirection] = useState(1); // 1 forward, -1 backward

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const restart = () => {
    setDirection(-1);
    setState({ ...initialState, features: new Set() });
    setStep(1);
  };

  const toggleFeature = (f: string) => {
    setState((prev) => {
      const next = new Set(prev.features);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return { ...prev, features: next };
    });
  };

  // Can user proceed?
  const canNext =
    (step === 1 && state.industry !== '') ||
    (step === 2 && state.application !== '') ||
    (step === 3 && state.type !== '') ||
    (step === 4 && state.pedals !== '') ||
    step === 5; // features are optional

  // Filter products for results
  const results = useMemo(() => {
    return catalogProducts.filter((p) => {
      // Type filter
      if (state.type === 'Electrical' && p.type !== 'Electrical') return false;
      if (
        state.type === 'Pneumatic' &&
        p.type !== 'Electrical Pneumatic' &&
        p.type !== 'Pneumatic Flow Control'
      )
        return false;

      // Pedals filter
      if (state.pedals === '1' && p.numberOfPedals !== 1) return false;
      if (state.pedals === '2' && p.numberOfPedals !== 2) return false;

      // Feature filters
      if (state.features.has('wireless') && !p.wireless) return false;
      if (state.features.has('linear') && !p.linear) return false;
      if (state.features.has('gated') && !p.gated) return false;
      if (
        state.features.has('ip-rated') &&
        (!p.ipRating || p.ipRating === 'IPXX')
      )
        return false;

      return true;
    });
  }, [state]);

  // Limit display to top 12
  const displayResults = results.slice(0, 12);

  /* Step content renderer */
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2">
              What industry are you in?
            </h2>
            <p className="text-white/50 text-base mb-8">
              This helps us narrow down the best foot control options for your
              environment.
            </p>
            <div className="grid gap-3 max-w-lg">
              {industries.map((ind) => (
                <SelectionCard
                  key={ind.id}
                  selected={state.industry === ind.id}
                  onClick={() => setState((s) => ({ ...s, industry: ind.id, application: '' }))}
                  icon={ind.icon}
                  label={ind.label}
                  description={ind.description}
                />
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2">
              What is your application?
            </h2>
            <p className="text-white/50 text-base mb-8">
              Select the application that best describes your use case.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
              {(applicationsByIndustry[state.industry] || []).map((app) => (
                <SelectionCard
                  key={app.id}
                  selected={state.application === app.id}
                  onClick={() => setState((s) => ({ ...s, application: app.id }))}
                  label={app.label}
                />
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2">
              What type of switch do you need?
            </h2>
            <p className="text-white/50 text-base mb-8">
              Choose the switching technology that suits your application.
            </p>
            <div className="grid gap-3 max-w-lg">
              {switchTypes.map((t) => (
                <SelectionCard
                  key={t.id}
                  selected={state.type === t.id}
                  onClick={() => setState((s) => ({ ...s, type: t.id }))}
                  icon={t.icon}
                  label={t.label}
                  description={t.description}
                />
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2">
              How many pedals do you need?
            </h2>
            <p className="text-white/50 text-base mb-8">
              Choose the number of foot pedals for your control.
            </p>
            <div className="grid gap-3 max-w-lg">
              {pedalOptions.map((p) => (
                <SelectionCard
                  key={p.id}
                  selected={state.pedals === p.id}
                  onClick={() => setState((s) => ({ ...s, pedals: p.id }))}
                  icon={Footprints}
                  label={p.label}
                  description={p.description}
                />
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2">
              Any special features needed?
            </h2>
            <p className="text-white/50 text-base mb-8">
              Select all that apply, or skip this step if none are required.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
              {featureOptions.map((f) => (
                <ToggleCard
                  key={f.id}
                  active={state.features.has(f.id)}
                  onToggle={() => toggleFeature(f.id)}
                  icon={f.icon}
                  label={f.label}
                  description={f.description}
                />
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-16 h-16 bg-[#2563EB]/15 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <Sparkles className="w-8 h-8 text-[#2563EB]" />
              </motion.div>
              <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2">
                Your Recommended Products
              </h2>
              <p className="text-white/50 text-base max-w-lg mx-auto">
                {results.length > 0
                  ? `We found ${results.length} product${results.length !== 1 ? 's' : ''} matching your criteria.${results.length > 12 ? ' Showing the top 12 results.' : ''}`
                  : 'No exact matches found. Try adjusting your preferences or browse our full catalog.'}
              </p>
            </div>

            {displayResults.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayResults.map((product, i) => (
                  <ResultCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-white font-semibold text-xl mb-2">
                  No exact matches
                </h3>
                <p className="text-white/50 mb-6 max-w-md mx-auto">
                  We could not find stock products with those exact specifications.
                  Linemaster can build a custom solution for your needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/custom-solutions"
                    className="inline-flex items-center justify-center gap-2 bg-[#D4A853] hover:bg-[#c49a48] text-[#0A1628] font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
                  >
                    Request Custom Solution <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 border border-white/20"
                  >
                    Browse All Products
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Additional CTAs below results */}
            {displayResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
              >
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 border border-white/20"
                >
                  Browse Full Catalog <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/custom-solutions"
                  className="inline-flex items-center justify-center gap-2 bg-[#D4A853] hover:bg-[#c49a48] text-[#0A1628] font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
                >
                  Request Custom Solution <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden">
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#2563EB]/10 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-4"
          >
            Footswitch Finder
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Find Your Perfect
            <br />
            <span className="text-[#2563EB]">Foot Control</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Answer a few quick questions and we will recommend the best
            Linemaster footswitch for your application.
          </motion.p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WIZARD                                                       */}
      {/* ============================================================ */}
      <section className="py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress */}
          <div className="mb-10">
            <ProgressBar step={step} total={TOTAL_STEPS} />
          </div>

          {/* Step content with AnimatePresence */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
            {step > 1 ? (
              <button
                onClick={step === 6 ? restart : goBack}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white font-medium transition-colors"
              >
                {step === 6 ? (
                  <>
                    <RotateCcw className="w-4 h-4" /> Start Over
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-4 h-4" /> Back
                  </>
                )}
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS && (
              <button
                onClick={goNext}
                disabled={!canNext}
                className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-[#2563EB]/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#2563EB]"
              >
                {step === 5 ? 'See Results' : 'Continue'}{' '}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
