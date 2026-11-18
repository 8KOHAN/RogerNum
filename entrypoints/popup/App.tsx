import { useState, type FormEvent } from 'react';
import './App.css';

function App() {
  const [minValue, setMinValue] = useState('1');
  const [maxValue, setMaxValue] = useState('100');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setResult(null);
    setError('');

    if (minValue.trim() === '' || maxValue.trim() === '') {
      setError('Enter both minimum and maximum values.');
      return;
    }

    const min = Number(minValue);
    const max = Number(maxValue);

    if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max)) {
      setError('Enter valid integers within the safe number range.');
      return;
    }

    if (min > max) {
      setError('The minimum value cannot exceed the maximum.');
      return;
    }

    const range = max - min + 1;

    if (!Number.isSafeInteger(range)) {
      setError('The selected range is too large.');
      return;
    }

    const randomNumber = Math.floor(Math.random() * range) + min;

    setResult(randomNumber);
  };

  const handleMinChange = (value: string) => {
    setMinValue(value);
    setResult(null);
    setError('');
  };

  const handleMaxChange = (value: string) => {
    setMaxValue(value);
    setResult(null);
    setError('');
  };

  return (
    <div className="popup-shell">
      <header className="brand-header">
        <div className="brand-logo">
          <span>RN</span>
        </div>

        <div className="brand-info">
          <h1 className="brand-title">
            Roger<span>Num</span>
          </h1>

          <p className="brand-subtitle">
            THE GOLDEN GENERATOR
          </p>
        </div>

        <div className="brand-crown" aria-hidden="true">
          ♛
        </div>
      </header>

      <main className="generator-card">
        <div className="section-heading">
          <p className="section-eyebrow">RANDOM NUMBER GENERATOR</p>

          <h2>Number generator</h2>

          <p className="section-description">
            Choose your range and discover your number.
          </p>
        </div>

        <form onSubmit={handleGenerate}>
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
              {error}
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

      <footer className="popup-footer">
        <span>RogerNum</span>
        <span>GOLDEN EDITION</span>
      </footer>
    </div>
  );
}

export default App;