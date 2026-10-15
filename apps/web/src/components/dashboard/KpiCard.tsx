import type { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, HelpCircle } from 'lucide-react';
import type { KpiMetric } from '@iams/shared';

interface KpiCardProps {
  metric: KpiMetric;
  icon: ReactNode;
  accentColor?: string;
}

export function KpiCard({ metric, icon, accentColor = 'text-primary-600' }: KpiCardProps) {
  const isAvailable = metric.availability === 'available';

  return (
    <div className="card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-50 ${accentColor}`}>
          {icon}
        </div>
        {isAvailable && metric.trend && (
          <span
            className={`flex items-center gap-0.5 text-xs font-medium ${
              metric.trend.direction === 'up'
                ? 'text-success-600'
                : metric.trend.direction === 'down'
                  ? 'text-error-600'
                  : 'text-neutral-500'
            }`}
          >
            {metric.trend.direction === 'up' && <ArrowUpRight className="h-3.5 w-3.5" />}
            {metric.trend.direction === 'down' && <ArrowDownRight className="h-3.5 w-3.5" />}
            {metric.trend.direction === 'flat' && <Minus className="h-3.5 w-3.5" />}
            {metric.trend.percentage}%
          </span>
        )}
      </div>

      <p className="mt-4 text-sm text-neutral-500">{metric.label}</p>

      {isAvailable ? (
        <p className="mt-1.5 text-3xl font-bold text-neutral-900">
          {metric.value?.toLocaleString() ?? '0'}
        </p>
      ) : (
        <div className="mt-1.5 flex items-center gap-1.5">
          <HelpCircle className="h-5 w-5 text-neutral-300" />
          <span className="text-sm font-medium text-neutral-400">Not available yet</span>
        </div>
      )}

      <p className="mt-2 text-xs text-neutral-400">{metric.description}</p>
    </div>
  );
}
