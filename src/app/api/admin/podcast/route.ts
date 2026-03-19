import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function GET() {
  const authError = checkAdminAuth();
  if (authError) return authError;

  const { data, error } = await supabase
    .from("podcast_show_notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const authError = checkAdminAuth();
  if (authError) return authError;

  const body = await request.json();

  const { data, error } = await supabase
    .from("podcast_show_notes")
    .insert([body])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
