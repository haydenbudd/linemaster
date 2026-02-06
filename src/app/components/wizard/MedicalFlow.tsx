import { Option } from '@/app/lib/api';
import { WizardState } from '@/app/hooks/useWizardState';
import { OptionCard } from '@/app/components/OptionCard';
import { ProgressDots } from '@/app/components/ProgressDots';
import { GlassCard } from '@/app/components/GlassCard';
import { Header } from '@/app/components/Header';
import { OrbBackground } from '@/app/components/OrbBackground';
import { getProxiedImageUrl } from '@/app/utils/imageProxy';
import { ChevronLeft, ArrowRight, Download, Send, CheckCircle, Heart } from 'lucide-react';

export interface MedicalFlowProps {
  wizardState: WizardState;
  consoleStyles: Option[];
  pedalCounts: Option[];
  medicalTechnicalFeatures: Option[];
  accessories: Option[];
  totalSteps: number;
  onBack: () => void;
  onContinue: () => void;
  onViewStandardProducts: () => void;
  onGeneratePDF: () => void;
  onReset: () => void;
}

export function MedicalFlow({
  wizardState,
  consoleStyles,
  pedalCounts,
  medicalTechnicalFeatures,
  accessories,
  totalSteps,
  onBack,
  onContinue,
  onViewStandardProducts,
  onGeneratePDF,
  onReset,
}: MedicalFlowProps) {
  return (
    <div className="min-h-screen mesh-gradient-medical relative z-10">
      <OrbBackground />
      <Header onReset={onReset} />

      {wizardState.step === 1 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <GlassCard cornerRadius={28} padding="0" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full overflow-hidden">
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
                <div key={feature} className="flex items-center gap-3 p-4 bg-[#ff2d55]/10 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-[#ff2d55] flex-shrink-0" />
                  <span className="text-sm font-semibold text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-8 pb-8">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <div className="flex gap-3">
                <button
                  onClick={onViewStandardProducts}
                  className="px-6 py-3 text-[#ff2d55] font-semibold hover:bg-[#ff2d55]/10 rounded-xl transition-colors"
                >
                  View Standard Products
                </button>
                <button
                  onClick={onContinue}
                  className="flex items-center gap-2 px-8 py-3 bg-[#ff2d55] hover:bg-[#ff2d55]/90 text-white font-semibold rounded-xl transition-colors"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {wizardState.step === 2 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={0} totalSteps={totalSteps} isMedical />
          <GlassCard cornerRadius={28} padding="32px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full">
            <div className="text-[#ff2d55] text-xs font-semibold uppercase tracking-wider mb-2">
              STEP 1 OF {totalSteps}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Console Style</h2>
            <p className="text-sm text-muted-foreground mb-6">Select your preferred platform.</p>

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
                    setTimeout(onContinue, 150);
                  }}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <span className="text-sm text-muted-foreground">Select to continue</span>
            </div>
          </GlassCard>
        </div>
      )}

      {wizardState.step === 3 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={1} totalSteps={totalSteps} isMedical />
          <GlassCard cornerRadius={28} padding="32px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full">
            <div className="text-[#ff2d55] text-xs font-semibold uppercase tracking-wider mb-2">
              STEP 2 OF {totalSteps}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Pedal Count</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {pedalCounts.map((option) => (
                <OptionCard
                  key={option.id}
                  option={option}
                  selected={wizardState.selectedPedalCount === option.id}
                  onSelect={() => {
                    wizardState.setSelectedPedalCount(option.id);
                    setTimeout(onContinue, 150);
                  }}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <span className="text-sm text-muted-foreground">Select to continue</span>
            </div>
          </GlassCard>
        </div>
      )}

      {wizardState.step === 4 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={2} totalSteps={totalSteps} isMedical />
          <GlassCard cornerRadius={28} padding="32px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full">
            <div className="text-[#ff2d55] text-xs font-semibold uppercase tracking-wider mb-2">
              STEP 3 OF {totalSteps}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Technical Features</h2>
            <p className="text-sm text-muted-foreground mb-6">Select all that apply.</p>

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
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={onContinue}
                className="flex items-center gap-2 px-8 py-3 bg-[#ff2d55] hover:bg-[#ff2d55]/90 text-white font-semibold rounded-xl transition-colors"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {wizardState.step === 5 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <ProgressDots currentStep={3} totalSteps={totalSteps} isMedical />
          <GlassCard cornerRadius={28} padding="32px" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full">
            <div className="text-[#ff2d55] text-xs font-semibold uppercase tracking-wider mb-2">
              STEP 4 OF {totalSteps}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Accessories & Add-ons</h2>
            <p className="text-sm text-muted-foreground mb-6">Select all that apply.</p>

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
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={onContinue}
                className="flex items-center gap-2 px-8 py-3 bg-[#ff2d55] hover:bg-[#ff2d55]/90 text-white font-semibold rounded-xl transition-colors"
              >
                See Results
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {wizardState.step === 6 && (
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <GlassCard cornerRadius={28} padding="0" blurAmount={0.25} saturation={150} displacementScale={40} overLight className="w-full overflow-hidden">
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
              <div className="divide-y divide-foreground/5">
                <div className="flex justify-between py-4">
                  <span className="text-sm text-muted-foreground">Console Style</span>
                  <span className="text-sm font-semibold text-foreground">
                    {consoleStyles.find(c => c.id === wizardState.selectedConsoleStyle)?.label || wizardState.selectedConsoleStyle}
                  </span>
                </div>
                <div className="flex justify-between py-4">
                  <span className="text-sm text-muted-foreground">Pedal Configuration</span>
                  <span className="text-sm font-semibold text-foreground">
                    {pedalCounts.find(p => p.id === wizardState.selectedPedalCount)?.label || wizardState.selectedPedalCount}
                  </span>
                </div>
                {wizardState.selectedMedicalFeatures.length > 0 && (
                  <div className="flex justify-between py-4">
                    <span className="text-sm text-muted-foreground">Technical Features</span>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {wizardState.selectedMedicalFeatures.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wide rounded-full"
                        >
                          {medicalTechnicalFeatures.find(f => f.id === feature)?.label || feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {wizardState.selectedAccessories.length > 0 && (
                  <div className="flex justify-between py-4">
                    <span className="text-sm text-muted-foreground">Accessories</span>
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
                  Submit Quote Request
                </button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Attach your downloaded PDF to the quote form for faster processing.
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-foreground/5">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Accessories
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
