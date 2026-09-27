export function isEmailValid(email: string): boolean {
  return email.includes('@');
}

export function hasMinLength(password: string): boolean {
  return password.length >= 6;
}

export function hasUpperCase(password: string): boolean {
  return /[A-Z]/.test(password);
}

export function countSpecialChars(password: string): number {
  return (password.match(/[^A-Za-z0-9]/g) || []).length;
}

export function isPasswordSecure(password: string): boolean {
  return (
    hasMinLength(password) &&
    hasUpperCase(password) &&
    countSpecialChars(password) >= 2
  );
}