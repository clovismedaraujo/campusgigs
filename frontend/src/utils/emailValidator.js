export const APPROVED_UFRN_DOMAINS = [
  'ufrn.edu.br',
  'escolar.ufrn.br',
  'ufrn.br',
  'imd.ufrn.br',
  'dca.ufrn.br',
];

export function isApprovedInstitutionalEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const trimmed = email.trim().toLowerCase();
  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex <= 0 || atIndex === trimmed.length - 1) {
    return false;
  }

  const domain = trimmed.substring(atIndex + 1);
  return APPROVED_UFRN_DOMAINS.includes(domain);
}
