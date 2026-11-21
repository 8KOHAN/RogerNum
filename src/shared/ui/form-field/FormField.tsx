import type { ReactNode } from 'react';

import './FormField.css';

export interface FormFieldProps {
  id: string;
  label: ReactNode;
  children: ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  children,
  className,
}: FormFieldProps) {
  const fieldClassName = ['ui-form-field', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={fieldClassName}>
      <label className="ui-form-field__label" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}
