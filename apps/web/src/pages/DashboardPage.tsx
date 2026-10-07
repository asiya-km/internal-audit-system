import { useAuth } from '../context/AuthContext';
import { ModulePlaceholder } from '../components/ui/ModulePlaceholder';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-8 text-white shadow-md">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.firstName} {user?.lastName}
        </h1>
        <p className="mt-1.5 text-sm text-primary-100">
          This is the Internal Audit Management System dashboard. Audit metrics
          and visualizations will appear here in a later development phase.
        </p>
      </div>

      {/* Quick stats placeholder cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active Engagements', value: '—' },
          { label: 'Open Findings', value: '—' },
          { label: 'Pending Actions', value: '—' },
          { label: 'Reports Due', value: '—' },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-neutral-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <ModulePlaceholder
        title="Dashboard Analytics"
        description="Interactive dashboards with audit lifecycle metrics, engagement status tracking, and findings analytics will be available here."
      />
    </div>
  );
}
