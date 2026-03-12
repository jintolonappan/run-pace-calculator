export type DistanceUnit = 'km' | 'mi';
export type CalcMode = 'pace' | 'time' | 'distance';

export interface TimeComponents {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface PaceComponents {
  minutes: number;
  seconds: number;
}

export type QuickDistance = '5K' | '10K' | '15K' | 'Half' | 'Marathon' | 'Custom';

export interface QuickDistanceOption {
  label: string;
  km: number | null;
}

export const QUICK_DISTANCES: Record<QuickDistance, QuickDistanceOption> = {
  '5K':       { label: '5K',        km: 5 },
  '10K':      { label: '10K',       km: 10 },
  '15K':      { label: '15K',       km: 15 },
  'Half':     { label: 'Half',      km: 21.0975 },
  'Marathon': { label: 'Marathon',  km: 42.195 },
  'Custom':   { label: 'Custom',    km: null },
};

export interface CalculationResult {
  paceSecPerKm: number | null;
  totalSeconds: number | null;
  distanceKm: number | null;
  treadmillSpeedKph: number | null;
}
