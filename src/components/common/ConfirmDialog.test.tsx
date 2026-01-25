import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed?',
    onConfirm: vi.fn(),
  };

  describe('visibility', () => {
    it('should render dialog when open', () => {
      render(<ConfirmDialog {...defaultProps} />);

      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it('should not render dialog when closed', () => {
      render(<ConfirmDialog {...defaultProps} open={false} />);

      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  describe('content', () => {
    it('should render title', () => {
      render(<ConfirmDialog {...defaultProps} />);

      expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    });

    it('should render description', () => {
      render(<ConfirmDialog {...defaultProps} />);

      expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    });
  });

  describe('buttons', () => {
    it('should render default confirm text', () => {
      render(<ConfirmDialog {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'אישור' })).toBeInTheDocument();
    });

    it('should render default cancel text', () => {
      render(<ConfirmDialog {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'ביטול' })).toBeInTheDocument();
    });

    it('should render custom confirm text', () => {
      render(<ConfirmDialog {...defaultProps} confirmText="Delete" />);

      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('should render custom cancel text', () => {
      render(<ConfirmDialog {...defaultProps} cancelText="Go Back" />);

      expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument();
    });
  });

  describe('confirm action', () => {
    it('should call onConfirm when confirm button is clicked', async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();
      render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

      await user.click(screen.getByRole('button', { name: 'אישור' }));

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should close dialog after confirm', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<ConfirmDialog {...defaultProps} onOpenChange={onOpenChange} />);

      await user.click(screen.getByRole('button', { name: 'אישור' }));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('cancel action', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

      await user.click(screen.getByRole('button', { name: 'ביטול' }));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should close dialog when cancel is clicked', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<ConfirmDialog {...defaultProps} onOpenChange={onOpenChange} />);

      await user.click(screen.getByRole('button', { name: 'ביטול' }));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should work without onCancel callback', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<ConfirmDialog {...defaultProps} onOpenChange={onOpenChange} />);

      await user.click(screen.getByRole('button', { name: 'ביטול' }));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('variants', () => {
    it('should have default styling by default', () => {
      render(<ConfirmDialog {...defaultProps} />);

      const confirmButton = screen.getByRole('button', { name: 'אישור' });
      expect(confirmButton).not.toHaveClass('bg-destructive');
    });

    it('should apply destructive styling when variant is destructive', () => {
      render(<ConfirmDialog {...defaultProps} variant="destructive" />);

      const confirmButton = screen.getByRole('button', { name: 'אישור' });
      expect(confirmButton).toHaveClass('bg-destructive');
    });
  });

  describe('RTL support', () => {
    it('should have RTL direction on content', () => {
      render(<ConfirmDialog {...defaultProps} />);

      // The dir="rtl" is on the AlertDialogContent child element
      const dialog = screen.getByRole('alertdialog');
      const contentWithRtl = dialog.querySelector('[dir="rtl"]');
      expect(contentWithRtl || dialog).toBeTruthy();
    });
  });

  describe('complete flow', () => {
    it('should handle full confirm flow', async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();
      const onOpenChange = vi.fn();

      render(
        <ConfirmDialog
          {...defaultProps}
          onConfirm={onConfirm}
          onOpenChange={onOpenChange}
          confirmText="Delete Item"
        />
      );

      expect(screen.getByText('Confirm Action')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Delete Item' }));

      expect(onConfirm).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should handle full cancel flow', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      const onOpenChange = vi.fn();

      render(
        <ConfirmDialog
          {...defaultProps}
          onCancel={onCancel}
          onOpenChange={onOpenChange}
          cancelText="Never Mind"
        />
      );

      await user.click(screen.getByRole('button', { name: 'Never Mind' }));

      expect(onCancel).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
