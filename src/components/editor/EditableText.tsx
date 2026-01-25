import { useState, useRef, useEffect, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface EditableTextProps {
  value: string;
  onChange?: (value: string) => void;
  isEditing?: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  placeholder?: string;
  style?: CSSProperties;
}

export function EditableText({
  value,
  onChange,
  isEditing = false,
  className,
  as: Component = 'span',
  placeholder = 'לחץ לעריכה...',
  style,
}: EditableTextProps) {
  const [isActive, setIsActive] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isActive]);

  const handleBlur = () => {
    setIsActive(false);
    if (localValue !== value) {
      onChange?.(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setLocalValue(value);
      setIsActive(false);
    }
  };

  if (!isEditing) {
    return (
      <Component className={className} style={style}>
        {value || placeholder}
      </Component>
    );
  }

  if (isActive) {
    return (
      <textarea
        ref={inputRef}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'bg-transparent border-none outline-none resize-none w-full',
          'focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded',
          'min-h-[1.5em]',
          className
        )}
        style={{ height: 'auto', ...style }}
        rows={1}
      />
    );
  }

  return (
    <Component 
      className={cn(
        className,
        'cursor-text hover:bg-primary/10 rounded px-1 -mx-1 transition-colors',
        'border border-transparent hover:border-primary/30'
      )}
      style={style}
      onClick={() => setIsActive(true)}
    >
      {value || <span className="text-muted-foreground italic">{placeholder}</span>}
    </Component>
  );
}
