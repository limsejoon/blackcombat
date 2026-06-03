import type { DonationWithPlayer } from "@/types/database";

function formatAmount(amount: number): string {
  return "₩" + amount.toLocaleString("ko-KR");
}

function formatTime(createdAt: string): string {
  const d = new Date(createdAt);
  const now = new Date();
  const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (diffMin < 1) return "방금";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}시간 전`;
  return `${Math.floor(diffHr / 24)}일 전`;
}

export function DonationCard({
  donation,
  isSpotlight,
}: {
  donation: DonationWithPlayer;
  isSpotlight: boolean;
}) {
  const playerName = donation.players?.nickname || donation.players?.name || "";

  return (
    <div
      className="p-4 rounded-2xl mb-3"
      style={{
        background: isSpotlight ? "#222218" : "#1C1C1C",
        border: isSpotlight
          ? "1px solid rgba(127,214,73,0.2)"
          : "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <span className="text-[14px] font-bold" style={{ color: "#7FD649" }}>
            {donation.donor_nickname}
          </span>
          {playerName && (
            <span className="text-[13px]" style={{ color: "#6E6E73" }}>
              {" "}님이{" "}
              <span style={{ color: "#FFFFFF" }}>{playerName}</span>
              {" "}선수에게
            </span>
          )}
        </div>
        <span
          className="shrink-0 text-[11px]"
          style={{ fontFamily: "'Geist Mono', monospace", color: "#6E6E73" }}
        >
          {formatTime(donation.created_at)}
        </span>
      </div>

      <div
        className="text-[26px] font-bold mb-2"
        style={{ fontFamily: "'Clash Grotesk', sans-serif", color: "#FFFFFF" }}
      >
        {formatAmount(donation.amount)}
      </div>

      {donation.message && (
        <div
          className="text-[13px] leading-relaxed px-3 py-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)", color: "#A0A0A8" }}
        >
          "{donation.message}"
        </div>
      )}
    </div>
  );
}
