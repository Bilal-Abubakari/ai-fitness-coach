import { PoseLandmarker, FilesetResolver, PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import { MEDIAPIPE_CONFIG } from '@fitness/config';

let poseLandmarker: PoseLandmarker | null = null;
let isInitializing = false;

export async function initPoseLandmarker(): Promise<PoseLandmarker> {
  if (poseLandmarker) return poseLandmarker;
  if (isInitializing) {
    // Wait for initialization to complete
    await new Promise<void>((resolve) => {
      const check = setInterval(() => {
        if (poseLandmarker || !isInitializing) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
    return poseLandmarker!;
  }

  isInitializing = true;
  try {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
    );

    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task',
        delegate: 'GPU',
      },
      runningMode: MEDIAPIPE_CONFIG.runningMode,
      numPoses: MEDIAPIPE_CONFIG.numPoses,
      minPoseDetectionConfidence: MEDIAPIPE_CONFIG.minPoseDetectionConfidence,
      minPosePresenceConfidence: MEDIAPIPE_CONFIG.minPosePresenceConfidence,
      minTrackingConfidence: MEDIAPIPE_CONFIG.minTrackingConfidence,
    });
  } finally {
    isInitializing = false;
  }

  return poseLandmarker!;
}

export function detectPose(
  landmarker: PoseLandmarker,
  video: HTMLVideoElement,
  timestamp: number,
): PoseLandmarkerResult {
  return landmarker.detectForVideo(video, timestamp);
}

export function disposePoseLandmarker(): void {
  poseLandmarker?.close();
  poseLandmarker = null;
}

