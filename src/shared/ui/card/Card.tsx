import type { HTMLAttributes } from 'react';

import './Card.css';

export type CardVariant = 'surface' | 'plain';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export function Card({
  variant = 'surface',
  className,
  ...props
}: CardProps) {
  const cardClassName = [
    'ui-card',
    `ui-card--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div {...props} className={cardClassName} />;
}
