/**
 * AccessibilityAdmin - דף ניהול הגדרות ווידג'ט הנגישות
 */

import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { useAdminSettings } from './useAdminSettings';
import { type AdminLanguage, adminTranslations } from './translations';
import { styles } from './styles';
import { RotateCcwIcon, SettingsIcon } from '../icons';

export interface AccessibilityAdminProps {
  defaultLanguage?: AdminLanguage;
  onSave?: () => void;
  showHeader?: boolean;
  className?: string;
}

export const AccessibilityAdmin: React.FC<AccessibilityAdminProps> = ({
  defaultLanguage = 'he',
  onSave,
  showHeader = true,
  className,
}) => {
  const [language, setLanguage] = useState<AdminLanguage>(defaultLanguage);
  const t = adminTranslations[language];
  const isRTL = language === 'he';

  const { save, reset, hasUnsavedChanges, isSaved } = useAdminSettings();

  const handleSave = () => {
    save();
    onSave?.();
  };

  return (
    <div className={cn(styles.container, className)} dir={isRTL ? 'rtl' : 'ltr'}>
      {showHeader && (
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              <SettingsIcon size={28} />
              {t.pageTitle}
            </h1>
            <p className={styles.description}>{t.pageDescription}</p>
            <div className={cn(styles.languageSwitch, 'mt-4')}>
              <button onClick={() => setLanguage('he')} className={cn(styles.languageButton, language === 'he' ? styles.languageActive : styles.languageInactive)} aria-label="החלף לעברית" aria-pressed={language === 'he'}>עברית</button>
              { }
              <button onClick={() => setLanguage('en')} className={cn(styles.languageButton, language === 'en' ? styles.languageActive : styles.languageInactive)} aria-label="Switch to English" aria-pressed={language === 'en'}>English</button>
            </div>
          </div>
        </header>
      )}
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <button onClick={handleSave} disabled={!hasUnsavedChanges && !isSaved} className={cn(styles.button, 'w-full', isSaved ? styles.buttonSuccess : styles.buttonPrimary)}>
              {isSaved ? `✓ ${t.saved}` : t.save}
            </button>
            <button onClick={reset} className={cn(styles.button, styles.buttonSecondary, 'w-full mt-3')}>
              <span className="flex items-center justify-center gap-2"><RotateCcwIcon size={16} />{t.reset}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
