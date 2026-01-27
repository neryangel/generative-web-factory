/**
 * ProfilesSelector - Accessibility profile selector
 * @module accessibility/components/ProfilesSelector
 */

import React, { useState } from 'react';
import { ACCESSIBILITY_PROFILES, applyProfile, isProfileActive } from '../profiles';
import { cn } from '../lib/utils';
import type { AccessibilitySettings } from '../types';
import type { AccessibilityTranslations } from '../i18n/translations';

export interface ProfilesSelectorProps {
  currentSettings: AccessibilitySettings;
  onApplyProfile: (newSettings: AccessibilitySettings) => void;
  translations: AccessibilityTranslations;
  language: 'he' | 'en';
}

export const ProfilesSelector: React.FC<ProfilesSelectorProps> = ({
  currentSettings,
  onApplyProfile,
  translations: t,
  language,
}) => {
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);

  const handleApplyProfile = (profileId: string) => {
    const profile = ACCESSIBILITY_PROFILES.find(p => p.id === profileId);
    if (profile) {
      const newSettings = applyProfile(currentSettings, profile);
      onApplyProfile(newSettings);
      setExpandedProfile(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">
        {t.quickProfiles}
      </label>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2">
        {ACCESSIBILITY_PROFILES.map((profile) => {
          const isActive = isProfileActive(currentSettings, profile);
          const isExpanded = expandedProfile === profile.id;
          
          return (
            <button
              key={profile.id}
              onClick={() => {
                if (isActive) return;
                if (isExpanded) {
                  handleApplyProfile(profile.id);
                } else {
                  setExpandedProfile(profile.id);
                }
              }}
              onBlur={() => {
                setTimeout(() => setExpandedProfile(null), 200);
              }}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-lg transition-all text-xs text-center',
                isActive
                  ? 'border-2 border-[hsl(var(--a11y-primary))] bg-[hsl(var(--a11y-primary)/0.1)] cursor-default'
                  : 'border border-[hsl(var(--a11y-border))] bg-[hsl(var(--a11y-background))] cursor-pointer hover:bg-[hsl(var(--a11y-muted))]',
                isExpanded && !isActive ? 'min-h-20' : 'min-h-16'
              )}
              style={{ color: 'hsl(var(--a11y-foreground))' }}
              aria-pressed={isActive}
              aria-label={language === 'he' ? profile.nameHe : profile.nameEn}
            >
              <span className="text-xl" aria-hidden="true">
                {profile.icon}
              </span>
              <span className="font-medium">
                {language === 'he' ? profile.nameHe : profile.nameEn}
              </span>
              
              {isActive && (
                <span className="text-[0.625rem] font-semibold text-[hsl(var(--a11y-primary))]">
                  ✓ {t.active}
                </span>
              )}
              
              {isExpanded && !isActive && (
                <span className="text-[0.625rem] text-[hsl(var(--a11y-muted-foreground))] mt-1">
                  {language === 'he' ? profile.descriptionHe : profile.descriptionEn}
                  <br />
                  <strong className="text-[hsl(var(--a11y-primary))]">
                    {t.apply} →
                  </strong>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
