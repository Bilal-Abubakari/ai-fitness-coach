'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, usersApi, workoutsApi, subscriptionsApi } from '../lib/api';
import { LoginRequest, RegisterRequest, WorkoutSessionCreate } from '@fitness/types';

// ---- Auth hooks ----
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: usersApi.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (res) => {
      localStorage.setItem('accessToken', res.tokens.accessToken);
      localStorage.setItem('refreshToken', res.tokens.refreshToken);
      qc.setQueryData(['currentUser'], res.user);
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (res) => {
      localStorage.setItem('accessToken', res.tokens.accessToken);
      localStorage.setItem('refreshToken', res.tokens.refreshToken);
      qc.setQueryData(['currentUser'], res.user);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      qc.clear();
    },
  });
}

// ---- Workout hooks ----
export function useWorkoutSessions(page = 0) {
  return useQuery({
    queryKey: ['workoutSessions', page],
    queryFn: () => workoutsApi.getSessions(page),
  });
}

export function useWorkoutProgress() {
  return useQuery({
    queryKey: ['workoutProgress'],
    queryFn: workoutsApi.getProgress,
  });
}

export function useSaveWorkoutSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkoutSessionCreate) => workoutsApi.createSession(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workoutSessions'] });
      qc.invalidateQueries({ queryKey: ['workoutProgress'] });
    },
  });
}

// ---- Subscription hooks ----
export function useCheckout() {
  return useMutation({
    mutationFn: (plan: 'MONTHLY' | 'YEARLY') => subscriptionsApi.createCheckoutSession(plan),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });
}

