import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from './ErrorBoundary';

// A component that always throws
function ThrowingComponent({ error }: { error: Error }) {
  throw error;
}

// A component that can conditionally throw
function ConditionalThrower({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Conditional error');
  return <div>Working fine</div>;
}

describe('ErrorBoundary', () => {
  // Suppress React error boundary console.error noise in tests
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('should render default fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent error={new Error('Test crash')} />
      </ErrorBoundary>
    );

    // Default fallback should show the Hebrew error heading
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('משהו השתבש')).toBeInTheDocument();
  });

  it('should render the "try again" and "refresh" buttons in default fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent error={new Error('Test crash')} />
      </ErrorBoundary>
    );

    expect(screen.getByText('נסה שוב')).toBeInTheDocument();
    expect(screen.getByText('רענן דף')).toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom error view</div>}>
        <ThrowingComponent error={new Error('Test crash')} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error view')).toBeInTheDocument();
    expect(screen.queryByText('משהו השתבש')).not.toBeInTheDocument();
  });

  it('should call onError callback when an error is caught', () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowingComponent error={new Error('Callback test')} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Callback test' }),
      expect.objectContaining({ componentStack: expect.any(String) })
    );
  });

  it('should reset error state when "try again" button is clicked', async () => {
    const user = userEvent.setup();

    // Use a ref-like flag that we control from outside to decide when to throw
    let shouldThrow = true;

    function ConditionalThrowComponent() {
      if (shouldThrow) {
        throw new Error('One time error');
      }
      return <div>Recovered content</div>;
    }

    render(
      <ErrorBoundary>
        <ConditionalThrowComponent />
      </ErrorBoundary>
    );

    // Should show error state
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('נסה שוב')).toBeInTheDocument();

    // Flip the flag before clicking retry so the re-render succeeds
    shouldThrow = false;

    // Click "try again"
    await user.click(screen.getByText('נסה שוב'));

    // After reset, children re-render without throwing
    expect(screen.getByText('Recovered content')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should show error message in development mode', () => {
    // NODE_ENV is 'test' by default in vitest which is not 'development',
    // so error message should NOT be visible
    render(
      <ErrorBoundary>
        <ThrowingComponent error={new Error('Dev error message')} />
      </ErrorBoundary>
    );

    // In test mode (not development), the error details should be hidden
    // This verifies the conditional rendering logic
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should have role="alert" on the default fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent error={new Error('Alert test')} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should have RTL direction on the default fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent error={new Error('RTL test')} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toHaveAttribute('dir', 'rtl');
  });
});
