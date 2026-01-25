import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditableText } from './EditableText';

describe('EditableText', () => {
  describe('when not in editing mode', () => {
    it('should render the value', () => {
      render(<EditableText value="Hello World" />);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('should render placeholder when value is empty', () => {
      render(<EditableText value="" placeholder="Enter text..." />);
      expect(screen.getByText('Enter text...')).toBeInTheDocument();
    });

    it('should render with correct element type', () => {
      const { container } = render(<EditableText value="Test" as="h1" />);
      expect(container.querySelector('h1')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<EditableText value="Test" className="custom-class" />);
      expect(screen.getByText('Test')).toHaveClass('custom-class');
    });

    it('should apply custom style', () => {
      render(<EditableText value="Test" style={{ color: 'red' }} />);
      expect(screen.getByText('Test')).toHaveStyle({ color: 'red' });
    });

    it('should not be clickable when not editing', () => {
      const onChange = vi.fn();
      render(<EditableText value="Test" onChange={onChange} isEditing={false} />);

      fireEvent.click(screen.getByText('Test'));

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });

  describe('when in editing mode', () => {
    it('should be clickable and show textarea', async () => {
      const user = userEvent.setup();
      render(<EditableText value="Test" isEditing={true} />);

      await user.click(screen.getByText('Test'));

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should focus textarea when activated', async () => {
      const user = userEvent.setup();
      render(<EditableText value="Test" isEditing={true} />);

      await user.click(screen.getByText('Test'));

      expect(screen.getByRole('textbox')).toHaveFocus();
    });

    it('should show hover state styling when editable', () => {
      const { container } = render(<EditableText value="Test" isEditing={true} />);

      const element = container.querySelector('[class*="cursor-text"]');
      expect(element).toBeInTheDocument();
    });

    it('should update local value on typing', async () => {
      const user = userEvent.setup();
      render(<EditableText value="Test" isEditing={true} />);

      await user.click(screen.getByText('Test'));

      const textarea = screen.getByRole('textbox');
      await user.clear(textarea);
      await user.type(textarea, 'New Value');

      expect(textarea).toHaveValue('New Value');
    });

    it('should call onChange on blur with new value', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<EditableText value="Test" onChange={onChange} isEditing={true} />);

      await user.click(screen.getByText('Test'));

      const textarea = screen.getByRole('textbox');
      await user.clear(textarea);
      await user.type(textarea, 'New Value');
      await user.tab();

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('New Value');
      });
    });

    it('should not call onChange if value did not change', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<EditableText value="Test" onChange={onChange} isEditing={true} />);

      await user.click(screen.getByText('Test'));
      await user.tab();

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should submit on Enter key', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<EditableText value="Test" onChange={onChange} isEditing={true} />);

      await user.click(screen.getByText('Test'));

      const textarea = screen.getByRole('textbox');
      await user.clear(textarea);
      await user.type(textarea, 'New Value');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('New Value');
      });
    });

    it('should cancel on Escape key', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<EditableText value="Test" onChange={onChange} isEditing={true} />);

      await user.click(screen.getByText('Test'));

      const textarea = screen.getByRole('textbox');
      await user.clear(textarea);
      await user.type(textarea, 'New Value');
      await user.keyboard('{Escape}');

      expect(onChange).not.toHaveBeenCalled();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('should reset value on Escape', async () => {
      const user = userEvent.setup();
      render(<EditableText value="Original" isEditing={true} />);

      await user.click(screen.getByText('Original'));

      const textarea = screen.getByRole('textbox');
      await user.clear(textarea);
      await user.type(textarea, 'Changed');
      await user.keyboard('{Escape}');

      expect(screen.getByText('Original')).toBeInTheDocument();
    });

    it('should allow multiline with Shift+Enter', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<EditableText value="Test" onChange={onChange} isEditing={true} />);

      await user.click(screen.getByText('Test'));

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, '{Shift>}{Enter}{/Shift}');

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should show placeholder in textarea when empty', async () => {
      const user = userEvent.setup();
      render(<EditableText value="" placeholder="Custom placeholder" isEditing={true} />);

      await user.click(screen.getByText('Custom placeholder'));

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('element types', () => {
    it('should render as h1', () => {
      const { container } = render(<EditableText value="Heading" as="h1" />);
      expect(container.querySelector('h1')).toHaveTextContent('Heading');
    });

    it('should render as h2', () => {
      const { container } = render(<EditableText value="Heading" as="h2" />);
      expect(container.querySelector('h2')).toHaveTextContent('Heading');
    });

    it('should render as h3', () => {
      const { container } = render(<EditableText value="Heading" as="h3" />);
      expect(container.querySelector('h3')).toHaveTextContent('Heading');
    });

    it('should render as p', () => {
      const { container } = render(<EditableText value="Paragraph" as="p" />);
      expect(container.querySelector('p')).toHaveTextContent('Paragraph');
    });

    it('should render as span by default', () => {
      const { container } = render(<EditableText value="Text" />);
      expect(container.querySelector('span')).toHaveTextContent('Text');
    });
  });

  describe('value updates', () => {
    it('should update when value prop changes', async () => {
      const { rerender } = render(<EditableText value="Initial" />);

      expect(screen.getByText('Initial')).toBeInTheDocument();

      rerender(<EditableText value="Updated" />);

      expect(screen.getByText('Updated')).toBeInTheDocument();
    });
  });
});
