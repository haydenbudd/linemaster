import { Option } from '@/app/lib/api';
import { WizardState } from '@/app/hooks/useWizardState';
import { OptionCard } from '@/app/components/OptionCard';
import { ProgressDots } from '@/app/components/ProgressDots';
import { TrustBadges } from '@/app/components/TrustBadges';
import { GlassCard } from '@/app/components/GlassCard';
import { ChevronLeft, ArrowRight } from 'lucide-react';

export interface StandardStepsProps {
  wizardState: WizardState;
  categories: Option[];
  applications: Option[];
  technologies: Option[];
  actions: Option[];
  environments: Option[];
  features: Option[];
  duties: Option[];
  materials: Option[];
  connections: Option[];
  totalSteps: number;
  getProgressStep: (rawStep: number) => number;
  getDisplayStep: (rawStep: number) => number;
  getProductCount: (step: number, optionId?: string) => number;
  clearDownstreamSelections: (fromStep: number) => void;
  onCategorySelect: (id: string) => void;
  onApplicationSelect: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function StandardSteps({
  wizardState,
  categories,
  applications,
  technologies,
  actions,
  environments,
  features,
  duties,
  materials,
  connections,
  totalSteps,
  getProgressStep,
  getDisplayStep,
  getProductCount,
  clearDownstreamSelections,
  onCategorySelect,
  onApplicationSelect,
  onBack,
  onContinue,
}: StandardStepsProps) {
  // Filter applications by selected category for phase 2
  const filteredApps = wizardState.selectedCategory
    ? applications.filter((a: any) => a.parentCategory === wizardState.selectedCategory)
    : applications;
  return (
    <>
      {wizardState.step === 0 && !wizardState.selectedCategory && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Find Your Perfect Foot Switch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Answer a few questions and we'll recommend the best product for your needs
            </p>
          </div>

          <GlassCard cornerRadius={28} padding="32px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-1 bg-gradient-to-b from-primary to-purple-500 rounded-full"></div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  What's your industry?
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground mb-8">Select the category that best matches your business.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {categories.map((option) => (
                <OptionCard
                  key={option.id}
                  option={option}
                  selected={wizardState.selectedCategory === option.id}
                  onSelect={() => onCategorySelect(option.id)}
                />
              ))}
            </div>

            <div className="flex items-center justify-center pt-6 border-t border-foreground/5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span>Select an option to continue</span>
              </div>
            </div>

            <TrustBadges />
          </GlassCard>
        </div>
      )}

      {wizardState.step === 0 && wizardState.selectedCategory && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Find Your Perfect Foot Switch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Answer a few questions and we'll recommend the best product for your needs
            </p>
          </div>

          <GlassCard cornerRadius={28} padding="32px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full">
            <button
              onClick={onBack}
              className="flex items-center gap-2 mb-4 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] rounded-xl transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Industries
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-1 bg-gradient-to-b from-primary to-purple-500 rounded-full"></div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  What's your application?
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground mb-8">Select the specific use case that best describes your needs.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {filteredApps.map((option) => (
                <OptionCard
                  key={option.id}
                  option={option}
                  selected={wizardState.selectedApplication === option.id}
                  onSelect={() => onApplicationSelect(option.id)}
                />
              ))}
            </div>

            <div className="flex items-center justify-center pt-6 border-t border-foreground/5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span>Select an option to continue</span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {wizardState.step === 1 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={getProgressStep(1)} totalSteps={totalSteps} />
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] rounded-xl transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <GlassCard cornerRadius={28} padding="32px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full">
            <div className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              STEP {getDisplayStep(1)} OF {totalSteps}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Technology</h2>
            <p className="text-sm text-muted-foreground mb-6">Select your technology.</p>

            <div className="space-y-4 mb-8">
              {technologies
                .filter((tech) => tech.availableFor?.includes(wizardState.selectedApplication))
                .map((option) => (
                  <div key={option.id}>
                    <OptionCard
                      option={option}
                      selected={wizardState.selectedTechnology === option.id}
                      onSelect={() => {
                        wizardState.setSelectedTechnology(option.id);
                        clearDownstreamSelections(1);
                        setTimeout(onContinue, 150);
                      }}
                    />
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-center pt-2">
              <span className="text-sm text-muted-foreground">Select to continue</span>
            </div>
          </GlassCard>
        </div>
      )}

      {wizardState.step === 2 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={getProgressStep(2)} totalSteps={totalSteps} />
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] rounded-xl transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <GlassCard cornerRadius={28} padding="32px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full">
            <div className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              STEP {getDisplayStep(2)} OF {totalSteps}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Action</h2>
            <p className="text-sm text-muted-foreground mb-6">Select switch action.</p>

            <div className="space-y-4 mb-8">
              {actions
                .filter((action) => action.availableFor?.includes(wizardState.selectedTechnology))
                .map((option) => (
                  <div key={option.id}>
                    <OptionCard
                      option={option}
                      selected={wizardState.selectedAction === option.id}
                      onSelect={() => {
                        wizardState.setSelectedAction(option.id);
                        clearDownstreamSelections(2);
                        setTimeout(onContinue, 150);
                      }}
                    />
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-center pt-2">
              <span className="text-sm text-muted-foreground">Select to continue</span>
            </div>
          </GlassCard>
        </div>
      )}

      {wizardState.step === 3 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={getProgressStep(3)} totalSteps={totalSteps} />
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] rounded-xl transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <GlassCard cornerRadius={28} padding="32px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full">
            <div className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              STEP {getDisplayStep(3)} OF {totalSteps}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">IP Rating</h2>
            <p className="text-sm text-muted-foreground mb-6">Select Ingress Protection rating.</p>

            <div className="space-y-4 mb-8">
              {environments
                .map((option) => (
                <div key={option.id}>
                  <OptionCard
                    option={option}
                    selected={wizardState.selectedEnvironment === option.id}
                    onSelect={() => {
                      wizardState.setSelectedEnvironment(option.id);
                      clearDownstreamSelections(3);
                      setTimeout(onContinue, 150);
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center pt-2">
              <span className="text-sm text-muted-foreground">Select to continue</span>
            </div>
          </GlassCard>
        </div>
      )}

      {wizardState.step === 4 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={getProgressStep(4)} totalSteps={totalSteps} />
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] rounded-xl transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <GlassCard cornerRadius={28} padding="32px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full">
            <div className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              STEP {getDisplayStep(4)} OF {totalSteps}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Stability & Material</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Do you need a heavy switch that stays stable on the floor, or a lighter, cost-effective option?
            </p>

            <div className="space-y-4 mb-8">
              {duties
                .filter(d => getProductCount(4, d.id) > 0)
                .map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={wizardState.selectedDuty === option.id}
                    onSelect={() => {
                      wizardState.setSelectedDuty(option.id);
                      clearDownstreamSelections(4);
                      setTimeout(onContinue, 150);
                    }}
                  />
                ))}
            </div>

            {duties.every(d => getProductCount(4, d.id) === 0) && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-200">
                No products match your current selections. Try adjusting your previous choices, or{' '}
                <a href="https://linemaster.com/contact/" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-amber-900 dark:hover:text-amber-100">contact us</a>{' '}
                for assistance.
              </div>
            )}

            <div className="flex items-center justify-end">
              <button
                onClick={() => {
                  wizardState.setSelectedDuty('');
                  onContinue();
                }}
                className="px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground font-medium transition-all border border-dashed border-foreground/15 hover:border-foreground/30 rounded-xl"
              >
                No Preference — Skip
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {wizardState.step === 5 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={getProgressStep(5)} totalSteps={totalSteps} />
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] rounded-xl transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <GlassCard cornerRadius={28} padding="32px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full">
            <div className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              STEP {getDisplayStep(5)} OF {totalSteps}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Material</h2>
            <p className="text-sm text-muted-foreground mb-6">
              What material do you prefer? This affects weight, corrosion resistance, and cost.
            </p>

            <div className="space-y-4 mb-8">
              {materials
                .filter(m => getProductCount(5, m.id) > 0)
                .map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={wizardState.selectedMaterial === option.id}
                    onSelect={() => {
                      wizardState.setSelectedMaterial(option.id);
                      clearDownstreamSelections(5);
                      setTimeout(onContinue, 150);
                    }}
                  />
                ))}
            </div>

            {materials.every(m => getProductCount(5, m.id) === 0) && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-200">
                No products match your current selections. Try adjusting your previous choices, or{' '}
                <a href="https://linemaster.com/contact/" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-amber-900 dark:hover:text-amber-100">contact us</a>{' '}
                for assistance.
              </div>
            )}

            <div className="flex items-center justify-end">
              <button
                onClick={() => {
                  wizardState.setSelectedMaterial('');
                  onContinue();
                }}
                className="px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground font-medium transition-all border border-dashed border-foreground/15 hover:border-foreground/30 rounded-xl"
              >
                No Preference — Skip
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {wizardState.step === 6 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={getProgressStep(6)} totalSteps={totalSteps} />
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] rounded-xl transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <GlassCard cornerRadius={28} padding="32px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full">
            <div className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              STEP {getDisplayStep(6)} OF {totalSteps}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Connection Type</h2>
            <p className="text-sm text-muted-foreground mb-6">Select connection style.</p>

            <div className="space-y-4 mb-8">
              {connections
                .filter(c => getProductCount(6, c.id) > 0)
                .map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={wizardState.selectedConnection === option.id}
                    onSelect={() => {
                      wizardState.setSelectedConnection(option.id);
                      clearDownstreamSelections(6);
                      setTimeout(onContinue, 150);
                    }}
                  />
                ))}
            </div>

            {connections.every(c => getProductCount(6, c.id) === 0) && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-200">
                No products match your current selections. Try adjusting your previous choices, or{' '}
                <a href="https://linemaster.com/contact/" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-amber-900 dark:hover:text-amber-100">contact us</a>{' '}
                for assistance.
              </div>
            )}

            <div className="flex items-center justify-end">
              <button
                onClick={() => {
                  wizardState.setSelectedConnection('');
                  onContinue();
                }}
                className="px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground font-medium transition-all border border-dashed border-foreground/15 hover:border-foreground/30 rounded-xl"
              >
                No Preference — Skip
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {wizardState.step === 7 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={getProgressStep(7)} totalSteps={totalSteps} />
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] rounded-xl transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <GlassCard cornerRadius={28} padding="32px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full">
            <div className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              STEP {getDisplayStep(7)} OF {totalSteps}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Safety Guard</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Do you need a built-in safety guard to prevent accidental activation?
            </p>

            <div className="space-y-4 mb-8">
              <OptionCard
                option={{ id: 'yes', label: 'Yes — Safety Guard', description: 'Includes a protective guard over the pedal to prevent accidental presses.', icon: 'Shield' }}
                selected={wizardState.selectedGuard === 'yes'}
                onSelect={() => {
                  wizardState.setSelectedGuard('yes');
                  clearDownstreamSelections(7);
                  setTimeout(onContinue, 150);
                }}
              />
              <OptionCard
                option={{ id: 'no', label: 'No Guard Needed', description: 'Standard open pedal without a protective guard.', icon: 'Footprints' }}
                selected={wizardState.selectedGuard === 'no'}
                onSelect={() => {
                  wizardState.setSelectedGuard('no');
                  clearDownstreamSelections(7);
                  setTimeout(onContinue, 150);
                }}
              />
            </div>

            {getProductCount(7, 'yes') === 0 && getProductCount(7, 'no') === 0 && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-200">
                No products match your current selections. Try adjusting your previous choices, or{' '}
                <a href="https://linemaster.com/contact/" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-amber-900 dark:hover:text-amber-100">contact us</a>{' '}
                for assistance.
              </div>
            )}

            <div className="flex items-center justify-end">
              <button
                onClick={() => {
                  wizardState.setSelectedGuard('');
                  onContinue();
                }}
                className="px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground font-medium transition-all border border-dashed border-foreground/15 hover:border-foreground/30 rounded-xl"
              >
                No Preference — Skip
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {wizardState.step === 9 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={getProgressStep(9)} totalSteps={totalSteps} />
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] rounded-xl transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <GlassCard cornerRadius={28} padding="32px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full">
            <div className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              STEP {getDisplayStep(9)} OF {totalSteps}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Additional Features</h2>
            <p className="text-sm text-muted-foreground mb-6">Select any additional features you need.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features
                .filter(
                  (feature) => !feature.hideFor?.includes(wizardState.selectedTechnology)
                    && feature.id !== 'shield' && feature.id !== 'twin'
                )
                .map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={wizardState.selectedFeatures.includes(option.id)}
                    multiSelect
                    onSelect={() => {
                      wizardState.setSelectedFeatures((prev) =>
                        prev.includes(option.id)
                          ? prev.filter((id) => id !== option.id)
                          : [...prev, option.id]
                      );
                    }}
                  />
                ))}
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={onContinue}
                className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-colors"
              >
                See Results
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
}
