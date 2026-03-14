import { CalcMode } from '../types';

interface Props {
  mode: CalcMode;
  onChange: (mode: CalcMode) => void;
}

const MODES: { value: CalcMode; label: string; desc: string }[] = [
  { value: 'pace',     label: 'Find Pace',     desc: 'Distance + Time → Pace' },
  { value: 'time',     label: 'Find Time',     desc: 'Distance + Pace → Time' },
  { value: 'distance', label: 'Find Distance', desc: 'Pace + Time → Distance' },
];

export function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        What do you want to calculate?
      </p>
      <div className="grid grid-cols-3 gap-1.5 bg-gray-100 dark:bg-[#152b1e] p-1 rounded-xl">
        {MODES.map(({ value, label, desc }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            aria-pressed={mode === value}
            title={desc}
            className={`
              py-2.5 md:py-3 px-1 rounded-lg text-sm md:text-base font-semibold
              transition-all duration-150 min-h-[48px] md:min-h-[52px]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1
              ${mode === value
                ? 'bg-white dark:bg-surf-dark text-brand-700 dark:text-brand-400 shadow-sm border border-brand-200 dark:border-brand-800'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-surf-dark/60'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
