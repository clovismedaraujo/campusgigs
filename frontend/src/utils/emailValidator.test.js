import { describe, it, expect } from 'vitest';
import { isApprovedInstitutionalEmail, APPROVED_UFRN_DOMAINS } from './emailValidator';

describe('emailValidator', () => {
  it('deve exportar a lista de domínios aprovados da UFRN', () => {
    expect(APPROVED_UFRN_DOMAINS).toContain('ufrn.edu.br');
    expect(APPROVED_UFRN_DOMAINS).toContain('escolar.ufrn.br');
  });

  it('deve aprovar e-mails com domínios institucionais da UFRN', () => {
    expect(isApprovedInstitutionalEmail('clovis@ufrn.edu.br')).toBe(true);
    expect(isApprovedInstitutionalEmail('maria@escolar.ufrn.br')).toBe(true);
    expect(isApprovedInstitutionalEmail('joao@ufrn.br')).toBe(true);
    expect(isApprovedInstitutionalEmail('dev@imd.ufrn.br')).toBe(true);
    expect(isApprovedInstitutionalEmail('ESTUDANTE@UFRN.EDU.BR')).toBe(true);
  });

  it('deve rejeitar e-mails fora dos domínios aprovados', () => {
    expect(isApprovedInstitutionalEmail('aluno@gmail.com')).toBe(false);
    expect(isApprovedInstitutionalEmail('aluno@hotmail.com')).toBe(false);
    expect(isApprovedInstitutionalEmail('aluno@usp.br')).toBe(false);
    expect(isApprovedInstitutionalEmail('invalido')).toBe(false);
    expect(isApprovedInstitutionalEmail('')).toBe(false);
  });
});
