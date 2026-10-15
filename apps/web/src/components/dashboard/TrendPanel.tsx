import { TrendingUp, HelpCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { TrendPoint } from '@iams/shared';

interface TrendPanelProps {
  availability: 'available' | 'not_available';
  data: TrendPoint[];
  description: string;
}

export function TrendPanel({ availability, data, description }: TrendPanelProps) {
  const isAvailable = availability === 'available' && data.length > 0;

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">Assurance Coverage Trend</h3>
        <TrendingUp className="h-4 w-4 text-neutral-400" />
      </div>

      {isAvailable ? (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 12, fill: '#64748b' }}
                stroke="#cbd5e1"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: '#64748b' }}
                stroke="#cbd5e1"
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />
              <ReferenceLine
                y={data[0]?.target ?? 80}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                label={{ value: 'Target', fontSize: 11, fill: '#d97706' }}
              />
              <Line
                type="monotone"
                dataKey="coverage"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4, fill: '#2563eb' }}
                name="Coverage"
                unit="%"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-72 flex-col items-center justify-center text-center">
          <HelpCircle className="mb-3 h-8 w-8 text-neutral-300" />
          <p className="text-sm font-medium text-neutral-400">Not available yet</p>
          <p className="mt-1 max-w-sm text-xs text-neutral-400">{description}</p>
        </div>
      )}
    </div>
  );
}
