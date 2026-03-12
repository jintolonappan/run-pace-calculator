import { CalculationResult, DistanceUnit } from '../types';
import { UnitToggle } from './UnitToggle';
import {
  kphToMph, kphToPaceSecPerKm, treadmillToOutdoorPace,
} from '../utils/treadmill';
import { formatSecsToPace, paceToString, paceKmToMi } from '../utils/paceCalc';

interface Props {
  result: CalculationResult;
  grade: number;
  displayUnit: DistanceUnit;
  onGradeChange: (g: number) => void;
  onUnitChange: (u: DistanceUnit) => void;
}

export function TreadmillPanel({ result, grade, displayUnit, onGradeChange, onUnitChange }: Props) {
  const { treadmillSpeedKph } = result;

  const hasSpeed = treadmillSpeedKph !== null && treadmillSpeedKph > 0;
  const speedKph = treadmillSpeedKph ?? 10;
  const speedMph = kphToMph(speedKph);

  // Outdoor equivalent pace at current grade
  const outdoorPaceSecPerKm = treadmillToOutdoorPace(speedKph, grade);
  const outdoorPaceKm = formatSecsToPace(outdoorPaceSecPerKm);
  const outdoorPaceMi = formatSecsToPace(paceKmToMi(outdoorPaceSecPerKm));

  // Direct pace at this treadmill speed (0% grade equivalent)
  const directPaceSecPerKm = kphToPaceSecPerKm(speedKph);
  const directPaceKm = formatSecsToPace(directPaceSecPerKm);
  const directPaceMi = formatSecsToPace(paceKmToMi(directPaceSecPerKm));

  return (
    <details open className="group">
      <summary className="
        flex items-center justify-between cursor-pointer select-none
        text-sm font-semibold text-gray-600 py-3 px-4 rounded-xl
        bg-gray-50 hover:bg-gray-100 transition-colors
        list-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
      ">
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Treadmill Settings
        </span>
        <svg className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>

      <div className="mt-3 space-y-5 px-1">

        {/* Auto-calculated speed from pace result */}
        {hasSpeed ? (
          <div className="bg-gradient-to-br from-brand-50 to-orange-50 border border-brand-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-3">
              Set your treadmill to
            </p>
            <div className="flex items-baseline gap-4">
              <div>
                <span className="text-3xl font-bold text-gray-900">
                  {displayUnit === 'km' ? speedKph.toFixed(1) : speedMph.toFixed(1)}
                </span>
                <span className="text-base font-semibold text-brand-500 ml-1">
                  {displayUnit === 'km' ? 'kph' : 'mph'}
                </span>
              </div>
              <div className="text-gray-400 font-light">·</div>
              <div className="text-gray-500 text-sm">
                {displayUnit === 'km'
                  ? `${speedMph.toFixed(1)} mph`
                  : `${speedKph.toFixed(1)} kph`
                }
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              At {grade}% grade → equivalent outdoor pace:{' '}
              <strong className="text-gray-700">
                {displayUnit === 'km'
                  ? `${paceToString(outdoorPaceKm)}/km`
                  : `${paceToString(outdoorPaceMi)}/mi`
                }
              </strong>
            </p>
          </div>
        ) : (
          <div className="text-sm text-gray-400 italic text-center py-2">
            Calculate a pace above to see treadmill speed
          </div>
        )}

        {/* Pace reference rows */}
        {hasSpeed && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg px-3 py-2.5">
              <p className="text-xs text-gray-400 mb-1">Flat pace (0% grade)</p>
              <p className="font-semibold text-gray-700">
                {displayUnit === 'km'
                  ? `${paceToString(directPaceKm)}/km`
                  : `${paceToString(directPaceMi)}/mi`
                }
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg px-3 py-2.5">
              <p className="text-xs text-gray-400 mb-1">Outdoor equiv ({grade}% grade)</p>
              <p className="font-semibold text-gray-700">
                {displayUnit === 'km'
                  ? `${paceToString(outdoorPaceKm)}/km`
                  : `${paceToString(outdoorPaceMi)}/mi`
                }
              </p>
            </div>
          </div>
        )}

        {/* Grade control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="grade-slider" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Grade (Incline)
            </label>
            <span className="text-sm font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
              {grade.toFixed(1)}%
            </span>
          </div>
          <input
            id="grade-slider"
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={grade}
            onChange={(e) => onGradeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-brand-500"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>0% flat</span>
            <span className="text-brand-500 font-semibold">1% = outdoor equivalent</span>
            <span>10% steep</span>
          </div>
        </div>

        {/* Speed unit toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Speed Unit</span>
          <UnitToggle unit={displayUnit} onChange={onUnitChange} compact />
        </div>

        <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-3">
          <strong className="text-gray-500">Note:</strong> Running at 1% treadmill grade is widely
          considered equivalent to outdoor flat running, compensating for air resistance.
          (Jones, 2002 — Journal of Sports Sciences)
        </p>
      </div>
    </details>
  );
}
