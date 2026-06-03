import Link from "next/link";
import { Bookmark, Star } from "lucide-react";
import type { Tournament } from "@/types/database";
import { LiveBadge } from "./live-badge";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function formatDateRange(startsAt: string | null, endsAt: string | null): string {
  const start = formatDate(startsAt);
  const end = formatDate(endsAt);
  return end && end !== start ? `${start} – ${end}` : start;
}

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const isLive = tournament.status === "ongoing";
  const isUpcoming = tournament.status === "upcoming";

  return (
    <Link href={`/tournaments/${tournament.id}`} className="block mb-3">
      <div
        className="rounded-2xl overflow-hidden transition-opacity hover:opacity-90 active:opacity-80"
        style={{
          background: "#1C1C1C",
          border: isLive
            ? "1px solid rgba(255,69,58,0.25)"
            : "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Card header row */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-[12px] font-medium" style={{ color: "#6E6E73" }}>
            {isLive ? "진행 중" : isUpcoming ? "예정 경기" : "종료"}
          </span>
          <div className="flex items-center gap-3">
            <Bookmark size={15} color="#6E6E73" />
            <Star size={15} color="#6E6E73" />
          </div>
        </div>

        {/* Main content */}
        <div className="px-4 py-5">
          {/* Tournament title + league */}
          <div className="flex items-center justify-center gap-3 mb-5">
            {/* Left placeholder avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-[18px]"
              style={{ background: "#2A2A2A" }}
            >
              ⚔️
            </div>

            <div className="text-center flex-1">
              <p
                className="text-[14px] font-bold leading-tight"
                style={{ color: "#FFFFFF" }}
              >
                {tournament.title}
              </p>
              {tournament.description && (
                <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: "#6E6E73" }}>
                  {tournament.description}
                </p>
              )}
            </div>

            {/* Right placeholder avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-[18px]"
              style={{ background: "#2A2A2A" }}
            >
              🏆
            </div>
          </div>

          {/* Status / score / date row */}
          <div className="flex items-center justify-center">
            {isLive ? (
              <div className="flex flex-col items-center gap-1.5">
                <LiveBadge />
                <span className="text-[11px]" style={{ color: "#6E6E73" }}>
                  {formatDateRange(tournament.starts_at, tournament.ends_at)}
                </span>
              </div>
            ) : isUpcoming ? (
              <div className="flex flex-col items-center gap-1">
                <p
                  className="text-[28px] font-bold leading-none tracking-tight"
                  style={{
                    fontFamily: "'Clash Grotesk', sans-serif",
                    color: "#FFFFFF",
                  }}
                >
                  {formatDate(tournament.starts_at)}
                </p>
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{ background: "rgba(127,214,73,0.12)", color: "#7FD649" }}
                >
                  예정
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <p
                  className="text-[14px] font-medium"
                  style={{ color: "#6E6E73" }}
                >
                  {formatDateRange(tournament.starts_at, tournament.ends_at)}
                </p>
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#6E6E73" }}
                >
                  종료
                </span>
              </div>
            )}
          </div>
        </div>

        {/* CTA strip for live tournaments */}
        {isLive && (
          <div
            className="px-4 py-3 flex items-center justify-center"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="text-[13px] font-semibold" style={{ color: "#7FD649" }}>
              후원하러 가기 →
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
