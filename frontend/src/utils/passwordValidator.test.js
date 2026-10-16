import { describe, it, expect } from 'vitest';
import { validatePasswordPolicy } from './passwordValidator';

describe('passwordValidator', () => {
  it('deve aprovar senhas com pelo menos 8 caracteres, letra maiúscula e número', () => {
    const result = validatePasswordPolicy('Campus2026');
    expect(result.isValid).toBe(true);
    expect(result.hasMinLength).toBe(true);
    expect(result.hasUppercase).toBe(true);
    expect(result.hasNumber).toBe(true);
  });

  it('deve reprovar senhas curtas, sem letra maiúscula ou sem número', () => {
    expect(validatePasswordPolicy('Curta1').isValid).toBe(false);
    expect(validatePasswordPolicy('semmaiuscula1').isValid).toBe(false);
    expect(validatePasswordPolicy('SemNumero').isValid).toBe(false);
    expect(validatePasswordPolicy('').isValid).toBe(false);
  });
});
