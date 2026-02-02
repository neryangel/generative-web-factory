import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { isValidUuid, isValidDomain, errorResponse } from "../_shared/validation.ts";
import { getCorsHeaders } from "../_shared/cors.ts";

interface ManageDomainRequest {
  action: "add" | "remove" | "verify" | "status";
  domainId: string;
  domain?: string;
}

interface VercelDomainResponse {
  name: string;
  apexName: string;
  projectId: string;
  verified: boolean;
  verification?: Array<{
    type: string;
    domain: string;
    value: string;
    reason: string;
  }>;
  configured?: boolean;
  error?: { code: string; message: string };
}

const VERCEL_API_URL = "https://api.vercel.com";

async function getVercelConfig() {
  const token = Deno.env.get("VERCEL_TOKEN");
  const projectId = Deno.env.get("VERCEL_PROJECT_ID");
  const teamId = Deno.env.get("VERCEL_TEAM_ID");

  if (!token || !projectId) {
    throw new Error("Missing Vercel configuration. Set VERCEL_TOKEN and VERCEL_PROJECT_ID.");
  }

  return { token, projectId, teamId };
}

async function addDomainToVercel(domain: string): Promise<VercelDomainResponse> {
  const { token, projectId, teamId } = await getVercelConfig();

  const url = teamId
    ? `${VERCEL_API_URL}/v10/projects/${projectId}/domains?teamId=${teamId}`
    : `${VERCEL_API_URL}/v10/projects/${projectId}/domains`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: domain }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Vercel API error:", data);
    throw new Error(data.error?.message || "Failed to add domain to Vercel");
  }

  return data;
}

async function removeDomainFromVercel(domain: string): Promise<void> {
  const { token, projectId, teamId } = await getVercelConfig();

  const url = teamId
    ? `${VERCEL_API_URL}/v9/projects/${projectId}/domains/${domain}?teamId=${teamId}`
    : `${VERCEL_API_URL}/v9/projects/${projectId}/domains/${domain}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    const data = await response.json();
    throw new Error(data.error?.message || "Failed to remove domain from Vercel");
  }
}

async function getDomainStatus(domain: string): Promise<VercelDomainResponse | null> {
  const { token, projectId, teamId } = await getVercelConfig();

  const url = teamId
    ? `${VERCEL_API_URL}/v9/projects/${projectId}/domains/${domain}?teamId=${teamId}`
    : `${VERCEL_API_URL}/v9/projects/${projectId}/domains/${domain}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || "Failed to get domain status");
  }

  return response.json();
}

async function verifyDomainOnVercel(domain: string): Promise<VercelDomainResponse> {
  const { token, projectId, teamId } = await getVercelConfig();

  const url = teamId
    ? `${VERCEL_API_URL}/v9/projects/${projectId}/domains/${domain}/verify?teamId=${teamId}`
    : `${VERCEL_API_URL}/v9/projects/${projectId}/domains/${domain}/verify`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Vercel verify error:", data);
    throw new Error(data.error?.message || "Failed to verify domain");
  }

  return data;
}

async function getDomainConfig(domain: string): Promise<{ configured: boolean; misconfigured: boolean }> {
  const { token, teamId } = await getVercelConfig();

  const url = teamId
    ? `${VERCEL_API_URL}/v6/domains/${domain}/config?teamId=${teamId}`
    : `${VERCEL_API_URL}/v6/domains/${domain}/config`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return { configured: false, misconfigured: true };
  }

  const data = await response.json();
  return {
    configured: data.configuredBy !== null,
    misconfigured: data.misconfigured || false,
  };
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, domainId, domain: domainName } = await req.json() as ManageDomainRequest;

    // Validate action
    const validActions = ["add", "remove", "verify", "status"];
    if (!action || !validActions.includes(action)) {
      return errorResponse("Invalid action", 400, corsHeaders);
    }

    // Validate domainId
    if (!domainId) {
      return errorResponse("Missing domainId", 400, corsHeaders);
    }

    if (!isValidUuid(domainId)) {
      return errorResponse("Invalid domainId format", 400, corsHeaders);
    }

    // Get domain from database
    const { data: domainRecord, error: domainError } = await supabase
      .from("domains")
      .select("*")
      .eq("id", domainId)
      .maybeSingle();

    if (domainError || !domainRecord) {
      return errorResponse("Domain not found", 404, corsHeaders);
    }

    const domain = domainRecord.domain;

    // Validate domain format before making external API calls
    if (!isValidDomain(domain)) {
      return errorResponse("Invalid domain format in database", 400, corsHeaders);
    }

    let result: Record<string, unknown> = {};

    switch (action) {
      case "add": {
        // Add domain to Vercel
        const vercelResponse = await addDomainToVercel(domain);

        // Update database with Vercel info
        await supabase
          .from("domains")
          .update({
            status: vercelResponse.verified ? "active" : "verifying",
            cf_hostname_id: vercelResponse.projectId, // Reusing field for Vercel project ID
          })
          .eq("id", domainId);

        result = {
          success: true,
          verified: vercelResponse.verified,
          verification: vercelResponse.verification,
        };
        break;
      }

      case "remove": {
        await removeDomainFromVercel(domain);
        result = { success: true };
        break;
      }

      case "verify": {
        // First check domain status
        const status = await getDomainStatus(domain);

        if (!status) {
          // Domain not in Vercel, add it first
          const addResult = await addDomainToVercel(domain);
          result = {
            verified: addResult.verified,
            verification: addResult.verification,
            needsSetup: true,
          };
        } else if (!status.verified) {
          // Try to verify
          const verifyResult = await verifyDomainOnVercel(domain);

          // Check DNS configuration
          const configResult = await getDomainConfig(domain);

          const isVerified = verifyResult.verified && configResult.configured;

          // Update database
          await supabase
            .from("domains")
            .update({
              status: isVerified ? "active" : "verifying",
              verified_at: isVerified ? new Date().toISOString() : null,
              ssl_status: isVerified ? "active" : "pending",
            })
            .eq("id", domainId);

          result = {
            verified: isVerified,
            configured: configResult.configured,
            verification: verifyResult.verification,
          };
        } else {
          // Already verified, check configuration
          const configResult = await getDomainConfig(domain);

          const isFullyActive = status.verified && configResult.configured;

          await supabase
            .from("domains")
            .update({
              status: isFullyActive ? "active" : "verifying",
              verified_at: isFullyActive ? new Date().toISOString() : domainRecord.verified_at,
              ssl_status: isFullyActive ? "active" : "pending",
            })
            .eq("id", domainId);

          result = {
            verified: status.verified,
            configured: configResult.configured,
          };
        }
        break;
      }

      case "status": {
        const status = await getDomainStatus(domain);
        if (status) {
          const configResult = await getDomainConfig(domain);
          result = {
            exists: true,
            verified: status.verified,
            configured: configResult.configured,
            verification: status.verification,
          };
        } else {
          result = { exists: false };
        }
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Manage Vercel domain error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
