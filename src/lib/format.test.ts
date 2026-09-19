import { describe, expect, it } from 'vitest';
import { exerciseCount } from './format';

describe('exerciseCount', () => {
  it('reads naturally with the singular for one', () => {
    expect(exerciseCount(1)).toBe('1 exercice');
  });

  it('uses the plural for none and for many', () => {
    expect(exerciseCount(0)).toBe('0 exercices');
    expect(exerciseCount(12)).toBe('12 exercices');
  });
});
