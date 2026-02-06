import { useState, Suspense, lazy, useMemo } from 'react';
import { Router } from '@/app/components/Router';
import { Header } from '@/app/components/Header';
import { OrbBackground } from '@/app/components/OrbBackground';
import { useProductData } from '@/app/hooks/useProductData';
import { useWizardState } from '@/app/hooks/useWizardState';
import { trackWizardStep, trackNoResults } from '@/app/utils/analytics';
import { generatePDF } from '@/app/utils/generatePDF';
import { MedicalFlow } from '@/app/components/wizard/MedicalFlow';
import { StandardSteps } from '@/app/components/wizard/StandardSteps';
import { ResultsPage } from '@/app/components/wizard/ResultsPage';

// Lazy load admin panel
const AdminContainer = lazy(() =>
  import('@/app/components/admin/AdminContainer').then(module => ({
    default: module.AdminContainer
  }))
);

function WizardApp() {
  const wizardState = useWizardState();

  const {
    products,
    applications,
    technologies,
    actions,
    environments,
    features,
    consoleStyles,
    pedalCounts,
    medicalTechnicalFeatures,
    accessories,
    materials,
    connections,
    duties,
  } = useProductData();

  // Enhanced search state for results page
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'duty' | 'ip'>('relevance');
  const [dutyFilter, setDutyFilter] = useState<string[]>([]);
  const [cordedFilter, setCordedFilter] = useState<'all' | 'corded' | 'cordless'>('all');

  const handleReset = () => {
    wizardState.resetWizard();
    setSearchTerm('');
    setSortBy('relevance');
    setDutyFilter([]);
    setCordedFilter('all');
  };

  // Clear all selections downstream of the given step to prevent stale filter combos
  const clearDownstreamSelections = (fromStep: number) => {
    if (fromStep <= 1) { wizardState.setSelectedAction(''); }
    if (fromStep <= 2) { wizardState.setSelectedEnvironment(''); }
    if (fromStep <= 3) { wizardState.setSelectedDuty(''); }
    if (fromStep <= 4) { wizardState.setSelectedMaterial(''); }
    if (fromStep <= 5) { wizardState.setSelectedConnection(''); }
    if (fromStep <= 6) { wizardState.setSelectedGuard(''); }
    if (fromStep <= 7) { wizardState.setSelectedFeatures([]); }
  };

  const handleApplicationSelect = (id: string) => {
    wizardState.setSelectedApplication(id);
    wizardState.setSelectedTechnology('');
    clearDownstreamSelections(0);
    const app = applications.find((a) => a.id === id);
    if (app?.isMedical) {
      wizardState.setFlow('medical');
      setTimeout(() => wizardState.setStep(1), 150);
    } else {
      wizardState.setFlow('standard');
      setTimeout(() => wizardState.setStep(1), 150);
    }
    trackWizardStep(0, app?.isMedical ? 'medical' : 'standard', { application: id });
  };

  const handleBack = () => {
    if (wizardState.step === 0) return;
    if (wizardState.flow === 'medical' && wizardState.step === 1) {
      wizardState.setFlow('standard');
      wizardState.setStep(0);
      wizardState.setSelectedApplication('');
    } else {
      let prevStep = wizardState.step - 1;
      // Skip Pedal Configuration step (index 8) — removed
      if (prevStep === 8) {
        prevStep--;
      }
      // Skip Connection Type step (index 6) for Air/pneumatic technology
      if (prevStep === 6 && wizardState.selectedTechnology === 'pneumatic') {
        prevStep--;
      }
      wizardState.setStep(prevStep);
    }
  };

  const handleContinue = () => {
    let newStep = wizardState.step + 1;
    // Skip Connection Type step (index 6) for Air/pneumatic technology
    if (newStep === 6 && wizardState.selectedTechnology === 'pneumatic') {
      newStep++;
    }
    // Skip Pedal Configuration step (index 8) — removed
    if (newStep === 8) {
      newStep++;
    }
    wizardState.setStep(newStep);
    trackWizardStep(newStep, wizardState.flow, {
      application: wizardState.selectedApplication,
      technology: wizardState.selectedTechnology,
      action: wizardState.selectedAction,
      environment: wizardState.selectedEnvironment,
      features: wizardState.selectedFeatures,
    });
  };

  const handleViewMedicalProducts = () => {
    wizardState.setFlow('standard');
    wizardState.setStep(10);
    trackWizardStep(10, 'standard', {
      application: wizardState.selectedApplication,
      source: 'medical_bypass'
    });
  };

  const filterProducts = (overrides: Partial<typeof wizardState> = {}) => {
    const state = { ...wizardState, ...overrides };

    return products.filter((product) => {
      if (state.selectedApplication && !product.applications.includes(state.selectedApplication)) return false;
      if (state.selectedTechnology && product.technology !== state.selectedTechnology) return false;
      if (state.selectedAction && !product.actions.includes(state.selectedAction)) return false;
      if (state.selectedEnvironment === 'wet' && product.ip !== 'IP68') return false;
      if (state.selectedEnvironment === 'damp' && !['IP56', 'IP68'].includes(product.ip)) return false;
      if (state.selectedDuty && product.duty !== state.selectedDuty) return false;
      if (state.selectedMaterial && product.material !== state.selectedMaterial) return false;
      if (state.selectedTechnology !== 'pneumatic' && state.selectedConnection && product.connector_type !== state.selectedConnection) return false;
      if (state.selectedGuard === 'yes' && !(product.features || []).includes('shield')) return false;
      if (state.selectedGuard === 'no' && (product.features || []).includes('shield')) return false;

      if (state.selectedFeatures.length > 0) {
        const hardwareFeatures = state.selectedFeatures.filter(
          f => f !== 'custom_cable' && f !== 'custom_connector'
        );
        if (hardwareFeatures.length > 0) {
          const productFeatures = product.features || [];
          const hasAllFeatures = hardwareFeatures.every(featureId => productFeatures.includes(featureId));
          if (!hasAllFeatures) return false;
        }
      }

      return true;
    });
  };

  const getProductCount = (step: number, optionId?: string) => {
    if (step === 1) {
      return products.filter(p =>
        p.applications.includes(wizardState.selectedApplication) &&
        p.technology === optionId
      ).length;
    } else if (step === 2) {
      return products.filter(p =>
        p.applications.includes(wizardState.selectedApplication) &&
        p.technology === wizardState.selectedTechnology &&
        p.actions.includes(optionId || '')
      ).length;
    } else if (step === 3) {
      return products.filter(p => {
        if (!p.applications.includes(wizardState.selectedApplication)) return false;
        if (p.technology !== wizardState.selectedTechnology) return false;
        if (!p.actions.includes(wizardState.selectedAction)) return false;
        if (optionId === 'wet' && p.ip !== 'IP68') return false;
        if (optionId === 'damp' && !['IP56', 'IP68'].includes(p.ip)) return false;
        return true;
      }).length;
    } else if (step === 4) {
      return products.filter(p => {
        if (!p.applications.includes(wizardState.selectedApplication)) return false;
        if (p.technology !== wizardState.selectedTechnology) return false;
        if (!p.actions.includes(wizardState.selectedAction)) return false;
        if (wizardState.selectedEnvironment === 'wet' && p.ip !== 'IP68') return false;
        if (wizardState.selectedEnvironment === 'damp' && !['IP56', 'IP68'].includes(p.ip)) return false;
        return p.duty === optionId;
      }).length;
    } else if (step === 5) {
      return products.filter(p => {
        if (!p.applications.includes(wizardState.selectedApplication)) return false;
        if (p.technology !== wizardState.selectedTechnology) return false;
        if (!p.actions.includes(wizardState.selectedAction)) return false;
        if (wizardState.selectedEnvironment === 'wet' && p.ip !== 'IP68') return false;
        if (wizardState.selectedEnvironment === 'damp' && !['IP56', 'IP68'].includes(p.ip)) return false;
        if (wizardState.selectedDuty && p.duty !== wizardState.selectedDuty) return false;
        return p.material === optionId;
      }).length;
    } else if (step === 6) {
      return products.filter(p => {
        if (!p.applications.includes(wizardState.selectedApplication)) return false;
        if (p.technology !== wizardState.selectedTechnology) return false;
        if (!p.actions.includes(wizardState.selectedAction)) return false;
        if (wizardState.selectedEnvironment === 'wet' && p.ip !== 'IP68') return false;
        if (wizardState.selectedEnvironment === 'damp' && !['IP56', 'IP68'].includes(p.ip)) return false;
        if (wizardState.selectedDuty && p.duty !== wizardState.selectedDuty) return false;
        if (wizardState.selectedMaterial && p.material !== wizardState.selectedMaterial) return false;
        return p.connector_type === optionId;
      }).length;
    } else if (step === 7) {
      return products.filter(p => {
        if (!p.applications.includes(wizardState.selectedApplication)) return false;
        if (p.technology !== wizardState.selectedTechnology) return false;
        if (!p.actions.includes(wizardState.selectedAction)) return false;
        if (wizardState.selectedEnvironment === 'wet' && p.ip !== 'IP68') return false;
        if (wizardState.selectedEnvironment === 'damp' && !['IP56', 'IP68'].includes(p.ip)) return false;
        if (wizardState.selectedDuty && p.duty !== wizardState.selectedDuty) return false;
        if (wizardState.selectedMaterial && p.material !== wizardState.selectedMaterial) return false;
        if (wizardState.selectedTechnology !== 'pneumatic' && wizardState.selectedConnection && p.connector_type !== wizardState.selectedConnection) return false;
        const hasShield = (p.features || []).includes('shield');
        if (optionId === 'yes') return hasShield;
        if (optionId === 'no') return !hasShield;
        return true;
      }).length;
    }
    return 0;
  };

  const getAlternativeProducts = () => {
    if (wizardState.selectedFeatures.length > 0) {
      const withoutFeatures = filterProducts({ selectedFeatures: [] });
      if (withoutFeatures.length > 0) return { products: withoutFeatures, relaxed: 'features' as const };
    }
    if (wizardState.selectedGuard) {
      const withoutGuard = filterProducts({ selectedFeatures: [], selectedGuard: '' });
      if (withoutGuard.length > 0) return { products: withoutGuard, relaxed: 'guard' as const };
    }
    if (wizardState.selectedMaterial) {
      const withoutMaterial = filterProducts({ selectedFeatures: [], selectedGuard: '', selectedMaterial: '' });
      if (withoutMaterial.length > 0) return { products: withoutMaterial, relaxed: 'material' as const };
    }
    if (wizardState.selectedDuty) {
      const withoutDuty = filterProducts({ selectedFeatures: [], selectedGuard: '', selectedMaterial: '', selectedDuty: '' });
      if (withoutDuty.length > 0) return { products: withoutDuty, relaxed: 'duty' as const };
    }
    if (wizardState.selectedEnvironment) {
      const withoutEnvironment = products.filter((product) => {
        if (!product.applications.includes(wizardState.selectedApplication)) return false;
        if (product.technology !== wizardState.selectedTechnology) return false;
        if (!product.actions.includes(wizardState.selectedAction)) return false;
        return true;
      });
      if (withoutEnvironment.length > 0) return { products: withoutEnvironment, relaxed: 'environment' as const };
    }
    if (wizardState.selectedAction) {
      const withoutAction = products.filter((product) => {
        if (!product.applications.includes(wizardState.selectedApplication)) return false;
        if (product.technology !== wizardState.selectedTechnology) return false;
        return true;
      });
      if (withoutAction.length > 0) return { products: withoutAction, relaxed: 'action' as const };
    }
    if (wizardState.selectedTechnology) {
      const withoutTechnology = products.filter((product) => {
        if (!product.applications.includes(wizardState.selectedApplication)) return false;
        return true;
      });
      if (withoutTechnology.length > 0) return { products: withoutTechnology, relaxed: 'technology' as const };
    }
    const allForApplication = products.filter((product) => product.applications.includes(wizardState.selectedApplication));
    return { products: allForApplication, relaxed: 'all' as const };
  };

  const needsCustomSolution = useMemo(() => {
    const filtered = filterProducts();
    const hasCustomFeature =
      wizardState.selectedFeatures.includes('custom_cable') ||
      wizardState.selectedFeatures.includes('custom_connector');

    if (wizardState.step === 10 && filtered.length === 0) {
      trackNoResults({
        application: wizardState.selectedApplication,
        technology: wizardState.selectedTechnology,
        action: wizardState.selectedAction,
        environment: wizardState.selectedEnvironment,
        features: wizardState.selectedFeatures,
      });
    }
    return hasCustomFeature;
  }, [
    products,
    wizardState.step,
    wizardState.selectedApplication,
    wizardState.selectedTechnology,
    wizardState.selectedAction,
    wizardState.selectedEnvironment,
    wizardState.selectedDuty,
    wizardState.selectedMaterial,
    wizardState.selectedConnection,
    wizardState.selectedGuard,
    wizardState.selectedFeatures,
  ]);

  const handleGeneratePDF = () => {
    generatePDF({
      wizardState,
      matchedProducts: filterProducts(),
      applications, technologies, actions, environments, features, duties,
      consoleStyles, pedalCounts, medicalTechnicalFeatures, accessories,
    });
  };

  // Calculate total visible steps dynamically
  const totalSteps = (() => {
    if (wizardState.flow === 'medical') return 4;
    let steps = 8;
    if (wizardState.selectedTechnology === 'pneumatic') steps--;
    return steps;
  })();

  const getProgressStep = (rawStep: number) => {
    if (rawStep <= 0) return 0;
    let step = rawStep - 1;
    if (wizardState.selectedTechnology === 'pneumatic' && rawStep > 6) step--;
    if (rawStep > 8) step--;
    return step;
  };

  const getDisplayStep = (rawStep: number) => getProgressStep(rawStep) + 1;

  // Medical flow
  if (wizardState.flow === 'medical') {
    return (
      <MedicalFlow
        wizardState={wizardState}
        consoleStyles={consoleStyles}
        pedalCounts={pedalCounts}
        medicalTechnicalFeatures={medicalTechnicalFeatures}
        accessories={accessories}
        totalSteps={totalSteps}
        onBack={handleBack}
        onContinue={handleContinue}
        onViewStandardProducts={handleViewMedicalProducts}
        onGeneratePDF={handleGeneratePDF}
        onReset={handleReset}
      />
    );
  }

  // Standard flow
  return (
    <div className="min-h-screen mesh-gradient-light relative z-10">
      <OrbBackground />
      <Header onReset={handleReset} />

      {wizardState.step >= 0 && wizardState.step <= 9 && (
        <StandardSteps
          wizardState={wizardState}
          applications={applications}
          technologies={technologies}
          actions={actions}
          environments={environments}
          features={features}
          duties={duties}
          materials={materials}
          connections={connections}
          totalSteps={totalSteps}
          getProgressStep={getProgressStep}
          getDisplayStep={getDisplayStep}
          getProductCount={getProductCount}
          clearDownstreamSelections={clearDownstreamSelections}
          onApplicationSelect={handleApplicationSelect}
          onBack={handleBack}
          onContinue={handleContinue}
        />
      )}

      {wizardState.step === 10 && (
        <ResultsPage
          wizardState={wizardState}
          products={products}
          applications={applications}
          technologies={technologies}
          actions={actions}
          environments={environments}
          features={features}
          duties={duties}
          filterProducts={filterProducts}
          getAlternativeProducts={getAlternativeProducts}
          needsCustomSolution={needsCustomSolution}
          onBack={handleBack}
          onReset={handleReset}
          onGeneratePDF={handleGeneratePDF}
          clearDownstreamSelections={clearDownstreamSelections}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          dutyFilter={dutyFilter}
          setDutyFilter={setDutyFilter}
          cordedFilter={cordedFilter}
          setCordedFilter={setCordedFilter}
        />
      )}
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
        return <WizardApp />;
      }}
    </Router>
  );
}
