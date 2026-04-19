import { PoseLandmark } from '@fitness/types';

/**
 * Calculate the angle at point B formed by vectors BA and BC.
 * Returns angle in degrees (0-180).
 */
export function calculateAngle(a: PoseLandmark, b: PoseLandmark, c: PoseLandmark): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
}

/**
 * Calculate the angle between a vector and vertical axis.
 */
export function calculateVerticalAngle(top: PoseLandmark, bottom: PoseLandmark): number {
  const dx = bottom.x - top.x;
  const dy = bottom.y - top.y;
  const angleRad = Math.atan2(Math.abs(dx), Math.abs(dy));
  return (angleRad * 180) / Math.PI;
}

/**
 * Calculate Euclidean distance between two landmarks.
 */
export function distance(a: PoseLandmark, b: PoseLandmark): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

/**
 * Normalize a value between min and max to 0-1 range.
 */
export function normalize(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

