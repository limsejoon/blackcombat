import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tournament_id, player_id, donor_nickname, amount, message } = body;

  if (!tournament_id || !player_id || !donor_nickname?.trim() || !amount || !message?.trim()) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다" }, { status: 400 });
  }

  if (![1000, 5000, 10000, 50000].includes(amount)) {
    return NextResponse.json({ error: "유효하지 않은 금액입니다" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any;
  const order_id = crypto.randomUUID();

  const { data, error } = await supabase
    .from("donations")
    .insert({
      tournament_id,
      player_id,
      donor_nickname: donor_nickname.trim(),
      amount,
      message: message.trim(),
      order_id,
      donor_id: null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("donation insert error:", error);
    return NextResponse.json({ error: "저장에 실패했습니다" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, order_id });
}
