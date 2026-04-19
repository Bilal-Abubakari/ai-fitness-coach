import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 60_000 } },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#030712' },
            headerTintColor: '#fff',
            contentStyle: { backgroundColor: '#030712' },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'AI Fitness Coach' }} />
          <Stack.Screen name="coach" options={{ title: 'Coach', headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ title: 'Sign In' }} />
          <Stack.Screen name="auth/register" options={{ title: 'Create Account' }} />
          <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

