import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileQuestion } from 'lucide-react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  describe('title', () => {
    it('should render title', () => {
      render(<EmptyState title="No items found" />);

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('No items found');
    });

    it('should render title with correct styling', () => {
      render(<EmptyState title="No items found" />);

      expect(screen.getByRole('heading', { level: 3 })).toHaveClass('font-semibold');
    });
  });

  describe('description', () => {
    it('should not render description when not provided', () => {
      render(<EmptyState title="Title" />);

      expect(screen.queryByText(/./)).toHaveTextContent('Title');
    });

    it('should render description when provided', () => {
      render(<EmptyState title="Title" description="Some helpful description" />);

      expect(screen.getByText('Some helpful description')).toBeInTheDocument();
    });

    it('should render description with muted styling', () => {
      render(<EmptyState title="Title" description="Description" />);

      expect(screen.getByText('Description')).toHaveClass('text-muted-foreground');
    });
  });

  describe('icon', () => {
    it('should not render icon when not provided', () => {
      const { container } = render(<EmptyState title="Title" />);

      expect(container.querySelector('.rounded-full')).not.toBeInTheDocument();
    });

    it('should render icon when provided', () => {
      const { container } = render(<EmptyState title="Title" icon={FileQuestion} />);

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render icon in a circular container', () => {
      const { container } = render(<EmptyState title="Title" icon={FileQuestion} />);

      expect(container.querySelector('.rounded-full')).toBeInTheDocument();
    });

    it('should apply muted background to icon container', () => {
      const { container } = render(<EmptyState title="Title" icon={FileQuestion} />);

      expect(container.querySelector('.bg-muted')).toBeInTheDocument();
    });

    it('should size icon correctly', () => {
      const { container } = render(<EmptyState title="Title" icon={FileQuestion} />);

      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('h-8', 'w-8');
    });
  });

  describe('action button', () => {
    it('should not render action when not provided', () => {
      render(<EmptyState title="Title" />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should render action button when provided', () => {
      render(
        <EmptyState
          title="Title"
          action={{ label: 'Create New', onClick: vi.fn() }}
        />
      );

      expect(screen.getByRole('button', { name: 'Create New' })).toBeInTheDocument();
    });

    it('should call onClick when action button is clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <EmptyState
          title="Title"
          action={{ label: 'Create New', onClick }}
        />
      );

      await user.click(screen.getByRole('button', { name: 'Create New' }));

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('className', () => {
    it('should apply custom className', () => {
      const { container } = render(<EmptyState title="Title" className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should merge custom className with default classes', () => {
      const { container } = render(<EmptyState title="Title" className="custom-class" />);

      expect(container.firstChild).toHaveClass('flex', 'flex-col', 'custom-class');
    });
  });

  describe('layout', () => {
    it('should center content', () => {
      const { container } = render(<EmptyState title="Title" />);

      expect(container.firstChild).toHaveClass('items-center', 'justify-center');
    });

    it('should have text-center alignment', () => {
      const { container } = render(<EmptyState title="Title" />);

      expect(container.firstChild).toHaveClass('text-center');
    });

    it('should have padding', () => {
      const { container } = render(<EmptyState title="Title" />);

      expect(container.firstChild).toHaveClass('py-12', 'px-4');
    });
  });

  describe('full example', () => {
    it('should render all elements when all props provided', () => {
      const onClick = vi.fn();
      render(
        <EmptyState
          icon={FileQuestion}
          title="No items found"
          description="Create your first item to get started"
          action={{ label: 'Create Item', onClick }}
        />
      );

      expect(screen.getByRole('heading')).toHaveTextContent('No items found');
      expect(screen.getByText('Create your first item to get started')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Item' })).toBeInTheDocument();
    });
  });
});
