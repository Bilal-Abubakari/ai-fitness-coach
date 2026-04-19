import { SquatPhase } from '@fitness/types';

interface RepCounterState {
  phase: SquatPhase;
  repCount: number;
  lastPhaseChange: number;
}

const PHASE_THRESHOLDS = {
  STANDING_KNEE_ANGLE: 160,
  BOTTOM_KNEE_ANGLE: 90,
  MIN_PHASE_DURATION_MS: 200,
};

/**
 * Stateful rep counter using a phase state machine for squats.
 * Transitions: STANDING → DESCENDING → BOTTOM → ASCENDING → STANDING (counts as 1 rep)
 */
export class RepCounter {
  private state: RepCounterState = {
    phase: 'STANDING',
    repCount: 0,
    lastPhaseChange: Date.now(),
  };

  update(kneeAngle: number): RepCounterState {
    const now = Date.now();
    const timeSinceLastChange = now - this.state.lastPhaseChange;

    if (timeSinceLastChange < PHASE_THRESHOLDS.MIN_PHASE_DURATION_MS) {
      return this.state;
    }

    const { phase, repCount } = this.state;
    let newPhase = phase;

    switch (phase) {
      case 'STANDING':
        if (kneeAngle < PHASE_THRESHOLDS.STANDING_KNEE_ANGLE) {
          newPhase = 'DESCENDING';
        }
        break;
      case 'DESCENDING':
        if (kneeAngle < PHASE_THRESHOLDS.BOTTOM_KNEE_ANGLE) {
          newPhase = 'BOTTOM';
        } else if (kneeAngle > PHASE_THRESHOLDS.STANDING_KNEE_ANGLE) {
          // Aborted rep - went back up without reaching bottom
          newPhase = 'STANDING';
        }
        break;
      case 'BOTTOM':
        if (kneeAngle > PHASE_THRESHOLDS.BOTTOM_KNEE_ANGLE) {
          newPhase = 'ASCENDING';
        }
        break;
      case 'ASCENDING':
        if (kneeAngle > PHASE_THRESHOLDS.STANDING_KNEE_ANGLE) {
          newPhase = 'STANDING';
          this.state = {
            phase: newPhase,
            repCount: repCount + 1,
            lastPhaseChange: now,
          };
          return this.state;
        }
        break;
    }

    if (newPhase !== phase) {
      this.state = { phase: newPhase, repCount, lastPhaseChange: now };
    }

    return this.state;
  }

  reset(): void {
    this.state = { phase: 'STANDING', repCount: 0, lastPhaseChange: Date.now() };
  }

  getState(): RepCounterState {
    return this.state;
  }
}

