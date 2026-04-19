'use client';

import Link from 'next/link';
import { useCurrentUser, useWorkoutProgress, useWorkoutSessions, useLogout } from '../../hooks/useQueries';
import { useRouter } from 'next/navigation';

export function DashboardView() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: progress } = useWorkoutProgress();
  const { data: sessions } = useWorkoutSessions();
  const logout = useLogout();

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.push('/');
  };

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const stats = [
    { label: 'Total Sessions', value: progress?.totalSessions ?? 0 },
    { label: 'Total Reps', value: progress?.totalReps ?? 0 },
    {
      label: 'Total Time',
      value: `${Math.floor((progress?.totalDurationSeconds ?? 0) / 60)}m`,
    },
    { label: 'This Week', value: progress?.weeklyReps?.reduce((a, b) => a + b, 0) ?? 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user.email}</span>
            <Link
              href="/coach"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Start Workout
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="mb-2 text-2xl font-bold">
          Welcome back, {user.name ?? user.email.split('@')[0]} 👋
        </h2>
        <p className="mb-8 text-gray-400">Here's your fitness progress</p>

        {/* Stats grid */}
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
              <div className="text-3xl font-bold text-white">{s.value}</div>
              <div className="mt-1 text-sm text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent sessions */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Recent Sessions</h3>
          {!sessions || sessions.content.length === 0 ? (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-10 text-center text-gray-500">
              No sessions yet.{' '}
              <Link href="/coach" className="text-brand-500 hover:underline">
                Start your first workout!
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-800">
              <table className="w-full text-sm">
                <thead className="bg-gray-900 text-left text-gray-400">
                  <tr>
                    {['Exercise', 'Reps', 'Duration', 'Date'].map((h) => (
                      <th key={h} className="px-5 py-3 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {sessions.content.map((s) => (
                    <tr key={s.id} className="bg-gray-950 hover:bg-gray-900">
                      <td className="px-5 py-3 capitalize">{s.exerciseType}</td>
                      <td className="px-5 py-3">{s.repCount}</td>
                      <td className="px-5 py-3">{s.durationSeconds}s</td>
                      <td className="px-5 py-3 text-gray-400">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Subscription CTA */}
        {user.subscription?.plan === 'FREE' && (
          <div className="mt-10 rounded-2xl border border-brand-500/30 bg-brand-500/10 p-6">
            <h3 className="mb-1 text-lg font-semibold text-brand-400">Upgrade to Pro</h3>
            <p className="mb-4 text-sm text-gray-400">
              Unlock unlimited workouts, advanced feedback, and voice coaching.
            </p>
            <Link
              href="/subscribe"
              className="inline-block rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
            >
              View Plans →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

