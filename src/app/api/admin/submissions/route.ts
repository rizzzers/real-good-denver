import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkAdminAuth } from "@/lib/admin-auth";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://xrpbjtdbwuodfixgpapx.supabase.co";

// Reads form_submissions, which is protected by RLS. The anon client used
// elsewhere cannot see these rows, so this route uses the service-role key.
// Set SUPABASE_SERVICE_ROLE_KEY in the environment (Vercel + .env.local).
export async function GET(request: NextRequest) {
  const authError = checkAdminAuth();
  if (authError) return authError;

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured" },
      { status: 500 },
    );
  }

  const supabase = createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false },
  });

  const type = request.nextUrl.searchParams.get("type");
  let query = supabase
    .from("form_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (type && type !== "all") {
    query = query.eq("type", type);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
