import {
  isEmailValid,
  hasMinLength,
  hasUpperCase,
  countSpecialChars,
  isPasswordSecure,
} from '../validation';

describe('isEmailValid', () => {
  it('возвращает true для корректного email', () => {
    expect(isEmailValid('test@mail.ru')).toBe(true);
  });
  it('возвращает false без собаки', () => {
    expect(isEmailValid('testmail.ru')).toBe(false);
  });
});

describe('hasMinLength', () => {
  it('true для 6+ символов', () => {
    expect(hasMinLength('123456')).toBe(true);
  });
  it('false для 5 символов', () => {
    expect(hasMinLength('12345')).toBe(false);
  });
});

describe('hasUpperCase', () => {
  it('true для заглавной буквы', () => {
    expect(hasUpperCase('Password')).toBe(true);
  });
  it('false без заглавных', () => {
    expect(hasUpperCase('password')).toBe(false);
  });
});

describe('countSpecialChars', () => {
  it('считает спецсимволы', () => {
    expect(countSpecialChars('a!b@c#')).toBe(3);
  });
  it('0 если нет спецсимволов', () => {
    expect(countSpecialChars('abc123')).toBe(0);
  });
});

describe('isPasswordSecure', () => {
  it('true для пароля по всем правилам', () => {
    expect(isPasswordSecure('Secure@!')).toBe(true);
  });
  it('false если короткий', () => {
    expect(isPasswordSecure('Se@!')).toBe(false);
  });
  it('false без заглавной', () => {
    expect(isPasswordSecure('secure@!')).toBe(false);
  });
  it('false с одним спецсимволом', () => {
    expect(isPasswordSecure('Secure@1')).toBe(false);
  });
});