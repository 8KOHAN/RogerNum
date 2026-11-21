import { forwardRef, type ButtonHTMLAttributes } from 'react';

import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'medium',
      type = 'button',
      className,
      ...props
    },
    ref,
  ) {
    const buttonClassName = [
      'ui-button',
      `ui-button--${variant}`,
      `ui-button--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={buttonClassName}
      />
    );
  },
);

Button.displayName = 'Button';
