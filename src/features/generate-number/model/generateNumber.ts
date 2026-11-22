export type GenerateNumberErrorCode =
  | 'invalid-integer'
  | 'minimum-exceeds-maximum'
  | 'range-too-large';

export type GenerateNumbersErrorCode = GenerateNumberErrorCode | 'invalid-count';

export type GenerateNumberResult =
  | {
      ok: true;
      value: number;
    }
  | {
      ok: false;
      error: GenerateNumberErrorCode;
    };

export type GenerateNumbersResult =
  | {
      ok: true;
      values: number[];
    }
  | {
      ok: false;
      error: GenerateNumbersErrorCode;
    };

export const MAX_GENERATED_NUMBERS = 100;

type ValidatedRange =
  | { ok: true; size: number }
  | { ok: false; error: GenerateNumberErrorCode };

function validateRange(min: number, max: number): ValidatedRange {
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max)) {
    return { ok: false, error: 'invalid-integer' };
  }

  if (min > max) {
    return { ok: false, error: 'minimum-exceeds-maximum' };
  }

  const size = max - min + 1;
  if (!Number.isSafeInteger(size)) {
    return { ok: false, error: 'range-too-large' };
  }

  return { ok: true, size };
}

function generateValue(min: number, rangeSize: number): number {
  return Math.floor(Math.random() * rangeSize) + min;
}

export function generateNumber(
  min: number,
  max: number,
): GenerateNumberResult {
  const range = validateRange(min, max);
  if (range.ok === false) {
    return { ok: false, error: range.error };
  }

  return {
    ok: true,
    value: generateValue(min, range.size),
  };
}

/** Generate independent values. Duplicates are allowed by design. */
export function generateNumbers(
  min: number,
  max: number,
  count: number,
): GenerateNumbersResult {
  if (
    !Number.isSafeInteger(count) ||
    count < 1 ||
    count > MAX_GENERATED_NUMBERS
  ) {
    return { ok: false, error: 'invalid-count' };
  }

  const range = validateRange(min, max);
  if (range.ok === false) {
    return { ok: false, error: range.error };
  }

  const values = Array.from({ length: count }, () =>
    generateValue(min, range.size),
  );

  return { ok: true, values };
}
