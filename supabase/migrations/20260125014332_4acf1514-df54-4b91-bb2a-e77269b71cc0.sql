-- ═══════════════════════════════════════════════════════════════
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
$$;