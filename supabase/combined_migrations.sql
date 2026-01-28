-- ═══════════════════════════════════════════════════════════════
-- AMDIR Multi-Tenant Site Builder - Phase 1: Foundation Schema
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════

CREATE TYPE site_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE domain_status AS ENUM ('pending', 'verifying', 'active', 'failed');
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'editor', 'viewer');

-- ═══════════════════════════════════════════
-- GLOBAL TABLES (no tenant_id - system-wide)
-- ═══════════════════════════════════════════

-- Templates: Global, managed by system admins
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    blueprint_schema JSONB NOT NULL DEFAULT '{}',
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Section Registry: Available section types
CREATE TABLE section_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    schema JSONB NOT NULL DEFAULT '{}',
    default_content JSONB NOT NULL DEFAULT '{}',
    supported_variants TEXT[] DEFAULT '{}',
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- TENANT-SCOPED TABLES (RLS enforced)
-- ═══════════════════════════════════════════

-- Tenants: Organizations/accounts
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan TEXT DEFAULT 'free',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tenant Members: User-to-Tenant mapping with roles
CREATE TABLE tenant_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    user_id UUID NOT NULL,
    role user_role DEFAULT 'viewer',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(tenant_id, user_id)
);

-- User Profiles: Additional user data
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sites: Websites owned by tenants
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    template_id UUID REFERENCES templates(id),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    status site_status DEFAULT 'draft',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(tenant_id, slug)
);

-- Pages: Pages within sites
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    seo JSONB DEFAULT '{}',
    sort_order INT DEFAULT 0,
    is_homepage BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(site_id, slug)
);

-- Sections: Content blocks within pages
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    variant TEXT DEFAULT 'default',
    content JSONB NOT NULL DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Assets: Media files (images, documents, etc.)
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
    filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT,
    alt_text TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Publishes: Published versions/snapshots
CREATE TABLE publishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    version INT NOT NULL,
    snapshot JSONB NOT NULL,
    changelog TEXT,
    published_by UUID,
    is_current BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(site_id, version)
);

-- Domains: Custom domains for sites
CREATE TABLE domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    domain TEXT UNIQUE NOT NULL,
    status domain_status DEFAULT 'pending',
    ssl_status TEXT DEFAULT 'pending',
    cf_hostname_id TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit Log: Track all changes
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
    user_id UUID,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    payload JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════

CREATE INDEX idx_tenant_members_user ON tenant_members(user_id);
CREATE INDEX idx_tenant_members_tenant ON tenant_members(tenant_id);
CREATE INDEX idx_sites_tenant ON sites(tenant_id);
CREATE INDEX idx_sites_status ON sites(status);
CREATE INDEX idx_pages_site ON pages(site_id);
CREATE INDEX idx_sections_page ON sections(page_id);
CREATE INDEX idx_assets_tenant ON assets(tenant_id);
CREATE INDEX idx_publishes_site ON publishes(site_id);
CREATE INDEX idx_domains_site ON domains(site_id);
CREATE INDEX idx_audit_log_tenant ON audit_log(tenant_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);

-- ═══════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════

-- Enable RLS on all tenant-scoped tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if user is member of tenant
CREATE OR REPLACE FUNCTION public.is_tenant_member(p_tenant_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM tenant_members
        WHERE tenant_id = p_tenant_id AND user_id = p_user_id
    );
$$;

-- Helper function: Get user's tenants
CREATE OR REPLACE FUNCTION public.get_user_tenants(p_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT tenant_id FROM tenant_members WHERE user_id = p_user_id;
$$;

-- Helper function: Check if user has role in tenant
CREATE OR REPLACE FUNCTION public.has_tenant_role(p_tenant_id UUID, p_user_id UUID, p_roles user_role[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM tenant_members
        WHERE tenant_id = p_tenant_id 
          AND user_id = p_user_id 
          AND role = ANY(p_roles)
    );
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Tenants policies
CREATE POLICY "Users can view their tenants"
    ON tenants FOR SELECT
    USING (id IN (SELECT public.get_user_tenants(auth.uid())));

CREATE POLICY "Users can create tenants"
    ON tenants FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Owners can update tenants"
    ON tenants FOR UPDATE
    USING (public.has_tenant_role(id, auth.uid(), ARRAY['owner']::user_role[]));

-- Tenant Members policies
CREATE POLICY "Members can view tenant members"
    ON tenant_members FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Owners/Admins can manage members"
    ON tenant_members FOR ALL
    USING (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin']::user_role[]));

-- Sites policies
CREATE POLICY "Members can view sites"
    ON sites FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Editors can manage sites"
    ON sites FOR ALL
    USING (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin', 'editor']::user_role[]));

-- Pages policies
CREATE POLICY "Members can view pages"
    ON pages FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Editors can manage pages"
    ON pages FOR ALL
    USING (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin', 'editor']::user_role[]));

-- Sections policies
CREATE POLICY "Members can view sections"
    ON sections FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Editors can manage sections"
    ON sections FOR ALL
    USING (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin', 'editor']::user_role[]));

-- Assets policies
CREATE POLICY "Members can view assets"
    ON assets FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Editors can manage assets"
    ON assets FOR ALL
    USING (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin', 'editor']::user_role[]));

-- Publishes policies
CREATE POLICY "Members can view publishes"
    ON publishes FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Editors can create publishes"
    ON publishes FOR INSERT
    WITH CHECK (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin', 'editor']::user_role[]));

-- Domains policies
CREATE POLICY "Members can view domains"
    ON domains FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Admins can manage domains"
    ON domains FOR ALL
    USING (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin']::user_role[]));

-- Audit Log policies
CREATE POLICY "Members can view audit log"
    ON audit_log FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "System can insert audit log"
    ON audit_log FOR INSERT
    WITH CHECK (public.is_tenant_member(tenant_id, auth.uid()));

-- ═══════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_sites_updated_at
    BEFORE UPDATE ON sites
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_sections_updated_at
    BEFORE UPDATE ON sections
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-add creator as owner when tenant is created
CREATE OR REPLACE FUNCTION public.handle_new_tenant()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.tenant_members (tenant_id, user_id, role)
    VALUES (NEW.id, auth.uid(), 'owner');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_tenant_created
    AFTER INSERT ON tenants
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_tenant();

-- ═══════════════════════════════════════════
-- SEED DATA: Default Section Registry
-- ═══════════════════════════════════════════

INSERT INTO section_registry (type, name, description, schema, default_content, supported_variants, icon) VALUES
('hero', 'Hero Section', 'Main banner with headline and CTA', 
 '{"headline": "string", "subheadline": "string", "cta_primary": {"text": "string", "url": "string"}, "cta_secondary": {"text": "string", "url": "string"}, "background_image": "string", "overlay_opacity": "number"}',
 '{"headline": "ברוכים הבאים", "subheadline": "תיאור קצר של העסק שלך", "cta_primary": {"text": "צור קשר", "url": "#contact"}}',
 ARRAY['centered', 'split', 'video', 'minimal'], 'layout'),

('features', 'Features Section', 'Highlight key features or services',
 '{"title": "string", "subtitle": "string", "items": [{"icon": "string", "title": "string", "description": "string"}]}',
 '{"title": "השירותים שלנו", "subtitle": "מה אנחנו מציעים", "items": []}',
 ARRAY['grid', 'list', 'cards', 'icons'], 'grid'),

('gallery', 'Gallery Section', 'Image gallery or portfolio',
 '{"title": "string", "images": [{"src": "string", "alt": "string", "caption": "string"}]}',
 '{"title": "הגלריה שלנו", "images": []}',
 ARRAY['grid', 'masonry', 'carousel', 'lightbox'], 'image'),

('testimonials', 'Testimonials Section', 'Customer reviews and quotes',
 '{"title": "string", "items": [{"quote": "string", "author": "string", "role": "string", "avatar": "string"}]}',
 '{"title": "מה הלקוחות אומרים", "items": []}',
 ARRAY['carousel', 'grid', 'single', 'cards'], 'quote'),

('cta', 'Call to Action', 'Conversion-focused section',
 '{"headline": "string", "description": "string", "button": {"text": "string", "url": "string"}, "background_color": "string"}',
 '{"headline": "מוכנים להתחיל?", "description": "צרו איתנו קשר עוד היום", "button": {"text": "דברו איתנו", "url": "#contact"}}',
 ARRAY['simple', 'split', 'banner', 'floating'], 'megaphone'),

('contact', 'Contact Section', 'Contact form and information',
 '{"title": "string", "subtitle": "string", "email": "string", "phone": "string", "address": "string", "show_form": "boolean", "show_map": "boolean"}',
 '{"title": "צור קשר", "subtitle": "נשמח לשמוע ממך", "show_form": true, "show_map": false}',
 ARRAY['form', 'split', 'minimal', 'full'], 'mail'),

('about', 'About Section', 'Company or personal story',
 '{"title": "string", "content": "string", "image": "string", "stats": [{"value": "string", "label": "string"}]}',
 '{"title": "אודותינו", "content": "ספרו את הסיפור שלכם כאן"}',
 ARRAY['story', 'team', 'timeline', 'stats'], 'users'),

('footer', 'Footer Section', 'Site footer with links and info',
 '{"logo": "string", "tagline": "string", "links": [{"title": "string", "items": [{"text": "string", "url": "string"}]}], "social": [{"platform": "string", "url": "string"}], "copyright": "string"}',
 '{"copyright": "© 2025 כל הזכויות שמורות", "links": [], "social": []}',
 ARRAY['simple', 'columns', 'minimal', 'mega'], 'layout-grid');

-- ═══════════════════════════════════════════
-- SEED DATA: Default Template (Restaurant)
-- ═══════════════════════════════════════════

INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('restaurant-starter', 'מסעדה - בסיסי', 'restaurant', 'תבנית בסיסית לאתר מסעדה עם תפריט, גלריה וצור קשר',
'{
  "meta": {
    "name": "",
    "template_id": "restaurant-starter",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#D97706",
      "secondary": "#78350F",
      "accent": "#FCD34D",
      "background": "#FFFBEB",
      "text": "#1F2937"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    }
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף הבית",
      "sections": ["hero", "features", "gallery", "testimonials", "cta", "footer"]
    },
    {
      "slug": "menu",
      "title": "תפריט",
      "sections": ["hero", "features", "footer"]
    },
    {
      "slug": "contact",
      "title": "צור קשר",
      "sections": ["contact", "footer"]
    }
  ]
}', true);-- ═══════════════════════════════════════════════════════════════
-- AMDIR - Security Fixes: Enable RLS on Global Tables + Fix Policies
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS on global tables (templates, section_registry)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_registry ENABLE ROW LEVEL SECURITY;

-- Templates: Read-only for all authenticated users
CREATE POLICY "Anyone can view active templates"
    ON templates FOR SELECT
    USING (is_active = true);

-- Section Registry: Read-only for all authenticated users
CREATE POLICY "Anyone can view active sections"
    ON section_registry FOR SELECT
    USING (is_active = true);

-- Fix the overly permissive tenant creation policy
DROP POLICY IF EXISTS "Users can create tenants" ON tenants;

CREATE POLICY "Authenticated users can create tenants"
    ON tenants FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Fix functions with mutable search_path
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;-- ===========================================
-- FIX #1: Drop existing problematic policies and recreate correctly
-- ===========================================

-- Drop the problematic policy that prevents tenant creation
DROP POLICY IF EXISTS "Authenticated users can create tenants" ON public.tenants;

-- Recreate with PERMISSIVE policy (critical fix)
CREATE POLICY "Authenticated users can create tenants" 
ON public.tenants 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- ===========================================
-- FIX #2: Fix tenant_members policies for initial membership creation
-- The trigger runs AFTER insert, so we need to allow it to add the owner
-- ===========================================

-- Drop existing policies
DROP POLICY IF EXISTS "Owners/Admins can manage members" ON public.tenant_members;
DROP POLICY IF EXISTS "Members can view tenant members" ON public.tenant_members;

-- Create policy that allows the trigger to insert initial owner membership
-- The trigger runs as SECURITY DEFINER so it can insert, but we also need
-- a policy for the initial insert by the system
CREATE POLICY "Allow initial owner membership via trigger" 
ON public.tenant_members 
FOR INSERT 
TO authenticated
WITH CHECK (
    -- Allow if user is creating their own membership as owner for a tenant they just created
    user_id = auth.uid() AND role = 'owner'
);

-- Re-create view policy
CREATE POLICY "Members can view tenant members" 
ON public.tenant_members 
FOR SELECT 
TO authenticated
USING (is_tenant_member(tenant_id, auth.uid()));

-- Owners/Admins can update and delete members (not insert - that's handled by trigger)
CREATE POLICY "Owners/Admins can update members" 
ON public.tenant_members 
FOR UPDATE 
TO authenticated
USING (has_tenant_role(tenant_id, auth.uid(), ARRAY['owner'::user_role, 'admin'::user_role]));

CREATE POLICY "Owners/Admins can delete members" 
ON public.tenant_members 
FOR DELETE 
TO authenticated
USING (has_tenant_role(tenant_id, auth.uid(), ARRAY['owner'::user_role, 'admin'::user_role]));

-- ===========================================
-- FIX #3: Ensure the trigger exists and works correctly
-- ===========================================

-- Drop and recreate trigger to ensure it's properly attached
DROP TRIGGER IF EXISTS on_tenant_created ON public.tenants;

-- Recreate the trigger
CREATE TRIGGER on_tenant_created
    AFTER INSERT ON public.tenants
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_tenant();

-- Also ensure the profiles trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();-- Fix tenant creation RLS - Clean slate approach
-- Drop all existing policies on tenants table
DROP POLICY IF EXISTS "Users can create tenants" ON public.tenants;
DROP POLICY IF EXISTS "Authenticated users can create tenants" ON public.tenants;
DROP POLICY IF EXISTS "Users can view their tenants" ON public.tenants;
DROP POLICY IF EXISTS "Owners can update tenants" ON public.tenants;
DROP POLICY IF EXISTS "tenant_insert_policy" ON public.tenants;
DROP POLICY IF EXISTS "tenant_select_policy" ON public.tenants;
DROP POLICY IF EXISTS "tenant_update_policy" ON public.tenants;

-- Drop existing policies on tenant_members for insert
DROP POLICY IF EXISTS "Allow initial owner membership via trigger" ON public.tenant_members;
DROP POLICY IF EXISTS "tenant_members_insert_policy" ON public.tenant_members;

-- Create clean policies for tenants table
CREATE POLICY "tenant_insert_policy" 
ON public.tenants 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "tenant_select_policy" 
ON public.tenants 
FOR SELECT 
TO authenticated
USING (id IN (SELECT public.get_user_tenants(auth.uid())));

CREATE POLICY "tenant_update_policy" 
ON public.tenants 
FOR UPDATE 
TO authenticated
USING (public.has_tenant_role(id, auth.uid(), ARRAY['owner']::user_role[]));

-- Create policy for tenant_members insert (for trigger)
CREATE POLICY "tenant_members_insert_policy" 
ON public.tenant_members 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Recreate the trigger function to ensure it works
CREATE OR REPLACE FUNCTION public.handle_new_tenant()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.tenant_members (tenant_id, user_id, role)
    VALUES (NEW.id, auth.uid(), 'owner');
    RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_tenant_created ON public.tenants;
CREATE TRIGGER on_tenant_created
    AFTER INSERT ON public.tenants
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_tenant();-- First, drop the existing problematic trigger on tenants
DROP TRIGGER IF EXISTS on_new_tenant ON public.tenants;

-- Update the handle_new_tenant function to accept user_id as parameter from the tenant insert
-- Since the existing trigger causes issues, we'll handle tenant_members creation differently

-- Create trigger function to automatically create a personal tenant for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_tenant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_tenant_id uuid;
BEGIN
  -- Create a personal tenant for the new user
  INSERT INTO public.tenants (name, slug)
  VALUES (
    'האתרים שלי',
    'user-' || substr(NEW.user_id::text, 1, 8)
  )
  RETURNING id INTO new_tenant_id;
  
  -- Add the user as owner of the tenant (using NEW.user_id from profiles trigger)
  INSERT INTO public.tenant_members (tenant_id, user_id, role)
  VALUES (new_tenant_id, NEW.user_id, 'owner');
  
  RETURN NEW;
END;
$$;

-- Create trigger to run after user profile is created
DROP TRIGGER IF EXISTS on_profile_created_create_tenant ON public.profiles;
CREATE TRIGGER on_profile_created_create_tenant
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_tenant();-- Drop the old trigger function that's causing issues
DROP FUNCTION IF EXISTS public.handle_new_tenant() CASCADE;-- Create storage bucket for site assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assets',
  'assets',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
);

-- RLS Policy: Anyone can view public assets
CREATE POLICY "Public assets are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');

-- RLS Policy: Tenant members can upload assets to their tenant folder
CREATE POLICY "Tenant members can upload assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'assets' 
  AND auth.uid() IS NOT NULL
  AND public.is_tenant_member(
    (storage.foldername(name))[1]::uuid,
    auth.uid()
  )
);

-- RLS Policy: Tenant members can update their assets
CREATE POLICY "Tenant members can update assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'assets'
  AND auth.uid() IS NOT NULL
  AND public.is_tenant_member(
    (storage.foldername(name))[1]::uuid,
    auth.uid()
  )
);

-- RLS Policy: Tenant editors can delete assets
CREATE POLICY "Tenant editors can delete assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'assets'
  AND auth.uid() IS NOT NULL
  AND public.has_tenant_role(
    (storage.foldername(name))[1]::uuid,
    auth.uid(),
    ARRAY['owner'::user_role, 'admin'::user_role, 'editor'::user_role]
  )
);-- ═══════════════════════════════════════════════════════════════
-- AMDIR - Fix Public Site Access for Anonymous Visitors
-- ═══════════════════════════════════════════════════════════════
-- Published sites need to be viewable by anyone (for public-facing rendered sites)
-- The middleware routes custom domains to /sites/[domain], but without these
-- policies, database queries fail for unauthenticated visitors.

-- ═══════════════════════════════════════════════════════════════
-- SITES: Allow anonymous access to published sites
-- ═══════════════════════════════════════════════════════════════

CREATE POLICY "Anyone can view published sites"
    ON sites FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

-- ═══════════════════════════════════════════════════════════════
-- PAGES: Allow anonymous access to pages of published sites
-- ═══════════════════════════════════════════════════════════════

CREATE POLICY "Anyone can view pages of published sites"
    ON pages FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM sites
            WHERE sites.id = pages.site_id
            AND sites.status = 'published'
        )
    );

-- ═══════════════════════════════════════════════════════════════
-- SECTIONS: Allow anonymous access to sections of published sites
-- ═══════════════════════════════════════════════════════════════

CREATE POLICY "Anyone can view sections of published sites"
    ON sections FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM pages
            JOIN sites ON sites.id = pages.site_id
            WHERE pages.id = sections.page_id
            AND sites.status = 'published'
        )
    );

-- ═══════════════════════════════════════════════════════════════
-- DOMAINS: Allow anonymous lookup of active domains
-- ═══════════════════════════════════════════════════════════════

CREATE POLICY "Anyone can lookup active domains"
    ON domains FOR SELECT
    TO anon, authenticated
    USING (status = 'active');

-- ═══════════════════════════════════════════════════════════════
-- PUBLISHES: Allow anonymous access to current published versions
-- ═══════════════════════════════════════════════════════════════

CREATE POLICY "Anyone can view current published versions"
    ON publishes FOR SELECT
    TO anon, authenticated
    USING (
        is_current = true
        AND EXISTS (
            SELECT 1 FROM sites
            WHERE sites.id = publishes.site_id
            AND sites.status = 'published'
        )
    );

-- ═══════════════════════════════════════════════════════════════
-- ASSETS: Allow anonymous access to assets of published sites
-- ═══════════════════════════════════════════════════════════════

CREATE POLICY "Anyone can view assets of published sites"
    ON assets FOR SELECT
    TO anon, authenticated
    USING (
        site_id IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM sites
            WHERE sites.id = assets.site_id
            AND sites.status = 'published'
        )
    );

-- ═══════════════════════════════════════════════════════════════
-- Performance: Add index for status lookups
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_sites_status_published
    ON sites(status) WHERE status = 'published';
-- ═══════════════════════════════════════════════════════════════
-- AMDIR - Architectural Fixes for Enterprise Scalability
-- ═══════════════════════════════════════════════════════════════
-- Fixes:
-- 1. Global slug uniqueness to prevent collision on /s/[slug] routes
-- 2. Composite indexes for RLS policy performance at scale
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- FIX 1: Global Slug Uniqueness
-- ═══════════════════════════════════════════════════════════════
-- Problem: Site slugs are unique per-tenant but preview route /s/[slug]
-- serves sites globally. Two tenants could create slug "my-restaurant"
-- causing collision on public preview URL.

-- First drop the existing constraint
ALTER TABLE sites DROP CONSTRAINT IF EXISTS sites_tenant_id_slug_key;

-- Add global uniqueness constraint on slug
ALTER TABLE sites ADD CONSTRAINT sites_slug_key UNIQUE (slug);

-- ═══════════════════════════════════════════════════════════════
-- FIX 2: Composite Indexes for RLS Performance
-- ═══════════════════════════════════════════════════════════════
-- Problem: RLS policies call is_tenant_member(tenant_id, user_id) on every
-- query. At scale (1000+ tenants, 100k+ sites), this causes full table scans.

-- Optimal index for tenant membership lookups (used by is_tenant_member function)
CREATE INDEX IF NOT EXISTS idx_tenant_members_lookup
    ON tenant_members(tenant_id, user_id);

-- Composite index for sites queries filtered by tenant and status
CREATE INDEX IF NOT EXISTS idx_sites_tenant_status
    ON sites(tenant_id, status);

-- Composite index for pages with site and tenant (for RLS joins)
CREATE INDEX IF NOT EXISTS idx_pages_site_tenant
    ON pages(site_id, tenant_id);

-- Composite index for sections with page and tenant (for RLS joins)
CREATE INDEX IF NOT EXISTS idx_sections_page_tenant
    ON sections(page_id, tenant_id);

-- Index for publishes lookups by site and current status
CREATE INDEX IF NOT EXISTS idx_publishes_site_current
    ON publishes(site_id, is_current) WHERE is_current = true;

-- Index for domains by site and status
CREATE INDEX IF NOT EXISTS idx_domains_site_status
    ON domains(site_id, status);

-- Index for assets by tenant and site
CREATE INDEX IF NOT EXISTS idx_assets_tenant_site
    ON assets(tenant_id, site_id);

-- ═══════════════════════════════════════════════════════════════
-- Performance: Analyze tables after index creation
-- ═══════════════════════════════════════════════════════════════
ANALYZE tenant_members;
ANALYZE sites;
ANALYZE pages;
ANALYZE sections;
ANALYZE publishes;
ANALYZE domains;
ANALYZE assets;
-- ═══════════════════════════════════════════════════════════════
-- Migration: Add diverse website templates with variant support
-- Each template uses different section variants for visual diversity
-- ═══════════════════════════════════════════════════════════════

-- Template 1: SaaS Modern - Tech/startup dark theme with centered hero
INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('saas-modern', 'SaaS מודרני', 'saas', 'תבנית מודרנית למוצר SaaS עם דף נחיתה מרשים, תמחור ו-FAQ',
'{
  "meta": {
    "name": "SaaS מודרני",
    "template_id": "saas-modern",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#6366F1",
      "secondary": "#1E1B4B",
      "accent": "#06B6D4"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    },
    "direction": "rtl"
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף הבית",
      "sections": [
        { "type": "hero", "variant": "default", "content": { "headline": "הפלטפורמה שתשנה את העסק שלכם", "subheadline": "ניהול חכם, אוטומציה מתקדמת, ותובנות בזמן אמת. הכל במקום אחד.", "cta_text": "התחילו בחינם", "secondary_cta_text": "צפו בדמו", "badge_text": "חדש! גרסה 3.0 כאן" } },
        { "type": "features", "variant": "default", "content": { "title": "למה לבחור בנו?", "subtitle": "כל הכלים שאתם צריכים לנהל עסק מצליח", "items": [{ "icon": "Zap", "title": "מהירות בזק", "description": "ביצועים מהירים פי 10 מהמתחרים" }, { "icon": "Shield", "title": "אבטחה מתקדמת", "description": "הצפנה מקצה לקצה והגנה על המידע שלכם" }, { "icon": "BarChart3", "title": "אנליטיקס חכם", "description": "תובנות מבוססות AI שעוזרות לקבל החלטות" }, { "icon": "Users", "title": "עבודת צוות", "description": "שיתוף פעולה חלק בין כל חברי הצוות" }, { "icon": "Globe", "title": "גלובלי", "description": "תמיכה ב-40+ שפות ומטבעות" }, { "icon": "HeadphonesIcon", "title": "תמיכה 24/7", "description": "צוות מומחים זמין לכם בכל שעה" }] } },
        { "type": "stats", "variant": "default", "content": { "title": "המספרים מדברים", "subtitle": "תוצאות מוכחות מלקוחות אמיתיים", "stats": [{ "value": 50000, "suffix": "+", "label": "משתמשים פעילים", "icon": "Users" }, { "value": 99, "suffix": "%", "label": "שביעות רצון", "icon": "Award" }, { "value": 150, "suffix": "+", "label": "אינטגרציות", "icon": "Globe" }, { "value": 24, "suffix": "/7", "label": "תמיכה זמינה", "icon": "TrendingUp" }] } },
        { "type": "testimonials", "variant": "default", "content": { "title": "מה הלקוחות אומרים", "subtitle": "אלפי עסקים כבר סומכים עלינו" } },
        { "type": "pricing", "variant": "default", "content": { "title": "תכניות מחירים", "subtitle": "בחרו את התכנית שמתאימה לכם" } },
        { "type": "faq", "variant": "default", "content": { "title": "שאלות נפוצות", "subtitle": "תשובות לשאלות הנפוצות ביותר" } },
        { "type": "cta", "variant": "default", "content": { "headline": "מוכנים להתחיל?", "description": "הצטרפו לאלפי עסקים שכבר משתמשים בפלטפורמה שלנו", "button_text": "התחילו בחינם עכשיו" } },
        { "type": "footer", "variant": "default" }
      ]
    }
  ]
}', true);

-- Template 2: Portfolio Minimal - Clean, typography-focused
INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('portfolio-minimal', 'פורטפוליו מינימלי', 'portfolio', 'תבנית נקייה ומינימלית לאנשי קריאייטיב, מעצבים וצלמים',
'{
  "meta": {
    "name": "פורטפוליו מינימלי",
    "template_id": "portfolio-minimal",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#18181B",
      "secondary": "#27272A",
      "accent": "#A1A1AA"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    },
    "direction": "rtl"
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף הבית",
      "sections": [
        { "type": "hero", "variant": "minimal", "content": { "headline": "עיצוב שמספר סיפור", "subheadline": "מעצב/ת חוויות דיגיטליות. יוצר/ת מותגים שנזכרים.", "cta_text": "צפו בעבודות" } },
        { "type": "gallery", "variant": "masonry", "content": { "title": "עבודות נבחרות", "subtitle": "פרויקטים שעיצבתי עבור מותגים מובילים" } },
        { "type": "about", "variant": "team", "content": { "title": "קצת עליי", "content": "מעצב/ת עם למעלה מ-10 שנות ניסיון בעיצוב דיגיטלי, מיתוג וחוויית משתמש. עובד/ת עם מותגים מהארץ ומהעולם.", "features": ["עיצוב UI/UX", "מיתוג ושפה חזותית", "עיצוב אתרים ואפליקציות", "הדרכות עיצוב"] } },
        { "type": "testimonials", "variant": "single", "content": { "title": "המלצות", "subtitle": "" } },
        { "type": "contact", "variant": "minimal", "content": { "title": "בואו נדבר", "subtitle": "מוזמנים לפנות לשיתוף פעולה, פרויקט חדש, או סתם לשיחה", "email": "hello@studio.co.il", "phone": "050-1234567" } },
        { "type": "footer", "variant": "minimal" }
      ]
    }
  ]
}', true);

-- Template 3: Business Professional - Split hero, corporate feel
INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('business-pro', 'עסקי מקצועי', 'business', 'תבנית מקצועית לעסקים עם צוות, שירותים ודף יצירת קשר',
'{
  "meta": {
    "name": "עסקי מקצועי",
    "template_id": "business-pro",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#0F766E",
      "secondary": "#134E4A",
      "accent": "#2DD4BF"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    },
    "direction": "rtl"
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף הבית",
      "sections": [
        { "type": "hero", "variant": "split", "content": { "headline": "פתרונות עסקיים שעובדים", "subheadline": "אנחנו עוזרים לעסקים לצמוח עם שירותי ייעוץ, אסטרטגיה וטכנולוגיה מתקדמת.", "cta_text": "קבעו פגישת ייעוץ", "secondary_cta_text": "גלו את השירותים", "badge_text": "מובילים בתחום מאז 2010" } },
        { "type": "features", "variant": "cards", "content": { "title": "השירותים שלנו", "subtitle": "פתרונות מותאמים אישית לכל עסק", "items": [{ "icon": "BarChart3", "title": "ייעוץ אסטרטגי", "description": "בניית תכנית עסקית מותאמת למטרות שלכם" }, { "icon": "Users", "title": "ניהול פרויקטים", "description": "ליווי מקצועי מהרעיון ועד לביצוע" }, { "icon": "TrendingUp", "title": "שיווק דיגיטלי", "description": "קמפיינים ממוקדים שמביאים תוצאות" }, { "icon": "Code", "title": "פיתוח טכנולוגי", "description": "פתרונות טכנולוגיים חדשניים" }] } },
        { "type": "stats", "variant": "inline", "content": { "stats": [{ "value": 500, "suffix": "+", "label": "פרויקטים שהושלמו", "icon": "Award" }, { "value": 200, "suffix": "+", "label": "לקוחות מרוצים", "icon": "Users" }, { "value": 15, "suffix": "+", "label": "שנות ניסיון", "icon": "TrendingUp" }, { "value": 98, "suffix": "%", "label": "שביעות רצון", "icon": "Star" }] } },
        { "type": "about", "variant": "default", "content": { "title": "הסיפור שלנו", "content": "הוקמנו מתוך אמונה שכל עסק ראוי לייעוץ מקצועי ברמה הגבוהה ביותר. עם צוות מומחים ושנים של ניסיון, אנחנו כאן כדי לקחת את העסק שלכם לשלב הבא." } },
        { "type": "testimonials", "variant": "grid", "content": { "title": "לקוחות ממליצים", "subtitle": "שמענו מה הלקוחות שלנו חושבים" } },
        { "type": "cta", "variant": "floating", "content": { "headline": "מוכנים לקחת את העסק לשלב הבא?", "description": "צוות המומחים שלנו מחכה לשמוע מכם", "button_text": "קבעו פגישה חינם" } },
        { "type": "footer", "variant": "default" }
      ]
    },
    {
      "slug": "team",
      "title": "הצוות",
      "sections": [
        { "type": "hero", "variant": "minimal", "content": { "headline": "הצוות שלנו", "subheadline": "אנשים מוכשרים שמאמינים בשינוי", "cta_text": "הצטרפו אלינו" } },
        { "type": "team", "variant": "default" },
        { "type": "footer", "variant": "default" }
      ]
    },
    {
      "slug": "contact",
      "title": "צור קשר",
      "sections": [
        { "type": "contact", "variant": "split", "content": { "title": "דברו איתנו", "subtitle": "נשמח לשמוע מכם ולעזור בכל שאלה", "email": "info@business.co.il", "phone": "03-1234567", "address": "רחוב הרצל 1, תל אביב" } },
        { "type": "footer", "variant": "default" }
      ]
    }
  ]
}', true);

-- Template 4: Restaurant Premium - Warm, immersive, gradient hero
INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('restaurant-premium', 'מסעדה פרימיום', 'restaurant', 'תבנית יוקרתית למסעדות עם אווירה חמה, גלריה מרשימה וטפסי הזמנה',
'{
  "meta": {
    "name": "מסעדה פרימיום",
    "template_id": "restaurant-premium",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#B45309",
      "secondary": "#451A03",
      "accent": "#F59E0B"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    },
    "direction": "rtl"
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף הבית",
      "sections": [
        { "type": "hero", "variant": "video", "content": { "headline": "טעמים שמספרים סיפור", "subheadline": "חוויה קולינרית שמשלבת מסורת עם חדשנות. כל מנה נוצרת באהבה ובמקצועיות.", "cta_text": "הזמינו שולחן", "secondary_cta_text": "לתפריט" } },
        { "type": "about", "variant": "default", "content": { "title": "הסיפור שלנו", "content": "כבר למעלה מ-20 שנה אנחנו מגישים מנות שנוצרות מחומרי גלם טריים ומקומיים. השף הראשי שלנו מביא השראה ממטבחי העולם ומשלב אותה עם המסורת הישראלית.", "features": ["חומרי גלם מקומיים", "שף בינלאומי מוביל", "חדר יין פרטי", "אירועים מיוחדים"] } },
        { "type": "gallery", "variant": "masonry", "content": { "title": "מהמטבח שלנו", "subtitle": "רגעים של טעם ויופי" } },
        { "type": "features", "variant": "list", "content": { "title": "למה אצלנו?", "subtitle": "", "items": [{ "icon": "Star", "title": "חומרי גלם מובחרים", "description": "עובדים רק עם ספקים מקומיים ואיכותיים" }, { "icon": "Award", "title": "שף מעטר פרסים", "description": "השף שלנו זכה ב-3 כוכבי מישלן" }, { "icon": "Heart", "title": "אווירה ייחודית", "description": "עיצוב פנים שמשלב חום ביתי עם אלגנטיות" }] } },
        { "type": "testimonials", "variant": "cards", "content": { "title": "מה אומרים עלינו", "subtitle": "" } },
        { "type": "cta", "variant": "banner", "content": { "headline": "הזמינו שולחן עוד היום", "button_text": "להזמנה" } },
        { "type": "footer", "variant": "simple" }
      ]
    },
    {
      "slug": "menu",
      "title": "תפריט",
      "sections": [
        { "type": "hero", "variant": "minimal", "content": { "headline": "התפריט שלנו", "subheadline": "מנות שנוצרו באהבה" } },
        { "type": "features", "variant": "cards", "content": { "title": "מנות פופולריות", "subtitle": "הטעמים האהובים ביותר", "items": [{ "icon": "UtensilsCrossed", "title": "פילה בקר", "description": "פילה מושלם עם רוטב יין אדום, פירה כמהין ואספרגוס" }, { "icon": "UtensilsCrossed", "title": "ריזוטו פטריות", "description": "ריזוטו קרמי עם פטריות יער, פרמז׳ן ושמן כמהין" }, { "icon": "UtensilsCrossed", "title": "דג ים", "description": "פילה דניס טרי עם ירקות עונתיים ורוטב לימון" }] } },
        { "type": "footer", "variant": "simple" }
      ]
    },
    {
      "slug": "contact",
      "title": "צור קשר",
      "sections": [
        { "type": "contact", "variant": "full", "content": { "title": "בואו לבקר אותנו", "subtitle": "או שמרו שולחן לערב מושלם", "email": "info@restaurant.co.il", "phone": "03-9876543", "address": "שדרות רוטשילד 45, תל אביב", "hours": "א-ה 12:00-23:00, ו-ש 18:00-00:00" } },
        { "type": "footer", "variant": "simple" }
      ]
    }
  ]
}', true);

-- Template 5: Clinic / Medical - Soft, trustworthy, split hero
INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('clinic-care', 'קליניקה מקצועית', 'clinic', 'תבנית רכה ומקצועית לקליניקות, רופאים ומטפלים',
'{
  "meta": {
    "name": "קליניקה מקצועית",
    "template_id": "clinic-care",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#0EA5E9",
      "secondary": "#0C4A6E",
      "accent": "#38BDF8"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    },
    "direction": "rtl"
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף הבית",
      "sections": [
        { "type": "hero", "variant": "split", "content": { "headline": "הבריאות שלכם בידיים טובות", "subheadline": "צוות רפואי מקצועי, טכנולוגיה מתקדמת, וגישה אישית לכל מטופל. הקליניקה שלנו מציעה טיפול ברמה הגבוהה ביותר.", "cta_text": "קבעו תור", "secondary_cta_text": "התחומים שלנו", "badge_text": "קליניקה מובילה בישראל" } },
        { "type": "features", "variant": "cards", "content": { "title": "התחומים שלנו", "subtitle": "מגוון רחב של שירותים רפואיים", "items": [{ "icon": "Heart", "title": "רפואה פנימית", "description": "אבחון וטיפול מקיף במחלות פנימיות" }, { "icon": "Eye", "title": "רפואת עיניים", "description": "בדיקות עיניים מתקדמות וטיפולי לייזר" }, { "icon": "Bone", "title": "אורתופדיה", "description": "טיפול בבעיות שלד ומפרקים" }, { "icon": "Brain", "title": "נוירולוגיה", "description": "אבחון וטיפול במערכת העצבים" }] } },
        { "type": "team", "variant": "default", "content": { "title": "הצוות הרפואי", "subtitle": "מומחים מובילים בתחומם" } },
        { "type": "testimonials", "variant": "grid", "content": { "title": "מטופלים ממליצים", "subtitle": "חוות דעת ממטופלים מרוצים" } },
        { "type": "faq", "variant": "minimal", "content": { "title": "שאלות נפוצות", "subtitle": "תשובות לשאלות שנשאלות הרבה", "items": [{ "question": "האם אתם עובדים עם קופות חולים?", "answer": "כן, אנחנו עובדים עם כל קופות החולים ומרבית חברות הביטוח.", "category": "כללי" }, { "question": "כמה זמן ממתינים לתור?", "answer": "זמני ההמתנה משתנים לפי המחלקה. תורים דחופים ניתנים בו ביום.", "category": "תורים" }, { "question": "האם יש חניה?", "answer": "כן, חניון תת-קרקעי פעיל לרשות המטופלים.", "category": "כללי" }] } },
        { "type": "cta", "variant": "floating", "content": { "headline": "מוכנים לקבוע תור?", "description": "הצוות שלנו מחכה לכם", "button_text": "קבעו תור עכשיו" } },
        { "type": "footer", "variant": "default" }
      ]
    },
    {
      "slug": "contact",
      "title": "צור קשר",
      "sections": [
        { "type": "contact", "variant": "split", "content": { "title": "צרו קשר", "subtitle": "נשמח לעזור לכם", "email": "info@clinic.co.il", "phone": "03-5551234", "address": "רחוב ויצמן 10, תל אביב", "hours": "א-ה 08:00-20:00, ו 08:00-13:00" } },
        { "type": "footer", "variant": "default" }
      ]
    }
  ]
}', true);

-- Template 6: Landing Page - High conversion, gradient hero
INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('landing-conversion', 'דף נחיתה ממיר', 'landing', 'דף נחיתה עם hero מרשים, הוכחות חברתיות וטופס ליד',
'{
  "meta": {
    "name": "דף נחיתה ממיר",
    "template_id": "landing-conversion",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#7C3AED",
      "secondary": "#1E1B4B",
      "accent": "#F472B6"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    },
    "direction": "rtl"
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף נחיתה",
      "sections": [
        { "type": "hero", "variant": "video", "content": { "headline": "הגיע הזמן לשינוי אמיתי", "subheadline": "הצטרפו לאלפי אנשים שכבר שינו את חייהם. תכנית מוכחת שנותנת תוצאות.", "cta_text": "הצטרפו עכשיו", "secondary_cta_text": "גלו איך" } },
        { "type": "stats", "variant": "inline", "content": { "stats": [{ "value": 10000, "suffix": "+", "label": "מצטרפים", "icon": "Users" }, { "value": 97, "suffix": "%", "label": "הצלחה", "icon": "Award" }, { "value": 30, "suffix": " יום", "label": "לתוצאות", "icon": "TrendingUp" }] } },
        { "type": "features", "variant": "default", "content": { "title": "איך זה עובד?", "subtitle": "3 שלבים פשוטים לתוצאות מדהימות", "items": [{ "icon": "UserPlus", "title": "שלב 1: הרשמה", "description": "נרשמים בקלות תוך דקה אחת" }, { "icon": "Settings", "title": "שלב 2: התאמה אישית", "description": "מקבלים תכנית מותאמת אישית" }, { "icon": "Rocket", "title": "שלב 3: תוצאות", "description": "רואים תוצאות כבר אחרי שבוע" }] } },
        { "type": "testimonials", "variant": "default", "content": { "title": "סיפורי הצלחה", "subtitle": "שמעו מאנשים אמיתיים" } },
        { "type": "pricing", "variant": "simple", "content": { "title": "בחרו את המסלול", "subtitle": "30 יום אחריות החזר כספי מלא" } },
        { "type": "faq", "variant": "grid", "content": { "title": "שאלות ותשובות", "subtitle": "" } },
        { "type": "cta", "variant": "default", "content": { "headline": "אל תפספסו את ההזדמנות", "description": "ההצעה מוגבלת! הצטרפו עכשיו וקבלו 50% הנחה", "button_text": "אני רוצה להצטרף" } },
        { "type": "footer", "variant": "minimal" }
      ]
    }
  ]
}', true);

-- Template 7: Real Estate - Luxury, full-bleed, gallery-focused
INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('realestate-luxury', 'נדל"ן יוקרתי', 'realestate', 'תבנית יוקרתית לנדל"ן עם גלריה מרשימה ופרטי נכסים',
'{
  "meta": {
    "name": "נדלן יוקרתי",
    "template_id": "realestate-luxury",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#B8860B",
      "secondary": "#1C1917",
      "accent": "#D4A853"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    },
    "direction": "rtl"
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף הבית",
      "sections": [
        { "type": "hero", "variant": "video", "content": { "headline": "הבית שחלמתם עליו", "subheadline": "נכסי יוקרה במיקומים הטובים ביותר. שירות אישי, מקצועיות ודיסקרטיות.", "cta_text": "לנכסים שלנו", "secondary_cta_text": "צרו קשר" } },
        { "type": "features", "variant": "minimal", "content": { "title": "למה אנחנו?", "subtitle": "", "items": [{ "icon": "Home", "title": "נכסי פרימיום", "description": "רק נכסים ברמה הגבוהה ביותר" }, { "icon": "Shield", "title": "דיסקרטיות מלאה", "description": "כל עסקה מתנהלת בדיסקרטיות מוחלטת" }, { "icon": "Users", "title": "שירות אישי", "description": "סוכן מקצועי צמוד לכל לקוח" }, { "icon": "Globe", "title": "חשיפה בינלאומית", "description": "גישה לקונים מכל העולם" }] } },
        { "type": "gallery", "variant": "carousel", "content": { "title": "נכסים נבחרים", "subtitle": "הצצה לנכסי היוקרה שלנו" } },
        { "type": "stats", "variant": "minimal", "content": { "stats": [{ "value": 2, "suffix": "B+", "label": "שווי נכסים שנמכרו", "icon": "TrendingUp" }, { "value": 350, "suffix": "+", "label": "נכסים שנמכרו", "icon": "Home" }, { "value": 25, "suffix": "+", "label": "שנות ניסיון", "icon": "Award" }, { "value": 100, "suffix": "%", "label": "שביעות רצון", "icon": "Star" }] } },
        { "type": "testimonials", "variant": "single", "content": { "title": "לקוחות מספרים", "subtitle": "" } },
        { "type": "cta", "variant": "split", "content": { "headline": "מחפשים נכס יוקרתי?", "description": "צוות המומחים שלנו ילווה אתכם בכל שלב. שיחת ייעוץ ראשונה ללא עלות.", "button_text": "דברו איתנו" } },
        { "type": "footer", "variant": "simple" }
      ]
    },
    {
      "slug": "contact",
      "title": "צור קשר",
      "sections": [
        { "type": "contact", "variant": "minimal", "content": { "title": "נשמח לשמוע מכם", "subtitle": "השאירו פרטים ונחזור אליכם בהקדם", "email": "luxury@realestate.co.il", "phone": "054-9876543", "address": "מגדל אלקטרה, דרך מנחם בגין 154, תל אביב" } },
        { "type": "footer", "variant": "simple" }
      ]
    }
  ]
}', true);

-- Template 8: Event / Wedding - Vibrant, dynamic, carousel gallery
INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('event-vibrant', 'אירועים ואירגון', 'event', 'תבנית דינמית לחברות הפקה, אירועים וחתונות',
'{
  "meta": {
    "name": "אירועים ואירגון",
    "template_id": "event-vibrant",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#E11D48",
      "secondary": "#4C0519",
      "accent": "#FB7185"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    },
    "direction": "rtl"
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף הבית",
      "sections": [
        { "type": "hero", "variant": "video", "content": { "headline": "רגעים שלא ישכחו", "subheadline": "מהפקות אינטימיות ועד אירועים של אלפים. כל אירוע מקבל את היחס המלא.", "cta_text": "דברו איתנו", "secondary_cta_text": "צפו בגלריה" } },
        { "type": "gallery", "variant": "masonry", "content": { "title": "מהאירועים שלנו", "subtitle": "רגעים שאנחנו גאים בהם" } },
        { "type": "features", "variant": "list", "content": { "title": "השירותים שלנו", "subtitle": "", "items": [{ "icon": "PartyPopper", "title": "הפקת אירועים", "description": "תכנון והפקה מלאה מא' עד ת'" }, { "icon": "Camera", "title": "צילום ווידאו", "description": "תיעוד מקצועי שישמור את הרגעים" }, { "icon": "Music", "title": "DJ ומוזיקה", "description": "אווירה מושלמת עם המוזיקה הנכונה" }, { "icon": "Flower2", "title": "עיצוב ופרחים", "description": "עיצוב מרהיב שמשלים את האווירה" }] } },
        { "type": "testimonials", "variant": "cards", "content": { "title": "זוגות מספרים", "subtitle": "חוויות מאירועים שהפקנו" } },
        { "type": "stats", "variant": "default", "content": { "title": "במספרים", "subtitle": "", "stats": [{ "value": 1200, "suffix": "+", "label": "אירועים שהפקנו", "icon": "Star" }, { "value": 50000, "suffix": "+", "label": "אורחים מרוצים", "icon": "Users" }, { "value": 8, "suffix": "+", "label": "שנות ניסיון", "icon": "Award" }] } },
        { "type": "cta", "variant": "default", "content": { "headline": "מתכננים אירוע?", "description": "צרו קשר ונבנה יחד את האירוע המושלם", "button_text": "קבלו הצעת מחיר" } },
        { "type": "footer", "variant": "default" }
      ]
    },
    {
      "slug": "contact",
      "title": "צור קשר",
      "sections": [
        { "type": "contact", "variant": "full", "content": { "title": "בואו ניצור משהו מיוחד", "subtitle": "ספרו לנו על האירוע שלכם", "email": "events@studio.co.il", "phone": "054-1234567", "address": "שדרות ירושלים 25, תל אביב" } },
        { "type": "footer", "variant": "default" }
      ]
    }
  ]
}', true);
