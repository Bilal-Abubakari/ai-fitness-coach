'use client';

import { useCheckout } from '../../hooks/useQueries';
import { SUBSCRIPTION_PLANS } from '@fitness/config';
import Link from 'next/link';

export default function SubscribePage() {
  const checkout = useCheckout();

  const plans = [
    { key: 'FREE' as const, ...SUBSCRIPTION_PLANS.FREE, cta: 'Get Started Free', disabled: true },
    { key: 'MONTHLY' as const, ...SUBSCRIPTION_PLANS.MONTHLY, cta: 'Subscribe Monthly' },
    { key: 'YEARLY' as const, ...SUBSCRIPTION_PLANS.YEARLY, cta: 'Subscribe Yearly', highlight: true },
  ];

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold">Simple, transparent pricing</h1>
          <p className="text-lg text-gray-400">Upgrade to unlock unlimited workouts and advanced AI coaching</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                (plan as { highlight?: boolean }).highlight
                  ? 'border-brand-500 bg-brand-500/5'
                  : 'border-gray-800 bg-gray-900'
              }`}
            >
              {(plan as { highlight?: boolean }).highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-brand-500 px-4 py-1 text-xs font-semibold text-white">
                    BEST VALUE
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="mb-1 text-xl font-bold">{plan.name}</h2>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price > 0 && (
                    <span className="mb-1 text-gray-400">
                      /{plan.key === 'MONTHLY' ? 'mo' : 'yr'}
                    </span>
                  )}
                </div>
                {plan.key === 'YEARLY' && (
                  <p className="mt-1 text-sm text-brand-400">Save ${(9.99 * 12 - plan.price).toFixed(2)}/year</p>
                )}
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="text-brand-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.key === 'FREE' ? (
                <Link
                  href="/auth/register"
                  className="block rounded-xl border border-gray-700 py-3 text-center font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  onClick={() => checkout.mutate(plan.key as 'MONTHLY' | 'YEARLY')}
                  disabled={checkout.isPending}
                  className={`w-full rounded-xl py-3 font-semibold transition disabled:opacity-50 ${
                    (plan as { highlight?: boolean }).highlight
                      ? 'bg-brand-500 text-white hover:bg-brand-600'
                      : 'border border-brand-500 text-brand-400 hover:bg-brand-500 hover:text-white'
                  }`}
                >
                  {checkout.isPending ? 'Redirecting...' : plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          All plans include a 7-day free trial. Cancel anytime. Payments secured by Stripe.
        </p>
      </div>
    </div>
  );
}

