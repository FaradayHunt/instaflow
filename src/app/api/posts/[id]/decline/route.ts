import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { comment } = await request.json();

  if (!comment) {
    return NextResponse.json(
      { error: "Decline comment is required" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("posts")
    .update({
      status: "declined",
      decline_comment: comment,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
