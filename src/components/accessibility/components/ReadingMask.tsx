/**
 * ReadingMask - מסכת קריאה לווידג'ט הנגישות
 * מציג שכבה שמדגישה את האזור שהעכבר/פוקוס נמצא בו
 * תומך גם בעכבר וגם בניווט מקלדת
 */

import React, { useEffect, useState } from 'react';
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
 */
export const ReadingMask: React.FC<ReadingMaskProps> = ({
  height = READING_MASK_HEIGHT,
  opacity = READING_MASK_OPACITY,
}) => {
  const [maskY, setMaskY] = useState(0);

  useEffect(() => {
    // מעקב אחר מיקום העכבר
    const handleMouseMove = (e: MouseEvent) => {
      setMaskY(e.clientY);
    };

    // מעקב אחר פוקוס מקלדת
    const handleFocusIn = () => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement !== document.body) {
        const rect = activeElement.getBoundingClientRect();
        setMaskY(rect.top + rect.height / 2);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('focusin', handleFocusIn);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  const topHeight = Math.max(0, maskY - height / 2);
  const bottomTop = maskY + height / 2;

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
        style={{ 
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: topHeight,
          backgroundColor: `rgba(0, 0, 0, ${opacity})` 
        }}
      />
      <div 
        style={{ 
          position: 'absolute',
          left: 0,
          right: 0,
          top: bottomTop,
          bottom: 0,
          backgroundColor: `rgba(0, 0, 0, ${opacity})` 
        }}
      />
    </div>
  );
};

export default ReadingMask;
