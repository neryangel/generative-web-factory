-- Fix tenant creation RLS - Clean slate approach
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
    EXECUTE FUNCTION public.handle_new_tenant();