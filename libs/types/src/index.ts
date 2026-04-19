// Pose Detection Types
export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface PoseResult {
  landmarks: PoseLandmark[];
  worldLandmarks?: PoseLandmark[];
  timestamp: number;
}

// Exercise Analysis Types
export type ExerciseType = 'squat' | 'pushup' | 'lunge' | 'deadlift';

export type SquatPhase = 'STANDING' | 'DESCENDING' | 'BOTTOM' | 'ASCENDING';

export type FeedbackSeverity = 'ok' | 'warning' | 'error';

export interface FeedbackMessage {
  type: FeedbackSeverity;
  text: string;
  bodyPart: string;
}

export interface SquatAnalysis {
  phase: SquatPhase;
  repCount: number;
  kneeAngle: number;
  hipAngle: number;
  backAngle: number;
  feedback: FeedbackMessage[];
}

export interface ExerciseAnalysis {
  exerciseType: ExerciseType;
  repCount: number;
  phase: string;
  feedback: FeedbackMessage[];
  metrics: Record<string, number>;
}

// Workout Types
export interface WorkoutSession {
  id: string;
  userId: string;
  exerciseType: ExerciseType;
  repCount: number;
  durationSeconds: number;
  feedback: FeedbackMessage[];
  createdAt: string;
}

export interface WorkoutSessionCreate {
  exerciseType: ExerciseType;
  repCount: number;
  durationSeconds: number;
  feedback: FeedbackMessage[];
}

export interface WorkoutProgress {
  totalSessions: number;
  totalReps: number;
  totalDurationSeconds: number;
  lastSessionAt?: string;
  weeklyReps: number[];
}

// User Types
export type UserRole = 'USER' | 'ADMIN';
export type SubscriptionPlan = 'FREE' | 'MONTHLY' | 'YEARLY';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  subscription?: Subscription;
  createdAt: string;
}

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// API Types
export interface ApiError {
  status: number;
  title: string;
  detail: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

