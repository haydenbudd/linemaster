import React, { useState, Suspense, lazy } from 'react';
import { Router } from '@/app/components/Router';
import { Header } from '@/app/components/Header';
import { ProgressDots } from '@/app/components/ProgressDots';
import { OptionCard } from '@/app/components/OptionCard';
import { ProductCard } from '@/app/components/ProductCard';
import { FilterChip } from '@/app/components/FilterChip';
import { TrustBadges } from '@/app/components/TrustBadges';
import { ProductCountBadge } from '@/app/components/ProductCountBadge';
import { EnhancedSearch } from '@/app/components/EnhancedSearch';
import { ChevronLeft, ArrowRight, Download, Send, CheckCircle, Heart, Search, Star, Shield, Footprints, RefreshCw } from 'lucide-react';
import { useProductData } from '@/app/hooks/useProductData';
import { useProductFilter } from '@/app/hooks/useProductFilter';
import { useWizardState } from '@/app/hooks/useWizardState';
import { categories, applications as staticApplications, technologies as staticTechnologies, actions as staticActions, environments as staticEnvironments } from '@/app/data/options';
import { trackWizardStep, trackProductView, trackPDFDownload, trackQuoteRequest, trackNoResults } from '@/app/utils/analytics';
import { getProxiedImageUrl } from '@/app/utils/imageProxy';
import { getProcessedProducts, isProductEnvironmentMatch } from '@/app/utils/productFilters';
import jsPDF from 'jspdf';

// Lazy load admin panel
const AdminContainer = lazy(() => 
  import('@/app/components/admin/AdminContainer').then(module => ({
    default: module.AdminContainer
  }))
);

type FlowType = 'standard' | 'medical';

function WizardApp() {
  // Use custom hook for session persistence and state management
  const wizardState = useWizardState();
  
  // Use custom hook for data fetching
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
    loading,
    error,
    refresh,
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

  const handleCategorySelect = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    if (cat?.isMedical) {
      // Medical category bypasses sub-categories — go straight to medical flow
      wizardState.setSelectedCategory('medical');
      wizardState.setSelectedApplication('medical');
      wizardState.setFlow('medical');
      setTimeout(() => wizardState.setStep(1), 150);
      trackWizardStep(0, 'medical', { application: 'medical' });
    } else {
      // Show sub-categories for this category
      wizardState.setSelectedCategory(categoryId);
    }
  };

  const handleApplicationSelect = (id: string) => {
    wizardState.setSelectedApplication(id);
    wizardState.setFlow('standard');
    setTimeout(() => wizardState.setStep(1), 150);

    // Track analytics
    trackWizardStep(0, 'standard', { category: wizardState.selectedCategory, application: id });
  };

  const handleBack = () => {
    if (wizardState.step === 0) return;
    if (wizardState.flow === 'medical' && wizardState.step === 1) {
      // Back from medical flow step 1 → return to category picker
      wizardState.setFlow('standard');
      wizardState.setStep(0);
      wizardState.setSelectedCategory('');
      wizardState.setSelectedApplication('');
    } else if (wizardState.step === 1) {
      // Back from Technology (step 1) → return to sub-category picker (step 0 with category set)
      wizardState.setStep(0);
      wizardState.setSelectedApplication('');
    } else {
      let prevStep = wizardState.step - 1;
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

    wizardState.setStep(newStep);
    
    // Track analytics
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

    // Track analytics
    trackWizardStep(10, 'standard', {
      application: wizardState.selectedApplication,
      source: 'medical_bypass'
    });
  };

  const filterProducts = (overrides: Partial<typeof wizardState> = {}) => {
    // Create a merged state object for filtering
    const state = { ...wizardState, ...overrides };

    return products.filter((product) => {
      // Filter by application
      if (state.selectedApplication && !product.applications.includes(state.selectedApplication)) return false;
      // Filter by technology
      if (state.selectedTechnology && product.technology !== state.selectedTechnology) return false;
      // Filter by action
      if (state.selectedAction && !product.actions.includes(state.selectedAction)) return false;
      // Filter by environment/IP rating
      if (state.selectedEnvironment === 'wet' && product.ip !== 'IP68') return false;
      if (state.selectedEnvironment === 'damp' && !['IP56', 'IP68'].includes(product.ip))
        return false;
      // For 'dry' environment, accept any IP rating (no filter needed)
      
      // Filter by Duty Class
      if (state.selectedDuty && product.duty !== state.selectedDuty) return false;

      // Filter by Material
      if (state.selectedMaterial && product.material !== state.selectedMaterial) return false;

      // Filter by Connection
      // Skip connection filter for Air technology as it doesn't apply
      if (state.selectedTechnology !== 'pneumatic' && state.selectedConnection && product.connector_type !== state.selectedConnection) return false;

      // Filter by Safety Guard (products store 'shield' in features array)
      if (state.selectedGuard === 'yes' && !(product.features || []).includes('shield')) return false;
      if (state.selectedGuard === 'no' && (product.features || []).includes('shield')) return false;

      // Filter by Pedal Configuration
      if (state.selectedPedalConfig === 'twin' && !(product.features || []).includes('twin')) return false;
      if (state.selectedPedalConfig === 'single' && (product.features || []).includes('twin')) return false;

      // Filter by selected features (if any features are selected)
      if (state.selectedFeatures.length > 0) {
        // Exclude custom cable/connector from this check (those trigger custom solution)
        const hardwareFeatures = state.selectedFeatures.filter(
          f => f !== 'custom_cable' && f !== 'custom_connector'
        );

        if (hardwareFeatures.length > 0) {
          // Product must have all selected hardware features
          const productFeatures = product.features || [];
          const hasAllFeatures = hardwareFeatures.every(featureId => {
            return productFeatures.includes(featureId);
          });
          if (!hasAllFeatures) return false;
        }
      }
      
      return true;
    });
  };

  // Helper to calculate product counts for upcoming options
  const calculateOptionCount = (field: keyof typeof wizardState, value: any) => {
    return filterProducts({ [field]: value }).length;
  };

  // Fallback filtering: progressively relax constraints to find alternatives
  const getAlternativeProducts = () => {
    // Try relaxing features first (most specific constraint)
    if (wizardState.selectedFeatures.length > 0) {
      const withoutFeatures = filterProducts({ selectedFeatures: [] });
      if (withoutFeatures.length > 0) {
        return { products: withoutFeatures, relaxed: 'features' as const };
      }
    }

    // Try relaxing pedal config
    if (wizardState.selectedPedalConfig) {
      const withoutPedal = filterProducts({ selectedFeatures: [], selectedPedalConfig: '' });
      if (withoutPedal.length > 0) {
        return { products: withoutPedal, relaxed: 'pedalConfig' as const };
      }
    }

    // Try relaxing guard
    if (wizardState.selectedGuard) {
      const withoutGuard = filterProducts({ selectedFeatures: [], selectedPedalConfig: '', selectedGuard: '' });
      if (withoutGuard.length > 0) {
        return { products: withoutGuard, relaxed: 'guard' as const };
      }
    }

    // Try relaxing material
    if (wizardState.selectedMaterial) {
      const withoutMaterial = filterProducts({ selectedFeatures: [], selectedPedalConfig: '', selectedGuard: '', selectedMaterial: '' });
      if (withoutMaterial.length > 0) {
        return { products: withoutMaterial, relaxed: 'material' as const };
      }
    }

    // Try relaxing duty
    if (wizardState.selectedDuty) {
      const withoutDuty = filterProducts({ selectedFeatures: [], selectedPedalConfig: '', selectedGuard: '', selectedMaterial: '', selectedDuty: '' });
      if (withoutDuty.length > 0) {
        return { products: withoutDuty, relaxed: 'duty' as const };
      }
    }

    // Try relaxing environment (IP rating)
    if (wizardState.selectedEnvironment) {
      const withoutEnvironment = products.filter((product) => {
        if (!product.applications.includes(wizardState.selectedApplication)) return false;
        if (product.technology !== wizardState.selectedTechnology) return false;
        if (!product.actions.includes(wizardState.selectedAction)) return false;
        return true;
      });
      if (withoutEnvironment.length > 0) {
        return { products: withoutEnvironment, relaxed: 'environment' as const };
      }
    }

    // Try relaxing action type
    if (wizardState.selectedAction) {
      const withoutAction = products.filter((product) => {
        if (!product.applications.includes(wizardState.selectedApplication)) return false;
        if (product.technology !== wizardState.selectedTechnology) return false;
        return true;
      });
      if (withoutAction.length > 0) {
        return { products: withoutAction, relaxed: 'action' as const };
      }
    }

    // Try relaxing technology (most broad)
    if (wizardState.selectedTechnology) {
      const withoutTechnology = products.filter((product) => {
        if (!product.applications.includes(wizardState.selectedApplication)) return false;
        return true;
      });
      if (withoutTechnology.length > 0) {
        return { products: withoutTechnology, relaxed: 'technology' as const };
      }
    }

    // Last resort: show all products for the application
    const allForApplication = products.filter((product) => {
      return product.applications.includes(wizardState.selectedApplication);
    });
    return { products: allForApplication, relaxed: 'all' as const };
  };

  const needsCustomSolution = () => {
    const filtered = filterProducts();
    if (filtered.length === 0) {
      trackNoResults({
        application: wizardState.selectedApplication,
        technology: wizardState.selectedTechnology,
        action: wizardState.selectedAction,
        environment: wizardState.selectedEnvironment,
        features: wizardState.selectedFeatures,
      });
    }
    return (
      filtered.length === 0 ||
      wizardState.selectedFeatures.includes('custom_cable') ||
      wizardState.selectedFeatures.includes('custom_connector')
    );
  };
  
  // Dynamic filtering: Calculate product counts for each step
  const getProductCount = (step: number, optionId?: string) => {
    if (step === 1) {
      // Technology step: count products for this tech + current application
      return products.filter(p =>
        p.applications.includes(wizardState.selectedApplication) &&
        p.technology === optionId
      ).length;
    } else if (step === 2) {
      // Action step
      return products.filter(p =>
        p.applications.includes(wizardState.selectedApplication) &&
        p.technology === wizardState.selectedTechnology &&
        p.actions.includes(optionId || '')
      ).length;
    } else if (step === 3) {
      // Environment step
      return products.filter(p => {
        if (!p.applications.includes(wizardState.selectedApplication)) return false;
        if (p.technology !== wizardState.selectedTechnology) return false;
        if (!p.actions.includes(wizardState.selectedAction)) return false;
        if (optionId === 'wet' && p.ip !== 'IP68') return false;
        if (optionId === 'damp' && !['IP56', 'IP68'].includes(p.ip)) return false;
        return true;
      }).length;
    } else if (step === 4) {
      // Duty Class step
      return products.filter(p => {
        if (!p.applications.includes(wizardState.selectedApplication)) return false;
        if (p.technology !== wizardState.selectedTechnology) return false;
        if (!p.actions.includes(wizardState.selectedAction)) return false;
        if (wizardState.selectedEnvironment === 'wet' && p.ip !== 'IP68') return false;
        if (wizardState.selectedEnvironment === 'damp' && !['IP56', 'IP68'].includes(p.ip)) return false;
        return p.duty === optionId;
      }).length;
    } else if (step === 5) {
      // Material step
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
      // Connection step
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
      // Guard step
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
    } else if (step === 8) {
      // Pedal config step
      return products.filter(p => {
        if (!p.applications.includes(wizardState.selectedApplication)) return false;
        if (p.technology !== wizardState.selectedTechnology) return false;
        if (!p.actions.includes(wizardState.selectedAction)) return false;
        if (wizardState.selectedEnvironment === 'wet' && p.ip !== 'IP68') return false;
        if (wizardState.selectedEnvironment === 'damp' && !['IP56', 'IP68'].includes(p.ip)) return false;
        if (wizardState.selectedDuty && p.duty !== wizardState.selectedDuty) return false;
        if (wizardState.selectedMaterial && p.material !== wizardState.selectedMaterial) return false;
        if (wizardState.selectedTechnology !== 'pneumatic' && wizardState.selectedConnection && p.connector_type !== wizardState.selectedConnection) return false;
        if (wizardState.selectedGuard === 'yes' && !(p.features || []).includes('shield')) return false;
        if (wizardState.selectedGuard === 'no' && (p.features || []).includes('shield')) return false;
        const hasTwin = (p.features || []).includes('twin');
        if (optionId === 'twin') return hasTwin;
        if (optionId === 'single') return !hasTwin;
        return true;
      }).length;
    }
    return 0;
  };

  const generatePDF = () => {
    trackPDFDownload(wizardState.flow, {
      application: wizardState.selectedApplication,
      technology: wizardState.selectedTechnology,
      action: wizardState.selectedAction,
      environment: wizardState.selectedEnvironment,
      features: wizardState.selectedFeatures,
    });
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Enhanced Header with gradient effect
    doc.setFillColor(99, 102, 241); // Indigo
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('LINEMASTER', 15, 12);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const subtitle = wizardState.flow === 'medical' ? 'Medical Product Specifications' : 'Product Finder Results';
    doc.text(subtitle, 15, 20);
    
    // Add date
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFontSize(9);
    doc.text(`Generated: ${date}`, pageWidth - 15, 20, { align: 'right' });

    doc.setTextColor(0, 0, 0);
    let yPos = 35;

    // Requirements Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Your Requirements', 15, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    if (wizardState.flow === 'medical') {
      doc.text(`Console Style: ${wizardState.selectedConsoleStyle}`, 20, yPos);
      yPos += 6;
      doc.text(`Pedal Configuration: ${wizardState.selectedPedalCount}`, 20, yPos);
      yPos += 6;
      if (wizardState.selectedMedicalFeatures.length > 0) {
        doc.text(`Technical Features: ${wizardState.selectedMedicalFeatures.join(', ')}`, 20, yPos);
        yPos += 6;
      }
      if (wizardState.selectedAccessories.length > 0) {
        doc.text(`Accessories: ${wizardState.selectedAccessories.join(', ')}`, 20, yPos);
        yPos += 6;
      }
    } else {
      const appLabel = staticApplications.find(a => a.id === wizardState.selectedApplication)?.label || applications.find(a => a.id === wizardState.selectedApplication)?.label || wizardState.selectedApplication;
      const techLabel = technologies.find(t => t.id === wizardState.selectedTechnology)?.label || wizardState.selectedTechnology;
      const actionLabel = actions.find(a => a.id === wizardState.selectedAction)?.label || wizardState.selectedAction;
      const envLabel = environments.find(e => e.id === wizardState.selectedEnvironment)?.label || wizardState.selectedEnvironment;
      
      doc.text(`Application: ${appLabel}`, 20, yPos);
      yPos += 6;
      doc.text(`Technology: ${techLabel}`, 20, yPos);
      yPos += 6;
      doc.text(`Action Type: ${actionLabel}`, 20, yPos);
      yPos += 6;
      doc.text(`Environment: ${envLabel}`, 20, yPos);
      yPos += 6;
      
      if (wizardState.selectedDuty) {
        const dutyLabel = duties.find(d => d.id === wizardState.selectedDuty)?.label || wizardState.selectedDuty;
        doc.text(`Duty Class: ${dutyLabel}`, 20, yPos);
        yPos += 6;
      }

      if (wizardState.selectedMaterial) {
        doc.text(`Material: ${wizardState.selectedMaterial}`, 20, yPos);
        yPos += 6;
      }

      if (wizardState.selectedConnection) {
        doc.text(`Connection: ${wizardState.selectedConnection}`, 20, yPos);
        yPos += 6;
      }

      if (wizardState.selectedGuard) {
        doc.text(`Safety Guard: ${wizardState.selectedGuard === 'yes' ? 'Required' : 'Not needed'}`, 20, yPos);
        yPos += 6;
      }

      if (wizardState.selectedPedalConfig) {
        doc.text(`Pedal Config: ${wizardState.selectedPedalConfig === 'twin' ? 'Twin Pedal' : 'Single Pedal'}`, 20, yPos);
        yPos += 6;
      }

      if (wizardState.selectedFeatures.length > 0) {
        const featureLabels = wizardState.selectedFeatures
          .map(fId => features.find(f => f.id === fId)?.label || fId)
          .join(', ');
        doc.text(`Additional Features: ${featureLabels}`, 20, yPos);
        yPos += 6;
      }
    }

    // Matched Products Section
    yPos += 5;
    const matchedProducts = filterProducts();
    
    if (matchedProducts.length > 0) {
      doc.setFillColor(240, 245, 255);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(99, 102, 241);
      doc.text(`Recommended Products (${matchedProducts.length})`, 20, yPos + 5.5);
      yPos += 12;
      
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      
      matchedProducts.slice(0, 5).forEach((product, idx) => {
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
        doc.text(`${product.description}`, 25, yPos);
        yPos += 5;
        
        // Specifications in columns
        doc.text(`IP Rating: ${product.ip}`, 25, yPos);
        doc.text(`Duty: ${product.duty}`, 80, yPos);
        doc.text(`Material: ${product.material}`, 135, yPos);
        yPos += 5;

        if (product.connector_type && product.connector_type !== 'undefined') {
          doc.text(`Connection: ${product.connector_type.replace(/-/g, ' ')}`, 25, yPos);
          yPos += 5;
        }
        
        if (product.features && product.features.length > 0) {
          doc.text(`Features: ${product.features.join(', ')}`, 25, yPos);
          yPos += 5;
        }
        
        doc.setTextColor(99, 102, 241);
        doc.text(`Learn more: ${product.link}`, 25, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 8;
      });
      
      if (matchedProducts.length > 5) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`+ ${matchedProducts.length - 5} more products available`, 20, yPos);
        yPos += 6;
      }
    }

    // Medical Certification Badge
    if (wizardState.flow === 'medical') {
      yPos += 5;
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFillColor(254, 242, 242);
      doc.rect(15, yPos, pageWidth - 30, 20, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 38, 38);
      doc.text('ISO Certified Manufacturing', 20, yPos + 7);
      doc.setFont('helvetica', 'normal');
      doc.text('FDA 510(k) Clearance Experience Available', 20, yPos + 14);
      doc.setTextColor(0, 0, 0);
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

    doc.save(`linemaster-${wizardState.flow}-specifications-${Date.now()}.pdf`);
  };

  // Calculate total visible steps dynamically (exclude skipped steps)
  const totalSteps = (() => {
    if (wizardState.flow === 'medical') return 5;
    let steps = 10; // base: steps 0-10 (App, Tech, Action, Env, Duty, Material, Connection, Guard, PedalConfig, Features, Results)
    if (wizardState.selectedTechnology === 'pneumatic') steps--; // skip Connection
    return steps;
  })();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
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

  // Show error state
  if (error) {
    const isBackendError = error.includes('Failed to fetch') || error.includes('backend') || error.includes('timeout');
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto p-8 bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3 text-center">Backend Connection Error</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed text-center">{error}</p>
          
          {isBackendError && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-xl">🚀</span>
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
              className="px-8 py-3.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render different screens based on step and flow
  if (wizardState.flow === 'medical') {
    return (
      <div className="min-h-screen">
        <Header onReset={handleReset} onRefresh={refresh} />

        {wizardState.step === 1 && (
          <div className="max-w-[800px] mx-auto px-6 py-8">
            <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Banner */}
              <div
                className="p-8 text-white"
                style={{
                  background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                }}
              >
                <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-wide mb-3">
                  <Heart className="w-4 h-4" />
                  MEDICAL
                </div>
                <h1 className="text-3xl font-bold mb-2">Custom Engineering Required</h1>
                <p className="text-white/90">
                  Medical OEM projects require engineering review.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8">
                {[
                  'ISO Certified',
                  'FDA 510(k) Experience',
                  'Wireless RF Technology',
                  'Custom Enclosure Design',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3 p-4 bg-[#fff1f2] rounded-xl">
                    <CheckCircle className="w-6 h-6 text-[#e11d48] flex-shrink-0" />
                    <span className="text-sm font-semibold text-[#0f172a]">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between px-8 pb-8">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 text-[#64748b] hover:text-[#1e293b] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleViewMedicalProducts}
                    className="px-6 py-3 text-[#e11d48] font-semibold hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    View Standard Products
                  </button>
                  <button
                    onClick={handleContinue}
                    className="flex items-center gap-2 px-8 py-3 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold rounded-xl transition-colors"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {wizardState.step === 2 && (
          <div className="max-w-[800px] mx-auto px-6 py-8">
            <ProgressDots currentStep={1} totalSteps={totalSteps} isMedical />
            <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-12">
              <div className="text-[#e11d48] text-xs font-bold uppercase tracking-wide mb-2">
                STEP 2 OF 5
              </div>
              <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Console Style</h2>
              <p className="text-sm text-[#64748b] mb-6">Select your preferred platform.</p>

              <div className="mb-6">
                <img
                  src={getProxiedImageUrl("https://linemaster.com/wp-content/uploads/2024/10/custom-footswitches-img-group.png")}
                  alt="Custom Footswitches"
                  className="max-w-[320px] mx-auto rounded-xl"
                />
              </div>

              <div className="space-y-4 mb-8">
                {consoleStyles.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={wizardState.selectedConsoleStyle === option.id}
                    onSelect={() => {
                      wizardState.setSelectedConsoleStyle(option.id);
                      setTimeout(handleContinue, 150);
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 text-[#64748b] hover:text-[#1e293b] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <span className="text-sm text-[#64748b]">Select to continue</span>
              </div>
            </div>
          </div>
        )}

        {wizardState.step === 3 && (
          <div className="max-w-[800px] mx-auto px-6 py-8">
            <ProgressDots currentStep={2} totalSteps={totalSteps} isMedical />
            <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-12">
              <div className="text-[#e11d48] text-xs font-bold uppercase tracking-wide mb-2">
                STEP 3 OF 5
              </div>
              <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Pedal Count</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {pedalCounts.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={wizardState.selectedPedalCount === option.id}
                    onSelect={() => {
                      wizardState.setSelectedPedalCount(option.id);
                      setTimeout(handleContinue, 150);
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 text-[#64748b] hover:text-[#1e293b] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <span className="text-sm text-[#64748b]">Select to continue</span>
              </div>
            </div>
          </div>
        )}

        {wizardState.step === 4 && (
          <div className="max-w-[800px] mx-auto px-6 py-8">
            <ProgressDots currentStep={3} totalSteps={totalSteps} isMedical />
            <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-12">
              <div className="text-[#e11d48] text-xs font-bold uppercase tracking-wide mb-2">
                STEP 4 OF 5
              </div>
              <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Technical Features</h2>
              <p className="text-sm text-[#64748b] mb-6">Select all that apply.</p>

              <div className="space-y-4 mb-8">
                {medicalTechnicalFeatures.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={wizardState.selectedMedicalFeatures.includes(option.id)}
                    multiSelect
                    onSelect={() => {
                      wizardState.setSelectedMedicalFeatures((prev) =>
                        prev.includes(option.id)
                          ? prev.filter((id) => id !== option.id)
                          : [...prev, option.id]
                      );
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 text-[#64748b] hover:text-[#1e293b] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleContinue}
                  className="flex items-center gap-2 px-8 py-3 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold rounded-xl transition-colors"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {wizardState.step === 5 && (
          <div className="max-w-[800px] mx-auto px-6 py-8">
            <ProgressDots currentStep={4} totalSteps={totalSteps} isMedical />
            <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-12">
              <div className="text-[#e11d48] text-xs font-bold uppercase tracking-wide mb-2">
                STEP 5 OF 5
              </div>
              <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Accessories & Add-ons</h2>
              <p className="text-sm text-[#64748b] mb-6">Select all that apply.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {accessories.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={wizardState.selectedAccessories.includes(option.id)}
                    multiSelect
                    onSelect={() => {
                      wizardState.setSelectedAccessories((prev) =>
                        prev.includes(option.id)
                          ? prev.filter((id) => id !== option.id)
                          : [...prev, option.id]
                      );
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 text-[#64748b] hover:text-[#1e293b] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleContinue}
                  className="flex items-center gap-2 px-8 py-3 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold rounded-xl transition-colors"
                >
                  See Results
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {wizardState.step === 6 && (
          <div className="max-w-[800px] mx-auto px-6 py-8">
            <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Banner */}
              <div
                className="p-8 text-white"
                style={{
                  background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                }}
              >
                <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-wide mb-3">
                  <Heart className="w-4 h-4" />
                  ISO CERTIFIED
                </div>
                <h1 className="text-3xl font-bold mb-2">Medical Project Summary</h1>
                <p className="text-white/90">
                  Download your specifications and submit via our quote form.
                </p>
              </div>

              {/* Summary */}
              <div className="p-8">
                <div className="divide-y divide-[#e2e8f0]">
                  <div className="flex justify-between py-4">
                    <span className="text-sm text-[#64748b]">Console Style</span>
                    <span className="text-sm font-semibold text-[#0f172a]">
                      {consoleStyles.find(c => c.id === wizardState.selectedConsoleStyle)?.label || wizardState.selectedConsoleStyle}
                    </span>
                  </div>
                  <div className="flex justify-between py-4">
                    <span className="text-sm text-[#64748b]">Pedal Configuration</span>
                    <span className="text-sm font-semibold text-[#0f172a]">
                      {pedalCounts.find(p => p.id === wizardState.selectedPedalCount)?.label || wizardState.selectedPedalCount}
                    </span>
                  </div>
                  {wizardState.selectedMedicalFeatures.length > 0 && (
                    <div className="flex justify-between py-4">
                      <span className="text-sm text-[#64748b]">Technical Features</span>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {wizardState.selectedMedicalFeatures.map((feature) => (
                          <span
                            key={feature}
                            className="px-3 py-1 bg-[#2563eb] text-white text-xs font-bold uppercase tracking-wide rounded-full"
                          >
                            {medicalTechnicalFeatures.find(f => f.id === feature)?.label || feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {wizardState.selectedAccessories.length > 0 && (
                    <div className="flex justify-between py-4">
                      <span className="text-sm text-[#64748b]">Accessories</span>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {wizardState.selectedAccessories.map((accessory) => (
                          <span
                            key={accessory}
                            className="px-3 py-1 bg-[#14b8a6] text-white text-xs font-bold uppercase tracking-wide rounded-full"
                          >
                            {accessories.find(a => a.id === accessory)?.label || accessory}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 space-y-4">
                  <button
                    onClick={generatePDF}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#1e293b] hover:bg-[#334155] text-white font-semibold rounded-xl transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download Specifications PDF
                  </button>

                  <div className="text-center text-sm text-[#64748b] py-2">then</div>

                  <button
                    onClick={() =>
                      window.open('https://linemaster.com/contact/', '_blank')
                    }
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold rounded-xl transition-colors"
                  >
                    <Send className="w-5 h-5" />
                    Submit Quote Request
                  </button>

                  <p className="text-xs text-center text-[#64748b] mt-4">
                    Attach your downloaded PDF to the quote form for faster processing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standard flow screens
  return (
    <div className="min-h-screen">
      <Header onReset={handleReset} onRefresh={refresh} />

      {wizardState.step === 0 && !wizardState.selectedCategory && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ProgressDots currentStep={0} totalSteps={totalSteps} />

          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              Find Your Perfect Foot Switch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Answer a few questions and we'll recommend the best product for your needs
            </p>
          </div>

          <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
            <div className="p-6 md:p-12">
            <div className="mb-6"><span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase">STEP 1 OF {totalSteps}</span></div>
            <div className="mb-8"><h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">What type of application?</h2><p className="text-muted-foreground">Choose the category that best describes your use case.</p></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`
                      group relative w-full p-6 rounded-2xl border-2 text-left transition-all duration-300
                      hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
                      border-border bg-card hover:border-primary/50 dark:hover:bg-card/80
                      ${cat.isMedical ? 'ring-2 ring-rose-500/30 ring-offset-2 dark:ring-offset-background' : ''}
                    `}
                  >
                    {cat.isMedical && (
                      <div className="absolute -top-3 right-4 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                        ISO CERTIFIED
                      </div>
                    )}
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-accent text-primary group-hover:bg-primary/10 transition-all">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-lg mb-1">{cat.label}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-8 pt-8 border-t border-border/50">
              <button
                disabled
                className="flex items-center gap-2 px-6 py-3 text-muted-foreground/50 cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="font-semibold">Back</span>
              </button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span>Select a category to continue</span>
              </div>
            </div>

            <TrustBadges />
            </div>
          </div>
        </div>
      )}

      {wizardState.step === 0 && wizardState.selectedCategory && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ProgressDots currentStep={0} totalSteps={totalSteps} />

          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              Find Your Perfect Foot Switch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Answer a few questions and we'll recommend the best product for your needs
            </p>
          </div>

          <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
            <div className="p-6 md:p-12">
            <div className="mb-6"><span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase">STEP 1 OF {totalSteps}</span></div>
            <div className="mb-8"><h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{wizardState.selectedCategory === 'industrial' ? 'What industry?' : 'What application?'}</h2><p className="text-muted-foreground">
              {wizardState.selectedCategory === 'industrial'
                ? 'Select the industry that best matches your application.'
                : 'Select the use case that best describes your needs.'}
            </p></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {staticApplications
                .filter((app) => app.parentCategory === wizardState.selectedCategory)
                .map((app) => {
                  const IconComponent = app.icon;
                  return (
                    <button
                      key={app.id}
                      onClick={() => handleApplicationSelect(app.id)}
                      className={`
                        group relative w-full p-6 rounded-2xl border-2 text-left transition-all duration-300
                        hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
                        ${
                          wizardState.selectedApplication === app.id
                            ? 'border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg ring-2 ring-primary/20'
                            : 'border-border bg-card hover:border-primary/50 dark:hover:bg-card/80'
                        }
                      `}
                    >
                      <div className="flex items-start gap-4">
                        {IconComponent && (
                          <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                            wizardState.selectedApplication === app.id
                              ? 'bg-primary text-primary-foreground scale-110'
                              : 'bg-accent text-primary group-hover:bg-primary/10'
                          }`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-foreground mb-1.5 text-lg">{app.label}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{app.description}</p>
                          <span className="mt-1 inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                            {calculateOptionCount('selectedApplication', app.id)} products
                          </span>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              wizardState.selectedApplication === app.id
                                ? 'border-primary bg-primary scale-110'
                                : 'border-muted-foreground/30 bg-transparent group-hover:border-primary'
                            }`}
                          >
                            {wizardState.selectedApplication === app.id && <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>

            <div className="flex items-center justify-between mt-8 pt-8 border-t border-border/50">
              <button
                onClick={() => {
                  wizardState.setSelectedCategory('');
                  wizardState.setSelectedApplication('');
                }}
                className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="font-semibold">Back</span>
              </button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span>Select an option to continue</span>
              </div>
            </div>

            <TrustBadges />
            </div>
          </div>
        </div>
      )}

      {wizardState.step === 1 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={1} totalSteps={totalSteps} />
          <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
            <div className="p-6 md:p-12">
            <div className="mb-6"><span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase">STEP 2 OF {totalSteps}</span></div>
            <div className="mb-8"><h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Technology</h2><p className="text-muted-foreground">Select your technology.</p></div>

            <div className="space-y-4 mb-8">
              {staticTechnologies
                .filter((tech) => {
                  const availableFor = tech.availableFor || [];
                  return availableFor.includes(wizardState.selectedApplication);
                })
                .map((option) => {
                  return (
                    <div key={option.id}>
                      <OptionCard
                        option={option}
                        selected={wizardState.selectedTechnology === option.id}
                        productCount={calculateOptionCount('selectedTechnology', option.id)}
                        onSelect={() => {
                          wizardState.setSelectedTechnology(option.id);
                          setTimeout(handleContinue, 150);
                        }}
                      />
                    </div>
                  );
                })}
            </div>

            <div className="flex items-center justify-between mt-8 pt-8 border-t border-border/50">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <span className="text-sm text-muted-foreground italic">Select to continue</span>
            </div>
            </div>
          </div>
        </div>
      )}

      {wizardState.step === 2 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={2} totalSteps={totalSteps} />
          <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
            <div className="p-6 md:p-12">
            <div className="mb-6"><span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase">STEP 3 OF {totalSteps}</span></div>
            <div className="mb-8"><h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Action</h2><p className="text-muted-foreground">Select switch action.</p></div>

            <div className="space-y-4 mb-8">
              {staticActions
                .filter((action) => action.availableFor?.includes(wizardState.selectedTechnology))
                .map((option) => {
                  return (
                    <div key={option.id}>
                      <OptionCard
                        option={option}
                        selected={wizardState.selectedAction === option.id}
                        productCount={calculateOptionCount('selectedAction', option.id)}
                        onSelect={() => {
                          wizardState.setSelectedAction(option.id);
                          setTimeout(handleContinue, 150);
                        }}
                      />
                    </div>
                  );
                })}
            </div>

            <div className="flex items-center justify-between mt-8 pt-8 border-t border-border/50">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <span className="text-sm text-muted-foreground italic">Select to continue</span>
            </div>
            </div>
          </div>
        </div>
      )}

      {wizardState.step === 3 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={3} totalSteps={totalSteps} />
          <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
            <div className="p-6 md:p-12">
            <div className="mb-6"><span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase">STEP 4 OF {totalSteps}</span></div>
            <div className="mb-8"><h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Environment</h2><p className="text-muted-foreground">What conditions will the switch operate in?</p></div>

            <div className="space-y-4 mb-8">
              {staticEnvironments
                .map((option) => {
                return (
                  <div key={option.id}>
                    <OptionCard
                      option={option}
                      selected={wizardState.selectedEnvironment === option.id}
                      productCount={calculateOptionCount('selectedEnvironment', option.id)}
                      onSelect={() => {
                        wizardState.setSelectedEnvironment(option.id);
                        setTimeout(handleContinue, 150);
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-8 pt-8 border-t border-border/50">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <span className="text-sm text-muted-foreground italic">Select to continue</span>
            </div>
            </div>
          </div>
        </div>
      )}

      {wizardState.step === 4 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={4} totalSteps={totalSteps} />
          <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
            <div className="p-6 md:p-12">
            <div className="mb-6"><span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase">STEP 5 OF {totalSteps}</span></div>
            <div className="mb-8"><h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Weight Class</h2><p className="text-muted-foreground">How heavy and stable does the switch need to be?</p></div>

            <div className="space-y-4 mb-8">
              {duties
                .filter((d) => getProductCount(4, d.id) > 0)
                .map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={wizardState.selectedDuty === option.id}
                    productCount={getProductCount(4, option.id)}
                    onSelect={() => {
                      wizardState.setSelectedDuty(option.id);
                      setTimeout(handleContinue, 150);
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

            <div className="flex items-center justify-between mt-8 pt-8 border-t border-border/50">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => {
                  wizardState.setSelectedDuty('');
                  handleContinue();
                }}
                className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors underline"
              >
                No Preference — Skip
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {wizardState.step === 5 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={5} totalSteps={totalSteps} />
          <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
            <div className="p-6 md:p-12">
            <div className="mb-6"><span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase">STEP 6 OF {totalSteps}</span></div>
            <div className="mb-8"><h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Material</h2><p className="text-muted-foreground">What material do you prefer? This affects weight, corrosion resistance, and cost.</p></div>

            <div className="space-y-4 mb-8">
              {materials
                .filter(m => getProductCount(5, m.id) > 0)
                .map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={wizardState.selectedMaterial === option.id}
                    productCount={getProductCount(5, option.id)}
                    onSelect={() => {
                      wizardState.setSelectedMaterial(option.id);
                      setTimeout(handleContinue, 150);
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

            <div className="flex items-center justify-between mt-8 pt-8 border-t border-border/50">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => {
                  wizardState.setSelectedMaterial('');
                  handleContinue();
                }}
                className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors underline"
              >
                No Preference — Skip
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {wizardState.step === 6 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={6} totalSteps={totalSteps} />
          <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
            <div className="p-6 md:p-12">
            <div className="mb-6"><span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase">STEP 7 OF {totalSteps}</span></div>
            <div className="mb-8"><h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Connection Type</h2><p className="text-muted-foreground">Select connection style.</p></div>

            <div className="space-y-4 mb-8">
              {connections
                .filter((c) => getProductCount(6, c.id) > 0)
                .map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={wizardState.selectedConnection === option.id}
                    productCount={getProductCount(6, option.id)}
                    onSelect={() => {
                      wizardState.setSelectedConnection(option.id);
                      setTimeout(handleContinue, 150);
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

            <div className="flex items-center justify-between mt-8 pt-8 border-t border-border/50">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => {
                  wizardState.setSelectedConnection('');
                  handleContinue();
                }}
                className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors underline"
              >
                No Preference — Skip
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {wizardState.step === 7 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={7} totalSteps={totalSteps} />
          <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
            <div className="p-6 md:p-12">
            <div className="mb-6"><span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase">STEP 8 OF {totalSteps}</span></div>
            <div className="mb-8"><h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Safety Guard</h2><p className="text-muted-foreground">Do you need a built-in safety guard to prevent accidental activation?</p></div>

            <div className="space-y-4 mb-8">
              <OptionCard
                option={{ id: 'yes', label: 'Yes — Safety Guard', description: 'Includes a protective guard over the pedal to prevent accidental presses.', icon: 'Shield' }}
                selected={wizardState.selectedGuard === 'yes'}
                productCount={getProductCount(7, 'yes')}
                onSelect={() => {
                  wizardState.setSelectedGuard('yes');
                  setTimeout(handleContinue, 150);
                }}
              />
              <OptionCard
                option={{ id: 'no', label: 'No Guard Needed', description: 'Standard open pedal without a protective guard.', icon: 'Footprints' }}
                selected={wizardState.selectedGuard === 'no'}
                productCount={getProductCount(7, 'no')}
                onSelect={() => {
                  wizardState.setSelectedGuard('no');
                  setTimeout(handleContinue, 150);
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

            <div className="flex items-center justify-between mt-8 pt-8 border-t border-border/50">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => {
                  wizardState.setSelectedGuard('');
                  handleContinue();
                }}
                className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors underline"
              >
                No Preference — Skip
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {wizardState.step === 8 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={8} totalSteps={totalSteps} />
          <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
            <div className="p-6 md:p-12">
            <div className="mb-6"><span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase">STEP 9 OF {totalSteps}</span></div>
            <div className="mb-8"><h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Pedal Configuration</h2><p className="text-muted-foreground">Do you need a single pedal or a twin (dual) pedal for two-function control?</p></div>

            <div className="space-y-4 mb-8">
              <OptionCard
                option={{ id: 'single', label: 'Single Pedal', description: 'One pedal for single-function operation.', icon: 'Footprints' }}
                selected={wizardState.selectedPedalConfig === 'single'}
                productCount={getProductCount(8, 'single')}
                onSelect={() => {
                  wizardState.setSelectedPedalConfig('single');
                  setTimeout(handleContinue, 150);
                }}
              />
              <OptionCard
                option={{ id: 'twin', label: 'Twin Pedal', description: 'Dual pedals for two-function control (e.g., forward/reverse).', icon: 'Footprints' }}
                selected={wizardState.selectedPedalConfig === 'twin'}
                productCount={getProductCount(8, 'twin')}
                onSelect={() => {
                  wizardState.setSelectedPedalConfig('twin');
                  setTimeout(handleContinue, 150);
                }}
              />
            </div>

            {getProductCount(8, 'single') === 0 && getProductCount(8, 'twin') === 0 && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-200">
                No products match your current selections. Try adjusting your previous choices, or{' '}
                <a href="https://linemaster.com/contact/" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-amber-900 dark:hover:text-amber-100">contact us</a>{' '}
                for assistance.
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-8 border-t border-border/50">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => {
                  wizardState.setSelectedPedalConfig('');
                  handleContinue();
                }}
                className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors underline"
              >
                No Preference — Skip
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {wizardState.step === 9 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={9} totalSteps={totalSteps} />
          <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
            <div className="p-6 md:p-12">
            <div className="mb-6"><span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase">STEP {totalSteps} OF {totalSteps}</span></div>
            <div className="mb-8"><h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Additional Features</h2><p className="text-muted-foreground">Select any additional features you need.</p></div>

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
                    productCount={calculateOptionCount(
                      'selectedFeatures',
                      wizardState.selectedFeatures.includes(option.id)
                        ? wizardState.selectedFeatures
                        : [...wizardState.selectedFeatures, option.id]
                    )}
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

            <div className="flex items-center justify-between mt-8 pt-8 border-t border-border/50">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleContinue}
                className="flex items-center gap-2 px-8 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl transition-colors"
              >
                See Results
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {wizardState.step === 10 && (
        <>
          {needsCustomSolution() ? (
            <div className="max-w-[800px] mx-auto px-6 py-8">
              <div className="bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Banner */}
                <div
                  className="p-8 text-white"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
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
                  <div className="divide-y divide-[#e2e8f0]">
                    <div className="flex justify-between py-4">
                      <span className="text-sm text-[#64748b]">Application</span>
                      <span className="text-sm font-semibold text-[#0f172a]">
                        {staticApplications.find(a => a.id === wizardState.selectedApplication)?.label || applications.find(a => a.id === wizardState.selectedApplication)?.label || wizardState.selectedApplication}
                      </span>
                    </div>
                    <div className="flex justify-between py-4">
                      <span className="text-sm text-[#64748b]">Technology</span>
                      <span className="text-sm font-semibold text-[#0f172a]">
                        {technologies.find(t => t.id === wizardState.selectedTechnology)?.label || wizardState.selectedTechnology}
                      </span>
                    </div>
                    <div className="flex justify-between py-4">
                      <span className="text-sm text-[#64748b]">Switch Action</span>
                      <span className="text-sm font-semibold text-[#0f172a]">
                        {actions.find(a => a.id === wizardState.selectedAction)?.label || wizardState.selectedAction}
                      </span>
                    </div>
                    <div className="flex justify-between py-4">
                      <span className="text-sm text-[#64748b]">Environment</span>
                      <span className="text-sm font-semibold text-[#0f172a]">
                        {environments.find(e => e.id === wizardState.selectedEnvironment)?.label || wizardState.selectedEnvironment}
                      </span>
                    </div>
                    {wizardState.selectedFeatures.length > 0 && (
                      <div className="flex justify-between py-4">
                        <span className="text-sm text-[#64748b]">Features</span>
                        <div className="flex flex-wrap gap-2 justify-end">
                          {wizardState.selectedFeatures.map((feature) => (
                            <span
                              key={feature}
                              className="px-3 py-1 bg-[#2563eb] text-white text-xs font-bold uppercase tracking-wide rounded-full"
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
                      onClick={generatePDF}
                      className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#1e293b] hover:bg-[#334155] text-white font-semibold rounded-xl transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download Specifications PDF
                    </button>

                    <div className="text-center text-sm text-[#64748b] py-2">then</div>

                    <button
                      onClick={() =>
                        window.open('https://linemaster.com/contact/', '_blank')
                      }
                      className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold rounded-xl transition-colors"
                    >
                      <Send className="w-5 h-5" />
                      Contact Us
                    </button>

                    <p className="text-xs text-center text-[#64748b] mt-4">
                      Attach your downloaded PDF when reaching out for faster processing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-[1200px] mx-auto px-6 py-8">
              {(() => {
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
                  pedalConfig: 'No exact matches for your pedal configuration, but these products match your other criteria:',
                  guard: 'No exact matches for your guard preference, but these products match your other criteria:',
                  material: 'No exact matches for your material preference, but these products match your other criteria:',
                  duty: 'No exact matches for your duty class, but these products match your other requirements:',
                  environment: 'No exact matches for your environment rating, but these products match your other requirements:',
                  action: 'No exact matches for your action type, but these products match your application and technology:',
                  technology: 'No exact matches for your technology type, but these products are compatible with your application:',
                  all: 'Here are all products available for your application:',
                };

                return (
                  <>
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Analyzed 300+ Products
                      </div>
                      
                      {hasExactMatches ? (
                        <>
                          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] dark:text-white mb-4 tracking-tight">
                            We Found <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">The One.</span>
                          </h1>
                          <p className="text-lg text-[#64748b] dark:text-gray-400 max-w-2xl mx-auto">
                            Based on your requirements, this is the exact switch you need.
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-900 rounded-full text-sm font-semibold mb-4">
                            <span className="text-lg">💡</span>
                            Alternative Suggestions
                          </div>
                          <h1 className="text-3xl font-bold text-[#0f172a] dark:text-white mb-2">
                            No Exact Matches Found
                          </h1>
                          <p className="text--[#64748b] dark:text-gray-400 max-w-2xl mx-auto">
                            {alternatives && relaxedMessages[alternatives.relaxed]}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Filter Summary Bar */}
                    <div className="mb-12 p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-indigo-200 dark:border-indigo-800">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                          Active Filters:
                        </span>
                        <button
                          onClick={handleReset}
                          className="ml-auto text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-semibold underline transition-colors"
                        >
                          Clear All & Start Over
                        </button>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {wizardState.selectedApplication && (
                          <FilterChip
                            label="Application"
                            value={staticApplications.find(a => a.id === wizardState.selectedApplication)?.label || applications.find(a => a.id === wizardState.selectedApplication)?.label || wizardState.selectedApplication}
                            onRemove={() => {
                              wizardState.setSelectedCategory('');
                              wizardState.setSelectedApplication('');
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
                              wizardState.setStep(7);
                            }}
                          />
                        )}
                        {wizardState.selectedPedalConfig && (
                          <FilterChip
                            label="Pedal"
                            value={wizardState.selectedPedalConfig === 'twin' ? 'Twin Pedal' : 'Single Pedal'}
                            onRemove={() => {
                              wizardState.setSelectedPedalConfig('');
                              wizardState.setStep(8);
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
                    </div>

                    {/* Best Match Highlight */}
                    {bestMatch && (
                      <div className="mb-16 transform hover:scale-[1.01] transition-transform duration-500">
                        <div className="relative bg-card/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
                           <div className="grid grid-cols-1 lg:grid-cols-2">
                             <div className="p-12 flex flex-col justify-center relative overflow-hidden bg-[rgba(161,73,206,0)]">
                               <div className="relative z-10">
                                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wider mb-6">
                                    <Star className="w-4 h-4 fill-green-700" />
                                    Top Recommendation
                                 </div>
                                 <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight flex flex-wrap items-baseline gap-3">
                                   {bestMatch.series}
                                   {(bestMatch.part_number || bestMatch.id) && (
                                     <span className="text-2xl font-medium text-slate-500 dark:text-slate-400">
                                       # {bestMatch.part_number || bestMatch.id.toUpperCase()}
                                     </span>
                                   )}
                                 </h2>
                                 <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                   {bestMatch.description}
                                 </p>
                                 
                                 <div className="grid grid-cols-2 gap-6 mb-10">
                                   <div>
                                     <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">IP Rating</div>
                                     <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                       {bestMatch.ip}
                                       {bestMatch.ip === 'IP68' && <CheckCircle className="w-4 h-4 text-blue-500" />}
                                     </div>
                                   </div>
                                   <div>
                                     <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Duty Rating</div>
                                     <div className="font-medium text-slate-900 dark:text-white">{bestMatch.duty.charAt(0).toUpperCase() + bestMatch.duty.slice(1)}</div>
                                   </div>
                                   <div>
                                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Material</div>
                                      <div className="font-medium text-slate-900 dark:text-white">{bestMatch.material}</div>
                                   </div>
                                   <div>
                                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Action</div>
                                      <div className="font-medium text-slate-900 dark:text-white">{bestMatch.actions.join(', ')}</div>
                                   </div>
                                   {bestMatch.voltage && (
                                     <div>
                                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Voltage</div>
                                        <div className="font-medium text-slate-900 dark:text-white">{bestMatch.voltage}</div>
                                     </div>
                                   )}
                                   {bestMatch.certifications && (
                                     <div>
                                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Certifications</div>
                                        <div className="font-medium text-slate-900 dark:text-white">{bestMatch.certifications}</div>
                                     </div>
                                   )}
                                 </div>

                                 <div className="flex flex-col sm:flex-row gap-4">
                                   <a 
                                     href={bestMatch.link} 
                                     target="_blank" 
                                     rel="noopener noreferrer"
                                     className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30"
                                   >
                                     View Full Specifications
                                     <ArrowRight className="w-5 h-5" />
                                   </a>
                                   <button 
                                      onClick={generatePDF}
                                      className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-colors"
                                   >
                                     <Download className="w-5 h-5" />
                                     Download PDF
                                   </button>
                                 </div>
                               </div>
                             </div>
                             <div className="bg-slate-50 dark:bg-slate-800/50 p-12 flex items-center justify-center relative">
                               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent dark:from-slate-800 opacity-60"></div>
                               <img 
                                 src={getProxiedImageUrl(bestMatch.image)} 
                                 alt={bestMatch.series} 
                                 className="w-full max-w-md object-contain drop-shadow-2xl relative z-10 transform hover:scale-105 transition-transform duration-500"
                               />
                             </div>
                           </div>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Search and Filter */}
                    <div className="mb-8">
                       <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                         {bestMatch ? 'Other Compatible Options' : 'Available Products'}
                         <span className="text-sm font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
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
                        onFilteredChange={(filtered) => {
                          // Filtered products are handled within the component
                        }}
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
                      <div className="mb-12 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                            ℹ️
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-amber-900 mb-2">
                              Need help choosing?
                            </h3>
                            <p className="text-sm text-amber-800 mb-4">
                              We found these alternative products that closely match your requirements.
                              Contact our team to discuss which option would work best for your specific application.
                            </p>
                            <button
                              onClick={() => window.open('https://linemaster.com/contact/', '_blank')}
                              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
                            >
                              Contact Us
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer CTA */}
                    <div className="mt-16 bg-[#1e293b] rounded-3xl p-8 text-white text-center">
                      <h2 className="text-2xl font-bold mb-2">Can't find what you need?</h2>
                      <p className="text-white/80 mb-6">
                        Our team can help you find the right foot switch for your application.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={generatePDF}
                          className="px-8 py-3 bg-white hover:bg-gray-100 text-[#1e293b] font-semibold rounded-xl transition-colors"
                        >
                          Download Specs PDF
                        </button>
                        <button
                          onClick={() =>
                            window.open('https://linemaster.com/contact/', '_blank')
                          }
                          className="px-8 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl transition-colors"
                        >
                          Contact Us
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </>
      )}
    </div>
  );
}

class AdminErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error('Admin panel error:', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-lg shadow p-6 max-w-lg">
            <h2 className="text-xl font-bold text-red-600 mb-2">Admin Panel Error</h2>
            <p className="text-gray-700 mb-4">{this.state.error.message}</p>
            <button onClick={() => { window.location.hash = '/'; }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Return to Wizard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import { OrbBackground } from '@/app/components/OrbBackground';

export default function App() {
  return (
    <>
      <OrbBackground />
      <Router>
      {(path, navigate) => {
        // If accessing admin route
        if (path.startsWith('/admin')) {
          return (
            <AdminErrorBoundary>
              <Suspense fallback={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Admin Panel...</p>
                  </div>
                </div>
              }>
                <AdminContainer />
              </Suspense>
            </AdminErrorBoundary>
          );
        }

        // Default to wizard app
        return <WizardApp />;
      }}
    </Router>
    </>
  );
}