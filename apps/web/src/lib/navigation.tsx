import type { NavItem } from '@iams/shared';
import {
  LayoutDashboard,
  CalendarCheck,
  Building2,
  FolderKanban,
  FileText,
  Flag,
  CheckSquare,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Settings,
} from 'lucide-react';

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Audit Planning', path: '/audit-planning', icon: 'CalendarCheck' },
  { label: 'Audit Universe', path: '/audit-universe', icon: 'Building2' },
  { label: 'Engagements', path: '/engagements', icon: 'FolderKanban' },
  { label: 'Working Papers', path: '/working-papers', icon: 'FileText' },
  { label: 'Findings', path: '/findings', icon: 'Flag' },
  { label: 'Corrective Actions', path: '/corrective-actions', icon: 'CheckSquare' },
  { label: 'Follow-up', path: '/follow-up', icon: 'RefreshCw' },
  { label: 'Reports', path: '/reports', icon: 'BarChart3' },
  { label: 'Analytics', path: '/analytics', icon: 'TrendingUp' },
  { label: 'Administration', path: '/administration', icon: 'Settings' },
];

const iconMap = {
  LayoutDashboard,
  CalendarCheck,
  Building2,
  FolderKanban,
  FileText,
  Flag,
  CheckSquare,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Settings,
} as const;

export type IconName = keyof typeof iconMap;

export function getIcon(name: string) {
  return iconMap[name as IconName] ?? LayoutDashboard;
}
