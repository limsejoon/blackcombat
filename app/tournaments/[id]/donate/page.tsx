import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Tournament, Player } from "@/types/database";
import { DonateFlow } from "@/components/donate-flow";

export default async function DonatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;

  const [{ data: tournament }, { data: players }] = await Promise.all([
    supabase.from("tournaments").select("*").eq("id", id).single(),
    supabase.from("players").select("*").eq("tournament_id", id).order("name"),
  ]);

  const t = tournament as Tournament | null;
  if (!t || t.status !== "ongoing") notFound();

  return (
    <DonateFlow
      tournament={t as Tournament}
      players={(players ?? []) as Player[]}
    />
  );
}
