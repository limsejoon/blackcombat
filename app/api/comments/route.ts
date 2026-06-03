import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tournament_id, author_name, content, fighter_slug } = body;

  if (!tournament_id || !author_name?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다" }, { status: 400 });
  }

  if (content.trim().length > 100) {
    return NextResponse.json({ error: "댓글은 100자 이하입니다" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any;

  const { data, error } = await supabase
    .from("comments")
    .insert({
      tournament_id,
      author_name: author_name.trim(),
      content: content.trim(),
      fighter_slug: fighter_slug ?? null,
    })
    .select("id, tournament_id, author_name, fighter_slug, content, created_at")
    .single();

  if (error) {
    console.error("comment insert error:", error);
    return NextResponse.json({ error: "저장에 실패했습니다" }, { status: 500 });
  }

  return NextResponse.json(data);
}
