import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { DashboardMetricsResponse, DashboardFilters } from '@iams/shared';

export function useDashboardMetrics(filters: DashboardFilters) {
  const params = new URLSearchParams();
  if (filters.reportingYear) params.set('reportingYear', filters.reportingYear);
  if (filters.auditCycle) params.set('auditCycle', filters.auditCycle);
  if (filters.riskArea) params.set('riskArea', filters.riskArea);
  if (filters.auditOwner) params.set('auditOwner', filters.auditOwner);
  if (filters.status) params.set('status', filters.status);

  const queryString = params.toString();
  const path = `/dashboard/metrics${queryString ? `?${queryString}` : ''}`;

  return useQuery<DashboardMetricsResponse>({
    queryKey: ['dashboard-metrics', filters],
    queryFn: () => api.getDashboardMetrics(path),
    staleTime: 60_000,
    retry: 1,
  });
}
