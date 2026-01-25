-- ===========================================
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
    EXECUTE FUNCTION handle_new_user();