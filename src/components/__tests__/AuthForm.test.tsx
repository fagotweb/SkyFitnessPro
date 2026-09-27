import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthForm from '../AuthForm';
import { loginUser, registerUser } from '@/services/api';

// 1. Мок next/image — иначе падает в jsdom
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// 2. Мок api
jest.mock('@/services/api', () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
}));

// 3. Мок контекста
const mockLogin = jest.fn();
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

// 4. Мок роутера
const mockBack = jest.fn();
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ back: mockBack, push: mockPush }),
}));

describe('AuthForm — режим логина', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('рендерит два поля и кнопку «Войти»', () => {
    render(<AuthForm mode="login" />);
    expect(screen.getByPlaceholderText('Эл. почта')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
  });

  it('кнопка disabled при пустых полях', () => {
    render(<AuthForm mode="login" />);
    expect(screen.getByRole('button', { name: 'Войти' })).toBeDisabled();
  });

  it('кнопка активна после заполнения полей', async () => {
    render(<AuthForm mode="login" />);
    await userEvent.type(
      screen.getByPlaceholderText('Эл. почта'),
      'test@mail.ru'
    );
    await userEvent.type(screen.getByPlaceholderText('Пароль'), '123');
    expect(screen.getByRole('button', { name: 'Войти' })).toBeEnabled();
  });

  it('вызывает loginUser и login при submit', async () => {
    (loginUser as jest.Mock).mockResolvedValue({ token: 'abc123' });
    render(<AuthForm mode="login" />);

    await userEvent.type(
      screen.getByPlaceholderText('Эл. почта'),
      'test@mail.ru'
    );
    await userEvent.type(screen.getByPlaceholderText('Пароль'), '123456');
    await userEvent.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: 'test@mail.ru',
        password: '123456',
      });
      expect(mockLogin).toHaveBeenCalledWith('abc123', 'test@mail.ru');
    });
  });

  it('показывает ошибку с бэка', async () => {
    (loginUser as jest.Mock).mockRejectedValue(new Error('Неверный пароль'));
    render(<AuthForm mode="login" />);

    await userEvent.type(
      screen.getByPlaceholderText('Эл. почта'),
      'test@mail.ru'
    );
    await userEvent.type(screen.getByPlaceholderText('Пароль'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: 'Войти' }));

    expect(await screen.findByText('Неверный пароль')).toBeInTheDocument();
  });
});

describe('AuthForm — режим регистрации', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('рендерит третье поле «Повторите пароль»', () => {
    render(<AuthForm mode="signup" />);
    expect(screen.getByPlaceholderText('Повторите пароль')).toBeInTheDocument();
  });

  it('кнопка disabled при слабом пароле', async () => {
    render(<AuthForm mode="signup" />);
    await userEvent.type(screen.getByPlaceholderText('Эл. почта'), 'a@b.ru');
    await userEvent.type(screen.getByPlaceholderText('Пароль'), 'weak');
    await userEvent.type(
      screen.getByPlaceholderText('Повторите пароль'),
      'weak'
    );
    expect(
      screen.getByRole('button', { name: 'Зарегистрироваться' })
    ).toBeDisabled();
  });

  it('кнопка активна при валидном пароле', async () => {
    render(<AuthForm mode="signup" />);
    await userEvent.type(screen.getByPlaceholderText('Эл. почта'), 'a@b.ru');
    await userEvent.type(screen.getByPlaceholderText('Пароль'), 'Secure@!');
    await userEvent.type(
      screen.getByPlaceholderText('Повторите пароль'),
      'Secure@!'
    );
    expect(
      screen.getByRole('button', { name: 'Зарегистрироваться' })
    ).toBeEnabled();
  });

  it('показывает ошибку «Пароли не совпадают»', async () => {
    render(<AuthForm mode="signup" />);
    await userEvent.type(screen.getByPlaceholderText('Эл. почта'), 'a@b.ru');
    await userEvent.type(screen.getByPlaceholderText('Пароль'), 'Secure@!');
    await userEvent.type(
      screen.getByPlaceholderText('Повторите пароль'),
      'Secure@?'
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Зарегистрироваться' })
    );

    expect(await screen.findByText('Пароли не совпадают')).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });

  it('вызывает registerUser при валидных данных', async () => {
    (registerUser as jest.Mock).mockResolvedValue({ message: 'ok' });
    global.alert = jest.fn();

    render(<AuthForm mode="signup" />);
    await userEvent.type(screen.getByPlaceholderText('Эл. почта'), 'a@b.ru');
    await userEvent.type(screen.getByPlaceholderText('Пароль'), 'Secure@!');
    await userEvent.type(
      screen.getByPlaceholderText('Повторите пароль'),
      'Secure@!'
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Зарегистрироваться' })
    );

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        email: 'a@b.ru',
        password: 'Secure@!',
      });
      expect(mockPush).toHaveBeenCalledWith('/auth/signin');
    });
  });
});
