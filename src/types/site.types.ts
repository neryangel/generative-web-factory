import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import type { ThemeSettings } from './theme.types';

// Base types from Supabase
export type Site = Tables<'sites'>;
export type SiteInsert = TablesInsert<'sites'>;
export type SiteUpdate = TablesUpdate<'sites'>;

export type Page = Tables<'pages'>;
export type PageInsert = TablesInsert<'pages'>;
export type PageUpdate = TablesUpdate<'pages'>;

// Extended types
export interface SiteWithPages extends Site {
  pages: Page[];
}

export interface SiteSettings extends ThemeSettings {
  direction?: 'rtl' | 'ltr';
}

export type SiteStatus = 'draft' | 'published' | 'archived';

export type ViewMode = 'desktop' | 'tablet' | 'mobile';

// Blueprint schema types for templates
export interface BlueprintSection {
  type: string;
  variant?: string;
  content?: Record<string, unknown>;
}

export interface BlueprintPage {
  slug: string;
  title: string;
  isHomepage?: boolean;
  sections?: (string | BlueprintSection)[];
}

export interface BlueprintSettings {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  direction?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
}

export interface BlueprintSchema {
  settings?: BlueprintSettings;
  pages?: BlueprintPage[];
}
