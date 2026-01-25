import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AddSectionButton } from './AddSectionButton';

// Mock AddSectionDialog
vi.mock('./AddSectionDialog', () => ({
  AddSectionDialog: ({ children, pageId, tenantId, currentSectionsCount, onSectionAdded }: {
    children: React.ReactNode;
    pageId: string;
    tenantId: string;
    currentSectionsCount: number;
    onSectionAdded: () => void;
  }) => (
    <div data-testid="add-section-dialog" data-page-id={pageId} data-tenant-id={tenantId} data-count={currentSectionsCount}>
      {children}
    </div>
  ),
}));

describe('AddSectionButton', () => {
  const defaultProps = {
    pageId: 'page-1',
    tenantId: 'tenant-1',
    currentSectionsCount: 5,
    onSectionAdded: vi.fn(),
  };

  describe('default variant', () => {
    it('should render add button', () => {
      render(<AddSectionButton {...defaultProps} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('הוסף סקשן')).toBeInTheDocument();
    });

    it('should render plus icon', () => {
      const { container } = render(<AddSectionButton {...defaultProps} />);

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should wrap button in AddSectionDialog', () => {
      render(<AddSectionButton {...defaultProps} />);

      expect(screen.getByTestId('add-section-dialog')).toBeInTheDocument();
    });

    it('should pass pageId to dialog', () => {
      render(<AddSectionButton {...defaultProps} />);

      expect(screen.getByTestId('add-section-dialog')).toHaveAttribute('data-page-id', 'page-1');
    });

    it('should pass tenantId to dialog', () => {
      render(<AddSectionButton {...defaultProps} />);

      expect(screen.getByTestId('add-section-dialog')).toHaveAttribute('data-tenant-id', 'tenant-1');
    });

    it('should pass currentSectionsCount to dialog', () => {
      render(<AddSectionButton {...defaultProps} />);

      expect(screen.getByTestId('add-section-dialog')).toHaveAttribute('data-count', '5');
    });

    it('should have full width button', () => {
      render(<AddSectionButton {...defaultProps} />);

      expect(screen.getByRole('button')).toHaveClass('w-full');
    });

    it('should have outline variant', () => {
      const { container } = render(<AddSectionButton {...defaultProps} />);

      const button = container.querySelector('button');
      expect(button?.className).toMatch(/outline|border/);
    });
  });

  describe('inline variant', () => {
    it('should render inline add section UI', () => {
      render(<AddSectionButton {...defaultProps} variant="inline" />);

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('הוסף סקשן')).toBeInTheDocument();
    });

    it('should render separator lines', () => {
      const { container } = render(<AddSectionButton {...defaultProps} variant="inline" />);

      const separators = container.querySelectorAll('.h-px');
      expect(separators.length).toBe(2);
    });

    it('should have smaller button size', () => {
      render(<AddSectionButton {...defaultProps} variant="inline" />);

      expect(screen.getByRole('button')).toHaveClass('h-7');
    });

    it('should have hidden by default button (opacity-0)', () => {
      render(<AddSectionButton {...defaultProps} variant="inline" />);

      expect(screen.getByRole('button')).toHaveClass('opacity-0');
    });

    it('should wrap in AddSectionDialog', () => {
      render(<AddSectionButton {...defaultProps} variant="inline" />);

      expect(screen.getByTestId('add-section-dialog')).toBeInTheDocument();
    });
  });

  describe('props handling', () => {
    it('should handle zero sections count', () => {
      render(<AddSectionButton {...defaultProps} currentSectionsCount={0} />);

      expect(screen.getByTestId('add-section-dialog')).toHaveAttribute('data-count', '0');
    });

    it('should render without onSectionAdded callback', () => {
      const props = { ...defaultProps };
      delete (props as Partial<typeof defaultProps>).onSectionAdded;

      expect(() => render(<AddSectionButton {...defaultProps} />)).not.toThrow();
    });
  });
});
