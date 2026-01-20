import { X } from 'lucide-react';

interface FilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
}

export function FilterChip({ label, value, onRemove }: FilterChipProps) {
  return (
    <div className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-200 dark:border-indigo-800 rounded-full text-sm transition-all hover:shadow-md">
      <span className="text-indigo-900 dark:text-indigo-300 font-medium">
        {label}:
      </span>
      <span className="text-indigo-700 dark:text-indigo-200 font-bold">
        {value}
      </span>
      <button
        onClick={onRemove}
        className="ml-1 p-1 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors group-hover:scale-110"
        aria-label={`Remove ${label} filter`}
      >
        <X className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
      </button>
    </div>
  );
}
