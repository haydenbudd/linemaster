import { Option } from '@/app/lib/api';
import { WizardState } from '@/app/hooks/useWizardState';
import { OptionCard } from '@/app/components/OptionCard';
import { WizardStep, BackButton } from '@/app/components/wizard/WizardStep';
import { TrustBadges } from '@/app/components/TrustBadges';
import { GlassCard } from '@/app/components/GlassCard';
import { ArrowRight } from 'lucide-react';

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

const GUARD_OPTIONS: Option[] = [
  { id: 'yes', category: 'guard', label: 'Yes — Safety Guard', description: 'Includes a protective guard over the pedal to prevent accidental presses.', icon: 'Shield' },
  { id: 'no', category: 'guard', label: 'No Guard Needed', description: 'Standard open pedal without a protective guard.', icon: 'Footprints' },
];

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
  const visibleTechnologies = technologies.filter(
    (tech) => tech.availableFor?.includes(wizardState.selectedApplication) && getProductCount(1, tech.id) > 0
  );
  const visibleActions = actions.filter(
    (action) => action.availableFor?.includes(wizardState.selectedTechnology) && getProductCount(2, action.id) > 0
  );
  const visibleEnvironments = environments.filter((env) => getProductCount(3, env.id) > 0);
  const visibleDuties = duties.filter((d) => getProductCount(4, d.id) > 0);
  const visibleMaterials = materials.filter((m) => getProductCount(5, m.id) > 0);
  const visibleConnections = connections.filter((c) => getProductCount(6, c.id) > 0);
  const visibleGuards = GUARD_OPTIONS.filter((g) => getProductCount(7, g.id) > 0);

  const selectToContinue = (
    <div className="flex items-center justify-center pt-2">
      <span className="text-sm text-muted-foreground">Select to continue</span>
    </div>
  );

  const skipFooter = (clear: () => void) => (
    <div className="flex items-center justify-end">
      <button
        onClick={() => {
          clear();
          onContinue();
        }}
        className="px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground font-medium transition-all border border-dashed border-foreground/15 hover:border-foreground/30 rounded-xl"
      >
        No Preference — Skip
      </button>
    </div>
  );
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
                <div className="w-2 h-2 rounded-full bg-primary"></div>
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
            <BackButton onClick={onBack} label="Back to Industries" />
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
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Select an option to continue</span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {wizardState.step === 1 && (
        <WizardStep
          progressStep={getProgressStep(1)}
          totalSteps={totalSteps}
          displayStep={getDisplayStep(1)}
          onBack={onBack}
          title="Technology"
          description="Select your technology."
          emptyState={visibleTechnologies.length === 0}
          footer={selectToContinue}
        >
          <div className="space-y-4 mb-8">
            {visibleTechnologies.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                selected={wizardState.selectedTechnology === option.id}
                onSelect={() => {
                  wizardState.setSelectedTechnology(option.id);
                  clearDownstreamSelections(1);
                  setTimeout(onContinue, 150);
                }}
              />
            ))}
          </div>
        </WizardStep>
      )}

      {wizardState.step === 2 && (
        <WizardStep
          progressStep={getProgressStep(2)}
          totalSteps={totalSteps}
          displayStep={getDisplayStep(2)}
          onBack={onBack}
          title="Action"
          description="Select switch action."
          emptyState={visibleActions.length === 0}
          footer={selectToContinue}
        >
          <div className="space-y-4 mb-8">
            {visibleActions.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                selected={wizardState.selectedAction === option.id}
                onSelect={() => {
                  wizardState.setSelectedAction(option.id);
                  clearDownstreamSelections(2);
                  setTimeout(onContinue, 150);
                }}
              />
            ))}
          </div>
        </WizardStep>
      )}

      {wizardState.step === 3 && (
        <WizardStep
          progressStep={getProgressStep(3)}
          totalSteps={totalSteps}
          displayStep={getDisplayStep(3)}
          onBack={onBack}
          title="IP Rating"
          description="Select Ingress Protection rating."
          emptyState={visibleEnvironments.length === 0}
          footer={selectToContinue}
        >
          <div className="space-y-4 mb-8">
            {visibleEnvironments.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                selected={wizardState.selectedEnvironment === option.id}
                onSelect={() => {
                  wizardState.setSelectedEnvironment(option.id);
                  clearDownstreamSelections(3);
                  setTimeout(onContinue, 150);
                }}
              />
            ))}
          </div>
        </WizardStep>
      )}

      {wizardState.step === 4 && (
        <WizardStep
          progressStep={getProgressStep(4)}
          totalSteps={totalSteps}
          displayStep={getDisplayStep(4)}
          onBack={onBack}
          title="Duty Rating"
          description="Do you need a heavy switch that stays stable on the floor, or a lighter, cost-effective option?"
          emptyState={visibleDuties.length === 0}
          footer={skipFooter(() => wizardState.setSelectedDuty(''))}
        >
          <div className="space-y-4 mb-8">
            {visibleDuties.map((option) => (
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
        </WizardStep>
      )}

      {wizardState.step === 5 && (
        <WizardStep
          progressStep={getProgressStep(5)}
          totalSteps={totalSteps}
          displayStep={getDisplayStep(5)}
          onBack={onBack}
          title="Material"
          description="What material do you prefer? This affects weight, corrosion resistance, and cost."
          emptyState={visibleMaterials.length === 0}
          footer={skipFooter(() => wizardState.setSelectedMaterial(''))}
        >
          <div className="space-y-4 mb-8">
            {visibleMaterials.map((option) => (
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
        </WizardStep>
      )}

      {wizardState.step === 6 && (
        <WizardStep
          progressStep={getProgressStep(6)}
          totalSteps={totalSteps}
          displayStep={getDisplayStep(6)}
          onBack={onBack}
          title="Connection Type"
          description="Select connection style."
          emptyState={visibleConnections.length === 0}
          footer={skipFooter(() => wizardState.setSelectedConnection(''))}
        >
          <div className="space-y-4 mb-8">
            {visibleConnections.map((option) => (
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
        </WizardStep>
      )}

      {wizardState.step === 7 && (
        <WizardStep
          progressStep={getProgressStep(7)}
          totalSteps={totalSteps}
          displayStep={getDisplayStep(7)}
          onBack={onBack}
          title="Safety Guard"
          description="Do you need a built-in safety guard to prevent accidental activation?"
          emptyState={visibleGuards.length === 0}
          footer={skipFooter(() => wizardState.setSelectedGuard(''))}
        >
          <div className="space-y-4 mb-8">
            {visibleGuards.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                selected={wizardState.selectedGuard === option.id}
                onSelect={() => {
                  wizardState.setSelectedGuard(option.id);
                  clearDownstreamSelections(7);
                  setTimeout(onContinue, 150);
                }}
              />
            ))}
          </div>
        </WizardStep>
      )}

      {wizardState.step === 9 && (
        <WizardStep
          progressStep={getProgressStep(9)}
          totalSteps={totalSteps}
          displayStep={getDisplayStep(9)}
          onBack={onBack}
          title="Additional Features"
          description="Select any additional features you need."
          footer={
            <div className="flex items-center justify-end">
              <button
                onClick={onContinue}
                className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-colors"
              >
                See Results
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          }
        >
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
        </WizardStep>
      )}
    </>
  );
}
