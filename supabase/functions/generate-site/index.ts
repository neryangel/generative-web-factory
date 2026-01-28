import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateBrief, errorResponse, successResponse } from "../_shared/validation.ts";

/**
 * Allowed origins for CORS
 * Configure based on your deployment domains
 */
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://generative-web-factory.vercel.app",
  "https://amdir.app",
  "https://www.amdir.app",
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed = origin && (
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith('.vercel.app')
  );

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

const SECTION_TYPES = [
  "hero",
  "features", 
  "gallery",
  "testimonials",
  "cta",
  "contact",
  "about",
  "footer"
];

const systemPrompt = `You are an expert website content strategist for AMDIR, an AI-powered website builder.
Your task is to generate a complete website blueprint based on the user's business description.

You MUST respond with a valid JSON object (no markdown, no code blocks) following this exact structure:

{
  "siteName": "Business Name",
  "settings": {
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "fontFamily": "font name",
    "direction": "rtl"
  },
  "pages": [
    {
      "slug": "home",
      "title": "Page Title",
      "isHomepage": true,
      "sections": [
        {
          "type": "hero",
          "content": {
            "headline": "Main headline text",
            "subheadline": "Supporting text",
            "ctaText": "Button text",
            "ctaLink": "#contact"
          }
        }
      ]
    }
  ]
}

Available section types and their content structure:

1. "hero" - Main banner section
   content: { headline, subheadline, ctaText, ctaLink, backgroundImage? }

2. "features" - Feature highlights
   content: { headline, subheadline, features: [{ title, description, icon? }] }

3. "gallery" - Image gallery
   content: { headline, subheadline, images: [{ url, alt, caption? }] }

4. "testimonials" - Customer reviews
   content: { headline, subheadline, testimonials: [{ quote, author, role, avatar? }] }

5. "cta" - Call to action
   content: { headline, subheadline, buttonText, buttonLink }

6. "contact" - Contact information
   content: { headline, subheadline, phone?, email?, address?, formEnabled? }

7. "about" - About section
   content: { headline, content, image? }

8. "footer" - Page footer
   content: { copyright, links: [{ text, url }], socialLinks: [{ platform, url }] }

Guidelines:
- Generate content in Hebrew (RTL) unless the description is clearly in another language
- Create compelling, professional marketing copy
- Include 4-8 sections per page for a complete website
- Always start with a hero section and end with footer
- Use realistic placeholder image URLs from unsplash.com
- Make content specific to the business described
- Be creative but professional`;

serve(async (req) => {
  const origin = req.headers.get("Origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // SECURITY: Require authentication to prevent abuse/DoS
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse("נדרשת הזדהות", 401, corsHeaders);
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return errorResponse("הזדהות נכשלה", 401, corsHeaders);
    }

    const { brief, language = "he" } = await req.json();

    // Validate and sanitize the brief
    const briefValidation = validateBrief(brief);
    if (!briefValidation.valid) {
      return errorResponse(
        briefValidation.error || "נא לספק תיאור עסק מפורט יותר (לפחות 10 תווים)",
        400,
        corsHeaders
      );
    }

    const sanitizedBrief = briefValidation.brief!;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Generating site for brief:", sanitizedBrief.substring(0, 100));

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    let response: Response;
    try {
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Generate a complete website blueprint for this business:\n\n${sanitizedBrief}\n\nRespond with valid JSON only.`
            },
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
        signal: controller.signal,
      });
    } catch (fetchError: unknown) {
      if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
        return errorResponse("שירות ה-AI לא הגיב בזמן, נסה שוב", 504, corsHeaders);
      }
      throw fetchError;
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      // Log status only, not response body (may contain sensitive data)
      console.error("AI gateway error:", response.status);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "שירות ה-AI עמוס כרגע, נסה שוב בעוד דקה" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "נדרש חידוש מנוי AI" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "שגיאה בשירות ה-AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response:", data);
      return new Response(
        JSON.stringify({ error: "לא התקבלה תשובה מה-AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON response - handle potential markdown code blocks
    let blueprint;
    try {
      // Remove potential markdown code blocks
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      
      blueprint = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", content);
      return new Response(
        JSON.stringify({ error: "שגיאה בפענוח תשובת ה-AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate blueprint structure
    if (!blueprint.pages || !Array.isArray(blueprint.pages) || blueprint.pages.length === 0) {
      console.error("Invalid blueprint structure:", blueprint);
      return new Response(
        JSON.stringify({ error: "מבנה האתר שהתקבל אינו תקין" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate section types
    for (const page of blueprint.pages) {
      if (page.sections) {
        page.sections = page.sections.filter((section: any) => 
          SECTION_TYPES.includes(section.type)
        );
      }
    }

    console.log("Successfully generated blueprint with", blueprint.pages.length, "pages");

    return new Response(
      JSON.stringify({ blueprint }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    // Log error type only, not full error (may contain sensitive data)
    console.error("generate-site error:", error instanceof Error ? error.name : "Unknown");
    return new Response(
      JSON.stringify({ error: "שגיאה לא צפויה" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
