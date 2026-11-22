import { type InputHTMLAttributes } from 'react';

import { Button } from '../button';

import './NumberInput.css';

type StepDirection = -1 | 1;

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange' | 'step'
>;

export interface NumberInputProps extends NativeInputProps {
  value: string;
  onValueChange: (value: string) => void;
  step?: number;
  increaseLabel?: string;
  decreaseLabel?: string;
  wrapperClassName?: string;
}

function getSteppedValue(
  value: string,
  direction: StepDirection,
  step: number,
  minimum?: number,
  maximum?: number,
): string | null {
  const currentValue = value.trim() === '' ? 0 : Number(value);

  if (!Number.isFinite(currentValue)) {
    return null;
  }

  const nextValue =
    direction === 1
      ? (Math.floor(currentValue / step) + 1) * step
      : (Math.ceil(currentValue / step) - 1) * step;

  if (!Number.isSafeInteger(nextValue)) {
    return null;
  }

  if (minimum !== undefined && Number.isFinite(minimum) && nextValue < minimum) {
    return null;
  }

  if (maximum !== undefined && Number.isFinite(maximum) && nextValue > maximum) {
    return null;
  }

  return String(nextValue);
}

function StepArrow({ direction }: { direction: StepDirection }) {
  const path =
    direction === 1 ? 'm4 10 4-4 4 4' : 'm4 6 4 4 4-4';

  return (
    <svg
      className="ui-number-input__stepper-icon"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  );
}

export function NumberInput({
  value,
  onValueChange,
  step = 1,
  increaseLabel = 'Increase value',
  decreaseLabel = 'Decrease value',
  wrapperClassName,
  className,
  disabled,
  ...inputProps
}: NumberInputProps) {
  const safeStep = Number.isSafeInteger(step) && step > 0 ? step : 1;
  const wrapperClasses = ['ui-number-input', wrapperClassName]
    .filter(Boolean)
    .join(' ');
  const inputClasses = ['ui-number-input__field', className]
    .filter(Boolean)
    .join(' ');

  const minimum =
    inputProps.min === undefined ? undefined : Number(inputProps.min);
  const maximum =
    inputProps.max === undefined ? undefined : Number(inputProps.max);
  const increaseValue = getSteppedValue(value, 1, safeStep, minimum, maximum);
  const decreaseValue = getSteppedValue(value, -1, safeStep, minimum, maximum);

  function handleStep(direction: StepDirection) {
    const nextValue = getSteppedValue(value, direction, safeStep, minimum, maximum);

    if (nextValue !== null) {
      onValueChange(nextValue);
    }
  }

  return (
    <div className={wrapperClasses}>
      <input
        {...inputProps}
        className={inputClasses}
        type="number"
        step={safeStep}
        inputMode={inputProps.inputMode ?? 'numeric'}
        value={value}
        disabled={disabled}
        onChange={(event) => onValueChange(event.target.value)}
      />

      <div className="ui-number-input__stepper">
        <Button
          className="ui-number-input__stepper-button"
          variant="ghost"
          size="icon"
          type="button"
          aria-label={increaseLabel}
          onClick={() => handleStep(1)}
          disabled={disabled || increaseValue === null}
        >
          <StepArrow direction={1} />
        </Button>

        <Button
          className="ui-number-input__stepper-button"
          variant="ghost"
          size="icon"
          type="button"
          aria-label={decreaseLabel}
          onClick={() => handleStep(-1)}
          disabled={disabled || decreaseValue === null}
        >
          <StepArrow direction={-1} />
        </Button>
      </div>
    </div>
  );
}
