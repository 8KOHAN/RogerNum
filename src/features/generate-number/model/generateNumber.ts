export type GenerateNumberErrorCode =
  | 'invalid-integer'
  | 'minimum-exceeds-maximum'
  | 'range-too-large';

export type GenerateNumberResult =
  | {
      ok: true;
      value: number;
    }
  | {
      ok: false;
      error: GenerateNumberErrorCode;
    };

export function generateNumber(
    min: number,
    max: number,
): GenerateNumberResult {
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max)) {
    return {
      ok: false,
      error: 'invalid-integer',
    };
  }

  if (min > max) {
    return {
      ok: false,
      error: 'minimum-exceeds-maximum',
    };
  }

  const range = max - min + 1;

  if (!Number.isSafeInteger(range)) {
    return {
      ok: false,
      error: 'range-too-large',
    };
  }

  return {
    ok: true,
    value: Math.floor(Math.random() * range) + min,
  };
}