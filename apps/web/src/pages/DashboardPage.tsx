import { useMemo, useState } from 'react';
import {
  Building2,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Target,
  Flag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { KpiCard } from '../components/dashboard/KpiCard';
import { ChartCard } from '../components/dashboard/ChartCard';
import { FilterBar } from '../components/dashboard/FilterBar';
import { PriorityTable } from '../components/dashboard/PriorityTable';
import { TrendPanel } from '../components/dashboard/TrendPanel';
import { ErrorState } from '../components/ui/ErrorState';
import { PageLoading } from '../components/ui/Spinner';
import type { DashboardFilters, KpiMetric } from '@iams/shared';

const KPI_ICONS: Record<string, { icon: typeof Building2; color: string }> = {
  audit_universe: { icon: Building2, color: 'text-primary-600' },
  audits_planned: { icon: CalendarCheck, color: 'text-primary-600' },
  audits_completed: { icon: CheckCircle2, color: 'text-success-600' },
  open_findings: { icon: Flag, color: 'text-error-600' },
  overdue_actions: { icon: AlertTriangle, color: 'text-warning-600' },
  assurance_coverage: { icon: ShieldCheck, color: 'text-primary-600' },
};

export function DashboardPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<DashboardFilters>({});
  const { data, isLoading, isError, refetch } = useDashboardMetrics(filters);

  const kpiMetrics = useMemo<KpiMetric[]>(() => {
    if (!data) return [];
    return data.kpis;
  }, [data]);

  const panels = data?.panels ?? [];

  if (isLoading) return <PageLoading />;

  if (isError) {
    return <ErrorState message="Failed to load dashboard metrics" onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-neutral-900">Executive Dashboard</h1>
        <p className="text-sm text-neutral-500">
          Welcome back, {user?.firstName} {user?.lastName}. Here is an overview of the
          internal audit activity.
        </p>
      </div>

      {/* Header filters */}
      <FilterBar
        filters={filters}
        filterOptions={data?.filterOptions ?? { reportingYears: [], auditCycles: [], riskAreas: [], auditOwners: [], statuses: [] }}
        onChange={setFilters}
      />

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpiMetrics.map((metric) => {
          const config = KPI_ICONS[metric.key] ?? { icon: Target, color: 'text-primary-600' };
          const Icon = config.icon;
          return (
            <KpiCard
              key={metric.key}
              metric={metric}
              icon={<Icon className="h-5 w-5" />}
              accentColor={config.color}
            />
          );
        })}
      </div>

      {/* Analytics panels — first row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {panels.slice(0, 4).map((panel) => (
          <ChartCard key={panel.key} panel={panel}>
            {/* Chart rendering will be connected when data becomes available */}
            {null}
          </ChartCard>
        ))}
      </div>

      {/* Analytics panels — second row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {panels.slice(4).map((panel) => (
          <ChartCard key={panel.key} panel={panel}>
            {null}
          </ChartCard>
        ))}
      </div>

      {/* Trend panel */}
      <TrendPanel
        availability={data?.trend.availability ?? 'not_available'}
        data={data?.trend.data ?? []}
        description={data?.trend.description ?? 'Trend data not available yet.'}
      />

      {/* Priority audit items table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Priority Audit Items</h2>
        </div>
        <PriorityTable items={data?.priorityItems ?? []} />
      </div>

      {/* Metric definitions */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-neutral-900">Metric Definitions</h3>
        <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-neutral-700">Audit Universe</dt>
            <dd className="text-xs text-neutral-500">Total number of auditable entities and processes identified for the organization.</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-neutral-700">Audits Planned</dt>
            <dd className="text-xs text-neutral-500">Number of audit engagements scheduled in the current annual audit plan cycle.</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-neutral-700">Audits Completed</dt>
            <dd className="text-xs text-neutral-500">Engagements where fieldwork is finished and the final report has been issued.</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-neutral-700">Open Findings</dt>
            <dd className="text-xs text-neutral-500">Audit findings that have not yet been remediated or formally closed.</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-neutral-700">Overdue Actions</dt>
            <dd className="text-xs text-neutral-500">Corrective actions past their agreed-upon due date without closure.</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-neutral-700">Assurance Coverage</dt>
            <dd className="text-xs text-neutral-500">Percentage of key risks covered by at least one assurance activity.</dd>
          </div>
        </dl>
        <div className="mt-4 rounded-lg bg-neutral-50 p-3">
          <p className="text-xs text-neutral-500">
            Metrics show "Not available yet" when their source module has not been implemented.
            Values will populate automatically as audit modules are completed and data is entered.
            Zero is shown only when a functioning data source has been queried and returned no records.
          </p>
        </div>
      </div>
    </div>
  );
}
