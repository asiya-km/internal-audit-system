import type { ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';
import type { AnalyticsPanel } from '@iams/shared';

interface ChartCardProps {
  panel: AnalyticsPanel;
  children: ReactNode;
}

export function ChartCard({ panel, children }: ChartCardProps) {
  const isAvailable = panel.availability === 'available';

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">{panel.title}</h3>
      </div>

      {isAvailable ? (
        <div className="h-64">{children}</div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <HelpCircle className="mb-3 h-8 w-8 text-neutral-300" />
          <p className="text-sm font-medium text-neutral-400">Not available yet</p>
          <p className="mt-1 max-w-xs text-xs text-neutral-400">{panel.description}</p>
        </div>
      )}
    </div>
  );
}
