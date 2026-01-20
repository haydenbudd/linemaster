interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
  isMedical?: boolean;
}

export function ProgressDots({ currentStep, totalSteps, isMedical = false }: ProgressDotsProps) {
  const percentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`absolute h-full rounded-full transition-all duration-500 ease-out ${
            isMedical
              ? 'bg-gradient-to-r from-rose-500 to-pink-500'
              : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step Indicator */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">
            Step {currentStep + 1}
          </span>
          <span className="text-sm text-muted-foreground">of {totalSteps}</span>
        </div>
        <span className="text-sm font-semibold text-primary">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}