export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
  },
  USERS: {
    ME: '/api/users/me',
    UPDATE: '/api/users/me',
  },
  WORKOUTS: {
    SESSIONS: '/api/workouts/sessions',
    PROGRESS: '/api/workouts/progress',
  },
  SUBSCRIPTIONS: {
    CHECKOUT: '/api/subscriptions/checkout',
    PORTAL: '/api/subscriptions/portal',
    STATUS: '/api/subscriptions/status',
  },
} as const;

export const EXERCISE_CONFIG = {
  squat: {
    name: 'Squat',
    description: 'Barbell or bodyweight squat',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    keyAngles: {
      knee: { optimal: [80, 100], warning: [70, 110], label: 'Knee Angle' },
      hip: { optimal: [70, 110], warning: [60, 120], label: 'Hip Angle' },
      back: { optimal: [0, 30], warning: [0, 45], label: 'Back Lean' },
    },
  },
  pushup: {
    name: 'Push-up',
    description: 'Standard push-up',
    targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
    keyAngles: {
      elbow: { optimal: [80, 100], warning: [70, 110], label: 'Elbow Angle' },
      back: { optimal: [0, 15], warning: [0, 25], label: 'Back Alignment' },
    },
  },
  lunge: {
    name: 'Lunge',
    description: 'Forward or reverse lunge',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hip Flexors'],
    keyAngles: {
      frontKnee: { optimal: [85, 95], warning: [80, 100], label: 'Front Knee' },
      backKnee: { optimal: [85, 95], warning: [80, 100], label: 'Back Knee' },
    },
  },
} as const;

export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: ['5 workouts/month', 'Basic feedback', 'Rep counting'],
  },
  MONTHLY: {
    name: 'Pro Monthly',
    price: 9.99,
    stripePriceId: process.env['NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID'] ?? '',
    features: ['Unlimited workouts', 'Advanced AI feedback', 'Progress analytics', 'Voice coaching'],
  },
  YEARLY: {
    name: 'Pro Yearly',
    price: 79.99,
    stripePriceId: process.env['NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID'] ?? '',
    features: ['Everything in Monthly', '2 months free', 'Priority support'],
  },
} as const;

export const MEDIAPIPE_CONFIG = {
  modelPath: '/mediapipe/pose_landmarker_full.task',
  runningMode: 'VIDEO' as const,
  numPoses: 1,
  minPoseDetectionConfidence: 0.5,
  minPosePresenceConfidence: 0.5,
  minTrackingConfidence: 0.5,
};

export const POSE_CONNECTIONS = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
  [11, 23], [12, 24], [23, 24],
  [23, 25], [25, 27], [24, 26], [26, 28],
  [27, 29], [27, 31], [28, 30], [28, 32],
] as const;

