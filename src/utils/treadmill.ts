/**
 * Treadmill ↔ outdoor pace equivalence
 *
 * Based on Jones (2002): running at 1% treadmill grade best replicates the
 * metabolic cost of outdoor flat running (compensates for air resistance).
 *
 * Minetti linear approximation: each 1% of grade adds ~3.5% to metabolic cost.
 * Therefore: outdoorSpeedKph = treadmillSpeedKph × (1 + grade × 0.035)
 */

/** Convert km/h to sec/km */
export function kphToPaceSecPerKm(kph: number): number {
  return 3600 / kph;
}

/** Convert sec/km to km/h */
export function paceSecPerKmToKph(secPerKm: number): number {
  return 3600 / secPerKm;
}

/** Convert km/h to mph */
export function kphToMph(kph: number): number {
  return kph / 1.60934;
}

/** Convert mph to km/h */
export function mphToKph(mph: number): number {
  return mph * 1.60934;
}

/**
 * Given treadmill speed (kph) and grade (%), return the equivalent
 * outdoor flat-running pace (sec/km) that requires the same effort.
 */
export function treadmillToOutdoorPace(speedKph: number, gradePercent: number): number {
  const outdoorSpeedKph = speedKph * (1 + gradePercent * 0.035);
  return kphToPaceSecPerKm(outdoorSpeedKph);
}

/**
 * Given a target outdoor pace (sec/km) and treadmill grade (%),
 * return the treadmill speed (kph) that produces equivalent effort.
 */
export function outdoorPaceToTreadmillSpeed(secPerKm: number, gradePercent: number): number | null {
  if (!isFinite(secPerKm) || secPerKm <= 0) return null;
  const targetKph = paceSecPerKmToKph(secPerKm);
  return targetKph / (1 + gradePercent * 0.035);
}
