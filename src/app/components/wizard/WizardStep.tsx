import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { ProgressDots } from '@/app/components/ProgressDots';
import { GlassCard } from '@/app/components/GlassCard';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export function BackButton({ onClick, label = 'Back' }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 mb-4 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] rounded-xl transition-all"
    >
      <ChevronLeft className="w-4 h-4" />
      {label}
    </button>
  );
}

export function EmptyStateNotice() {
  return (
    <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-200">
      No products match your current selections. Try adjusting your previous choices, or{' '}
      <a
        href="https://linemaster.com/contact/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold underline hover:text-amber-900 dark:hover:text-amber-100"
      >
        contact us
      </a>{' '}
      for assistance.
    </div>
  );
}

interface WizardStepProps {
  progressStep?: number;
  totalSteps?: number;
  displayStep?: number;
  onBack?: () => void;
  title: string;
  description?: ReactNode;
  isMedical?: boolean;
  footer?: ReactNode;
  emptyState?: boolean;
  children: ReactNode;
}

export function WizardStep({
  progressStep,
  totalSteps,
  displayStep,
  onBack,
  title,
  description,
  isMedical = false,
  footer,
  emptyState = false,
  children,
}: WizardStepProps) {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-8">
      {progressStep !== undefined && totalSteps !== undefined && (
        <ProgressDots currentStep={progressStep} totalSteps={totalSteps} isMedical={isMedical} />
      )}
      {onBack && <BackButton onClick={onBack} />}
      <GlassCard padding="32px" className="w-full">
        {displayStep !== undefined && totalSteps !== undefined && (
          <div
            className={`${isMedical ? 'text-[#ff2d55]' : 'text-primary'} text-xs font-semibold uppercase tracking-wider mb-2`}
          >
            STEP {displayStep} OF {totalSteps}
          </div>
        )}
        <h2 className={`text-2xl font-bold text-foreground ${description ? 'mb-2' : 'mb-6'}`}>{title}</h2>
        {description && <p className="text-sm text-muted-foreground mb-6">{description}</p>}

        {children}

        {emptyState && <EmptyStateNotice />}

        {footer}
      </GlassCard>
    </div>
  );
}
