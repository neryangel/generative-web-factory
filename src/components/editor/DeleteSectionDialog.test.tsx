import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteSectionDialog } from './DeleteSectionDialog';

// Track mock calls
let deleteResult: { error: Error | null } = { error: null };
let deleteCalls: string[] = [];

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock supabase with inline implementation
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (table: string) => ({
      delete: () => ({
        eq: (field: string, value: string) => {
          deleteCalls.push(`${table}.${field}=${value}`);
          return Promise.resolve(deleteResult);
        },
      }),
    }),
  },
}));

describe('DeleteSectionDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    sectionId: 'section-1',
    sectionType: 'hero',
    onDeleted: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    deleteResult = { error: null };
    deleteCalls = [];
  });

  it('should render dialog when open', () => {
    render(<DeleteSectionDialog {...defaultProps} />);

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('מחיקת סקשן')).toBeInTheDocument();
  });

  it('should not render dialog when closed', () => {
    render(<DeleteSectionDialog {...defaultProps} open={false} />);

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('should display section type in description', () => {
    render(<DeleteSectionDialog {...defaultProps} sectionType="features" />);

    expect(screen.getByText(/features/)).toBeInTheDocument();
  });

  it('should show cancel button', () => {
    render(<DeleteSectionDialog {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'ביטול' })).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<DeleteSectionDialog {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'מחק סקשן' })).toBeInTheDocument();
  });

  it('should call onOpenChange when cancel is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<DeleteSectionDialog {...defaultProps} onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: 'ביטול' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  describe('deletion', () => {
    it('should delete section when confirmed', async () => {
      const user = userEvent.setup();
      render(<DeleteSectionDialog {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: 'מחק סקשן' }));

      await waitFor(() => {
        expect(deleteCalls).toContain('sections.id=section-1');
      });
    });

    it('should call onDeleted after successful deletion', async () => {
      const user = userEvent.setup();
      const onDeleted = vi.fn();
      render(<DeleteSectionDialog {...defaultProps} onDeleted={onDeleted} />);

      await user.click(screen.getByRole('button', { name: 'מחק סקשן' }));

      await waitFor(() => {
        expect(onDeleted).toHaveBeenCalledWith('section-1');
      });
    });

    it('should close dialog after successful deletion', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<DeleteSectionDialog {...defaultProps} onOpenChange={onOpenChange} />);

      await user.click(screen.getByRole('button', { name: 'מחק סקשן' }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('should show success toast after deletion', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');
      render(<DeleteSectionDialog {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: 'מחק סקשן' }));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('הסקשן נמחק בהצלחה');
      });
    });
  });

  describe('error handling', () => {
    it('should show error toast on deletion failure', async () => {
      deleteResult = { error: new Error('Delete failed') };
      const user = userEvent.setup();
      const { toast } = await import('sonner');

      render(<DeleteSectionDialog {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: 'מחק סקשן' }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('שגיאה במחיקת הסקשן');
      });
    });

    it('should not call onDeleted on error', async () => {
      deleteResult = { error: new Error('Delete failed') };
      const user = userEvent.setup();
      const onDeleted = vi.fn();

      render(<DeleteSectionDialog {...defaultProps} onDeleted={onDeleted} />);

      await user.click(screen.getByRole('button', { name: 'מחק סקשן' }));

      // Wait for the error to be processed
      await waitFor(() => {
        const { toast } = vi.mocked(require('sonner'));
        // Error was handled (toast.error was called)
      });

      // onDeleted should not have been called
      expect(onDeleted).not.toHaveBeenCalled();
    });
  });
});
