import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WidgetErrorBoundary } from '../components/WidgetErrorBoundary';

const ThrowingChild = () => {
  throw new Error('Test error');
};

const GoodChild = () => <div data-testid="good-child">Working</div>;

describe('WidgetErrorBoundary', () => {
  it('should render children when no error occurs', () => {
    render(
      <WidgetErrorBoundary>
        <GoodChild />
      </WidgetErrorBoundary>
    );

    expect(screen.getByTestId('good-child')).toBeInTheDocument();
  });

  it('should render nothing when a child throws', () => {
    // Suppress console.error from React error boundary
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(
      <WidgetErrorBoundary>
        <ThrowingChild />
      </WidgetErrorBoundary>
    );

    expect(container.innerHTML).toBe('');
    spy.mockRestore();
  });

  it('should not crash the surrounding app', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(
      <div data-testid="app">
        <WidgetErrorBoundary>
          <ThrowingChild />
        </WidgetErrorBoundary>
        <div data-testid="rest-of-app">Still here</div>
      </div>
    );

    expect(screen.getByTestId('rest-of-app')).toBeInTheDocument();
    expect(screen.getByText('Still here')).toBeInTheDocument();
    spy.mockRestore();
  });
});
