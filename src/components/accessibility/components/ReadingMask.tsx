/**
 * ReadingMask - מסכת קריאה לווידג'ט הנגישות
 * מציג שכבה שמדגישה את האזור שהעכבר/פוקוס נמצא בו
 * תומך גם בעכבר וגם בניווט מקלדת
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { READING_MASK_HEIGHT, READING_MASK_OPACITY, Z_INDEX_READING_MASK } from '../constants';

export interface ReadingMaskProps {
  /** גובה המסכה בפיקסלים */
  height?: number;
  /** אטימות השכבות */
  opacity?: number;
  /** className נוסף */
  className?: string;
}

/**
 * רכיב מסכת קריאה
 * משתמש ב-refs + rAF במקום state כדי למנוע re-render בכל mousemove
 */
export const ReadingMask: React.FC<ReadingMaskProps> = ({
  height = READING_MASK_HEIGHT,
  opacity = READING_MASK_OPACITY,
}) => {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);

  const updateMask = useCallback((y: number) => {
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const topHeight = Math.max(0, y - height / 2);
      const bottomTop = y + height / 2;
      if (topRef.current) {
        topRef.current.style.height = `${topHeight}px`;
      }
      if (bottomRef.current) {
        bottomRef.current.style.top = `${bottomTop}px`;
      }
    });
  }, [height]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updateMask(e.clientY);
    };

    const handleFocusIn = () => {
      const active = document.activeElement as HTMLElement;
      if (active && active !== document.body) {
        const rect = active.getBoundingClientRect();
        updateMask(rect.top + rect.height / 2);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('focusin', handleFocusIn);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('focusin', handleFocusIn);
      cancelAnimationFrame(rafId.current);
    };
  }, [updateMask]);

  return (
    <div
      role="presentation"
      aria-hidden="true"
      data-testid="reading-mask"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: Z_INDEX_READING_MASK,
      }}
    >
      <div
        ref={topRef}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 0,
          backgroundColor: `rgba(0, 0, 0, ${opacity})`
        }}
      />
      <div
        ref={bottomRef}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: `rgba(0, 0, 0, ${opacity})`
        }}
      />
    </div>
  );
};

export default ReadingMask;
