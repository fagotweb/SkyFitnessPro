import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScrollToTopButton from '../ScrollToTopButton';

describe('ScrollToTopButton', () => {
  it('рендерит кнопку', () => {
    render(<ScrollToTopButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('вызывает window.scrollTo с параметрами при клике', async () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation();
    render(<ScrollToTopButton />);

    await userEvent.click(screen.getByRole('button'));

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    scrollToSpy.mockRestore();
  });
});
