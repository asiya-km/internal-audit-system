import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuditPlanningPage } from './pages/AuditPlanningPage';
import { AuditUniversePage } from './pages/AuditUniversePage';
import { EngagementsPage } from './pages/EngagementsPage';
import { EvidenceTrackerPage } from './pages/EvidenceTrackerPage';
import { FindingsPage } from './pages/FindingsPage';
import { ActionPlansPage } from './pages/ActionPlansPage';
import { AuditRiskAssessmentPage } from './pages/AuditRiskAssessment';
import { ControlTestingPage } from './pages/ControlTesting';
import { ReportsPage } from './pages/ReportsPage';
import { AdministrationPage } from './pages/AdministrationPage';
import { AssuranceMapPage } from './pages/AssuranceMapPage';
import { EmptyState } from './components/ui/EmptyState';
function LoginRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <LoginPage />;
}

function NotFoundPage() {
  return (
    <EmptyState
      title="Page Not Found"
      description="The page you are looking for does not exist or has been moved."
    />
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginRoute />} />

              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/audit-planning" element={<AuditPlanningPage />} />
                <Route path="/audit-universe" element={<AuditUniversePage />} />
                <Route path="/engagements" element={<EngagementsPage />} />
                <Route path="/evidence-tracker" element={<EvidenceTrackerPage />} />
                <Route path="/findings" element={<FindingsPage />} />
                <Route path="/audit-risk-assessment" element={<AuditRiskAssessmentPage />} />
                <Route path="/action-plans" element={<ActionPlansPage />} />
                <Route path="/control-testing" element={<ControlTestingPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/assurance-map" element={<AssuranceMapPage />} />
                <Route path="/administration" element={<AdministrationPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
