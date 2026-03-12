import { useRef } from 'react';
import { DistanceUnit } from '../types';

interface Props {
  minutes: number;
  seconds: number;
  unit: DistanceUnit;
  onChange: (m: number, s: number) => void;
  disabled?: boolean;
  label?: string;
}

export function PaceInput({ minutes, seconds, unit, onChange, disabled, label = 'Pace' }: Props) {
  const sRef = useRef<HTMLInputElement>(null);

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  const handleM = (v: string) => {
    const n = clamp(parseInt(v) || 0, 0, 59);
    onChange(n, seconds);
    if (v.length >= 2) sRef.current?.select();
  };

  const handleS = (v: string) => {
    const n = clamp(parseInt(v) || 0, 0, 59);
    onChange(minutes, n);
  };

  const fieldClass = `
    w-16 text-center py-3 border-2 rounded-xl text-xl font-semibold
    focus:outline-none transition-colors
    ${disabled
      ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
      : 'border-gray-200 bg-white focus:border-brand-400'
    }
  `;

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <div role="group" aria-label={label} className="flex items-end gap-1">
        <div className="flex flex-col items-center gap-1">
          <input
            type="number"
            inputMode="numeric"
            min={0} max={59}
            value={minutes || ''}
            onChange={(e) => handleM(e.target.value)}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            placeholder="0"
            aria-label="Minutes per unit"
            className={fieldClass}
          />
          <span className="text-[10px] text-gray-400 font-medium">min</span>
        </div>
        <span className="text-2xl font-light text-gray-300 mb-5">:</span>
        <div className="flex flex-col items-center gap-1">
          <input
            ref={sRef}
            type="number"
            inputMode="numeric"
            min={0} max={59}
            value={seconds || ''}
            onChange={(e) => handleS(e.target.value)}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            placeholder="00"
            aria-label="Seconds per unit"
            className={fieldClass}
          />
          <span className="text-[10px] text-gray-400 font-medium">sec</span>
        </div>
        <div className="flex flex-col items-end gap-1 pb-0.5">
          <span className="text-sm font-semibold text-gray-400 whitespace-nowrap mb-5">
            /{unit}
          </span>
        </div>
      </div>
    </div>
  );
}
