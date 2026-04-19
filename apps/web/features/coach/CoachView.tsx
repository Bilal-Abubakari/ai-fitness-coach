'use client';

import { useState, useEffect } from 'react';
import { useWebcam } from './useWebcam';
import { usePoseDetection } from '../pose/usePoseDetection';
import { useSquatAnalysis } from './useSquatAnalysis';
import { useSpeechFeedback } from './useSpeechFeedback';
import { SkeletonOverlay } from '../pose/SkeletonOverlay';
import { FeedbackPanel } from '@fitness/ui';
import { AngleDisplay } from '@fitness/ui';

export function CoachView() {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showAngles, setShowAngles] = useState(true);

  const { videoRef, isActive, error: camError, startCamera, stopCamera } = useWebcam();
  const { landmarks, status, fps } = usePoseDetection({ videoRef, enabled: isActive });
  const analysis = useSquatAnalysis(landmarks);
  const { speak } = useSpeechFeedback();

  useEffect(() => {
    if (voiceEnabled) speak(analysis.feedback);
  }, [analysis.feedback, voiceEnabled, speak]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <a href="/" className="text-gray-400 hover:text-white">← Back</a>
          <h1 className="text-xl font-bold">Squat Coach</h1>
        </div>
        <div className="flex items-center gap-3">
          {isActive && (
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              {fps} FPS
            </span>
          )}
          <button
            onClick={() => setShowAngles((v) => !v)}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${showAngles ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            Angles
          </button>
          <button
            onClick={() => setVoiceEnabled((v) => !v)}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${voiceEnabled ? 'bg-brand-600 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            🔊 Voice
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 lg:flex-row">
        {/* Video + Skeleton */}
        <div className="relative flex-1 overflow-hidden rounded-2xl bg-gray-900">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
            playsInline
            muted
          />

          {isActive && <SkeletonOverlay landmarks={landmarks} videoRef={videoRef} />}

          {/* Phase badge overlay */}
          {isActive && (
            <div className="absolute left-4 top-4">
              <span className="rounded-lg bg-black/60 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
                {analysis.phase}
              </span>
            </div>
          )}

          {/* Angle display overlay */}
          {isActive && (
            <div className="absolute bottom-4 left-4">
              <AngleDisplay
                kneeAngle={analysis.kneeAngle}
                hipAngle={analysis.hipAngle}
                backAngle={analysis.backAngle}
                visible={showAngles}
              />
            </div>
          )}

          {/* Loading overlay */}
          {isActive && status === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="text-center">
                <div className="mb-3 h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent mx-auto" />
                <p className="text-sm text-gray-300">Loading AI model...</p>
              </div>
            </div>
          )}

          {/* Start camera prompt */}
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-6xl">📷</div>
                <h2 className="mb-2 text-xl font-semibold">Ready to coach?</h2>
                <p className="mb-6 text-gray-400">Allow camera access to start your session</p>
                {camError && (
                  <p className="mb-4 rounded-lg bg-red-900/50 px-4 py-2 text-sm text-red-300">
                    {camError}
                  </p>
                )}
                <button
                  onClick={startCamera}
                  className="rounded-xl bg-brand-500 px-8 py-3 font-semibold text-white transition hover:bg-brand-600"
                >
                  Start Camera
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex w-full flex-col gap-4 lg:w-80">
          <FeedbackPanel
            feedback={analysis.feedback}
            repCount={analysis.repCount}
            phase={analysis.phase}
          />

          {isActive && (
            <button
              onClick={stopCamera}
              className="rounded-xl border border-red-800 bg-red-900/30 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-900/50"
            >
              Stop Session
            </button>
          )}

          {/* Tips */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-300">Squat Tips</h3>
            <ul className="space-y-2 text-xs text-gray-500">
              <li>• Stand ~2m from your device</li>
              <li>• Ensure full body is visible</li>
              <li>• Good lighting improves accuracy</li>
              <li>• Feet shoulder-width apart</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

