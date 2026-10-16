export function validatePasswordPolicy(password) {
  const value = typeof password === 'string' ? password.trim() : '';
  const hasMinLength = value.length >= 8;
  const hasUppercase = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);

  return {
    isValid: hasMinLength && hasUppercase && hasNumber,
    hasMinLength,
    hasUppercase,
    hasNumber,
  };
}
