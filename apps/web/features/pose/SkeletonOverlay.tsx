'use client';

import { useEffect, useRef } from 'react';
import { PoseLandmark } from '@fitness/types';
import { POSE_CONNECTIONS } from '@fitness/config';

interface SkeletonOverlayProps {
  landmarks: PoseLandmark[];
  videoRef: React.RefObject<HTMLVideoElement>;
}

const KEYPOINT_RADIUS = 5;
const CONNECTION_WIDTH = 2;
const KEYPOINT_COLOR = '#22c55e';
const CONNECTION_COLOR = 'rgba(34, 197, 94, 0.7)';
const LOW_CONFIDENCE_COLOR = 'rgba(234, 179, 8, 0.5)';
const CONFIDENCE_THRESHOLD = 0.5;

export function SkeletonOverlay({ landmarks, videoRef }: SkeletonOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match canvas to video dimensions
    canvas.width = video.videoWidth || video.clientWidth;
    canvas.height = video.videoHeight || video.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!landmarks || landmarks.length === 0) return;

    const w = canvas.width;
    const h = canvas.height;

    // Draw connections
    ctx.lineWidth = CONNECTION_WIDTH;
    for (const [startIdx, endIdx] of POSE_CONNECTIONS) {
      const start = landmarks[startIdx];
      const end = landmarks[endIdx];
      if (!start || !end) continue;

      const startConf = start.visibility ?? 1;
      const endConf = end.visibility ?? 1;
      if (startConf < 0.3 || endConf < 0.3) continue;

      ctx.strokeStyle =
        startConf >= CONFIDENCE_THRESHOLD && endConf >= CONFIDENCE_THRESHOLD
          ? CONNECTION_COLOR
          : LOW_CONFIDENCE_COLOR;

      ctx.beginPath();
      ctx.moveTo(start.x * w, start.y * h);
      ctx.lineTo(end.x * w, end.y * h);
      ctx.stroke();
    }

    // Draw keypoints
    for (const landmark of landmarks) {
      const confidence = landmark.visibility ?? 1;
      if (confidence < 0.3) continue;

      ctx.fillStyle =
        confidence >= CONFIDENCE_THRESHOLD ? KEYPOINT_COLOR : LOW_CONFIDENCE_COLOR;
      ctx.beginPath();
      ctx.arc(landmark.x * w, landmark.y * h, KEYPOINT_RADIUS, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, [landmarks, videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="skeleton-overlay pointer-events-none"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    />
  );
}

