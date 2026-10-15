import { Table } from '../ui/Table';
import { EmptyState } from '../ui/EmptyState';
import { Flag } from 'lucide-react';
import type { PriorityItem } from '@iams/shared';

interface PriorityTableProps {
  items: PriorityItem[];
}

const priorityStyles: Record<PriorityItem['priority'], string> = {
  critical: 'bg-error-50 text-error-700 border-error-200',
  high: 'bg-warning-50 text-warning-700 border-warning-200',
  medium: 'bg-primary-50 text-primary-700 border-primary-200',
  low: 'bg-neutral-100 text-neutral-600 border-neutral-200',
};

const statusStyles: Record<PriorityItem['status'], string> = {
  open: 'bg-neutral-100 text-neutral-700',
  in_progress: 'bg-primary-50 text-primary-700',
  overdue: 'bg-error-50 text-error-700',
  closed: 'bg-success-50 text-success-700',
  pending: 'bg-warning-50 text-warning-700',
};

const statusLabels: Record<PriorityItem['status'], string> = {
  open: 'Open',
  in_progress: 'In Progress',
  overdue: 'Overdue',
  closed: 'Closed',
  pending: 'Pending',
};

export function PriorityTable({ items }: PriorityTableProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Flag className="h-12 w-12" />}
        title="No Priority Items"
        description="Priority audit items will appear here when findings and action plans are created in their respective modules."
      />
    );
  }

  return (
    <Table<PriorityItem & Record<string, unknown>>
      columns={[
        { key: 'reference', header: 'Reference' },
        { key: 'title', header: 'Title' },
        { key: 'owner', header: 'Owner' },
        {
          key: 'dueDate',
          header: 'Due Date',
          render: (row) => (row.dueDate ? new Date(row.dueDate).toLocaleDateString() : '—'),
        },
        {
          key: 'priority',
          header: 'Priority',
          render: (row) => (
            <span className={`badge border ${priorityStyles[row.priority]}`}>
              {row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
            </span>
          ),
        },
        {
          key: 'status',
          header: 'Status',
          render: (row) => (
            <span className={`badge ${statusStyles[row.status]}`}>
              {statusLabels[row.status]}
            </span>
          ),
        },
      ]}
      data={items as (PriorityItem & Record<string, unknown>)[]}
      emptyMessage="No priority items to display"
    />
  );
}
