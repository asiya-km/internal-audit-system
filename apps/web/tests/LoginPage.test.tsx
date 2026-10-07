import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';
import { ToastProvider } from '../src/context/ToastContext';
import { LoginPage } from '../src/pages/LoginPage';

vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid',
});

function renderWithProviders(ui: React.ReactNode) {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <ToastProvider>{ui}</ToastProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('LoginPage', () => {
  it('should render the sign-in form', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Development Credentials')).toBeInTheDocument();
  });

  it('should display the IAMS branding', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText('IAMS')).toBeInTheDocument();
    expect(
      screen.getByText('Internal Audit Management System'),
    ).toBeInTheDocument();
  });
});
