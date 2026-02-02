import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RotateCcw } from 'lucide-react';

export interface SectionStyles {
  backgroundColor?: string;
  textColor?: string;
  paddingY?: 'compact' | 'normal' | 'spacious';
}

interface SectionPropertiesPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionType: string;
  sectionVariant: string;
  styles: SectionStyles;
  onStylesChange: (styles: SectionStyles) => void;
}

const paddingOptions: Array<{ value: SectionStyles['paddingY']; label: string; description: string }> = [
  { value: 'compact', label: 'צפוף', description: 'py-12' },
  { value: 'normal', label: 'רגיל', description: 'py-20' },
  { value: 'spacious', label: 'מרווח', description: 'py-28' },
];

export function SectionPropertiesPanel({
  open,
  onOpenChange,
  sectionType,
  sectionVariant,
  styles,
  onStylesChange,
}: SectionPropertiesPanelProps) {
  const [localStyles, setLocalStyles] = useState<SectionStyles>(styles);

  useEffect(() => {
    setLocalStyles(styles);
  }, [styles]);

  const updateStyle = <K extends keyof SectionStyles>(key: K, value: SectionStyles[K]) => {
    const updated = { ...localStyles, [key]: value };
    setLocalStyles(updated);
    onStylesChange(updated);
  };

  const handleReset = () => {
    const reset: SectionStyles = {};
    setLocalStyles(reset);
    onStylesChange(reset);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            הגדרות סקשן — <span className="capitalize">{sectionType}</span>
          </DialogTitle>
          <DialogDescription>
            {sectionVariant !== 'default' && <span className="capitalize">({sectionVariant}) </span>}
            שנה צבעים ומרווחים לסקשן זה
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* Background Color */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">צבע רקע</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm">רקע</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border shadow-sm cursor-pointer relative overflow-hidden"
                  style={{ backgroundColor: localStyles.backgroundColor || '#ffffff' }}
                >
                  <input
                    type="color"
                    value={localStyles.backgroundColor || '#ffffff'}
                    onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
                <input
                  type="text"
                  value={localStyles.backgroundColor || ''}
                  onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                  placeholder="ברירת מחדל"
                  className="w-24 text-xs bg-muted/50 border rounded px-2 py-1"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">צבע טקסט</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm">טקסט</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border shadow-sm cursor-pointer relative overflow-hidden"
                  style={{ backgroundColor: localStyles.textColor || '#000000' }}
                >
                  <input
                    type="color"
                    value={localStyles.textColor || '#000000'}
                    onChange={(e) => updateStyle('textColor', e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
                <input
                  type="text"
                  value={localStyles.textColor || ''}
                  onChange={(e) => updateStyle('textColor', e.target.value)}
                  placeholder="ברירת מחדל"
                  className="w-24 text-xs bg-muted/50 border rounded px-2 py-1"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Padding */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">מרווחים</Label>
            <div className="grid grid-cols-3 gap-2">
              {paddingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateStyle('paddingY', option.value)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                    (localStyles.paddingY || 'normal') === option.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted/50 hover:bg-muted border-border'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="w-full gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            איפוס לברירת מחדל
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
