import { TimeComponents, PaceComponents } from '../types';

// ─── Unit conversions ───────────────────────────────────────────────────────

export const KM_PER_MILE = 1.60934;

export function kmToMi(km: number): number {
  return km / KM_PER_MILE;
}

export function miToKm(mi: number): number {
  return mi * KM_PER_MILE;
}

/** Convert pace sec/km → sec/mi */
export function paceKmToMi(secPerKm: number): number {
  return secPerKm * KM_PER_MILE;
}

/** Convert pace sec/mi → sec/km */
export function paceMiToKm(secPerMi: number): number {
  return secPerMi / KM_PER_MILE;
}

// ─── Formatting ─────────────────────────────────────────────────────────────

export function formatSecsToHMS(totalSeconds: number): TimeComponents {
  const s = Math.round(totalSeconds);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return { hours, minutes, seconds };
}

export function formatSecsToPace(secPerUnit: number): PaceComponents {
  const s = Math.round(secPerUnit);
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  return { minutes, seconds };
}

export function paceToString(pace: PaceComponents): string {
  return `${pace.minutes}:${String(pace.seconds).padStart(2, '0')}`;
}

export function timeToString(time: TimeComponents): string {
  if (time.hours > 0) {
    return `${time.hours}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`;
  }
  return `${time.minutes}:${String(time.seconds).padStart(2, '0')}`;
}

// ─── Validation ──────────────────────────────────────────────────────────────

export function isValidPositive(n: number | null | undefined): n is number {
  return n !== null && n !== undefined && isFinite(n) && n > 0;
}

// ─── Core calculations ───────────────────────────────────────────────────────

/** Find Pace: given distance (km) and total time (sec) → pace sec/km */
export function calcPace(distKm: number | null, totalSec: number | null): number | null {
  if (!isValidPositive(distKm) || !isValidPositive(totalSec)) return null;
  return totalSec / distKm;
}

/** Find Time: given distance (km) and pace (sec/km) → total seconds */
export function calcTime(distKm: number | null, secPerKm: number | null): number | null {
  if (!isValidPositive(distKm) || !isValidPositive(secPerKm)) return null;
  return distKm * secPerKm;
}

/** Find Distance: given total time (sec) and pace (sec/km) → km */
export function calcDistance(totalSec: number | null, secPerKm: number | null): number | null {
  if (!isValidPositive(totalSec) || !isValidPositive(secPerKm)) return null;
  return totalSec / secPerKm;
}
