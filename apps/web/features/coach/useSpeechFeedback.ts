'use client';

import { useCallback, useRef } from 'react';
import { FeedbackMessage } from '@fitness/types';

export function useSpeechFeedback() {
  const lastSpokenRef = useRef<string>('');
  const lastSpokenTimeRef = useRef<number>(0);

  const speak = useCallback((feedback: FeedbackMessage[]) => {
    if (!('speechSynthesis' in window)) return;

    const errors = feedback.filter((f) => f.type === 'error');
    const warnings = feedback.filter((f) => f.type === 'warning');
    const priority = errors.length > 0 ? errors : warnings;

    if (priority.length === 0) return;

    const text = priority[0].text;
    const now = Date.now();

    // Debounce - don't repeat same message within 4 seconds
    if (text === lastSpokenRef.current && now - lastSpokenTimeRef.current < 4000) return;

    lastSpokenRef.current = text;
    lastSpokenTimeRef.current = now;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
}

