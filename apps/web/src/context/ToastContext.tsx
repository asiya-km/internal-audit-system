import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle, AlertCircle, Info, X, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertCircle,
};

const styles: Record<ToastType, string> = {
  success: 'border-success-600 bg-success-50 text-success-700',
  error: 'border-error-600 bg-error-50 text-error-700',
  info: 'border-primary-600 bg-primary-50 text-primary-700',
  warning: 'border-warning-600 bg-warning-50 text-warning-700',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg animate-in slide-in-from-right ${styles[t.type]}`}
              role="alert"
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="ml-auto opacity-60 hover:opacity-100"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
