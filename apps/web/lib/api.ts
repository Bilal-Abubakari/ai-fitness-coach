import { apiClient } from '../lib/apiClient';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  WorkoutSession,
  WorkoutSessionCreate,
  WorkoutProgress,
  PaginatedResponse,
} from '@fitness/types';
import { API_ENDPOINTS } from '@fitness/config';

// Auth
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    return res.data;
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    return res.data;
  },
  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
};

// Users
export const usersApi = {
  getMe: async (): Promise<User> => {
    const res = await apiClient.get<User>(API_ENDPOINTS.USERS.ME);
    return res.data;
  },
};

// Workouts
export const workoutsApi = {
  getSessions: async (page = 0, size = 20): Promise<PaginatedResponse<WorkoutSession>> => {
    const res = await apiClient.get<PaginatedResponse<WorkoutSession>>(
      API_ENDPOINTS.WORKOUTS.SESSIONS,
      { params: { page, size } },
    );
    return res.data;
  },
  createSession: async (data: WorkoutSessionCreate): Promise<WorkoutSession> => {
    const res = await apiClient.post<WorkoutSession>(API_ENDPOINTS.WORKOUTS.SESSIONS, data);
    return res.data;
  },
  getProgress: async (): Promise<WorkoutProgress> => {
    const res = await apiClient.get<WorkoutProgress>(API_ENDPOINTS.WORKOUTS.PROGRESS);
    return res.data;
  },
};

// Subscriptions
export const subscriptionsApi = {
  createCheckoutSession: async (plan: 'MONTHLY' | 'YEARLY'): Promise<{ url: string }> => {
    const res = await apiClient.post<{ url: string }>(API_ENDPOINTS.SUBSCRIPTIONS.CHECKOUT, {
      plan,
    });
    return res.data;
  },
  getPortalUrl: async (): Promise<{ url: string }> => {
    const res = await apiClient.post<{ url: string }>(API_ENDPOINTS.SUBSCRIPTIONS.PORTAL);
    return res.data;
  },
};

