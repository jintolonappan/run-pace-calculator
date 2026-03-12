import { useCalculator } from './hooks/useCalculator';
import { ModeToggle } from './components/ModeToggle';
import { UnitToggle } from './components/UnitToggle';
import { DistanceSelector } from './components/DistanceSelector';
import { TimeInput } from './components/TimeInput';
import { PaceInput } from './components/PaceInput';
import { ResultCard } from './components/ResultCard';
import { TreadmillPanel } from './components/TreadmillPanel';

export default function App() {
  const { state, dispatch, result } = useCalculator();
  const { mode, unit, quickDist, customDistRaw, timeH, timeM, timeS, paceM, paceS, treadmillGrade, treadmillUnit } = state;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Run Pace Calculator</h1>
              <p className="text-xs text-gray-400">Pace · Time · Distance · Treadmill</p>
            </div>
          </div>
          <UnitToggle
            unit={unit}
            onChange={(u) => dispatch({ type: 'SET_UNIT', payload: u })}
            compact
          />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">

        {/* Mode toggle */}
        <ModeToggle
          mode={mode}
          onChange={(m) => dispatch({ type: 'SET_MODE', payload: m })}
        />

        {/* Distance */}
        <DistanceSelector
          selected={quickDist}
          customValue={customDistRaw}
          unit={unit}
          onSelect={(d) => dispatch({ type: 'SELECT_QUICK_DIST', payload: d })}
          onCustomChange={(v) => dispatch({ type: 'SET_CUSTOM_DIST', payload: v })}
        />

        {/* Input fields: show the 2 that are NOT the calculated output */}
        <div className="flex flex-wrap gap-6">
          {mode !== 'time' && (
            <TimeInput
              hours={timeH}
              minutes={timeM}
              seconds={timeS}
              onChange={(h, m, s) => dispatch({ type: 'SET_TIME', payload: { h, m, s } })}
              label="Time"
            />
          )}
          {mode !== 'pace' && (
            <PaceInput
              minutes={paceM}
              seconds={paceS}
              unit={unit}
              onChange={(m, s) => dispatch({ type: 'SET_PACE', payload: { m, s } })}
              label="Pace"
            />
          )}
        </div>

        {/* Result */}
        <ResultCard mode={mode} result={result} unit={unit} />

        {/* Treadmill */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <TreadmillPanel
            result={result}
            grade={treadmillGrade}
            displayUnit={treadmillUnit}
            onGradeChange={(g) => dispatch({ type: 'SET_TREADMILL_GRADE', payload: g })}
            onUnitChange={(u) => dispatch({ type: 'SET_TREADMILL_UNIT', payload: u })}
          />
        </div>

        {/* Pace reference table */}
        <CommonPaces unit={unit} />

      </main>

      <footer className="max-w-lg mx-auto px-4 py-6 text-center text-xs text-gray-400 border-t border-gray-100">
        <p>Free running pace calculator · Works offline · No sign-up needed</p>
      </footer>
    </div>
  );
}

// ─── Common Paces Reference ──────────────────────────────────────────────────

function CommonPaces({ unit }: { unit: string }) {
  const paces = [
    { label: 'Beginner (5K ~35min)',     paceKm: 420 },
    { label: 'Intermediate (5K ~25min)', paceKm: 300 },
    { label: 'Easy / Recovery run',      paceKm: 390 },
    { label: 'Sub-4h Marathon',          paceKm: 341 },
    { label: 'Sub-3h Marathon',          paceKm: 256 },
    { label: '5K World Record (men)',     paceKm: 177 },
  ];

  return (
    <details className="group">
      <summary className="
        flex items-center justify-between cursor-pointer select-none
        text-sm font-semibold text-gray-600 py-3 px-4 rounded-xl
        bg-gray-50 hover:bg-gray-100 transition-colors
        list-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
      ">
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Pace Reference
        </span>
        <svg className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="mt-3 overflow-hidden rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2.5 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Benchmark</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Pace/{unit === 'km' ? 'km' : 'mi'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paces.map(({ label, paceKm }) => {
              const secPerUnit = unit === 'km' ? paceKm : paceKm * 1.60934;
              const m = Math.floor(secPerUnit / 60);
              const s = Math.round(secPerUnit % 60);
              return (
                <tr key={label} className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-700">{label}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-gray-800">
                    {m}:{String(s).padStart(2, '0')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </details>
  );
}
