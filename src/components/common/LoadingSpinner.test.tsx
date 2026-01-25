import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  describe('size variants', () => {
    it('should render with small size', () => {
      const { container } = render(<LoadingSpinner size="sm" />);

      const spinner = container.querySelector('svg');
      expect(spinner).toHaveClass('h-4', 'w-4');
    });

    it('should render with medium size by default', () => {
      const { container } = render(<LoadingSpinner />);

      const spinner = container.querySelector('svg');
      expect(spinner).toHaveClass('h-8', 'w-8');
    });

    it('should render with large size', () => {
      const { container } = render(<LoadingSpinner size="lg" />);

      const spinner = container.querySelector('svg');
      expect(spinner).toHaveClass('h-12', 'w-12');
    });
  });

  describe('animation', () => {
    it('should have spin animation class', () => {
      const { container } = render(<LoadingSpinner />);

      const spinner = container.querySelector('svg');
      expect(spinner).toHaveClass('animate-spin');
    });
  });

  describe('text', () => {
    it('should not render text by default', () => {
      render(<LoadingSpinner />);

      expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
    });

    it('should render text when provided', () => {
      render(<LoadingSpinner text="Loading..." />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render text with muted styling', () => {
      render(<LoadingSpinner text="Loading..." />);

      expect(screen.getByText('Loading...')).toHaveClass('text-muted-foreground');
    });
  });

  describe('fullScreen mode', () => {
    it('should not be fullScreen by default', () => {
      const { container } = render(<LoadingSpinner />);

      expect(container.querySelector('.min-h-screen')).not.toBeInTheDocument();
    });

    it('should render fullScreen wrapper when enabled', () => {
      const { container } = render(<LoadingSpinner fullScreen />);

      expect(container.querySelector('.min-h-screen')).toBeInTheDocument();
    });

    it('should center content in fullScreen mode', () => {
      const { container } = render(<LoadingSpinner fullScreen />);

      const wrapper = container.querySelector('.min-h-screen');
      expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('should apply background in fullScreen mode', () => {
      const { container } = render(<LoadingSpinner fullScreen />);

      const wrapper = container.querySelector('.min-h-screen');
      expect(wrapper).toHaveClass('bg-background');
    });
  });

  describe('className', () => {
    it('should apply custom className', () => {
      const { container } = render(<LoadingSpinner className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should merge custom className with default classes', () => {
      const { container } = render(<LoadingSpinner className="custom-class" />);

      const wrapper = container.querySelector('.flex');
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  describe('styling', () => {
    it('should have primary text color', () => {
      const { container } = render(<LoadingSpinner />);

      const spinner = container.querySelector('svg');
      expect(spinner).toHaveClass('text-primary');
    });

    it('should have flex column layout', () => {
      const { container } = render(<LoadingSpinner />);

      expect(container.firstChild).toHaveClass('flex', 'flex-col');
    });

    it('should center content', () => {
      const { container } = render(<LoadingSpinner />);

      expect(container.firstChild).toHaveClass('items-center', 'justify-center');
    });
  });
});
