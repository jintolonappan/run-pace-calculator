import { DistanceUnit } from '../types';

interface Props {
  unit: DistanceUnit;
  onChange: (unit: DistanceUnit) => void;
  compact?: boolean;
}

export function UnitToggle({ unit, onChange, compact }: Props) {
  return (
    <div className={`flex rounded-lg overflow-hidden border border-gray-200 ${compact ? 'text-xs' : 'text-sm'}`}>
      {(['km', 'mi'] as DistanceUnit[]).map((u) => (
        <button
          key={u}
          onClick={() => onChange(u)}
          aria-pressed={unit === u}
          className={`
            ${compact ? 'px-2.5 py-1' : 'px-3 py-1.5'} font-semibold transition-colors duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
            ${unit === u
              ? 'bg-brand-500 text-white'
              : 'bg-white text-gray-500 hover:bg-gray-50'
            }
          `}
        >
          {u}
        </button>
      ))}
    </div>
  );
}
