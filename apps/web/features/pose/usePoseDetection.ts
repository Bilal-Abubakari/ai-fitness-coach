'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { PoseLandmark } from '@fitness/types';
import { initPoseLandmarker, detectPose } from './poseDetection.service';

export type PoseDetectionStatus = 'idle' | 'loading' | 'ready' | 'error';

interface UsePoseDetectionOptions {
  videoRef: React.RefObject<HTMLVideoElement>;
  enabled?: boolean;
}

interface UsePoseDetectionResult {
  landmarks: PoseLandmark[];
  status: PoseDetectionStatus;
  error: string | null;
  fps: number;
}

export function usePoseDetection({
  videoRef,
  enabled = true,
}: UsePoseDetectionOptions): UsePoseDetectionResult {
  const [landmarks, setLandmarks] = useState<PoseLandmark[]>([]);
  const [status, setStatus] = useState<PoseDetectionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [fps, setFps] = useState(0);

  const rafRef = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const fpsTimer = useRef<number>(0);

  const runDetection = useCallback(async () => {
    if (!enabled) return;

    setStatus('loading');
    try {
      const landmarker = await initPoseLandmarker();
      setStatus('ready');

      const detect = (timestamp: number) => {
        const video = videoRef.current;
        if (!video || video.readyState < 2) {
          rafRef.current = requestAnimationFrame(detect);
          return;
        }

        if (timestamp - lastFrameTime.current < 1000 / 30) {
          rafRef.current = requestAnimationFrame(detect);
          return;
        }
        lastFrameTime.current = timestamp;

        try {
          const result = detectPose(landmarker, video, timestamp);
          if (result.landmarks && result.landmarks.length > 0) {
            setLandmarks(result.landmarks[0] as PoseLandmark[]);
          } else {
            setLandmarks([]);
          }
        } catch {
          // Silently continue on detection errors
        }

        // FPS calculation
        frameCount.current++;
        if (timestamp - fpsTimer.current >= 1000) {
          setFps(frameCount.current);
          frameCount.current = 0;
          fpsTimer.current = timestamp;
        }

        rafRef.current = requestAnimationFrame(detect);
      };

      rafRef.current = requestAnimationFrame(detect);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to initialize pose detection');
    }
  }, [enabled, videoRef]);

  useEffect(() => {
    if (!enabled) return;
    runDetection();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, runDetection]);

  return { landmarks, status, error, fps };
}

