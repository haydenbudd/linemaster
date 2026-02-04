interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
  isMedical?: boolean;
}

export function ProgressDots({ currentStep, totalSteps, isMedical = false }: ProgressDotsProps) {
  const percentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      {/* Progress Bar - Apple style thin */}
      <div className="relative h-1 bg-black/[0.06] dark:bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`absolute h-full rounded-full transition-all duration-700 ease-out ${
            isMedical
              ? 'bg-[#ff2d55]'
              : 'bg-primary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step Indicator */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground tracking-tight">
            Step {currentStep + 1}
          </span>
          <span className="text-sm text-muted-foreground">of {totalSteps}</span>
        </div>
        <span className={`text-sm font-medium ${isMedical ? 'text-[#ff2d55]' : 'text-primary'}`}>
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}
