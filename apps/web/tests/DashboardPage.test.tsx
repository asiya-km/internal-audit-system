import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardPage } from '../src/pages/DashboardPage';
import { AuthContext } from '../src/context/AuthContext';
import type { AuthContextValue } from '../src/context/AuthContext';

// Mock the dashboard metrics hook to return "not available" data
vi.mock('../src/hooks/useDashboardMetrics', () => ({
  useDashboardMetrics: () => ({
    data: {
      kpis: [
        { key: 'audit_universe', label: 'Audit Universe', value: null, availability: 'not_available', description: 'Total entities/processes in scope' },
        { key: 'audits_planned', label: 'Audits Planned', value: null, availability: 'not_available', description: 'Audits scheduled for the current cycle' },
        { key: 'audits_completed', label: 'Audits Completed', value: null, availability: 'not_available', description: 'Audits finished with report issued' },
        { key: 'open_findings', label: 'Open Findings', value: null, availability: 'not_available', description: 'Findings not yet remediated' },
        { key: 'overdue_actions', label: 'Overdue Actions', value: null, availability: 'not_available', description: 'Corrective actions past due date' },
        { key: 'assurance_coverage', label: 'Assurance Coverage', value: null, availability: 'not_available', description: 'Percentage of risk covered by assurance activities' },
      ],
      panels: [
        { key: 'universe_coverage', title: 'Audit Universe Coverage', availability: 'not_available', description: 'Coverage of auditable entities by status', data: [], chartType: 'bar' },
        { key: 'plan_calendar', title: 'Annual Plan Calendar', availability: 'not_available', description: 'Audit engagements scheduled across the year', data: [], chartType: 'calendar' },
        { key: 'control_testing', title: 'Control Testing Overview', availability: 'not_available', description: 'Control tests by pass/fail status', data: [], chartType: 'pie' },
        { key: 'finding_severity', title: 'Finding Severity', availability: 'not_available', description: 'Open findings grouped by severity rating', data: [], chartType: 'bar' },
        { key: 'action_aging', title: 'Management Action Aging', availability: 'not_available', description: 'Overdue and aging corrective actions', data: [], chartType: 'bar' },
        { key: 'assurance_coordination', title: 'Assurance Coordination', availability: 'not_available', description: 'Assurance provider coverage by risk area', data: [], chartType: 'heatmap' },
        { key: 'resource_allocation', title: 'Resource Allocation', availability: 'not_available', description: 'Auditor hours allocated across engagements', data: [], chartType: 'grouped-bar' },
        { key: 'remediation_progress', title: 'Remediation Progress', availability: 'not_available', description: 'Action plan completion over time', data: [], chartType: 'line' },
      ],
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
    },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

const mockAuthValue: AuthContextValue = {
  user: {
    id: 'test-id',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    isActive: true,
    lastLoginAt: null,
    roles: [],
    permissions: [],
  },
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
  hasPermission: vi.fn(),
  refreshUser: vi.fn(),
};

function renderDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuthValue}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </AuthContext.Provider>
    </QueryClientProvider>,
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the page title and welcome message', () => {
    renderDashboard();
    expect(screen.getByText('Executive Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/Welcome back, Test User/)).toBeInTheDocument();
  });

  it('should render all six KPI cards', () => {
    renderDashboard();
    expect(screen.getAllByText('Audit Universe').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Audits Planned').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Audits Completed').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Open Findings').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Overdue Actions').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Assurance Coverage/).length).toBeGreaterThanOrEqual(1);
  });

  it('should show "Not available yet" for all KPIs when no data source exists', () => {
    renderDashboard();
    const notAvailableElements = screen.getAllByText('Not available yet');
    // At least 6 KPI cards + 8 panels + 1 trend = 15
    expect(notAvailableElements.length).toBeGreaterThanOrEqual(6);
  });

  it('should render all eight analytics panel titles', () => {
    renderDashboard();
    expect(screen.getByText('Audit Universe Coverage')).toBeInTheDocument();
    expect(screen.getByText('Annual Plan Calendar')).toBeInTheDocument();
    expect(screen.getByText('Control Testing Overview')).toBeInTheDocument();
    expect(screen.getByText('Finding Severity')).toBeInTheDocument();
    expect(screen.getByText('Management Action Aging')).toBeInTheDocument();
    expect(screen.getByText('Assurance Coordination')).toBeInTheDocument();
    expect(screen.getByText('Resource Allocation')).toBeInTheDocument();
    expect(screen.getByText('Remediation Progress')).toBeInTheDocument();
  });

  it('should render the Assurance Coverage Trend panel', () => {
    renderDashboard();
    expect(screen.getByText('Assurance Coverage Trend')).toBeInTheDocument();
  });

  it('should render the Priority Audit Items section with empty state', () => {
    renderDashboard();
    expect(screen.getByText('Priority Audit Items')).toBeInTheDocument();
    expect(screen.getByText('No Priority Items')).toBeInTheDocument();
  });

  it('should render the Metric Definitions section', () => {
    renderDashboard();
    expect(screen.getByText('Metric Definitions')).toBeInTheDocument();
  });

  it('should render filter dropdowns', () => {
    renderDashboard();
    expect(screen.getByLabelText('Reporting Year')).toBeInTheDocument();
    expect(screen.getByLabelText('Audit Cycle')).toBeInTheDocument();
    expect(screen.getByLabelText('Risk Area')).toBeInTheDocument();
    expect(screen.getByLabelText('Audit Owner')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });
});
