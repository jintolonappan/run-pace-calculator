import { CalcMode, DistanceUnit } from '../types';
import { CalculationResult } from '../types';
import {
  formatSecsToPace, formatSecsToHMS, paceToString, timeToString,
  paceKmToMi, kmToMi,
} from '../utils/paceCalc';

interface Props {
  mode: CalcMode;
  result: CalculationResult;
  unit: DistanceUnit;
}

export function ResultCard({ mode, result, unit }: Props) {
  const { paceSecPerKm, totalSeconds, distanceKm } = result;

  let primary = '—';
  let primaryLabel = '';
  let secondary = '';

  if (mode === 'pace' && paceSecPerKm !== null) {
    const paceKm = formatSecsToPace(paceSecPerKm);
    const paceMi = formatSecsToPace(paceKmToMi(paceSecPerKm));
    if (unit === 'km') {
      primary = paceToString(paceKm);
      primaryLabel = '/km';
      secondary = `${paceToString(paceMi)} /mi`;
    } else {
      primary = paceToString(paceMi);
      primaryLabel = '/mi';
      secondary = `${paceToString(paceKm)} /km`;
    }
  } else if (mode === 'time' && totalSeconds !== null && totalSeconds > 0) {
    primary = timeToString(formatSecsToHMS(totalSeconds));
    primaryLabel = '';
    if (distanceKm !== null) {
      const hms = formatSecsToHMS(totalSeconds);
      if (hms.hours > 0) {
        secondary = `${hms.hours}h ${hms.minutes}m ${hms.seconds}s`;
      } else {
        secondary = `${hms.minutes} min ${hms.seconds} sec`;
      }
    }
  } else if (mode === 'distance' && distanceKm !== null) {
    if (unit === 'km') {
      primary = `${distanceKm.toFixed(2)} km`;
      secondary = `${kmToMi(distanceKm).toFixed(2)} mi`;
    } else {
      const mi = kmToMi(distanceKm);
      primary = `${mi.toFixed(2)} mi`;
      secondary = `${distanceKm.toFixed(2)} km`;
    }
  }

  const modeLabels: Record<CalcMode, string> = {
    pace:     'Your Pace',
    time:     'Finish Time',
    distance: 'Distance',
  };

  const hasResult = primary !== '—';

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`
        rounded-2xl border-2 p-6 md:p-8 transition-all duration-200
        ${hasResult
          ? 'bg-gradient-to-br from-brand-50 to-brand-100/60 dark:from-[#1a3225] dark:to-[#172c1e] border-brand-200 dark:border-brand-800'
          : 'bg-gray-50 dark:bg-surf-dark border-gray-100 dark:border-border-dark'
        }
      `}
    >
      <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${hasResult ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500'}`}>
        {modeLabels[mode]}
      </p>
      <div className="flex items-baseline gap-2">
        <span className={`text-5xl md:text-6xl font-bold tracking-tight ${hasResult ? 'text-gray-900 dark:text-white' : 'text-gray-200 dark:text-gray-700'}`}>
          {primary}
        </span>
        {primaryLabel && hasResult && (
          <span className="text-xl md:text-2xl font-semibold text-brand-500">{primaryLabel}</span>
        )}
      </div>
      {secondary && hasResult && (
        <p className="mt-1.5 text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">{secondary}</p>
      )}
      {!hasResult && (
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-600">Enter values above to calculate</p>
      )}
    </div>
  );
}
