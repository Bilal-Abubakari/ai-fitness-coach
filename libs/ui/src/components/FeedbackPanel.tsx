import React from 'react';
import { FeedbackMessage } from '@fitness/types';

interface FeedbackPanelProps {
  feedback: FeedbackMessage[];
  repCount: number;
  phase: string;
  className?: string;
}

const severityStyles: Record<FeedbackMessage['type'], string> = {
  ok: 'bg-green-500/20 border-green-500 text-green-300',
  warning: 'bg-yellow-500/20 border-yellow-500 text-yellow-300',
  error: 'bg-red-500/20 border-red-500 text-red-300',
};

const severityIcons: Record<FeedbackMessage['type'], string> = {
  ok: '✓',
  warning: '⚠',
  error: '✗',
};

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  feedback,
  repCount,
  phase,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Stats */}
      <div className="flex gap-4">
        <div className="flex-1 rounded-xl bg-gray-800/80 p-4 text-center backdrop-blur-sm">
          <div className="text-4xl font-bold text-white">{repCount}</div>
          <div className="mt-1 text-sm text-gray-400">Reps</div>
        </div>
        <div className="flex-1 rounded-xl bg-gray-800/80 p-4 text-center backdrop-blur-sm">
          <div className="text-xl font-semibold text-blue-400">{phase}</div>
          <div className="mt-1 text-sm text-gray-400">Phase</div>
        </div>
      </div>

      {/* Feedback Messages */}
      <div className="flex flex-col gap-2">
        {feedback.length === 0 ? (
          <div className="rounded-xl border border-gray-700 bg-gray-800/60 px-4 py-3 text-gray-400 backdrop-blur-sm">
            Get into position to start your workout
          </div>
        ) : (
          feedback.map((msg, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 backdrop-blur-sm ${severityStyles[msg.type]}`}
            >
              <span className="text-lg font-bold">{severityIcons[msg.type]}</span>
              <span className="text-sm">{msg.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

