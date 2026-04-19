import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-500">
          AI-Powered • Real-time • Client-side
        </div>
        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
          Your Personal{' '}
          <span className="bg-gradient-to-r from-brand-400 to-emerald-300 bg-clip-text text-transparent">
            AI Fitness Coach
          </span>
        </h1>
        <p className="mb-10 text-xl text-gray-400">
          Real-time form correction using your webcam. No cloud processing — all analysis runs
          on-device for instant feedback.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/coach"
            className="rounded-xl bg-brand-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-brand-600"
          >
            Start Coaching →
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-gray-700 px-8 py-4 text-lg font-semibold text-gray-300 transition hover:border-gray-500 hover:text-white"
          >
            View Progress
          </Link>
        </div>
      </div>

      {/* Feature grid */}
      <div className="mt-24 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            icon: '🎯',
            title: 'Real-time Feedback',
            desc: 'Instant form corrections as you exercise using MediaPipe pose estimation',
          },
          {
            icon: '📊',
            title: 'Progress Tracking',
            desc: 'Track reps, sets, and improvements over time with detailed analytics',
          },
          {
            icon: '🔒',
            title: 'Privacy First',
            desc: 'All AI processing happens locally in your browser — your video never leaves your device',
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm"
          >
            <div className="mb-3 text-3xl">{f.icon}</div>
            <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
            <p className="text-sm text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

