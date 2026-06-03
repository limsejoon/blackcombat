import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tournament_id, player_id, donor_nickname, amount, message } = body;

  if (!tournament_id || !player_id || !donor_nickname?.trim() || !amount) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다" }, { status: 400 });
  }

  if (typeof amount !== "number" || amount < 500) {
    return NextResponse.json({ error: "유효하지 않은 금액입니다" }, { status: 400 });
  }

  // 로그인한 사용자 ID 가져오기 (없으면 null)
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any;
  const order_id = crypto.randomUUID();

  const { data, error } = await supabase
    .from("donations")
    .insert({
      tournament_id,
      player_id,
      donor_id: user?.id ?? null,
      donor_nickname: donor_nickname.trim(),
      amount,
      message: (message ?? "").trim() || "응원합니다!",
      order_id,
    })
    .select("id, player_id, amount")
    .single();

  if (error) {
    console.error("donation insert error:", error);
    return NextResponse.json({ error: "저장에 실패했습니다" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, order_id, player_id: data.player_id, amount: data.amount });
}
