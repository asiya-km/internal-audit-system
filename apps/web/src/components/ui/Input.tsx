import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-error-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
