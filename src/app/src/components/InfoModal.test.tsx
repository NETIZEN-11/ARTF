import { renderWithProviders } from '@app/utils/testutils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import InfoModal from './InfoModal';

describe('InfoModal', () => {
  const mockOnClose = vi.fn();

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('does not render when closed', () => {
    renderWithProviders(<InfoModal open={false} onClose={mockOnClose} />);
    expect(screen.queryByText('About artef')).not.toBeInTheDocument();
  });

  it('displays the correct title', () => {
    renderWithProviders(<InfoModal open={true} onClose={mockOnClose} />);
    expect(screen.getByText('About artef')).toBeInTheDocument();
  });

  it('displays the correct version', () => {
    vi.stubEnv('VITE_artef_VERSION', '1.0.0');
    renderWithProviders(<InfoModal open={true} onClose={mockOnClose} />);
    expect(screen.getByText('Version 1.0.0')).toBeInTheDocument();
  });

  it('displays the correct description', () => {
    renderWithProviders(<InfoModal open={true} onClose={mockOnClose} />);
    expect(screen.getByText(/artef is a MIT licensed open-source tool/)).toBeInTheDocument();
  });

  it('renders all links correctly', () => {
    renderWithProviders(<InfoModal open={true} onClose={mockOnClose} />);
    const links = [
      'Documentation',
      'GitHub Repository',
      'File an Issue',
      'Join Our Discord Community',
    ];
    links.forEach((link) => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it('calls onClose when Close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InfoModal open={true} onClose={mockOnClose} />);
    // Find the Close button in the footer (not the dialog X button)
    const closeButtons = screen.getAllByRole('button', { name: 'Close' });
    const footerCloseButton = closeButtons.find((btn) => btn.textContent === 'Close');
    await user.click(footerCloseButton!);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('has accessible dialog with title', () => {
    renderWithProviders(<InfoModal open={true} onClose={mockOnClose} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName('About artef');
  });

  it('has correct link targets', () => {
    renderWithProviders(<InfoModal open={true} onClose={mockOnClose} />);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  it('has correct link hrefs', () => {
    renderWithProviders(<InfoModal open={true} onClose={mockOnClose} />);
    const links = [
      { text: 'Documentation', href: 'https://github.com/NETIZEN-11/ARTF/blob/main/README.md' },
      { text: 'GitHub Repository', href: 'https://github.com/artef/artef' },
      { text: 'File an Issue', href: 'https://github.com/artef/artef/issues' },
      { text: 'Join Our Discord Community', href: 'https://discord.gg/artef' },
    ];

    links.forEach(({ text, href }) => {
      const linkElement = screen.getByText(text).closest('a');
      expect(linkElement).toHaveAttribute('href', href);
    });
  });
});
