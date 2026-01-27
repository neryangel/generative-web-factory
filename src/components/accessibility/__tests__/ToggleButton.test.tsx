import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleButton } from '../components/ToggleButton';

// Simple icon component for tests
const TestIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg data-testid="icon" className={className} />
);

describe('ToggleButton', () => {
  const defaultProps = {
    icon: TestIcon,
    label: 'High Contrast',
    active: false,
    onClick: vi.fn(),
  };

  it('should render with label', () => {
    render(<ToggleButton {...defaultProps} />);
    expect(screen.getByText('High Contrast')).toBeInTheDocument();
  });

  it('should render the icon', () => {
    render(<ToggleButton {...defaultProps} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should set aria-pressed=false when inactive', () => {
    render(<ToggleButton {...defaultProps} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('should set aria-pressed=true when active', () => {
    render(<ToggleButton {...defaultProps} active={true} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<ToggleButton {...defaultProps} onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should include the data-a11y-toggle attribute for CSS hover', () => {
    render(<ToggleButton {...defaultProps} />);
    expect(screen.getByRole('button')).toHaveAttribute('data-a11y-toggle');
  });

  it('should apply custom className', () => {
    render(<ToggleButton {...defaultProps} className="custom-test" />);
    expect(screen.getByRole('button')).toHaveClass('custom-test');
  });
});
