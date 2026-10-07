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
