import { PoseLandmark, SquatAnalysis, SquatPhase, FeedbackMessage } from '@fitness/types';
import { calculateAngle, calculateVerticalAngle } from '../angle';
import { RepCounter } from '../repCounter';

// MediaPipe Pose landmark indices
export const POSE_LANDMARKS = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
} as const;

// Thresholds for feedback
const THRESHOLDS = {
  KNEE_OVER_TOE_TOLERANCE: 0.05, // normalized units
  BACK_ANGLE_WARNING: 30, // degrees from vertical
  BACK_ANGLE_ERROR: 45,
  HIP_DEPTH_THRESHOLD: 0.02, // hip y vs knee y (normalized)
};

export interface ExerciseAnalyzer<T> {
  analyze(landmarks: PoseLandmark[]): T;
  reset(): void;
}

export class SquatAnalyzer implements ExerciseAnalyzer<SquatAnalysis> {
  private repCounter = new RepCounter();

  analyze(landmarks: PoseLandmark[]): SquatAnalysis {
    if (!landmarks || landmarks.length < 29) {
      return this.emptyAnalysis();
    }

    const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];
    const leftKnee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
    const rightKnee = landmarks[POSE_LANDMARKS.RIGHT_KNEE];
    const leftAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const rightAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];
    const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];

    // Average left and right for bilateral analysis
    const avgHip = avgLandmark(leftHip, rightHip);
    const avgKnee = avgLandmark(leftKnee, rightKnee);
    const avgAnkle = avgLandmark(leftAnkle, rightAnkle);
    const avgShoulder = avgLandmark(leftShoulder, rightShoulder);

    // Calculate angles
    const kneeAngle = calculateAngle(avgHip, avgKnee, avgAnkle);
    const hipAngle = calculateAngle(avgShoulder, avgHip, avgKnee);
    const backAngle = calculateVerticalAngle(avgShoulder, avgHip);

    // Update rep counter and get phase
    const counterState = this.repCounter.update(kneeAngle);
    const phase: SquatPhase = counterState.phase;

    // Generate feedback
    const feedback: FeedbackMessage[] = [];

    // Back angle feedback
    if (backAngle > THRESHOLDS.BACK_ANGLE_ERROR) {
      feedback.push({
        type: 'error',
        text: 'Keep your back straight! Excessive forward lean detected.',
        bodyPart: 'back',
      });
    } else if (backAngle > THRESHOLDS.BACK_ANGLE_WARNING) {
      feedback.push({
        type: 'warning',
        text: 'Try to keep your back more upright.',
        bodyPart: 'back',
      });
    } else if (phase === 'BOTTOM' || phase === 'DESCENDING') {
      feedback.push({
        type: 'ok',
        text: 'Good back position!',
        bodyPart: 'back',
      });
    }

    // Hip depth feedback (check if hips are below knees at bottom)
    if (phase === 'BOTTOM') {
      if (avgHip.y < avgKnee.y + THRESHOLDS.HIP_DEPTH_THRESHOLD) {
        feedback.push({
          type: 'warning',
          text: 'Try to go deeper - hips should drop below knees.',
          bodyPart: 'hips',
        });
      } else {
        feedback.push({
          type: 'ok',
          text: 'Great depth!',
          bodyPart: 'hips',
        });
      }
    }

    // Knee tracking (knee should stay over toe)
    const leftKneeOverToe = leftKnee.x - leftAnkle.x;
    const rightKneeOverToe = rightKnee.x - rightAnkle.x;
    if (
      Math.abs(leftKneeOverToe) > THRESHOLDS.KNEE_OVER_TOE_TOLERANCE ||
      Math.abs(rightKneeOverToe) > THRESHOLDS.KNEE_OVER_TOE_TOLERANCE
    ) {
      feedback.push({
        type: 'warning',
        text: 'Keep knees aligned over your toes.',
        bodyPart: 'knees',
      });
    }

    return {
      phase,
      repCount: counterState.repCount,
      kneeAngle,
      hipAngle,
      backAngle,
      feedback,
    };
  }

  reset(): void {
    this.repCounter.reset();
  }

  private emptyAnalysis(): SquatAnalysis {
    return {
      phase: 'STANDING',
      repCount: 0,
      kneeAngle: 180,
      hipAngle: 180,
      backAngle: 0,
      feedback: [],
    };
  }
}

function avgLandmark(a: PoseLandmark, b: PoseLandmark): PoseLandmark {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    z: (a.z + b.z) / 2,
    visibility: Math.min(a.visibility ?? 1, b.visibility ?? 1),
  };
}

