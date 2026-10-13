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
  ClipboardCheck,
  Network,
  SlidersHorizontal,
  ClipboardPaste,
} from 'lucide-react';

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Audit Universe', path: '/audit-universe', icon: 'Building2' },
  { label: 'Annual Audit Plan', path: '/audit-planning', icon: 'CalendarCheck' },
  { label: 'Risk Assessment', path: '/audit-risk-assessment', icon: 'ClipboardPaste' },
  { label: 'Control Testing', path: '/control-testing', icon: 'SlidersHorizontal' },
  { label: 'Audit Findings', path: '/findings', icon: 'Flag' },
  { label: 'Audit Engagements', path: '/engagements', icon: 'FolderKanban' },
  { label: 'Action Plans', path: '/action-plans', icon: 'CheckSquare' },
  { label: 'Assurance Map', path: '/assurance-map', icon: 'Network' },
  { label: 'Evidence Tracker', path: '/evidence-tracker', icon: 'FileText' },
  { label: 'Reports', path: '/reports', icon: 'BarChart3' },
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
  Network,
  ClipboardCheck,
  SlidersHorizontal,
  ClipboardPaste,
} as const;

export type IconName = keyof typeof iconMap;

export function getIcon(name: string) {
  return iconMap[name as IconName] ?? LayoutDashboard;
}
