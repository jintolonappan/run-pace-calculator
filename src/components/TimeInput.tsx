import { useRef } from 'react';

interface Props {
  hours: number;
  minutes: number;
  seconds: number;
  onChange: (h: number, m: number, s: number) => void;
  disabled?: boolean;
  label?: string;
}

export function TimeInput({ hours, minutes, seconds, onChange, disabled, label = 'Time' }: Props) {
  const mRef = useRef<HTMLInputElement>(null);
  const sRef = useRef<HTMLInputElement>(null);

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  const handleH = (v: string) => {
    const n = clamp(parseInt(v) || 0, 0, 99);
    onChange(n, minutes, seconds);
    if (v.length >= 2) mRef.current?.select();
  };

  const handleM = (v: string) => {
    const n = clamp(parseInt(v) || 0, 0, 59);
    onChange(hours, n, seconds);
    if (v.length >= 2) sRef.current?.select();
  };

  const handleS = (v: string) => {
    const n = clamp(parseInt(v) || 0, 0, 59);
    onChange(hours, minutes, n);
  };

  const fieldClass = `
    w-16 md:w-20 text-center py-3 md:py-4 border-2 rounded-xl text-xl md:text-2xl font-semibold
    focus:outline-none transition-colors
    ${disabled
      ? 'border-gray-100 dark:border-[#1f3028] bg-gray-50 dark:bg-[#152b1e] text-gray-300 dark:text-gray-600 cursor-not-allowed'
      : 'border-gray-200 dark:border-border-dark bg-white dark:bg-surf-dark text-gray-900 dark:text-white focus:border-brand-400 dark:focus:border-brand-500'
    }
  `;

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <div role="group" aria-label={label} className="flex items-end gap-1">
        <div className="flex flex-col items-center gap-1">
          <input
            type="number"
            inputMode="numeric"
            min={0} max={99}
            value={hours || ''}
            onChange={(e) => handleH(e.target.value)}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            placeholder="0"
            aria-label="Hours"
            className={fieldClass}
          />
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">hrs</span>
        </div>
        <span className="text-2xl font-light text-gray-300 dark:text-gray-600 mb-5">:</span>
        <div className="flex flex-col items-center gap-1">
          <input
            ref={mRef}
            type="number"
            inputMode="numeric"
            min={0} max={59}
            value={minutes || ''}
            onChange={(e) => handleM(e.target.value)}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            placeholder="00"
            aria-label="Minutes"
            className={fieldClass}
          />
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">min</span>
        </div>
        <span className="text-2xl font-light text-gray-300 dark:text-gray-600 mb-5">:</span>
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
            aria-label="Seconds"
            className={fieldClass}
          />
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">sec</span>
        </div>
      </div>
    </div>
  );
}
