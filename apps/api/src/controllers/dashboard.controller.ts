import type { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/response.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { DashboardMetricsResponse, DashboardFilters, KpiMetric, AnalyticsPanel } from '@iams/shared';

const ALL_KPIS: KpiMetric[] = [
  { key: 'audit_universe', label: 'Audit Universe', value: null, availability: 'not_available', description: 'Total entities/processes in scope' },
  { key: 'audits_planned', label: 'Audits Planned', value: null, availability: 'not_available', description: 'Audits scheduled for the current cycle' },
  { key: 'audits_completed', label: 'Audits Completed', value: null, availability: 'not_available', description: 'Audits finished with report issued' },
  { key: 'open_findings', label: 'Open Findings', value: null, availability: 'not_available', description: 'Findings not yet remediated' },
  { key: 'overdue_actions', label: 'Overdue Actions', value: null, availability: 'not_available', description: 'Corrective actions past due date' },
  { key: 'assurance_coverage', label: 'Assurance Coverage', value: null, availability: 'not_available', description: 'Percentage of risk covered by assurance activities' },
];

const ALL_PANELS: AnalyticsPanel[] = [
  { key: 'universe_coverage', title: 'Audit Universe Coverage', availability: 'not_available', description: 'Coverage of auditable entities by status', data: [], chartType: 'bar' },
  { key: 'plan_calendar', title: 'Annual Plan Calendar', availability: 'not_available', description: 'Audit engagements scheduled across the year', data: [], chartType: 'calendar' },
  { key: 'control_testing', title: 'Control Testing Overview', availability: 'not_available', description: 'Control tests by pass/fail status', data: [], chartType: 'pie' },
  { key: 'finding_severity', title: 'Finding Severity', availability: 'not_available', description: 'Open findings grouped by severity rating', data: [], chartType: 'bar' },
  { key: 'action_aging', title: 'Management Action Aging', availability: 'not_available', description: 'Overdue and aging corrective actions', data: [], chartType: 'bar' },
  { key: 'assurance_coordination', title: 'Assurance Coordination', availability: 'not_available', description: 'Assurance provider coverage by risk area', data: [], chartType: 'heatmap' },
  { key: 'resource_allocation', title: 'Resource Allocation', availability: 'not_available', description: 'Auditor hours allocated across engagements', data: [], chartType: 'grouped-bar' },
  { key: 'remediation_progress', title: 'Remediation Progress', availability: 'not_available', description: 'Action plan completion over time', data: [], chartType: 'line' },
];

function buildNotAvailableResponse(_filters: DashboardFilters): DashboardMetricsResponse {
  return {
    kpis: ALL_KPIS,
    panels: ALL_PANELS,
    priorityItems: [],
    trend: {
      availability: 'not_available',
      data: [],
      description: 'Assurance coverage trend requires historical engagement data across multiple audit cycles.',
    },
    filterOptions: {
      reportingYears: [],
      auditCycles: [],
      riskAreas: [],
      auditOwners: [],
      statuses: [],
    },
  };
}

export async function getDashboardMetrics(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const filters: DashboardFilters = {
      reportingYear: req.query.reportingYear as string | undefined,
      auditCycle: req.query.auditCycle as string | undefined,
      riskArea: req.query.riskArea as string | undefined,
      auditOwner: req.query.auditOwner as string | undefined,
      status: req.query.status as string | undefined,
    };

    // No business domain models exist yet — return not_available for all metrics.
    // When models are added, replace this with real Prisma queries filtered by
    // the provided DashboardFilters and scoped to the user's permissions.
    const data = buildNotAvailableResponse(filters);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}
