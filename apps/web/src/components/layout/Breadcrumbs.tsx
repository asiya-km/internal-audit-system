import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { navItems } from '../../lib/navigation';

export function Breadcrumbs() {
  const { pathname } = useLocation();

  const current = navItems.find((item) => item.path === pathname);

  if (!current) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
      <Link to="/dashboard" className="text-neutral-500 hover:text-neutral-700">
        Home
      </Link>
      <ChevronRight className="h-4 w-4 text-neutral-300" />
      <span className="font-medium text-neutral-900">{current.label}</span>
    </nav>
  );
}
