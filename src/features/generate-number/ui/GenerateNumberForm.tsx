import { useState, type SubmitEvent } from 'react';

import {
  generateNumber,
  type GenerateNumberErrorCode,
} from '../model/generateNumber';

import { THEMES } from '../../../app/providers/theme/themes';
import { useTheme } from '../../../app/providers/theme/ThemeProvider';

import './GenerateNumberForm.css';

type FormErrorCode = GenerateNumberErrorCode | 'empty-bounds';
type StepDirection = -1 | 1;

const errorMessages: Record<FormErrorCode, string> = {
  'empty-bounds': 'Enter both minimum and maximum values.',
  'invalid-integer': 'Enter valid integers within the safe number range.',
  'minimum-exceeds-maximum':
    'The minimum value cannot exceed the maximum.',
  'range-too-large': 'The selected range is too large.',
};

function getSteppedValue(
  value: string,
  direction: StepDirection,
): string | null {
  const currentValue = value.trim() === '' ? 0 : Number(value);

  if (!Number.isFinite(currentValue)) {
    return null;
  }

  const nextValue =
    direction === 1
      ? Math.floor(currentValue) + 1
      : Math.ceil(currentValue) - 1;

  return Number.isSafeInteger(nextValue) ? String(nextValue) : null;
}

function StepArrow({ direction }: { direction: StepDirection }) {
  const path =
    direction === 1 ? 'm4 10 4-4 4 4' : 'm4 6 4 4 4-4';

  return (
    <svg
      className="number-stepper-icon"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  );
}

export function GenerateNumberForm() {
  const { theme } = useTheme();
  const themeCopy = THEMES[theme];

  const [minValue, setMinValue] = useState('1');
  const [maxValue, setMaxValue] = useState('100');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<FormErrorCode | null>(null);

  const handleGenerate = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setResult(null);
    setError(null);

    if (minValue.trim() === '' || maxValue.trim() === '') {
      setError('empty-bounds');
      return;
    }

    const generation = generateNumber(
      Number(minValue),
      Number(maxValue),
    );

    if (!generation.ok) {
      setError(generation.error);
      return;
    }

    setResult(generation.value);
  };

  const handleMinChange = (value: string) => {
    setMinValue(value);
    setResult(null);
    setError(null);
  };

  const handleMaxChange = (value: string) => {
    setMaxValue(value);
    setResult(null);
    setError(null);
  };

  const handleStep = (
    bound: 'min' | 'max',
    direction: StepDirection,
  ) => {
    const currentValue = bound === 'min' ? minValue : maxValue;
    const nextValue = getSteppedValue(currentValue, direction);

    if (nextValue === null) {
      return;
    }

    if (bound === 'min') {
      handleMinChange(nextValue);
    } else {
      handleMaxChange(nextValue);
    }
  };

  return (
    <main className="generator-card">
      <div className="section-heading">
        <p className="section-eyebrow">RANDOM NUMBER GENERATOR</p>

        <h2>Number generator</h2>

        <p className="section-description">
          Choose your range and discover your number.
        </p>
      </div>

      <form onSubmit={handleGenerate} noValidate>
        <div className="range-fields">
          <div className="field-group">
            <label htmlFor="minimum">From</label>

            <div className="number-input">
              <input
                className="number-input-field"
                id="minimum"
                type="number"
                step="1"
                inputMode="numeric"
                value={minValue}
                onChange={(event) => handleMinChange(event.target.value)}
                placeholder="Minimum"
                required
              />

              <div className="number-stepper">
                <button
                  className="number-stepper-button"
                  type="button"
                  aria-label="Increase minimum value"
                  onClick={() => handleStep('min', 1)}
                  disabled={getSteppedValue(minValue, 1) === null}
                >
                  <StepArrow direction={1} />
                </button>

                <button
                  className="number-stepper-button"
                  type="button"
                  aria-label="Decrease minimum value"
                  onClick={() => handleStep('min', -1)}
                  disabled={getSteppedValue(minValue, -1) === null}
                >
                  <StepArrow direction={-1} />
                </button>
              </div>
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="maximum">To</label>

            <div className="number-input">
              <input
                className="number-input-field"
                id="maximum"
                type="number"
                step="1"
                inputMode="numeric"
                value={maxValue}
                onChange={(event) => handleMaxChange(event.target.value)}
                placeholder="Maximum"
                required
              />

              <div className="number-stepper">
                <button
                  className="number-stepper-button"
                  type="button"
                  aria-label="Increase maximum value"
                  onClick={() => handleStep('max', 1)}
                  disabled={getSteppedValue(maxValue, 1) === null}
                >
                  <StepArrow direction={1} />
                </button>

                <button
                  className="number-stepper-button"
                  type="button"
                  aria-label="Decrease maximum value"
                  onClick={() => handleStep('max', -1)}
                  disabled={getSteppedValue(maxValue, -1) === null}
                >
                  <StepArrow direction={-1} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <section
          className={`result-card${result !== null ? ' has-result' : ''}`}
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="result-label">{themeCopy.resultLabel}</p>

          <output className="result-value">
            {result === null ? '— — —' : result.toLocaleString('en-US')}
          </output>

          <p className="result-caption">
            {result === null
              ? 'Your result will appear here'
              : `From ${minValue} to ${maxValue}`}
          </p>
        </section>

        {error && (
          <p className="error-message" role="alert">
            {errorMessages[error]}
          </p>
        )}

        <button className="generate-button" type="submit">
          Generate number
        </button>
      </form>
    </main>
  );
}
