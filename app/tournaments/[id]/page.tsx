import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Bookmark, Star, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Tournament, Player, DonationWithPlayer } from "@/types/database";
import { LiveBadge } from "@/components/live-badge";
import { DonationCard } from "@/components/donation-card";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", id)
    .single();

  if (!tournament) notFound();

  const [{ data: players }, { data: donations }] = await Promise.all([
    supabase.from("players").select("*").eq("tournament_id", id).order("name"),
    supabase
      .from("donations")
      .select("*, players(name, nickname)")
      .eq("tournament_id", id)
      .eq("is_hidden", false)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const t = tournament as Tournament;
  const playerList = (players ?? []) as Player[];
  const donationList = (donations ?? []) as DonationWithPlayer[];
  const isLive = t.status === "ongoing";

  return (
    <main className="min-h-screen pb-32" style={{ background: "#0F0F0F" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 px-4 py-3"
        style={{
          background: "rgba(15,15,15,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="max-w-[480px] mx-auto">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{ color: "#6E6E73" }}
            >
              <ChevronLeft size={18} />
              <span className="text-[13px]">전체</span>
            </Link>
            <div className="flex items-center gap-3">
              <Bookmark size={18} color="#6E6E73" />
              <Star size={18} color="#6E6E73" />
            </div>
          </div>
        </div>
      </header>

      {/* Tournament hero */}
      <div
        className="px-5 pt-6 pb-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-[480px] mx-auto">
          <div className="flex items-center gap-2 mb-3">
            {isLive && <LiveBadge />}
            {t.status === "upcoming" && (
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                style={{ background: "rgba(127,214,73,0.12)", color: "#7FD649" }}
              >
                예정
              </span>
            )}
            {t.status === "finished" && (
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                style={{ background: "rgba(255,255,255,0.06)", color: "#6E6E73" }}
              >
                종료
              </span>
            )}
          </div>

          <h1
            className="text-[22px] font-bold leading-snug mb-1"
            style={{ color: "#FFFFFF" }}
          >
            {t.title}
          </h1>

          {(t.starts_at || t.ends_at) && (
            <p className="text-[13px]" style={{ color: "#6E6E73" }}>
              {formatDate(t.starts_at)}
              {t.ends_at && t.ends_at !== t.starts_at ? ` – ${formatDate(t.ends_at)}` : ""}
            </p>
          )}

          {t.description && (
            <p className="text-[14px] mt-3 leading-relaxed" style={{ color: "#A0A0A8" }}>
              {t.description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-4 py-5">
        {/* Players */}
        {playerList.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Users size={14} color="#6E6E73" />
              <h2 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#6E6E73" }}>
                참가 선수
              </h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {playerList.map((p) => (
                <div
                  key={p.id}
                  className="px-3 py-1.5 rounded-full text-[13px] font-medium"
                  style={{
                    background: "#1C1C1C",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "#FFFFFF",
                  }}
                >
                  {p.name}
                  {p.nickname && (
                    <span className="ml-1 text-[11px]" style={{ color: "#6E6E73" }}>
                      ({p.nickname})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Donation Feed */}
        <section>
          <h2
            className="text-[11px] font-semibold mb-3 uppercase tracking-wider"
            style={{ color: "#6E6E73" }}
          >
            후원 피드
          </h2>

          {donationList.length === 0 ? (
            <div className="text-center py-14" style={{ color: "#6E6E73" }}>
              <p className="text-[14px]">아직 후원이 없습니다</p>
              <p className="text-[12px] mt-1">첫 번째 응원을 남겨보세요!</p>
            </div>
          ) : (
            donationList.map((d, i) => (
              <DonationCard key={d.id} donation={d} isSpotlight={i === 0} />
            ))
          )}
        </section>
      </div>

      {/* Sticky donate CTA */}
      {isLive && (
        <div
          className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-4"
          style={{
            background: "linear-gradient(to top, #0F0F0F 70%, transparent)",
            paddingBottom: "max(88px, calc(env(safe-area-inset-bottom) + 72px))",
          }}
        >
          <div className="max-w-[480px] mx-auto">
            <Link
              href={`/tournaments/${t.id}/donate`}
              className="block w-full text-center py-4 rounded-2xl text-[15px] font-bold"
              style={{ background: "#7FD649", color: "#0F0F0F" }}
            >
              후원하기
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
