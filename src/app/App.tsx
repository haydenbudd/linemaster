import { useState, useEffect } from 'react';
import { Router } from '@/app/components/Router';
import { AdminContainer } from '@/app/components/admin/AdminContainer';
import { Header } from '@/app/components/Header';
import { ProgressDots } from '@/app/components/ProgressDots';
import { OptionCard } from '@/app/components/OptionCard';
import { ProductCard } from '@/app/components/ProductCard';
import { FilterChip } from '@/app/components/FilterChip';
import { TrustBadges } from '@/app/components/TrustBadges';
import { ChevronLeft, ArrowRight, Download, Send, CheckCircle, Heart } from 'lucide-react';
import { fetchProducts, fetchOptions, Product, Option } from '@/app/lib/api';
import jsPDF from 'jspdf';

type FlowType = 'standard' | 'medical';

function WizardApp() {
  const [flow, setFlow] = useState<FlowType>('standard');
  const [step, setStep] = useState(0);
  
  // Data from Supabase
  const [products, setProducts] = useState<Product[]>([]);
  const [allOptions, setAllOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Standard flow state
  const [selectedApplication, setSelectedApplication] = useState<string>('');
  const [selectedTechnology, setSelectedTechnology] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('');
  const [selectedConnectorType, setSelectedConnectorType] = useState<string>('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Medical flow state
  const [selectedConsoleStyle, setSelectedConsoleStyle] = useState<string>('');
  const [selectedPedalCount, setSelectedPedalCount] = useState<string>('');
  const [selectedMedicalFeatures, setSelectedMedicalFeatures] = useState<string[]>([]);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  // Fetch data on mount
  useEffect(() => {
    async function loadData() {
      try {
        console.log('🚀 Starting to load data...');
        setLoading(true);
        setError(null);
        
        const [productsData, optionsData] = await Promise.all([
          fetchProducts(),
          fetchOptions(),
        ]);
        
        console.log('📦 Loaded products:', productsData.length);
        console.log('⚙️ Loaded options:', optionsData.length);
        
        setProducts(productsData);
        setAllOptions(optionsData);
        setError(null);
      } catch (err) {
        console.error('❌ Error loading data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to connect to backend: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Helper functions to get options by category
  const getOptionsByCategory = (category: string) => {
    return allOptions.filter((opt) => opt.category === category);
  };

  const applications = getOptionsByCategory('application');
  const technologies = getOptionsByCategory('technology');
  const actions = getOptionsByCategory('action');
  const environments = getOptionsByCategory('environment');
  const connectorTypes = getOptionsByCategory('connector_type');
  const features = getOptionsByCategory('feature');
  const consoleStyles = getOptionsByCategory('console_style');
  const pedalCounts = getOptionsByCategory('pedal_count');
  const medicalTechnicalFeatures = getOptionsByCategory('medical_feature');
  const accessories = getOptionsByCategory('accessory');

  const handleReset = () => {
    setFlow('standard');
    setStep(0);
    setSelectedApplication('');
    setSelectedTechnology('');
    setSelectedAction('');
    setSelectedEnvironment('');
    setSelectedConnectorType('');
    setSelectedFeatures([]);
    setSelectedConsoleStyle('');
    setSelectedPedalCount('');
    setSelectedMedicalFeatures([]);
    setSelectedAccessories([]);
  };

  const handleApplicationSelect = (id: string) => {
    setSelectedApplication(id);
    const app = applications.find((a) => a.id === id);
    if (app?.isMedical) {
      setFlow('medical');
      setTimeout(() => setStep(1), 150);
    } else {
      setFlow('standard');
      setTimeout(() => setStep(1), 150);
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    if (flow === 'medical' && step === 1) {
      setFlow('standard');
      setStep(0);
      setSelectedApplication('');
    } else {
      setStep(step - 1);
    }
  };

  const handleContinue = () => {
    setStep(step + 1);
  };

  const filterProducts = () => {
    return products.filter((product) => {
      // Filter by application
      if (selectedApplication && !product.applications?.includes(selectedApplication)) return false;
      // Filter by technology
      if (selectedTechnology && product.technology !== selectedTechnology) return false;
      // Filter by action - check if product supports this action
      if (selectedAction && !product.actions?.includes(selectedAction)) return false;

      // Filter by environment/IP rating
      // Handle various IP rating formats (IP68, IP56, IP20, IPXX, etc.)
      if (selectedEnvironment === 'wet') {
        // Wet environment requires IP68
        if (!product.ip?.includes('68')) return false;
      }
      if (selectedEnvironment === 'damp') {
        // Damp environment requires at least IP56
        const ip = product.ip || '';
        const hasGoodRating = ip.includes('56') || ip.includes('68');
        if (!hasGoodRating) return false;
      }

      // Filter by selected features (if any features are selected)
      if (selectedFeatures.length > 0) {
        // Exclude custom cable/connector from this check (those trigger custom solution)
        const hardwareFeatures = selectedFeatures.filter(
          f => f !== 'feature-custom-cable' && f !== 'feature-custom-connector'
        );

        if (hardwareFeatures.length > 0) {
          // Product must have all selected hardware features
          const productFeatures = product.features || [];
          const hasAllFeatures = hardwareFeatures.every(featureId => {
            // Feature options have IDs like 'feature-shield', 'feature-twin'
            // Products store features without prefix: ['shield', 'twin', 'multi_stage']
            const featureValue = featureId.replace('feature-', '');
            return productFeatures.includes(featureValue);
          });
          if (!hasAllFeatures) return false;
        }
      }

      return true;
    });
  };

  // Fallback filtering: progressively relax constraints to find alternatives
  const getAlternativeProducts = () => {
    // Helper function to check IP rating
    const meetsIpRequirement = (product: Product, env: string) => {
      if (env === 'wet') return product.ip?.includes('68');
      if (env === 'damp') return product.ip?.includes('56') || product.ip?.includes('68');
      return true;
    };

    // Try relaxing features first (most specific constraint)
    if (selectedFeatures.length > 0) {
      const withoutFeatures = products.filter((product) => {
        if (!product.applications?.includes(selectedApplication)) return false;
        if (product.technology !== selectedTechnology) return false;
        if (!product.actions?.includes(selectedAction)) return false;
        if (!meetsIpRequirement(product, selectedEnvironment)) return false;
        return true;
      });
      if (withoutFeatures.length > 0) {
        return { products: withoutFeatures, relaxed: 'features' };
      }
    }

    // Try relaxing environment (IP rating)
    if (selectedEnvironment) {
      const withoutEnvironment = products.filter((product) => {
        if (!product.applications?.includes(selectedApplication)) return false;
        if (product.technology !== selectedTechnology) return false;
        if (!product.actions?.includes(selectedAction)) return false;
        return true;
      });
      if (withoutEnvironment.length > 0) {
        return { products: withoutEnvironment, relaxed: 'environment' };
      }
    }

    // Try relaxing action type
    if (selectedAction) {
      const withoutAction = products.filter((product) => {
        if (!product.applications?.includes(selectedApplication)) return false;
        if (product.technology !== selectedTechnology) return false;
        return true;
      });
      if (withoutAction.length > 0) {
        return { products: withoutAction, relaxed: 'action' };
      }
    }

    // Try relaxing technology (most broad)
    if (selectedTechnology) {
      const withoutTechnology = products.filter((product) => {
        if (!product.applications?.includes(selectedApplication)) return false;
        return true;
      });
      if (withoutTechnology.length > 0) {
        return { products: withoutTechnology, relaxed: 'technology' };
      }
    }

    // Last resort: show all products for the application
    const allForApplication = products.filter((product) => {
      return product.applications?.includes(selectedApplication);
    });
    return { products: allForApplication, relaxed: 'all' };
  };

  const needsCustomSolution = () => {
    const filtered = filterProducts();
    return (
      filtered.length === 0 ||
      selectedFeatures.includes('feature-custom-cable') ||
      selectedFeatures.includes('feature-custom-connector')
    );
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('LINEMASTER', 10, 10);

    doc.setFontSize(10);
    if (flow === 'medical') {
      doc.text('Medical Project Specifications', 10, 20);
    } else {
      doc.text('Custom Foot Switch Requirements', 10, 20);
    }

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    let yPos = 35;

    doc.text('Project Requirements', 10, yPos);
    yPos += 10;

    if (flow === 'medical') {
      doc.text(`Console Style: ${selectedConsoleStyle}`, 10, yPos);
      yPos += 7;
      doc.text(`Pedal Configuration: ${selectedPedalCount}`, 10, yPos);
      yPos += 7;
      if (selectedMedicalFeatures.length > 0) {
        doc.text(`Technical Features: ${selectedMedicalFeatures.join(', ')}`, 10, yPos);
        yPos += 7;
      }
      if (selectedAccessories.length > 0) {
        doc.text(`Accessories: ${selectedAccessories.join(', ')}`, 10, yPos);
        yPos += 7;
      }

      // Medical badge box
      yPos += 10;
      doc.setFillColor(255, 241, 242);
      doc.rect(10, yPos, 190, 20, 'F');
      doc.setFontSize(10);
      doc.text('ISO Certified Manufacturing', 15, yPos + 7);
      doc.text('FDA 510(k) Clearance Experience Available', 15, yPos + 14);
    } else {
      doc.text(`Application: ${selectedApplication}`, 10, yPos);
      yPos += 7;
      doc.text(`Technology: ${selectedTechnology}`, 10, yPos);
      yPos += 7;
      doc.text(`Action: ${selectedAction}`, 10, yPos);
      yPos += 7;
      doc.text(`Environment: ${selectedEnvironment}`, 10, yPos);
      yPos += 7;
      if (selectedFeatures.length > 0) {
        doc.text(`Features: ${selectedFeatures.join(', ')}`, 10, yPos);
      }
    }

    // Footer
    doc.setFontSize(10);
    doc.text('Linemaster Switch Corporation', 10, 270);
    doc.text('Tel: (860) 974-1000 | linemaster.com', 10, 275);
    doc.setTextColor(37, 99, 235);
    doc.text('Submit this document with your quote request at:', 10, 282);
    doc.text('linemaster.com/request-a-quote/', 10, 287);

    doc.save('linemaster-specifications.pdf');
  };

  const totalSteps = flow === 'medical' ? 5 : 5;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 flex items-center justify-center p-4">
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-slate-950 dark:via-red-950 dark:to-orange-950 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto p-8 bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl text-center border border-border">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Error Loading Data</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Render different screens based on step and flow
  if (flow === 'medical') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-slate-950 dark:via-rose-950 dark:to-purple-950">
        <Header onReset={handleReset} />

        {step === 1 && (
          <div className="max-w-[800px] mx-auto px-6 py-8">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
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

        {step === 2 && (
          <div className="max-w-[800px] mx-auto px-6 py-8">
            <ProgressDots currentStep={1} totalSteps={totalSteps} isMedical />
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="text-[#e11d48] text-xs font-bold uppercase tracking-wide mb-2">
                STEP 2 OF 5
              </div>
              <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Console Style</h2>
              <p className="text-sm text-[#64748b] mb-6">Select your preferred platform.</p>

              <div className="mb-6">
                <img
                  src="https://linemaster.com/wp-content/uploads/2024/10/custom-footswitches-img-group.png"
                  alt="Custom Footswitches"
                  className="max-w-[320px] mx-auto rounded-xl"
                />
              </div>

              <div className="space-y-4 mb-8">
                {consoleStyles.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={selectedConsoleStyle === option.id}
                    onSelect={() => {
                      setSelectedConsoleStyle(option.id);
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

        {step === 3 && (
          <div className="max-w-[800px] mx-auto px-6 py-8">
            <ProgressDots currentStep={2} totalSteps={totalSteps} isMedical />
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="text-[#e11d48] text-xs font-bold uppercase tracking-wide mb-2">
                STEP 3 OF 5
              </div>
              <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Pedal Count</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {pedalCounts.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={selectedPedalCount === option.id}
                    onSelect={() => {
                      setSelectedPedalCount(option.id);
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

        {step === 4 && (
          <div className="max-w-[800px] mx-auto px-6 py-8">
            <ProgressDots currentStep={3} totalSteps={totalSteps} isMedical />
            <div className="bg-white rounded-3xl shadow-lg p-8">
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
                    selected={selectedMedicalFeatures.includes(option.id)}
                    multiSelect
                    onSelect={() => {
                      setSelectedMedicalFeatures((prev) =>
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

        {step === 5 && (
          <div className="max-w-[800px] mx-auto px-6 py-8">
            <ProgressDots currentStep={4} totalSteps={totalSteps} isMedical />
            <div className="bg-white rounded-3xl shadow-lg p-8">
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
                    selected={selectedAccessories.includes(option.id)}
                    multiSelect
                    onSelect={() => {
                      setSelectedAccessories((prev) =>
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

        {step === 6 && (
          <div className="max-w-[800px] mx-auto px-6 py-8">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
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
                      {consoleStyles.find(c => c.id === selectedConsoleStyle)?.label || selectedConsoleStyle}
                    </span>
                  </div>
                  <div className="flex justify-between py-4">
                    <span className="text-sm text-[#64748b]">Pedal Configuration</span>
                    <span className="text-sm font-semibold text-[#0f172a]">
                      {pedalCounts.find(p => p.id === selectedPedalCount)?.label || selectedPedalCount}
                    </span>
                  </div>
                  {selectedMedicalFeatures.length > 0 && (
                    <div className="flex justify-between py-4">
                      <span className="text-sm text-[#64748b]">Technical Features</span>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {selectedMedicalFeatures.map((feature) => (
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
                  {selectedAccessories.length > 0 && (
                    <div className="flex justify-between py-4">
                      <span className="text-sm text-[#64748b]">Accessories</span>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {selectedAccessories.map((accessory) => (
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
                      window.open('https://linemaster.com/request-a-quote/', '_blank')
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950">
      <Header onReset={handleReset} />

      {step === 0 && (
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

          <div className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-1 bg-gradient-to-b from-primary to-purple-500 rounded-full"></div>
              <div>
                <div className="text-primary text-xs font-bold uppercase tracking-wider mb-1">
                  Step 1 of 5
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  What's your application?
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground mb-8">Select the industry or use case that best describes your needs.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {applications.map((option) => (
                <OptionCard
                  key={option.id}
                  option={option}
                  selected={selectedApplication === option.id}
                  onSelect={() => handleApplicationSelect(option.id)}
                />
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border">
              <button
                disabled
                className="flex items-center gap-2 px-6 py-3 text-muted-foreground/50 cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="font-semibold">Back</span>
              </button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span>Select an option to continue</span>
              </div>
            </div>

            <TrustBadges />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={1} totalSteps={totalSteps} />
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="text-[#2563eb] text-xs font-bold uppercase tracking-wide mb-2">
              STEP 2 OF 5
            </div>
            <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Select Technology</h2>
            <p className="text-sm text-[#64748b] mb-6">How should it connect?</p>

            <div className="space-y-4 mb-8">
              {technologies
                .filter((tech) => tech.availableFor?.includes(selectedApplication))
                .map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={selectedTechnology === option.id}
                    onSelect={() => {
                      setSelectedTechnology(option.id);
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

      {step === 2 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={2} totalSteps={totalSteps} />
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="text-[#2563eb] text-xs font-bold uppercase tracking-wide mb-2">
              STEP 3 OF 5
            </div>
            <h2 className="text-2xl font-bold text-[#0f172a] mb-2">How should it operate?</h2>
            <p className="text-sm text-[#64748b] mb-6">Select switch action.</p>

            <div className="space-y-4 mb-8">
              {actions
                .filter((action) => action.availableFor?.includes(selectedTechnology))
                .map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={selectedAction === option.id}
                    onSelect={() => {
                      setSelectedAction(option.id);
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

      {step === 3 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={3} totalSteps={totalSteps} />
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="text-[#2563eb] text-xs font-bold uppercase tracking-wide mb-2">
              STEP 4 OF 5
            </div>
            <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Environment?</h2>
            <p className="text-sm text-[#64748b] mb-6">Determines IP rating.</p>

            <div className="space-y-4 mb-8">
              {environments.map((option) => (
                <OptionCard
                  key={option.id}
                  option={option}
                  selected={selectedEnvironment === option.id}
                  onSelect={() => {
                    setSelectedEnvironment(option.id);
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

      {step === 4 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={4} totalSteps={totalSteps} />
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="text-[#2563eb] text-xs font-bold uppercase tracking-wide mb-2">
              STEP 5 OF 5
            </div>
            <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Additional features?</h2>
            <p className="text-sm text-[#64748b] mb-6">Optional.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features
                .filter(
                  (feature) => !feature.hideFor?.includes(selectedTechnology)
                )
                .map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={selectedFeatures.includes(option.id)}
                    multiSelect
                    onSelect={() => {
                      setSelectedFeatures((prev) =>
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
                className="flex items-center gap-2 px-8 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl transition-colors"
              >
                See Results
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <>
          {needsCustomSolution() ? (
            <div className="max-w-[800px] mx-auto px-6 py-8">
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
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
                  <h1 className="text-3xl font-bold mb-2">Custom Solution Required</h1>
                  <p className="text-white/90">
                    Your requirements need a custom configuration.
                  </p>
                </div>

                {/* Summary */}
                <div className="p-8">
                  <div className="divide-y divide-[#e2e8f0]">
                    <div className="flex justify-between py-4">
                      <span className="text-sm text-[#64748b]">Application</span>
                      <span className="text-sm font-semibold text-[#0f172a]">
                        {applications.find(a => a.id === selectedApplication)?.label || selectedApplication}
                      </span>
                    </div>
                    <div className="flex justify-between py-4">
                      <span className="text-sm text-[#64748b]">Technology</span>
                      <span className="text-sm font-semibold text-[#0f172a]">
                        {technologies.find(t => t.id === selectedTechnology)?.label || selectedTechnology}
                      </span>
                    </div>
                    <div className="flex justify-between py-4">
                      <span className="text-sm text-[#64748b]">Switch Action</span>
                      <span className="text-sm font-semibold text-[#0f172a]">
                        {actions.find(a => a.id === selectedAction)?.label || selectedAction}
                      </span>
                    </div>
                    <div className="flex justify-between py-4">
                      <span className="text-sm text-[#64748b]">Environment</span>
                      <span className="text-sm font-semibold text-[#0f172a]">
                        {environments.find(e => e.id === selectedEnvironment)?.label || selectedEnvironment}
                      </span>
                    </div>
                    {selectedFeatures.length > 0 && (
                      <div className="flex justify-between py-4">
                        <span className="text-sm text-[#64748b]">Features</span>
                        <div className="flex flex-wrap gap-2 justify-end">
                          {selectedFeatures.map((feature) => (
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
                        window.open('https://linemaster.com/request-a-quote/', '_blank')
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
          ) : (
            <div className="max-w-[1200px] mx-auto px-6 py-8">
              {(() => {
                const exactMatches = filterProducts();
                const hasExactMatches = exactMatches.length > 0;
                const alternatives = hasExactMatches ? null : getAlternativeProducts();

                const relaxedMessages = {
                  features: 'No exact matches with your selected features, but these products match all other criteria:',
                  environment: 'No exact matches for your environment rating, but these products match your other requirements:',
                  action: 'No exact matches for your action type, but these products match your application and technology:',
                  technology: 'No exact matches for your technology type, but these products are compatible with your application:',
                  all: 'Here are all products available for your application:',
                };

                return (
                  <>
                    <div className="text-center mb-8">
                      {hasExactMatches ? (
                        <>
                          <h1 className="text-3xl font-bold text-[#0f172a] dark:text-white mb-2">
                            Recommended Solutions
                          </h1>
                          <p className="text-[#64748b] dark:text-gray-400">
                            {exactMatches.length} products found matching your requirements.
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
                          <p className="text-[#64748b] dark:text-gray-400 max-w-2xl mx-auto">
                            {alternatives && relaxedMessages[alternatives.relaxed]}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Filter Summary Bar */}
                    <div className="mb-8 p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-indigo-200 dark:border-indigo-800">
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
                        {selectedApplication && (
                          <FilterChip
                            label="Application"
                            value={applications.find(a => a.id === selectedApplication)?.label || selectedApplication}
                            onRemove={() => {
                              setSelectedApplication('');
                              setStep(0);
                            }}
                          />
                        )}
                        {selectedTechnology && (
                          <FilterChip
                            label="Technology"
                            value={technologies.find(t => t.id === selectedTechnology)?.label || selectedTechnology}
                            onRemove={() => {
                              setSelectedTechnology('');
                              setStep(1);
                            }}
                          />
                        )}
                        {selectedAction && (
                          <FilterChip
                            label="Action"
                            value={actions.find(a => a.id === selectedAction)?.label || selectedAction}
                            onRemove={() => {
                              setSelectedAction('');
                              setStep(2);
                            }}
                          />
                        )}
                        {selectedEnvironment && (
                          <FilterChip
                            label="Environment"
                            value={environments.find(e => e.id === selectedEnvironment)?.label || selectedEnvironment}
                            onRemove={() => {
                              setSelectedEnvironment('');
                              setStep(3);
                            }}
                          />
                        )}
                        {selectedFeatures.map((featureId) => (
                          <FilterChip
                            key={featureId}
                            label="Feature"
                            value={features.find(f => f.id === featureId)?.label || featureId}
                            onRemove={() => {
                              setSelectedFeatures(prev => prev.filter(id => id !== featureId));
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Product Results */}
                    {(['heavy', 'medium', 'light'] as const).map((duty) => {
                      const dutyProducts = (hasExactMatches ? exactMatches : alternatives?.products || []).filter((p) => p.duty === duty);
                      if (dutyProducts.length === 0) return null;

                      const dutyLabels = {
                        heavy: 'Heavy Duty',
                        medium: 'Medium Duty',
                        light: 'Light Duty',
                      };
                      const dutyDescriptions = {
                        heavy: 'Continuous, high-force use.',
                        medium: 'Regular daily use.',
                        light: 'Occasional use.',
                      };

                      return (
                        <div key={duty} className="mb-12">
                          <div className="mb-6">
                            <h2 className="text-xl font-bold text-[#0f172a] dark:text-white mb-1">
                              {dutyLabels[duty]}
                            </h2>
                            <p className="text-sm text-[#64748b] dark:text-gray-400">{dutyDescriptions[duty]}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dutyProducts.map((product) => {
                              // Build match reasons for this product
                              const matchReasons = {
                                technology: technologies.find(t => t.id === selectedTechnology)?.label,
                                action: actions.find(a => a.id === selectedAction)?.label,
                                environment: environments.find(e => e.id === selectedEnvironment)?.label,
                                features: selectedFeatures
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
                        </div>
                      );
                    })}

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
                              Contact our customer service team to discuss which option would work best for your specific application, or explore custom configurations.
                            </p>
                            <button
                              onClick={() => window.open('https://linemaster.com/request-a-quote/', '_blank')}
                              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
                            >
                              Contact Customer Service
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer CTA */}
                    <div className="mt-16 bg-[#1e293b] rounded-3xl p-8 text-white text-center">
                      <h2 className="text-2xl font-bold mb-2">Need a custom solution?</h2>
                      <p className="text-white/80 mb-6">
                        Download your specifications and request a custom quote.
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
                            window.open('https://linemaster.com/request-a-quote/', '_blank')
                          }
                          className="px-8 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl transition-colors"
                        >
                          Request Quote
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

export default function App() {
  return (
    <Router>
      {(path, navigate) => {
        // If accessing admin route
        if (path.startsWith('/admin')) {
          return <AdminContainer />;
        }
        
        // Default to wizard app
        return <WizardApp />;
      }}
    </Router>
  );
}