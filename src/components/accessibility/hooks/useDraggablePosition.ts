/**
 * useDraggablePosition - Hook לניהול מיקום גריר
 * שומר מיקום ב-localStorage ומספק snap to edges
 * 
 * @module accessibility/hooks/useDraggablePosition
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/** מפתח לשמירת מיקום ב-localStorage */
const POSITION_STORAGE_KEY = 'accessibility-button-position';

/** מרווח מקצה המסך בפיקסלים */
const EDGE_MARGIN = 16;

/** מרחק ל-snap אוטומטי לקצה */
const SNAP_THRESHOLD = 50;

/** מיקום ברירת מחדל */
const DEFAULT_POSITION = { x: 0, y: 0 };

export interface Position {
  x: number;
  y: number;
}

export interface UseDraggablePositionOptions {
  /** מיקום התחלתי (לפני שנטען מ-localStorage) */
  initialPosition?: Position;
  /** האם לאפשר snap לקצוות */
  snapToEdges?: boolean;
  /** צד ברירת מחדל */
  defaultSide?: 'left' | 'right';
  /** מרחק מלמטה בפיקסלים */
  bottomOffset?: number;
}

export interface UseDraggablePositionReturn {
  /** מיקום נוכחי (offset מברירת מחדל) */
  position: Position;
  /** האם נמצא בגרירה */
  isDragging: boolean;
  /** התחלת גרירה */
  handleDragStart: (e: React.MouseEvent | React.TouchEvent) => void;
  /** סיום גרירה */
  handleDragEnd: () => void;
  /** איפוס למיקום ברירת מחדל */
  resetPosition: () => void;
  /** ref לאלמנט */
  dragRef: React.RefObject<HTMLButtonElement>;
}

/**
 * Hook לניהול מיקום גריר של כפתור הנגישות
 */
export function useDraggablePosition(
  options: UseDraggablePositionOptions = {}
): UseDraggablePositionReturn {
  const {
    initialPosition = DEFAULT_POSITION,
    snapToEdges = true,
    defaultSide = 'right',
    bottomOffset = 80,
  } = options;

  const dragRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<Position>(() => {
    if (typeof window === 'undefined') return initialPosition;
    try {
      const stored = localStorage.getItem(POSITION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { x?: unknown; y?: unknown };
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return { x: parsed.x, y: parsed.y };
        }
      }
    } catch {
      // ignore
    }
    return initialPosition;
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<Position>({ x: 0, y: 0 });
  const elementStartPos = useRef<Position>({ x: 0, y: 0 });

  // שמירה ב-localStorage
  useEffect(() => {
    try {
      localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(position));
    } catch {
      // ignore
    }
  }, [position]);

  /**
   * Clamp position so the button stays fully inside the viewport.
   * Works independently of snapToEdges — always enforced.
   */
  const clampToViewport = useCallback((pos: Position): Position => {
    if (!dragRef.current) return pos;

    const buttonRect = dragRef.current.getBoundingClientRect();
    const buttonWidth = buttonRect.width;
    const buttonHeight = buttonRect.height;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const defaultX = defaultSide === 'right'
      ? windowWidth - buttonWidth - EDGE_MARGIN
      : EDGE_MARGIN;
    const defaultY = windowHeight - bottomOffset - buttonHeight;

    const minX = EDGE_MARGIN - defaultX;
    const maxX = windowWidth - buttonWidth - EDGE_MARGIN - defaultX;
    const minY = EDGE_MARGIN - defaultY;
    const maxY = windowHeight - buttonHeight - EDGE_MARGIN - defaultY;

    return {
      x: Math.max(minX, Math.min(maxX, pos.x)),
      y: Math.max(minY, Math.min(maxY, pos.y)),
    };
  }, [defaultSide, bottomOffset]);

  /**
   * Snap לקצה הקרוב ביותר
   */
  const snapToNearestEdge = useCallback((pos: Position): Position => {
    if (!snapToEdges || !dragRef.current) return clampToViewport(pos);

    const buttonRect = dragRef.current.getBoundingClientRect();
    const buttonWidth = buttonRect.width;
    const buttonHeight = buttonRect.height;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // חישוב מיקום אבסולוטי נוכחי
    const defaultX = defaultSide === 'right'
      ? windowWidth - buttonWidth - EDGE_MARGIN
      : EDGE_MARGIN;
    const defaultY = windowHeight - bottomOffset - buttonHeight;

    const absoluteX = defaultX + pos.x;
    const absoluteY = defaultY + pos.y;

    let snappedX = pos.x;
    let snappedY = pos.y;

    // Snap לצד שמאל
    if (absoluteX < SNAP_THRESHOLD) {
      snappedX = EDGE_MARGIN - defaultX;
    }
    // Snap לצד ימין
    else if (absoluteX > windowWidth - buttonWidth - SNAP_THRESHOLD) {
      snappedX = windowWidth - buttonWidth - EDGE_MARGIN - defaultX;
    }

    // Snap למעלה
    if (absoluteY < SNAP_THRESHOLD) {
      snappedY = EDGE_MARGIN - defaultY;
    }
    // Snap למטה
    else if (absoluteY > windowHeight - buttonHeight - SNAP_THRESHOLD) {
      snappedY = windowHeight - buttonHeight - EDGE_MARGIN - defaultY;
    }

    return clampToViewport({ x: snappedX, y: snappedY });
  }, [snapToEdges, defaultSide, bottomOffset, clampToViewport]);

  /**
   * התחלת גרירה
   */
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragStartPos.current = { x: clientX, y: clientY };
    elementStartPos.current = { ...position };
  }, [position]);

  /**
   * תנועה בזמן גרירה
   */
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - dragStartPos.current.x;
    const deltaY = clientY - dragStartPos.current.y;

    const raw = {
      x: elementStartPos.current.x + deltaX,
      y: elementStartPos.current.y + deltaY,
    };
    setPosition(clampToViewport(raw));
  }, [isDragging, clampToViewport]);

  /**
   * סיום גרירה
   */
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Snap לקצה
    setPosition(prev => snapToNearestEdge(prev));
  }, [isDragging, snapToNearestEdge]);

  /**
   * איפוס למיקום ברירת מחדל
   */
  const resetPosition = useCallback(() => {
    setPosition(DEFAULT_POSITION);
  }, []);

  // Event listeners לגרירה
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => handleDragMove(e);
    const handleTouchMove = (e: TouchEvent) => handleDragMove(e);
    const handleMouseUp = () => handleDragEnd();
    const handleTouchEnd = () => handleDragEnd();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);

    // שנה cursor בזמן גרירה
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Handle window resize - keep button in bounds
  useEffect(() => {
    const handleResize = () => {
      if (dragRef.current) {
        setPosition(prev => snapToNearestEdge(prev));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [snapToNearestEdge]);

  return {
    position,
    isDragging,
    handleDragStart,
    handleDragEnd,
    resetPosition,
    dragRef,
  };
}
