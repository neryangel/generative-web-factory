import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins for CORS - restrict to known app domains
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://generative-web-factory.vercel.app",
  "https://amdir.app",
  "https://www.amdir.app",
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

interface VerifyDomainRequest {
  domainId: string;
}

interface DnsRecord {
  type: string;
  name: string;
  value: string;
}

async function verifyDns(domain: string): Promise<{ verified: boolean; records: DnsRecord[] }> {
  // Check A record using DNS over HTTPS (Cloudflare)
  try {
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${domain}&type=A`,
      {
        headers: { Accept: "application/dns-json" },
      }
    );
    
    const data = await response.json();
    const records: DnsRecord[] = [];
    
    // Expected IP for Lovable hosting
    const expectedIp = "185.158.133.1";
    
    if (data.Answer) {
      for (const answer of data.Answer) {
        if (answer.type === 1) { // A record
          records.push({
            type: "A",
            name: answer.name,
            value: answer.data,
          });
        }
      }
    }
    
    const hasCorrectARecord = records.some(
      (r) => r.type === "A" && r.value === expectedIp
    );
    
    // Check TXT record for verification
    const txtResponse = await fetch(
      `https://cloudflare-dns.com/dns-query?name=_lovable.${domain}&type=TXT`,
      {
        headers: { Accept: "application/dns-json" },
      }
    );
    
    const txtData = await txtResponse.json();

    if (txtData.Answer) {
      for (const answer of txtData.Answer) {
        if (answer.type === 16) { // TXT record
          records.push({
            type: "TXT",
            name: answer.name,
            value: answer.data?.replace(/"/g, "") || "",
          });
        }
      }
    }
    
    return {
      verified: hasCorrectARecord,
      records,
    };
  } catch (error) {
    console.error("DNS verification error:", error);
    return { verified: false, records: [] };
  }
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate auth
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
    const { data: claimsData, error: claimsError } = await supabase.auth.getUser(token);
    
    if (claimsError || !claimsData?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { domainId } = await req.json() as VerifyDomainRequest;

    if (!domainId) {
      return new Response(
        JSON.stringify({ error: "Missing domainId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get domain details
    const { data: domain, error: domainError } = await supabase
      .from("domains")
      .select("*")
      .eq("id", domainId)
      .maybeSingle();

    if (domainError || !domain) {
      return new Response(
        JSON.stringify({ error: "Domain not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify DNS
    const { verified, records } = await verifyDns(domain.domain);

    // Update domain status
    const newStatus = verified ? "active" : "pending";
    const updates: Record<string, unknown> = {
      status: newStatus,
    };

    if (verified && !domain.verified_at) {
      updates.verified_at = new Date().toISOString();
      updates.ssl_status = "provisioning";
    }

    await supabase
      .from("domains")
      .update(updates)
      .eq("id", domainId);

    return new Response(
      JSON.stringify({
        verified,
        status: newStatus,
        records,
        domain: domain.domain,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Verify domain error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
