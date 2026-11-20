import { useState, type FormEvent } from 'react';

import {
  generateNumber,
  type GenerateNumberErrorCode,
} from '../model/generateNumber';

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
  const [minValue, setMinValue] = useState('1');
  const [maxValue, setMaxValue] = useState('100');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<FormErrorCode | null>(null);

  const handleGenerate = (event: FormEvent<HTMLFormElement>) => {
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

            <input
              id="minimum"
              type="number"
              step="1"
              inputMode="numeric"
              value={minValue}
              onChange={(event) => handleMinChange(event.target.value)}
              placeholder="Minimum"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="maximum">To</label>

            <input
              id="maximum"
              type="number"
              step="1"
              inputMode="numeric"
              value={maxValue}
              onChange={(event) => handleMaxChange(event.target.value)}
              placeholder="Maximum"
              required
            />
          </div>
        </div>

        <section
          className={`result-card${result !== null ? ' has-result' : ''}`}
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="result-decoration" aria-hidden="true">
            ✦
          </div>

          <p className="result-label">YOUR GOLDEN NUMBER</p>

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
          <span className="button-symbol" aria-hidden="true">
            ✦
          </span>

          Generate number
        </button>
      </form>
    </main>
  );
}