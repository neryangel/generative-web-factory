import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ReadingMask } from '../components/ReadingMask';

describe('ReadingMask', () => {
  it('should render with aria-hidden and role=presentation', () => {
    const { getByTestId } = render(<ReadingMask />);
    const mask = getByTestId('reading-mask');
    expect(mask).toHaveAttribute('aria-hidden', 'true');
    expect(mask).toHaveAttribute('role', 'presentation');
  });

  it('should have pointer-events: none so it does not block interaction', () => {
    const { getByTestId } = render(<ReadingMask />);
    expect(getByTestId('reading-mask').style.pointerEvents).toBe('none');
  });

  it('should render two overlay divs (top and bottom)', () => {
    const { getByTestId } = render(<ReadingMask />);
    const children = getByTestId('reading-mask').children;
    expect(children).toHaveLength(2);
  });

  it('should apply custom opacity', () => {
    const { getByTestId } = render(<ReadingMask opacity={0.4} />);
    const topOverlay = getByTestId('reading-mask').children[0] as HTMLElement;
    expect(topOverlay.style.backgroundColor).toContain('0.4');
  });
});
