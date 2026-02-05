interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
  isMedical?: boolean;
}

export function ProgressDots({ currentStep, totalSteps, isMedical = false }: ProgressDotsProps) {
  const percentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-8" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={`Step ${currentStep + 1} of ${totalSteps}`}>
      {/* Progress Bar with step dots */}
      <div className="relative">
        {/* Bar track */}
        <div className="h-1.5 bg-black/[0.06] dark:bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isMedical
                ? 'bg-[#ff2d55]'
                : 'bg-primary'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Step dot markers — absolutely positioned for perfect centering */}
        <div className="absolute inset-x-0 top-0 h-1.5 flex justify-between items-center">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                i <= currentStep
                  ? isMedical
                    ? 'bg-[#ff2d55] border-[#ff2d55]'
                    : 'bg-primary border-primary'
                  : 'bg-background border-foreground/15'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mt-3 flex items-center">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground tracking-tight">
            Step {currentStep + 1}
          </span>
          <span className="text-sm text-muted-foreground">of {totalSteps}</span>
        </div>
      </div>
    </div>
  );
}
