import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = checkAdminAuth();
  if (authError) return authError;

  const body = await request.json();

  const { data, error } = await supabase
    .from("podcast_show_notes")
    .update(body)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = checkAdminAuth();
  if (authError) return authError;

  const { error } = await supabase
    .from("podcast_show_notes")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
