import { calculateAngle, calculateVerticalAngle } from '../src/angle';
import { PoseLandmark } from '@fitness/types';

const lm = (x: number, y: number, z = 0): PoseLandmark => ({ x, y, z });

describe('calculateAngle', () => {
  it('should return 90 degrees for a right angle', () => {
    const a = lm(0, 1);
    const b = lm(0, 0);
    const c = lm(1, 0);
    expect(calculateAngle(a, b, c)).toBeCloseTo(90, 0);
  });

  it('should return 180 degrees for a straight line', () => {
    const a = lm(0, 0);
    const b = lm(1, 0);
    const c = lm(2, 0);
    expect(calculateAngle(a, b, c)).toBeCloseTo(180, 0);
  });

  it('should return 0 degrees when points overlap', () => {
    const a = lm(1, 0);
    const b = lm(0, 0);
    const c = lm(1, 0);
    expect(calculateAngle(a, b, c)).toBeCloseTo(0, 0);
  });
});

describe('calculateVerticalAngle', () => {
  it('should return 0 for perfectly vertical line', () => {
    const top = lm(0.5, 0);
    const bottom = lm(0.5, 1);
    expect(calculateVerticalAngle(top, bottom)).toBeCloseTo(0, 0);
  });

  it('should return 45 degrees for diagonal', () => {
    const top = lm(0, 0);
    const bottom = lm(1, 1);
    expect(calculateVerticalAngle(top, bottom)).toBeCloseTo(45, 0);
  });
});

