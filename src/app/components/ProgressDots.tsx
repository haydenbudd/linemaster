interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
  isMedical?: boolean;
}

export function ProgressDots({ currentStep, totalSteps, isMedical = false }: ProgressDotsProps) {
  const percentage = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 100;

  return (
    <div className="mb-6" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={`Step ${currentStep + 1} of ${totalSteps}`}>
      <div className="relative h-3 mx-[5px]">
        {/* Bar track */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-black/[0.06] dark:bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isMedical ? 'bg-[#ff2d55]' : 'bg-primary'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Step dot markers — centered at exact percentages along the bar */}
        {Array.from({ length: totalSteps }, (_, i) => {
          const left = totalSteps > 1 ? (i / (totalSteps - 1)) * 100 : 0;
          const isActive = i <= currentStep;
          return (
            <div
              key={i}
              className={`absolute top-1/2 w-2.5 h-2.5 rounded-full transition-all duration-300`}
              style={{
                left: `${left}%`,
                transform: 'translate(-50%, -50%)',
                backgroundColor: isActive
                  ? isMedical ? '#ff2d55' : 'var(--primary)'
                  : 'var(--border)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
