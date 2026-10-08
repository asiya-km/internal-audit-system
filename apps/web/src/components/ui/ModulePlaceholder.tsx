import { Construction } from 'lucide-react';

interface ModulePlaceholderProps {
  title: string;
  description: string;
}

export function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
        <Construction className="h-8 w-8 text-neutral-400" />
      </div>
      <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-neutral-500">{description}</p>
      <span className="mt-4 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
        Module coming in a later development phase
      </span>
    </div>
  );
}
