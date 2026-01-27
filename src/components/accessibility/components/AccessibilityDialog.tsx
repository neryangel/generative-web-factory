/**
 * AccessibilityDialog - Main accessibility dialog
 * @module accessibility/components/AccessibilityDialog
 */

import React from 'react';
import {
  AccessibilityIcon,
  AlignJustifyIcon,
  CircleIcon,
  ContrastIcon,
  EyeOffIcon,
  LinkIcon,
  MinusIcon,
  MousePointerIcon,
  PauseIcon,
  RotateCcwIcon,
  TypeIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from '../icons';
import { AccessibilityButton } from './AccessibilityButton';
import { ToggleButton } from './ToggleButton';
import { ProfilesSelector } from './ProfilesSelector';
import { getShortcutDisplay } from '../lib/keyboardUtils';
import { MAX_FONT_SIZE_LEVEL, MIN_FONT_SIZE_LEVEL, Z_INDEX_DIALOG } from '../constants';
import { cn } from '../lib/utils';
import type { AccessibilitySettings } from '../types';
import type { AccessibilityTranslations } from '../i18n/translations';
import type { AccessibilityFeatureKey } from '../admin/types';

export interface AccessibilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  onReset: () => void;
  onHide: () => void;
  onApplyProfile: (settings: AccessibilitySettings) => void;
  translations: AccessibilityTranslations;
  isRTL: boolean;
  position: 'left' | 'right';
  statementUrl: string;
  language: string;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  isFeatureEnabled?: (feature: AccessibilityFeatureKey) => boolean;
}

export const AccessibilityDialog: React.FC<AccessibilityDialogProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSetting,
  onReset,
  onHide,
  onApplyProfile,
  translations: t,
  isRTL,
  position,
  statementUrl,
  language,
  increaseFontSize,
  decreaseFontSize,
  containerRef,
  isFeatureEnabled,
}) => {
  if (!isOpen) return null;

  const fontSizeLabels = [
    t.fontSizeNormal,
    t.fontSizeLarge,
    t.fontSizeXLarge,
    t.fontSizeXXLarge,
  ];

  // Helper to check if feature should be shown
  const shouldShowFeature = (feature: AccessibilityFeatureKey): boolean => {
    if (!isFeatureEnabled) return true;
    return isFeatureEnabled(feature);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50"
        style={{ zIndex: Z_INDEX_DIALOG }}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Panel with Focus Trap */}
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
        data-accessibility-widget="dialog"
        className={cn(
          'fixed w-80 max-h-[80vh] overflow-y-auto rounded-lg border shadow-2xl isolate',
          position === 'left' ? 'left-4' : 'right-4',
          'bottom-4'
        )}
        style={{
          zIndex: Z_INDEX_DIALOG,
          backgroundColor: 'hsl(var(--a11y-background))',
          color: 'hsl(var(--a11y-foreground))',
          borderColor: 'hsl(var(--a11y-border))',
        }}
      >
        {/* Header */}
        <div 
          className="sticky top-0 p-4 flex items-center justify-between border-b"
          style={{
            backgroundColor: 'hsl(var(--a11y-background))',
            borderColor: 'hsl(var(--a11y-border))',
          }}
        >
          <div className="flex items-center gap-2">
            <AccessibilityIcon 
              className="w-5 h-5 text-[hsl(var(--a11y-primary))]"
              aria-hidden="true" 
            />
            <h2 className="font-semibold text-lg leading-7 m-0">
              {t.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded border-none bg-transparent cursor-pointer hover:bg-[hsl(var(--a11y-muted))] transition-colors"
            style={{ color: 'hsl(var(--a11y-foreground))' }}
            aria-label={t.close}
          >
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-4">
          
          {/* Quick Profiles */}
          <ProfilesSelector 
            currentSettings={settings}
            onApplyProfile={onApplyProfile}
            translations={t}
            language={language as 'he' | 'en'}
          />

          {/* Font Size */}
          {shouldShowFeature('fontSize') && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {t.fontSize}
              </label>
              <div className="flex items-center gap-2">
                <AccessibilityButton
                  variant="outline"
                  size="icon"
                  onClick={decreaseFontSize}
                  disabled={settings.fontSize === MIN_FONT_SIZE_LEVEL}
                  aria-label={t.decreaseFont}
                >
                  <ZoomOutIcon className="h-4 w-4" />
                </AccessibilityButton>
                <span className="flex-1 text-center text-sm">
                  {fontSizeLabels[settings.fontSize]}
                </span>
                <AccessibilityButton
                  variant="outline"
                  size="icon"
                  onClick={increaseFontSize}
                  disabled={settings.fontSize === MAX_FONT_SIZE_LEVEL}
                  aria-label={t.increaseFont}
                >
                  <ZoomInIcon className="h-4 w-4" />
                </AccessibilityButton>
              </div>
            </div>
          )}

          {/* Toggle Buttons */}
          <div className="flex flex-col gap-2">
            {shouldShowFeature('highContrast') && (
              <ToggleButton
                icon={ContrastIcon}
                label={t.highContrast}
                active={settings.highContrast}
                onClick={() => onUpdateSetting('highContrast', !settings.highContrast)}
                isRtl={isRTL}
              />
            )}
            
            {shouldShowFeature('highlightLinks') && (
              <ToggleButton
                icon={LinkIcon}
                label={t.highlightLinks}
                active={settings.highlightLinks}
                onClick={() => onUpdateSetting('highlightLinks', !settings.highlightLinks)}
                isRtl={isRTL}
              />
            )}
            
            {shouldShowFeature('pauseAnimations') && (
              <ToggleButton
                icon={PauseIcon}
                label={t.pauseAnimations}
                active={settings.pauseAnimations}
                onClick={() => onUpdateSetting('pauseAnimations', !settings.pauseAnimations)}
                isRtl={isRTL}
              />
            )}
            
            {shouldShowFeature('largeCursor') && (
              <ToggleButton
                icon={MousePointerIcon}
                label={t.largeCursor}
                active={settings.largeCursor}
                onClick={() => onUpdateSetting('largeCursor', !settings.largeCursor)}
                isRtl={isRTL}
              />
            )}
            
            {shouldShowFeature('readingMask') && (
              <ToggleButton
                icon={MinusIcon}
                label={t.readingMask}
                active={settings.readingMask}
                onClick={() => onUpdateSetting('readingMask', !settings.readingMask)}
                isRtl={isRTL}
              />
            )}
            
            {shouldShowFeature('grayscale') && (
              <ToggleButton
                icon={CircleIcon}
                label={t.grayscale}
                active={settings.grayscale}
                onClick={() => onUpdateSetting('grayscale', !settings.grayscale)}
                isRtl={isRTL}
              />
            )}
            
            {shouldShowFeature('textSpacing') && (
              <ToggleButton
                icon={AlignJustifyIcon}
                label={t.textSpacing}
                active={settings.textSpacing}
                onClick={() => onUpdateSetting('textSpacing', !settings.textSpacing)}
                isRtl={isRTL}
              />
            )}
            
            {shouldShowFeature('dyslexiaFont') && (
              <ToggleButton
                icon={TypeIcon}
                label={t.dyslexiaFont}
                active={settings.dyslexiaFont}
                onClick={() => onUpdateSetting('dyslexiaFont', !settings.dyslexiaFont)}
                isRtl={isRTL}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <AccessibilityButton
              variant="outline"
              className="flex-1"
              onClick={onReset}
            >
              <RotateCcwIcon className="w-4 h-4 me-2" aria-hidden="true" />
              {t.reset}
            </AccessibilityButton>
            
            <AccessibilityButton
              variant="outline"
              className="flex-1"
              onClick={onHide}
            >
              <EyeOffIcon className="w-4 h-4 me-2" aria-hidden="true" />
              {t.hideWidget}
            </AccessibilityButton>
          </div>

          {/* Keyboard Shortcut Notice */}
          <p className="text-xs text-center text-[hsl(var(--a11y-muted-foreground))]">
            {t.keyboardShortcutPrefix} {getShortcutDisplay()}
          </p>

          {/* Accessibility Statement Link */}
          <a
            href={statementUrl}
            className="block text-center text-sm text-[hsl(var(--a11y-primary))] rounded hover:underline"
          >
            {t.statement}
          </a>
        </div>
      </div>
    </>
  );
};
