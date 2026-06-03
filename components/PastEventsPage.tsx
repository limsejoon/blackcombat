"use client";

import { useState } from "react";
import { ChevronLeft, Trophy, CheckCircle } from "lucide-react";
import { PAST_EVENTS, PastEvent, PastFight, flag } from "@/components/PastEventData";
import { motion } from "motion/react";

function WinBadge({ method }: { method?: string }) {
  return (
    <span
      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded"
      style={{
        background: "rgba(16,185,129,0.15)",
        border: "1px solid rgba(16,185,129,0.35)",
        color: "#10b981",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 800,
        fontSize: "0.65rem",
        letterSpacing: "0.08em",
        whiteSpace: "nowrap",
      }}
    >
      <CheckCircle size={9} /> WIN{method ? ` · ${method}` : ""}
    </span>
  );
}

function FightRow({ fight }: { fight: PastFight }) {
  const redWin = fight.winner === "red";
  const blueWin = fight.winner === "blue";
  const noResult = fight.winner === null;

  return (
    <div
      className="overflow-hidden mb-3"
      style={{
        background: fight.isMain ? "rgba(200,208,220,0.06)" : "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        border: fight.isMain ? "1px solid rgba(200,208,220,0.2)" : "1px solid rgba(255,255,255,0.07)",
        borderRadius: 10,
      }}
    >
      <div className="flex items-center gap-2 px-4 pt-3 pb-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {fight.isMain && (
          <span style={{ background: "rgba(200,208,220,0.12)", color: "#c8d0dc", border: "1px solid rgba(200,208,220,0.25)", fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.62rem", letterSpacing: "0.15em", padding: "2px 7px", borderRadius: 0 }}>
            MAIN EVENT
          </span>
        )}
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#4a5e72", letterSpacing: "0.1em" }}>
          {fight.boutType}
        </span>
        {noResult && (
          <span className="ml-auto" style={{ fontSize: "0.62rem", color: "#4a5e72" }}>결과 미등록</span>
        )}
      </div>

      <div className="px-4 py-3 grid items-center gap-3" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
        <div className={`flex flex-col gap-0.5 ${redWin ? "" : blueWin ? "opacity-50" : ""}`}>
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: "0.9rem" }}>{flag(fight.red.nationality)}</span>
            {fight.red.rank && (
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", color: "#6a8099" }}>{fight.red.rank}</span>
            )}
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "1.1rem", color: redWin ? "#e8ecf0" : "#8090a0", lineHeight: 1.1 }}>
            {fight.red.nickname}
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#5a7080" }}>
            {fight.red.realName}
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#6a8099" }}>
            {fight.red.record}
          </div>
          {redWin && <WinBadge method={fight.method} />}
        </div>

        <div className="flex flex-col items-center gap-1">
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "1rem", color: "#3a3a4a" }}>VS</span>
          <div className="w-16 flex flex-col gap-0.5">
            <div className="flex h-1.5 rounded-full overflow-hidden">
              <div style={{ width: `${fight.redPct}%`, background: "#e05555" }} />
              <div style={{ width: `${fight.bluePct}%`, background: "#1a6ce8" }} />
            </div>
            <div className="flex justify-between">
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.58rem", color: "#e05555", fontWeight: 700 }}>{fight.redPct}%</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.58rem", color: "#1a6ce8", fontWeight: 700 }}>{fight.bluePct}%</span>
            </div>
          </div>
        </div>

        <div className={`flex flex-col gap-0.5 items-end text-right ${blueWin ? "" : redWin ? "opacity-50" : ""}`}>
          <div className="flex items-center gap-1.5 flex-row-reverse">
            <span style={{ fontSize: "0.9rem" }}>{flag(fight.blue.nationality)}</span>
            {fight.blue.rank && (
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", color: "#6a8099" }}>{fight.blue.rank}</span>
            )}
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "1.1rem", color: blueWin ? "#e8ecf0" : "#8090a0", lineHeight: 1.1 }}>
            {fight.blue.nickname}
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#5a7080" }}>
            {fight.blue.realName}
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#6a8099" }}>
            {fight.blue.record}
          </div>
          {blueWin && <WinBadge method={fight.method} />}
        </div>
      </div>
    </div>
  );
}

function EventDetail({ event, onBack }: { event: PastEvent; onBack: () => void }) {
  const eventDate = new Date(event.date);
  const dateStr = eventDate.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
  const wins = event.fights.filter((f) => f.winner !== null).length;
  const total = event.fights.length;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 mb-4 transition-all hover:opacity-70"
        style={{ color: "#6a8099", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
      >
        <ChevronLeft size={16} /> 지난 대회 목록
      </button>

      <div
        className="relative overflow-hidden mb-5"
        style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
      >
        <img src={event.poster} alt={event.name} className="w-full object-cover" style={{ height: 140, filter: "brightness(0.35) saturate(0.5)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(20,27,35,0.95) 0%, rgba(20,27,35,0.6) 100%)" }} />
        <div className="absolute inset-0 flex flex-col justify-center px-5">
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#c8d0dc", fontWeight: 800, letterSpacing: "0.2em", marginBottom: 2 }}>
            {event.org.toUpperCase()}
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "2rem", color: "#e8ecf0", lineHeight: 1 }}>
            {event.name}
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#6a8099", marginTop: 4 }}>
            {dateStr} · {event.venue}, {event.location}
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#c0ccd8" }}>
              총 {total}경기
            </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#10b981" }}>
              결과 등록 {wins}경기
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Trophy size={14} color="#c8d0dc" />
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.85rem", color: "#e8ecf0", letterSpacing: "0.1em" }}>
          FIGHT CARD
        </span>
      </div>

      {[...event.fights].sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0)).map((fight) => (
        <FightRow key={fight.id} fight={fight} />
      ))}
    </motion.div>
  );
}

export function PastEventsPage() {
  const [selected, setSelected] = useState<PastEvent | null>(null);

  if (selected) {
    return <EventDetail event={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#4a5e72", letterSpacing: "0.15em", marginBottom: 8 }}>
        {PAST_EVENTS.length}개 대회 기록
      </div>

      {PAST_EVENTS.map((event) => {
        const eventDate = new Date(event.date);
        const dateStr = eventDate.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
        const mainFight = event.fights.find((f) => f.isMain);

        return (
          <button
            key={event.id}
            onClick={() => setSelected(event)}
            className="w-full text-left overflow-hidden transition-all hover:scale-[1.005]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="relative">
              <img src={event.poster} alt={event.name} className="w-full object-cover" style={{ height: 100, filter: "brightness(0.3) saturate(0.4)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(20,27,35,0.98) 0%, rgba(20,27,35,0.5) 100%)" }} />
              <div className="absolute inset-0 flex items-center px-4 gap-4">
                <div className="flex-1">
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", color: "#c8d0dc", fontWeight: 800, letterSpacing: "0.2em" }}>
                    {event.org.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "1.5rem", color: "#e8ecf0", lineHeight: 1 }}>
                    {event.name}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#6a8099", marginTop: 2 }}>
                    {dateStr} · {event.venue}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: "#4a5e72", marginBottom: 2 }}>메인 이벤트</div>
                  {mainFight && (
                    <>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.88rem", color: "#c0ccd8" }}>
                        {mainFight.red.nickname}
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#3a3a4a" }}>vs</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.88rem", color: "#c0ccd8" }}>
                        {mainFight.blue.nickname}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "#4a5e72" }}>
                총 {event.fights.length}경기 · 결과 {event.fights.filter(f => f.winner !== null).length}건 등록
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "#c8d0dc", fontWeight: 700 }}>
                결과 보기 →
              </span>
            </div>
          </button>
        );
      })}
    </motion.div>
  );
}
