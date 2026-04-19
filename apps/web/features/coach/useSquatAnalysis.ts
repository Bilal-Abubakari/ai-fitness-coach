'use client';

import { useEffect, useRef, useState } from 'react';
import { SquatAnalysis, PoseLandmark } from '@fitness/types';
import { SquatAnalyzer } from '@fitness/utils';

export function useSquatAnalysis(landmarks: PoseLandmark[]): SquatAnalysis {
  const analyzerRef = useRef(new SquatAnalyzer());
  const [analysis, setAnalysis] = useState<SquatAnalysis>({
    phase: 'STANDING',
    repCount: 0,
    kneeAngle: 180,
    hipAngle: 180,
    backAngle: 0,
    feedback: [],
  });

  useEffect(() => {
    if (landmarks.length > 0) {
      const result = analyzerRef.current.analyze(landmarks);
      setAnalysis(result);
    }
  }, [landmarks]);

  return analysis;
}

