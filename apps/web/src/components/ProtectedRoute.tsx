import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FullPageSpinner } from './ui/Spinner';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, refreshUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (loading && user === null) {
      refreshUser();
    }
  }, [loading, user, refreshUser]);

  if (loading) {
    return <FullPageSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
