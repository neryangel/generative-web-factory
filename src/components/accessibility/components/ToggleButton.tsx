/**
 * ToggleButton - Accessibility widget toggle button
 * Standalone component with independent styling using a11y tokens
 */

import React, { useState } from 'react';
import { cn } from '../lib/utils';

export interface ToggleButtonProps {
  /** Icon to display */
  icon: React.ElementType;
  /** Button label */
  label: string;
  /** Whether active */
  active: boolean;
  /** Click handler */
  onClick: () => void;
  /** RTL direction */
  isRtl?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Toggle button with icon and label
 * Uses independent colors for full site isolation
 */
export const ToggleButton: React.FC<ToggleButtonProps> = ({
  icon: Icon,
  label,
  active,
  onClick,
  isRtl = false,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate transform based on text direction
  const getToggleTransform = () => {
    if (isRtl) {
      return active ? 'translateX(2px)' : 'translateX(14px)';
    }
    return active ? 'translateX(14px)' : 'translateX(2px)';
  };

  const getBackgroundColor = () => {
    if (active) return 'hsl(var(--a11y-primary) / 0.1)';
    if (isHovered) return 'hsl(var(--a11y-muted))';
    return 'hsl(var(--a11y-background))';
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-lg border transition-colors',
        className
      )}
      style={{
        backgroundColor: getBackgroundColor(),
        borderColor: active ? 'hsl(var(--a11y-primary))' : 'hsl(var(--a11y-border))',
        color: active ? 'hsl(var(--a11y-primary))' : 'hsl(var(--a11y-foreground))',
      }}
      aria-pressed={active}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="flex-1 text-start text-sm">{label}</span>
      <div 
        className="w-8 h-5 rounded-full transition-colors relative"
        style={{
          backgroundColor: active 
            ? 'hsl(var(--a11y-primary))' 
            : 'hsl(var(--a11y-muted-foreground) / 0.3)',
        }}
      >
        <div 
          className="absolute top-0.5 w-4 h-4 rounded-full bg-[hsl(var(--a11y-background))] transition-transform"
          style={{ transform: getToggleTransform() }}
        />
      </div>
    </button>
  );
};

export default ToggleButton;
