import { ChevronDown } from 'lucide-react';
import type { DashboardFilters } from '@iams/shared';

interface FilterBarProps {
  filters: DashboardFilters;
  filterOptions: {
    reportingYears: string[];
    auditCycles: string[];
    riskAreas: string[];
    auditOwners: string[];
    statuses: string[];
  };
  onChange: (filters: DashboardFilters) => void;
}

export function FilterBar({ filters, filterOptions, onChange }: FilterBarProps) {
  const filterConfigs = [
    { key: 'reportingYear' as const, label: 'Reporting Year', options: filterOptions.reportingYears },
    { key: 'auditCycle' as const, label: 'Audit Cycle', options: filterOptions.auditCycles },
    { key: 'riskArea' as const, label: 'Risk Area', options: filterOptions.riskAreas },
    { key: 'auditOwner' as const, label: 'Audit Owner', options: filterOptions.auditOwners },
    { key: 'status' as const, label: 'Status', options: filterOptions.statuses },
  ];

  return (
    <div className="card flex flex-wrap items-end gap-4 p-4">
      {filterConfigs.map((cfg) => {
        const hasOptions = cfg.options.length > 0;
        return (
          <div key={cfg.key} className="min-w-[160px] flex-1">
            <label className="label" htmlFor={`filter-${cfg.key}`}>
              {cfg.label}
            </label>
            <div className="relative">
              <select
                id={`filter-${cfg.key}`}
                value={filters[cfg.key] ?? ''}
                onChange={(e) => onChange({ ...filters, [cfg.key]: e.target.value || undefined })}
                disabled={!hasOptions}
                className="input appearance-none pr-9 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400"
              >
                <option value="">All</option>
                {hasOptions &&
                  cfg.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
