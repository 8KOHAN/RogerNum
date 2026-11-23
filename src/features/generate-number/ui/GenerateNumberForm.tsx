import { useEffect, useRef, useState, type SubmitEvent } from 'react';

import {
  generateNumber,
  generateNumbers,
  MAX_GENERATED_NUMBERS,
  type GenerateNumberErrorCode,
  type GenerateNumbersErrorCode,
} from '../model/generateNumber';

import { useTheme } from '../../../app/providers/theme/ThemeProvider';
import { useI18n, type TranslationKey } from '../../../app/providers/i18n';
import { usePreferences } from '../../../app/providers/preferences';
import {
  getInitialUserSettings,
  getUserSettings,
  subscribeToUserSettings,
  updateUserSettings,
} from '../../../app/providers/settings';
import { Button, Card, FormField, NumberInput } from '../../../shared/ui';

import './GenerateNumberForm.css';

type FormErrorCode =
  | GenerateNumberErrorCode
  | GenerateNumbersErrorCode
  | 'empty-bounds';

type CopyStatus = 'idle' | 'copied' | 'error';

const errorTranslationKeys: Record<FormErrorCode, TranslationKey> = {
  'empty-bounds': 'generator.error.emptyBounds',
  'invalid-integer': 'generator.error.invalidInteger',
  'minimum-exceeds-maximum': 'generator.error.minimumExceedsMaximum',
  'range-too-large': 'generator.error.rangeTooLarge',
  'invalid-count': 'generator.error.invalidCount',
};

export function GenerateNumberForm() {
  const { theme } = useTheme();
  const { language, t, themeText } = useI18n();
  const { multipleNumbersEnabled } = usePreferences();
  const themeCopy = themeText[theme];

  const [minValue, setMinValue] = useState(
    () => getInitialUserSettings().rangeMin,
  );
  const [maxValue, setMaxValue] = useState(
    () => getInitialUserSettings().rangeMax,
  );
  const [countValue, setCountValue] = useState('5');
  const [results, setResults] = useState<number[] | null>(null);
  const [error, setError] = useState<FormErrorCode | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const rangeMinWasEdited = useRef(false);
  const rangeMaxWasEdited = useRef(false);

  useEffect(() => {
    let isActive = true;
    const unsubscribe = subscribeToUserSettings((patch) => {
      if (patch.rangeMin !== undefined && !rangeMinWasEdited.current) {
        setMinValue(patch.rangeMin);
      }
      if (patch.rangeMax !== undefined && !rangeMaxWasEdited.current) {
        setMaxValue(patch.rangeMax);
      }
    });

    void getUserSettings().then((settings) => {
      if (!isActive) {
        return;
      }

      if (!rangeMinWasEdited.current) {
        setMinValue(settings.rangeMin);
      }
      if (!rangeMaxWasEdited.current) {
        setMaxValue(settings.rangeMax);
      }
    }).catch(() => {
      // Keep the default range if persistent storage is unavailable.
    });

    return () => { isActive = false; unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!multipleNumbersEnabled && results !== null && results.length > 1) {
      setResults(null);
      setCopyStatus('idle');
    }
  }, [multipleNumbersEnabled, results]);

  const handleGenerate = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setResults(null);
    setError(null);
    setCopyStatus('idle');

    if (minValue.trim() === '' || maxValue.trim() === '') {
      setError('empty-bounds');
      return;
    }

    const minimum = Number(minValue);
    const maximum = Number(maxValue);

    if (multipleNumbersEnabled) {
      const generation = generateNumbers(minimum, maximum, Number(countValue));

      if (generation.ok === false) {
        setError(generation.error);
        return;
      }

      setResults(generation.values);
      return;
    }

    const generation = generateNumber(minimum, maximum);

    if (generation.ok === false) {
      setError(generation.error);
      return;
    }

    setResults([generation.value]);
  };

  const handleMinChange = (value: string) => {
    rangeMinWasEdited.current = true;
    setMinValue(value);
    void updateUserSettings({ rangeMin: value }).catch(() => {
      // Keep the edited value in the current form if persistent storage fails.
    });
    setResults(null);
    setError(null);
    setCopyStatus('idle');
  };

  const handleMaxChange = (value: string) => {
    rangeMaxWasEdited.current = true;
    setMaxValue(value);
    void updateUserSettings({ rangeMax: value }).catch(() => {
      // Keep the edited value in the current form if persistent storage fails.
    });
    setResults(null);
    setError(null);
    setCopyStatus('idle');
  };

  const handleCountChange = (value: string) => {
    setCountValue(value);
    setResults(null);
    setError(null);
    setCopyStatus('idle');
  };

  async function handleCopyResults() {
    if (results === null || results.length === 0) {
      return;
    }

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API is unavailable.');
      }

      const textToCopy = results.length === 1
        ? String(results[0])
        : results.join('\n');

      await navigator.clipboard.writeText(textToCopy);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }
  }

  const numberLocale = language.replace('_', '-');
  const hasResults = results !== null && results.length > 0;
  const hasMultipleResults = results !== null && results.length > 1;
  const resultRange = t('generator.resultRange', {
    from: minValue,
    to: maxValue,
  });

  return (
    <main>
      <h2 className="visually-hidden">{t('generator.title')}</h2>
      <Card
        className={`generator-card${multipleNumbersEnabled ? ' generator-card--multiple-enabled' : ''}`}
      >
        <form onSubmit={handleGenerate} noValidate>
          <div className="range-fields">
            <FormField id="minimum" label={t('generator.from')}>
              <NumberInput
                id="minimum"
                value={minValue}
                onValueChange={handleMinChange}
                placeholder={t('generator.minimum')}
                required
                increaseLabel={t('generator.increaseMinimum')}
                decreaseLabel={t('generator.decreaseMinimum')}
              />
            </FormField>

            <FormField id="maximum" label={t('generator.to')}>
              <NumberInput
                id="maximum"
                value={maxValue}
                onValueChange={handleMaxChange}
                placeholder={t('generator.maximum')}
                required
                increaseLabel={t('generator.increaseMaximum')}
                decreaseLabel={t('generator.decreaseMaximum')}
              />
            </FormField>
          </div>

          {multipleNumbersEnabled && (
            <div className="generator-count-row">
              <label className="generator-count-label" htmlFor="number-count">
                {t('generator.count')}
              </label>
              <NumberInput
                id="number-count"
                wrapperClassName="generator-count-input"
                value={countValue}
                onValueChange={handleCountChange}
                min={1}
                max={MAX_GENERATED_NUMBERS}
                step={1}
                required
                increaseLabel={t('generator.increaseCount')}
                decreaseLabel={t('generator.decreaseCount')}
              />
            </div>
          )}

          <section
            className={`result-card${hasResults ? ' has-result' : ''}${hasMultipleResults ? ' result-card--multiple' : ''}`}
            aria-live="polite"
            aria-atomic={!hasMultipleResults}
          >
            <p className="result-label">
              {hasMultipleResults ? themeCopy.resultsLabel : themeCopy.resultLabel}
            </p>

            {hasMultipleResults ? (
              <div
                className="result-list"
                role="list"
                aria-label={t('generator.resultsCount', { count: results.length })}
              >
                {results.map((value, index) => (
                  <output
                    key={`${index}-${value}`}
                    className="result-list-item"
                    role="listitem"
                  >
                    {value.toLocaleString(numberLocale)}
                  </output>
                ))}
              </div>
            ) : (
              <output className="result-value">
                {results?.[0]?.toLocaleString(numberLocale) ?? '— — —'}
              </output>
            )}

            <p className="result-caption">
              {!hasResults
                ? t('generator.resultWillAppear')
                : resultRange}
            </p>

            {hasMultipleResults && (
              <div className="result-multiple-footer">
                <span className="result-multiple-count">
                  {t('generator.resultsCount', { count: results.length })}
                </span>
                <Button
                  className="result-copy-button"
                  variant="secondary"
                  size="small"
                  type="button"
                  onClick={handleCopyResults}
                >
                  {copyStatus === 'copied'
                    ? t('generator.copied')
                    : copyStatus === 'error'
                      ? t('generator.copyFailed')
                      : t('generator.copyAll')}
                </Button>
              </div>
            )}

            {hasResults && !hasMultipleResults && (
              <div className="result-single-footer">
                <Button
                  className="result-copy-button"
                  variant="secondary"
                  size="small"
                  type="button"
                  onClick={handleCopyResults}
                >
                  {copyStatus === 'copied'
                    ? t('generator.copied')
                    : copyStatus === 'error'
                      ? t('generator.copyFailed')
                      : t('generator.copy')}
                </Button>
              </div>
            )}
          </section>

          {error && (
            <p className="error-message" role="alert">
              {t(
                errorTranslationKeys[error],
                error === 'invalid-count'
                  ? { max: MAX_GENERATED_NUMBERS }
                  : undefined,
              )}
            </p>
          )}

          <Button
            className="generate-button"
            type="submit"
            variant="primary"
            size="large"
          >
            {multipleNumbersEnabled && Number(countValue) > 1
              ? t('generator.generateNumbers')
              : t('generator.generate')}
          </Button>
        </form>
      </Card>
    </main>
  );
}
