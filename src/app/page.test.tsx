import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Главная страница SkyFitnessPro', () => {
  test('Отображает приветственный текст Next.js', () => {
    render(<Home />);
    
    // Ищем текст со стандартной страницы Next.js, которую мы видели в браузере
    const textElement = screen.getByText(/To get started, edit/i);
    expect(textElement).toBeInTheDocument();
  });
});
