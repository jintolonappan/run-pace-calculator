import { useState, useEffect } from 'react';
import { useCalculator } from './hooks/useCalculator';
import { ModeToggle } from './components/ModeToggle';
import { UnitToggle } from './components/UnitToggle';
import { DistanceSelector } from './components/DistanceSelector';
import { TimeInput } from './components/TimeInput';
import { PaceInput } from './components/PaceInput';
import { ResultCard } from './components/ResultCard';
import { TreadmillPanel } from './components/TreadmillPanel';

// ─── Theme hook ──────────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

// ─── Icons ───────────────────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="5" />
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const { state, dispatch, result } = useCalculator();
  const { mode, unit, quickDist, customDistRaw, timeH, timeM, timeS, paceM, paceS, treadmillGrade, treadmillUnit } = state;
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark font-sans transition-colors duration-200">

      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="bg-white dark:bg-surf-dark border-b border-gray-100 dark:border-border-dark shadow-sm sticky top-0 z-10 transition-colors duration-200">
        <div className="max-w-xl md:max-w-5xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-11 md:h-11 bg-brand-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                Run Pace Calculator
              </h1>
              <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500">
                Pace · Time · Distance · Treadmill
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <UnitToggle
              unit={unit}
              onChange={(u) => dispatch({ type: 'SET_UNIT', payload: u })}
              compact
            />
            <button
              onClick={toggle}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="
                w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl
                text-gray-500 dark:text-gray-300
                bg-gray-100 dark:bg-border-dark
                hover:bg-gray-200 dark:hover:bg-[#2f5040]
                transition-colors duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
              "
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <main className="max-w-xl md:max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">

        {/* Desktop: 2-col grid │ Mobile: single column */}
        <div className="md:grid md:grid-cols-[1fr_460px] md:gap-10 space-y-6 md:space-y-0">

          {/* ── LEFT: inputs ── */}
          <div className="space-y-6 md:space-y-8">
            <ModeToggle
              mode={mode}
              onChange={(m) => dispatch({ type: 'SET_MODE', payload: m })}
            />

            <DistanceSelector
              selected={quickDist}
              customValue={customDistRaw}
              unit={unit}
              onSelect={(d) => dispatch({ type: 'SELECT_QUICK_DIST', payload: d })}
              onCustomChange={(v) => dispatch({ type: 'SET_CUSTOM_DIST', payload: v })}
            />

            <div className="flex flex-wrap gap-6 md:gap-8">
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

            {/* Pace reference — left col on desktop */}
            <div className="hidden md:block">
              <CommonPaces unit={unit} />
            </div>
          </div>

          {/* ── RIGHT: results ── */}
          <div className="space-y-6 md:space-y-8">
            <ResultCard mode={mode} result={result} unit={unit} />

            <div className="bg-white dark:bg-surf-dark rounded-2xl border border-gray-100 dark:border-border-dark shadow-sm p-4 md:p-6 transition-colors duration-200">
              <TreadmillPanel
                result={result}
                grade={treadmillGrade}
                displayUnit={treadmillUnit}
                onGradeChange={(g) => dispatch({ type: 'SET_TREADMILL_GRADE', payload: g })}
                onUnitChange={(u) => dispatch({ type: 'SET_TREADMILL_UNIT', payload: u })}
              />
            </div>

            {/* Pace reference — below treadmill on mobile */}
            <div className="md:hidden">
              <CommonPaces unit={unit} />
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-xl md:max-w-5xl mx-auto px-4 md:px-8 py-6 text-center text-xs text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-border-dark">
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
        text-sm font-semibold text-gray-600 dark:text-gray-300
        py-3 px-4 rounded-xl
        bg-gray-50 dark:bg-[#152b1e]
        hover:bg-gray-100 dark:hover:bg-border-dark
        transition-colors list-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
      ">
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Pace Reference
        </span>
        <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform group-open:rotate-180"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>

      <div className="mt-3 overflow-hidden rounded-xl border border-gray-100 dark:border-border-dark">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#152b1e]">
              <th className="px-4 py-2.5 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                Benchmark
              </th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                Pace/{unit === 'km' ? 'km' : 'mi'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-border-dark">
            {paces.map(({ label, paceKm }) => {
              const secPerUnit = unit === 'km' ? paceKm : paceKm * 1.60934;
              const m = Math.floor(secPerUnit / 60);
              const s = Math.round(secPerUnit % 60);
              return (
                <tr key={label} className="bg-white dark:bg-surf-dark hover:bg-gray-50 dark:hover:bg-[#1f3a28] transition-colors">
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{label}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-gray-800 dark:text-white">
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
