import { useReducer, useMemo } from 'react';
import {
  CalcMode, DistanceUnit, QuickDistance, QUICK_DISTANCES, CalculationResult,
} from '../types';
import { calcPace, calcTime, calcDistance, paceMiToKm, miToKm } from '../utils/paceCalc';
import { outdoorPaceToTreadmillSpeed } from '../utils/treadmill';

// ─── State ───────────────────────────────────────────────────────────────────

export interface AppState {
  mode: CalcMode;
  unit: DistanceUnit;
  quickDist: QuickDistance;
  customDistRaw: string;     // user-typed string for custom distance
  distKm: number | null;     // resolved km value
  // Time inputs
  timeH: number;
  timeM: number;
  timeS: number;
  // Pace inputs (in current unit)
  paceM: number;
  paceS: number;
  // Treadmill
  treadmillGrade: number;    // percent, default 1
  treadmillUnit: DistanceUnit;
}

const initialState: AppState = {
  mode: 'pace',
  unit: 'mi',
  quickDist: '10K',
  customDistRaw: '',
  distKm: 10,
  timeH: 0,
  timeM: 0,
  timeS: 0,
  paceM: 0,
  paceS: 0,
  treadmillGrade: 1,
  treadmillUnit: 'mi',
};

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_MODE';             payload: CalcMode }
  | { type: 'SET_UNIT';             payload: DistanceUnit }
  | { type: 'SELECT_QUICK_DIST';    payload: QuickDistance }
  | { type: 'SET_CUSTOM_DIST';      payload: string }
  | { type: 'SET_TIME';             payload: { h: number; m: number; s: number } }
  | { type: 'SET_PACE';             payload: { m: number; s: number } }
  | { type: 'SET_TREADMILL_GRADE';  payload: number }
  | { type: 'SET_TREADMILL_UNIT';   payload: DistanceUnit }
  | { type: 'RESET' };

function resolveCustomDist(raw: string, unit: DistanceUnit): number | null {
  const n = parseFloat(raw);
  if (!isFinite(n) || n <= 0) return null;
  return unit === 'mi' ? miToKm(n) : n;
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_UNIT':
      return { ...state, unit: action.payload };
    case 'SELECT_QUICK_DIST': {
      const qd = action.payload;
      const distKm = qd === 'Custom'
        ? resolveCustomDist(state.customDistRaw, state.unit)
        : (QUICK_DISTANCES[qd].km ?? null);
      return { ...state, quickDist: qd, distKm };
    }
    case 'SET_CUSTOM_DIST': {
      const raw = action.payload;
      const distKm = resolveCustomDist(raw, state.unit);
      return { ...state, customDistRaw: raw, distKm };
    }
    case 'SET_TIME':
      return { ...state, timeH: action.payload.h, timeM: action.payload.m, timeS: action.payload.s };
    case 'SET_PACE':
      return { ...state, paceM: action.payload.m, paceS: action.payload.s };
    case 'SET_TREADMILL_GRADE':
      return { ...state, treadmillGrade: action.payload };
    case 'SET_TREADMILL_UNIT':
      return { ...state, treadmillUnit: action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const result = useMemo<CalculationResult>(() => {
    const { mode, unit, distKm, timeH, timeM, timeS, paceM, paceS, treadmillGrade } = state;

    const totalSec = timeH * 3600 + timeM * 60 + timeS;
    const totalSecOrNull = totalSec > 0 ? totalSec : null;

    // Pace input is in user's unit — normalize to sec/km
    const paceInputSec = paceM * 60 + paceS;
    const paceInputSecOrNull = paceInputSec > 0 ? paceInputSec : null;
    const paceSecPerKm = paceInputSecOrNull !== null
      ? (unit === 'mi' ? paceMiToKm(paceInputSecOrNull) : paceInputSecOrNull)
      : null;

    let resultPaceSecPerKm: number | null = null;
    let resultTotalSec: number | null = null;
    let resultDistKm: number | null = null;

    if (mode === 'pace') {
      resultPaceSecPerKm = calcPace(distKm, totalSecOrNull);
      resultTotalSec = totalSecOrNull;
      resultDistKm = distKm;
    } else if (mode === 'time') {
      resultTotalSec = calcTime(distKm, paceSecPerKm);
      resultPaceSecPerKm = paceSecPerKm;
      resultDistKm = distKm;
    } else {
      resultDistKm = calcDistance(totalSecOrNull, paceSecPerKm);
      resultPaceSecPerKm = paceSecPerKm;
      resultTotalSec = totalSecOrNull;
    }

    const treadmillSpeedKph = resultPaceSecPerKm !== null
      ? outdoorPaceToTreadmillSpeed(resultPaceSecPerKm, treadmillGrade)
      : null;

    return {
      paceSecPerKm: resultPaceSecPerKm,
      totalSeconds: resultTotalSec,
      distanceKm: resultDistKm,
      treadmillSpeedKph,
    };
  }, [state]);

  return { state, dispatch, result };
}

// Re-export for convenience
export { QUICK_DISTANCES };
