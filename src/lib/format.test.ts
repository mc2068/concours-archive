import { describe, expect, it } from 'vitest';
import { exerciseCount, paperEpreuve } from './format';
import type { ConcoursPaper } from './types';

const paper = (over: Partial<ConcoursPaper>): ConcoursPaper => ({
  id: 'p',
  examBrand: 'Mines-Ponts',
  year: 2026,
  country: 'FR',
  subject: 'Maths',
  pdfPath: '/x.pdf',
  ...over,
});

describe('exerciseCount', () => {
  it('reads naturally with the singular for one', () => {
    expect(exerciseCount(1)).toBe('1 exercice');
  });

  it('uses the plural for none and for many', () => {
    expect(exerciseCount(0)).toBe('0 exercices');
    expect(exerciseCount(12)).toBe('12 exercices');
  });
});

describe('paperEpreuve', () => {
  it('appends the épreuve label so same-brand/year papers differ', () => {
    expect(paperEpreuve(paper({ label: 'Maths 1' }))).toBe('Mines-Ponts Maths 1');
    expect(paperEpreuve(paper({ label: 'Maths 2' }))).toBe('Mines-Ponts Maths 2');
  });

  it('falls back to the brand alone when there is no label', () => {
    expect(paperEpreuve(paper({ label: undefined }))).toBe('Mines-Ponts');
    expect(paperEpreuve(paper({ label: '' }))).toBe('Mines-Ponts');
    expect(paperEpreuve(paper({ label: '  ' }))).toBe('Mines-Ponts');
  });
});
