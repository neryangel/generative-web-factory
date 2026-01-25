import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Palette, 
  Type, 
  Square, 
  Sun, 
  Moon,
  Check,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Site = Tables<'sites'>;

interface ThemeSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: 'sharp' | 'rounded' | 'pill';
  darkMode: boolean;
}

interface ThemeCustomizerProps {
  site: Site;
  onUpdate: (site: Site) => void;
}

const fontOptions = [
  { value: 'Assistant', label: 'Assistant' },
  { value: 'Heebo', label: 'Heebo' },
  { value: 'Rubik', label: 'Rubik' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Alef', label: 'Alef' },
  { value: 'Secular One', label: 'Secular One' },
];

const borderRadiusOptions = [
  { value: 'sharp', label: 'חד', preview: 'rounded-none' },
  { value: 'rounded', label: 'מעוגל', preview: 'rounded-lg' },
  { value: 'pill', label: 'כפתור', preview: 'rounded-full' },
];

const defaultColors = {
  primary: '#3b82f6',
  secondary: '#64748b',
  accent: '#06b6d4',
};

export function ThemeCustomizer({ site, onUpdate }: ThemeCustomizerProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    const settings = site.settings as Record<string, unknown> || {};
    const colors = (settings.colors as Record<string, string>) || {};
    const fonts = (settings.fonts as Record<string, string>) || {};
    
    return {
      colors: {
        primary: colors.primary || defaultColors.primary,
        secondary: colors.secondary || defaultColors.secondary,
        accent: colors.accent || defaultColors.accent,
      },
      fonts: {
        heading: fonts.heading || 'Heebo',
        body: fonts.body || 'Heebo',
      },
      borderRadius: (settings.borderRadius as ThemeSettings['borderRadius']) || 'rounded',
      darkMode: (settings.darkMode as boolean) || false,
    };
  });

  // Debounced save
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveTheme();
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [theme]);

  const saveTheme = async () => {
    setIsSaving(true);
    try {
      const newSettings = {
        ...(site.settings as Record<string, unknown> || {}),
        colors: theme.colors,
        fonts: theme.fonts,
        borderRadius: theme.borderRadius,
        darkMode: theme.darkMode,
      };

      const { error } = await supabase
        .from('sites')
        .update({ settings: newSettings })
        .eq('id', site.id);

      if (error) throw error;

      onUpdate({
        ...site,
        settings: newSettings,
      });
    } catch (error) {
      console.error('Error saving theme:', error);
      toast.error('שגיאה בשמירת העיצוב');
    } finally {
      setIsSaving(false);
    }
  };

  const updateColor = (key: keyof ThemeSettings['colors'], value: string) => {
    setTheme(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  };

  const updateFont = (key: keyof ThemeSettings['fonts'], value: string) => {
    setTheme(prev => ({
      ...prev,
      fonts: { ...prev.fonts, [key]: value },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Palette className="w-4 h-4" />
          עיצוב
        </h3>
        {isSaving ? (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        ) : (
          <Check className="w-4 h-4 text-green-500" />
        )}
      </div>

      {/* Colors Section */}
      <div className="space-y-4">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">צבעים</Label>
        
        {/* Primary Color */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">ראשי (Primary)</span>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg border shadow-sm cursor-pointer relative overflow-hidden"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <input
                  type="color"
                  value={theme.colors.primary}
                  onChange={(e) => updateColor('primary', e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
              <input
                type="text"
                value={theme.colors.primary}
                onChange={(e) => updateColor('primary', e.target.value)}
                className="w-20 text-xs bg-muted/50 border rounded px-2 py-1"
              />
            </div>
          </div>
        </div>

        {/* Secondary Color */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">משני (Secondary)</span>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg border shadow-sm cursor-pointer relative overflow-hidden"
                style={{ backgroundColor: theme.colors.secondary }}
              >
                <input
                  type="color"
                  value={theme.colors.secondary}
                  onChange={(e) => updateColor('secondary', e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
              <input
                type="text"
                value={theme.colors.secondary}
                onChange={(e) => updateColor('secondary', e.target.value)}
                className="w-20 text-xs bg-muted/50 border rounded px-2 py-1"
              />
            </div>
          </div>
        </div>

        {/* Accent Color */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">הדגשה (Accent)</span>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg border shadow-sm cursor-pointer relative overflow-hidden"
                style={{ backgroundColor: theme.colors.accent }}
              >
                <input
                  type="color"
                  value={theme.colors.accent}
                  onChange={(e) => updateColor('accent', e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
              <input
                type="text"
                value={theme.colors.accent}
                onChange={(e) => updateColor('accent', e.target.value)}
                className="w-20 text-xs bg-muted/50 border rounded px-2 py-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fonts Section */}
      <div className="space-y-4">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Type className="w-3 h-3" />
          גופנים
        </Label>

        {/* Heading Font */}
        <div className="space-y-2">
          <span className="text-sm">כותרות</span>
          <div className="grid grid-cols-3 gap-2">
            {fontOptions.map((font) => (
              <button
                key={font.value}
                onClick={() => updateFont('heading', font.value)}
                className={`px-2 py-2 text-xs rounded-lg border transition-all ${
                  theme.fonts.heading === font.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/50 hover:bg-muted border-border'
                }`}
                style={{ fontFamily: font.value }}
              >
                {font.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body Font */}
        <div className="space-y-2">
          <span className="text-sm">טקסט</span>
          <div className="grid grid-cols-3 gap-2">
            {fontOptions.map((font) => (
              <button
                key={font.value}
                onClick={() => updateFont('body', font.value)}
                className={`px-2 py-2 text-xs rounded-lg border transition-all ${
                  theme.fonts.body === font.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/50 hover:bg-muted border-border'
                }`}
                style={{ fontFamily: font.value }}
              >
                {font.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Border Radius Section */}
      <div className="space-y-4">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Square className="w-3 h-3" />
          עיגול פינות
        </Label>

        <div className="grid grid-cols-3 gap-2">
          {borderRadiusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTheme(prev => ({ ...prev, borderRadius: option.value as ThemeSettings['borderRadius'] }))}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                theme.borderRadius === option.value
                  ? 'bg-primary/10 border-primary'
                  : 'bg-muted/50 hover:bg-muted border-border'
              }`}
            >
              <div 
                className={`w-8 h-8 bg-primary ${option.preview}`}
              />
              <span className="text-xs">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dark/Light Mode Toggle */}
      <div className="space-y-4">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">מצב תצוגה</Label>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
          <div className="flex items-center gap-3">
            {theme.darkMode ? (
              <Moon className="w-5 h-5 text-primary" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
            <span className="text-sm font-medium">
              {theme.darkMode ? 'מצב כהה' : 'מצב בהיר'}
            </span>
          </div>
          <Switch
            checked={theme.darkMode}
            onCheckedChange={(checked) => setTheme(prev => ({ ...prev, darkMode: checked }))}
          />
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">תצוגה מקדימה</Label>
        <div 
          className={`p-4 rounded-lg border ${theme.darkMode ? 'bg-gray-900' : 'bg-white'}`}
          style={{ 
            borderRadius: theme.borderRadius === 'sharp' ? '0' : theme.borderRadius === 'pill' ? '1.5rem' : '0.5rem'
          }}
        >
          <h4 
            className={`text-lg font-bold mb-2 ${theme.darkMode ? 'text-white' : 'text-gray-900'}`}
            style={{ fontFamily: theme.fonts.heading }}
          >
            כותרת לדוגמה
          </h4>
          <p 
            className={`text-sm mb-3 ${theme.darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            style={{ fontFamily: theme.fonts.body }}
          >
            זהו טקסט לדוגמה שמציג את הגופן שנבחר.
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 text-xs text-white"
              style={{ 
                backgroundColor: theme.colors.primary,
                borderRadius: theme.borderRadius === 'sharp' ? '0' : theme.borderRadius === 'pill' ? '999px' : '0.375rem'
              }}
            >
              כפתור ראשי
            </button>
            <button
              className="px-3 py-1.5 text-xs text-white"
              style={{ 
                backgroundColor: theme.colors.accent,
                borderRadius: theme.borderRadius === 'sharp' ? '0' : theme.borderRadius === 'pill' ? '999px' : '0.375rem'
              }}
            >
              כפתור הדגשה
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
