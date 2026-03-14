import { useRef } from 'react';
import { QuickDistance, DistanceUnit, QUICK_DISTANCES } from '../types';

interface Props {
  selected: QuickDistance;
  customValue: string;
  unit: DistanceUnit;
  onSelect: (d: QuickDistance) => void;
  onCustomChange: (val: string) => void;
}

const DISTANCES: QuickDistance[] = ['5K', '10K', '15K', 'Half', 'Marathon', 'Custom'];

const DISTANCE_LABELS: Record<QuickDistance, string> = {
  '5K':       '5K',
  '10K':      '10K',
  '15K':      '15K',
  'Half':     'Half',
  'Marathon': 'Full',
  'Custom':   'Custom',
};

export function DistanceSelector({ selected, customValue, unit, onSelect, onCustomChange }: Props) {
  const customRef = useRef<HTMLInputElement>(null);

  const handleSelect = (d: QuickDistance) => {
    onSelect(d);
    if (d === 'Custom') {
      setTimeout(() => customRef.current?.focus(), 50);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Distance</p>

      {/* Quick-pick pills */}
      <div className="flex flex-wrap gap-2">
        {DISTANCES.map((d) => {
          const isSelected = selected === d;
          const km = QUICK_DISTANCES[d].km;
          const subtitle = d !== 'Custom' && km !== null
            ? (unit === 'mi'
                ? `${(km / 1.60934).toFixed(1)} mi`
                : `${km % 1 === 0 ? km : km.toFixed(1)} km`)
            : null;

          return (
            <button
              key={d}
              onClick={() => handleSelect(d)}
              aria-pressed={isSelected}
              className={`
                flex flex-col items-center px-4 md:px-5 py-2.5 md:py-3
                rounded-xl border font-semibold text-sm md:text-base
                transition-all duration-150 min-w-[56px] md:min-w-[68px]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1
                ${isSelected
                  ? 'bg-brand-500 border-brand-500 text-gray-900 shadow-sm'
                  : 'bg-white dark:bg-surf-dark border-gray-200 dark:border-border-dark text-gray-700 dark:text-gray-300 hover:border-brand-400 hover:text-brand-600 dark:hover:border-brand-600 dark:hover:text-brand-400'
                }
              `}
            >
              <span>{DISTANCE_LABELS[d]}</span>
              {subtitle && (
                <span className={`text-[10px] font-normal mt-0.5 ${isSelected ? 'text-gray-700' : 'text-gray-400 dark:text-gray-500'}`}>
                  {subtitle}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom distance input */}
      {selected === 'Custom' && (
        <div className="flex items-center gap-2 mt-1">
          <div className="relative flex-1">
            <input
              ref={customRef}
              type="number"
              inputMode="decimal"
              min="0.1"
              step="0.1"
              value={customValue}
              onChange={(e) => onCustomChange(e.target.value)}
              placeholder={unit === 'mi' ? 'e.g. 6.2' : 'e.g. 10'}
              aria-label="Custom distance"
              className="
                w-full px-4 py-3 border-2 rounded-xl text-lg md:text-xl font-semibold
                bg-white dark:bg-surf-dark
                border-gray-200 dark:border-border-dark
                text-gray-900 dark:text-white
                placeholder:text-gray-300 dark:placeholder:text-gray-600
                focus:outline-none focus:border-brand-400 dark:focus:border-brand-500
                transition-colors
              "
            />
          </div>
          <span className="text-gray-500 dark:text-gray-400 font-semibold text-sm w-6">{unit}</span>
        </div>
      )}
    </div>
  );
}
