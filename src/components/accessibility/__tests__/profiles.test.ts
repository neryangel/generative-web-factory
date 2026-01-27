import { describe, it, expect } from 'vitest';
import { ACCESSIBILITY_PROFILES, DEFAULT_SETTINGS, applyProfile, isProfileActive } from '../profiles';
import type { AccessibilitySettings } from '../types';

describe('profiles', () => {
  describe('ACCESSIBILITY_PROFILES', () => {
    it('should have at least one profile defined', () => {
      expect(ACCESSIBILITY_PROFILES.length).toBeGreaterThan(0);
    });

    it('each profile should have required fields', () => {
      for (const profile of ACCESSIBILITY_PROFILES) {
        expect(profile).toHaveProperty('id');
        expect(profile).toHaveProperty('nameHe');
        expect(profile).toHaveProperty('nameEn');
        expect(profile).toHaveProperty('descriptionHe');
        expect(profile).toHaveProperty('descriptionEn');
        expect(profile).toHaveProperty('icon');
        expect(profile).toHaveProperty('settings');
        expect(typeof profile.id).toBe('string');
      }
    });
  });

  describe('applyProfile', () => {
    it('should merge profile settings onto current settings', () => {
      const profile = ACCESSIBILITY_PROFILES[0];
      const result = applyProfile(DEFAULT_SETTINGS, profile);

      // Profile settings should override defaults
      for (const [key, value] of Object.entries(profile.settings)) {
        expect(result[key as keyof AccessibilitySettings]).toBe(value);
      }
    });

    it('should preserve settings not defined in the profile', () => {
      const current: AccessibilitySettings = { ...DEFAULT_SETTINGS, largeCursor: true };
      const profile = ACCESSIBILITY_PROFILES[0];

      // Only check if largeCursor is not part of this profile
      if (!('largeCursor' in profile.settings)) {
        const result = applyProfile(current, profile);
        expect(result.largeCursor).toBe(true);
      }
    });
  });

  describe('isProfileActive', () => {
    it('should return false when no profile settings are applied', () => {
      const profile = ACCESSIBILITY_PROFILES[0];
      expect(isProfileActive(DEFAULT_SETTINGS, profile)).toBe(false);
    });

    it('should return true when all profile settings match', () => {
      const profile = ACCESSIBILITY_PROFILES[0];
      const applied = applyProfile(DEFAULT_SETTINGS, profile);
      expect(isProfileActive(applied, profile)).toBe(true);
    });
  });
});
