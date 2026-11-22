import { useState, type SubmitEvent } from 'react';

import {
  generateNumber,
  type GenerateNumberErrorCode,
} from '../model/generateNumber';

import { useTheme } from '../../../app/providers/theme/ThemeProvider';
import { useI18n, type TranslationKey } from '../../../app/providers/i18n';
import { Button, Card, FormField, NumberInput } from '../../../shared/ui';

import './GenerateNumberForm.css';

type FormErrorCode = GenerateNumberErrorCode | 'empty-bounds';

const errorTranslationKeys: Record<FormErrorCode, TranslationKey> = {
  'empty-bounds': 'generator.error.emptyBounds',
  'invalid-integer': 'generator.error.invalidInteger',
  'minimum-exceeds-maximum': 'generator.error.minimumExceedsMaximum',
  'range-too-large': 'generator.error.rangeTooLarge',
};

export function GenerateNumberForm() {
  const { theme } = useTheme();
  const { language, t, themeText } = useI18n();
  const themeCopy = themeText[theme];

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

    const generation = generateNumber(Number(minValue), Number(maxValue));

    if (generation.ok === false) {
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

  const numberLocale = language === 'uk' ? 'uk-UA' : 'en-US';

  return (
    <main>
      <Card className="generator-card">
        <div className="section-heading">
          <p className="section-eyebrow">{t('generator.eyebrow')}</p>
          <h2>{t('generator.title')}</h2>
          <p className="section-description">{t('generator.description')}</p>
        </div>

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

          <section
            className={`result-card${result !== null ? ' has-result' : ''}`}
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="result-label">{themeCopy.resultLabel}</p>
            <output className="result-value">
              {result === null ? '— — —' : result.toLocaleString(numberLocale)}
            </output>
            <p className="result-caption">
              {result === null
                ? t('generator.resultWillAppear')
                : t('generator.resultRange', { from: minValue, to: maxValue })}
            </p>
          </section>

          {error && (
            <p className="error-message" role="alert">
              {t(errorTranslationKeys[error])}
            </p>
          )}

          <Button
            className="generate-button"
            type="submit"
            variant="primary"
            size="large"
          >
            {t('generator.generate')}
          </Button>
        </form>
      </Card>
    </main>
  );
}
