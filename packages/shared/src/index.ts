// =============================================================================
// Shared API contracts and domain types for IAMS
// Used by both frontend and backend — no server-only imports here.
// =============================================================================

// ---- Generic API envelope ----

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ---- Auth ----

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserDto;
}

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  lastLoginAt: string | null;
  roles: RoleDto[];
  permissions: string[];
}

export interface RoleDto {
  id: string;
  name: string;
  description: string | null;
}

// ---- Health ----

export interface HealthResponse {
  status: 'ok' | 'degraded';
  timestamp: string;
  services: {
    database: 'connected' | 'disconnected';
  };
}

// ---- Navigation ----

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  permission?: string;
}

// ---- Dashboard ----

export type MetricAvailability = 'available' | 'not_available';

export interface KpiMetric {
  key: string;
  label: string;
  value: number | null;
  availability: MetricAvailability;
  description: string;
  trend?: { direction: 'up' | 'down' | 'flat'; percentage: number } | null;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  category?: string;
}

export interface AnalyticsPanel {
  key: string;
  title: string;
  availability: MetricAvailability;
  description: string;
  data: ChartDataPoint[];
  chartType: 'bar' | 'pie' | 'line' | 'heatmap' | 'calendar' | 'grouped-bar';
}

export interface PriorityItem {
  id: string;
  reference: string;
  title: string;
  owner: string;
  dueDate: string | null;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'overdue' | 'closed' | 'pending';
  sourceModule: string;
}

export interface TrendPoint {
  period: string;
  coverage: number;
  target: number;
}

export interface DashboardFilters {
  reportingYear?: string;
  auditCycle?: string;
  riskArea?: string;
  auditOwner?: string;
  status?: string;
}

export interface DashboardMetricsResponse {
  kpis: KpiMetric[];
  panels: AnalyticsPanel[];
  priorityItems: PriorityItem[];
  trend: {
    availability: MetricAvailability;
    data: TrendPoint[];
    description: string;
  };
  filterOptions: {
    reportingYears: string[];
    auditCycles: string[];
    riskAreas: string[];
    auditOwners: string[];
    statuses: string[];
  };
}
