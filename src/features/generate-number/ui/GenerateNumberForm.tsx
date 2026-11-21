import { useState, type SubmitEvent } from 'react';

import {
  generateNumber,
  type GenerateNumberErrorCode,
} from '../model/generateNumber';

import { THEMES } from '../../../app/providers/theme/themes';
import { useTheme } from '../../../app/providers/theme/ThemeProvider';
import { Button, Card, FormField, NumberInput } from '../../../shared/ui';

import './GenerateNumberForm.css';

type FormErrorCode = GenerateNumberErrorCode | 'empty-bounds';

const errorMessages: Record<FormErrorCode, string> = {
  'empty-bounds': 'Enter both minimum and maximum values.',
  'invalid-integer': 'Enter valid integers within the safe number range.',
  'minimum-exceeds-maximum':
    'The minimum value cannot exceed the maximum.',
  'range-too-large': 'The selected range is too large.',
};

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

  return (
    <main>
      <Card className="generator-card">
        <div className="section-heading">
          <p className="section-eyebrow">RANDOM NUMBER GENERATOR</p>

          <h2>Number generator</h2>

          <p className="section-description">
            Choose your range and discover your number.
          </p>
        </div>

        <form onSubmit={handleGenerate} noValidate>
          <div className="range-fields">
            <FormField id="minimum" label="From">
              <NumberInput
                id="minimum"
                value={minValue}
                onValueChange={handleMinChange}
                placeholder="Minimum"
                required
                increaseLabel="Increase minimum value"
                decreaseLabel="Decrease minimum value"
              />
            </FormField>

            <FormField id="maximum" label="To">
              <NumberInput
                id="maximum"
                value={maxValue}
                onValueChange={handleMaxChange}
                placeholder="Maximum"
                required
                increaseLabel="Increase maximum value"
                decreaseLabel="Decrease maximum value"
              />
            </FormField>
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

          <Button
            className="generate-button"
            type="submit"
            variant="primary"
            size="large"
          >
            Generate number
          </Button>
        </form>
      </Card>
    </main>
  );
}
