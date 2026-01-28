import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * CORS headers for public site endpoint
 *
 * IMPORTANT: This endpoint intentionally allows all origins (*) because:
 * 1. It serves published sites on custom domains (user's own domains)
 * 2. These domains are unpredictable and user-configured
 * 3. The endpoint is read-only and serves only public/published content
 *
 * SECURITY: Uses anon key with RLS policies that allow public access to
 * published content only. Never use service role key for public endpoints.
 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    const domain = url.searchParams.get("domain");

    if (!slug && !domain) {
      return new Response(
        JSON.stringify({ error: "Missing slug or domain parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    // SECURITY: Use anon key for public endpoints, not service role key
    // RLS policies must allow public access to published sites/domains/publishes
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    let siteId: string | null = null;

    // Find site by domain or slug
    if (domain) {
      const { data: domainData, error: domainError } = await supabase
        .from("domains")
        .select("site_id")
        .eq("domain", domain)
        .eq("status", "active")
        .maybeSingle();

      if (domainError) {
        console.error("Domain lookup error:", domainError);
      }

      if (domainData) {
        siteId = domainData.site_id;
      }
    }

    if (!siteId && slug) {
      const { data: siteData, error: siteError } = await supabase
        .from("sites")
        .select("id")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (siteError) {
        console.error("Site lookup error:", siteError);
        return new Response(
          JSON.stringify({ error: "Error finding site" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (siteData) {
        siteId = siteData.id;
      }
    }

    if (!siteId) {
      return new Response(
        JSON.stringify({ error: "Site not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the current published version
    const { data: publishData, error: publishError } = await supabase
      .from("publishes")
      .select("snapshot, version, published_at")
      .eq("site_id", siteId)
      .eq("is_current", true)
      .maybeSingle();

    if (publishError) {
      console.error("Publish lookup error:", publishError);
      return new Response(
        JSON.stringify({ error: "Error fetching published version" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!publishData) {
      return new Response(
        JSON.stringify({ error: "No published version found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get site metadata
    const { data: siteMetadata } = await supabase
      .from("sites")
      .select("name, settings")
      .eq("id", siteId)
      .single();

    return new Response(
      JSON.stringify({
        site: {
          name: siteMetadata?.name,
          settings: siteMetadata?.settings,
        },
        snapshot: publishData.snapshot,
        version: publishData.version,
        publishedAt: publishData.published_at,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("get-published-site error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
