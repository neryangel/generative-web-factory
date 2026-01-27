/**
 * Zod validation schemas for API layer
 * Provides runtime validation at system boundaries
 */
import { z } from 'zod';

// ═══════════════════════════════════════════
// Common Schemas
// ═══════════════════════════════════════════

export const uuidSchema = z.string().uuid('Invalid UUID format');

export const slugSchema = z
  .string()
  .min(2, 'Slug must be at least 2 characters')
  .max(100, 'Slug must be less than 100 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens');

// ═══════════════════════════════════════════
// Site Schemas
// ═══════════════════════════════════════════

export const siteStatusSchema = z.enum(['draft', 'published', 'archived']);

export const siteSettingsSchema = z.object({
  colors: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    accent: z.string().optional(),
    background: z.string().optional(),
    text: z.string().optional(),
  }).optional(),
  fonts: z.object({
    heading: z.string().optional(),
    body: z.string().optional(),
  }).optional(),
  direction: z.enum(['rtl', 'ltr']).optional(),
}).passthrough(); // Allow additional properties

export const siteInsertSchema = z.object({
  tenant_id: uuidSchema,
  name: z.string().min(1, 'Site name is required').max(255),
  slug: slugSchema,
  template_id: uuidSchema.nullable().optional(),
  status: siteStatusSchema.optional(),
  settings: siteSettingsSchema.optional(),
});

export const siteUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: slugSchema.optional(),
  status: siteStatusSchema.optional(),
  settings: siteSettingsSchema.optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

// ═══════════════════════════════════════════
// Page Schemas
// ═══════════════════════════════════════════

export const pageSeoSchema = z.object({
  title: z.string().max(70).optional(),
  description: z.string().max(160).optional(),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().url().optional(),
}).passthrough();

export const pageInsertSchema = z.object({
  site_id: uuidSchema,
  tenant_id: uuidSchema,
  slug: slugSchema,
  title: z.string().min(1, 'Page title is required').max(255),
  seo: pageSeoSchema.optional(),
  sort_order: z.number().int().min(0).optional(),
  is_homepage: z.boolean().optional(),
});

export const pageUpdateSchema = z.object({
  slug: slugSchema.optional(),
  title: z.string().min(1).max(255).optional(),
  seo: pageSeoSchema.optional(),
  sort_order: z.number().int().min(0).optional(),
  is_homepage: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

// ═══════════════════════════════════════════
// Section Schemas
// ═══════════════════════════════════════════

export const sectionTypeSchema = z.enum([
  'hero',
  'features',
  'gallery',
  'testimonials',
  'cta',
  'contact',
  'about',
  'footer',
  'pricing',
  'team',
  'faq',
  'stats',
]);

export const sectionContentSchema = z.record(z.unknown()).default({});

export const sectionSettingsSchema = z.record(z.unknown()).default({});

export const sectionInsertSchema = z.object({
  page_id: uuidSchema,
  tenant_id: uuidSchema,
  type: sectionTypeSchema,
  variant: z.string().max(50).optional(),
  content: sectionContentSchema.optional(),
  settings: sectionSettingsSchema.optional(),
  sort_order: z.number().int().min(0).optional(),
});

export const sectionUpdateSchema = z.object({
  type: sectionTypeSchema.optional(),
  variant: z.string().max(50).optional(),
  content: sectionContentSchema.optional(),
  settings: sectionSettingsSchema.optional(),
  sort_order: z.number().int().min(0).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

// ═══════════════════════════════════════════
// Domain Schemas
// ═══════════════════════════════════════════

export const domainStatusSchema = z.enum(['pending', 'verifying', 'active', 'failed']);

export const domainSchema = z
  .string()
  .min(4, 'Domain must be at least 4 characters')
  .max(253, 'Domain must be less than 253 characters')
  .regex(
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
    'Invalid domain format'
  );

export const domainInsertSchema = z.object({
  site_id: uuidSchema,
  tenant_id: uuidSchema,
  domain: domainSchema,
  status: domainStatusSchema.optional(),
});

// ═══════════════════════════════════════════
// Tenant Schemas
// ═══════════════════════════════════════════

export const tenantInsertSchema = z.object({
  name: z.string().min(1, 'Tenant name is required').max(255),
  slug: slugSchema,
  plan: z.enum(['free', 'starter', 'professional', 'enterprise']).optional(),
  settings: z.record(z.unknown()).optional(),
});

// ═══════════════════════════════════════════
// Type exports (inferred from schemas)
// ═══════════════════════════════════════════

export type SiteInsertInput = z.infer<typeof siteInsertSchema>;
export type SiteUpdateInput = z.infer<typeof siteUpdateSchema>;
export type PageInsertInput = z.infer<typeof pageInsertSchema>;
export type PageUpdateInput = z.infer<typeof pageUpdateSchema>;
export type SectionInsertInput = z.infer<typeof sectionInsertSchema>;
export type SectionUpdateInput = z.infer<typeof sectionUpdateSchema>;
export type DomainInsertInput = z.infer<typeof domainInsertSchema>;
export type TenantInsertInput = z.infer<typeof tenantInsertSchema>;
