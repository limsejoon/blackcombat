"use client";

import { useState } from "react";
import { MapPin, Calendar, Trophy, Star, Flame, Crown, TrendingUp, Archive } from "lucide-react";
import { EVENT, Fighter } from "@/components/EventData";
import { CountdownTimer } from "@/components/CountdownTimer";
import { FighterCard } from "@/components/FighterCard";
import { CheerSection } from "@/components/CheerSection";
import { DonationModal } from "@/components/DonationModal";
import { PastEventsPage } from "@/components/PastEventsPage";
import { motion } from "motion/react";

type TopTab = "upcoming" | "archive";
type Tab = "fights" | "fighters" | "cheer";

function getDaysLeft(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const INITIAL_DONATIONS: Record<string, number> = {
  "jeong-won-hee": 45000,
  "lee-young-woong": 38000,
  "patrick-kelvin": 72000,
  "kim-yul": 18000,
  "yeo-dong-ju": 31000,
  "fabricio-azevedo": 14000,
  "maicon-bruno": 22000,
  "lee-gang-nam": 19000,
  "bruno-itamar": 28000,
  "jang-geun-young": 25000,
  "lee-jong-gu": 16000,
  "hong-hee-won": 12000,
  "heo-sun-haeng": 8000,
  "ortsa-gudaev": 35000,
  "park-chan-sol": 11000,
  "wallison-silva": 29000,
  "lee-seol-ho": 7000,
  "son-min": 33000,
};

export default function App() {
  const [topTab, setTopTab] = useState<TopTab>("upcoming");
  const [activeTab, setActiveTab] = useState<Tab>("fights");
  const [selectedFightId, setSelectedFightId] = useState<string>(EVENT.fights[0].id);
  const [donations, setDonations] = useState<Record<string, number>>(INITIAL_DONATIONS);
  const [donationTarget, setDonationTarget] = useState<Fighter | null>(null);
  const [lastDonation, setLastDonation] = useState<{ user: string; amount: number; fighterName: string } | null>(null);

  const daysLeft = getDaysLeft(EVENT.date);
  const isCheerOpen = daysLeft <= 10;
  const selectedFight = EVENT.fights.find((f) => f.id === selectedFightId)!;

  const eventDate = new Date(EVENT.date);
  const dateStr = eventDate.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
  const timeStr = eventDate.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

  const fighterPairs = EVENT.fights.map((f) => ({ red: f.fighter1, blue: f.fighter2 }));
  const allFighters = EVENT.fights.flatMap((f) => [f.fighter1, f.fighter2]);
  const totalAllDonations = Object.values(donations).reduce((a, b) => a + b, 0);

  const donationRanking = allFighters
    .map((f) => ({ fighter: f, amount: donations[f.id] || 0 }))
    .sort((a, b) => b.amount - a.amount);

  function handleDonate(amount: number, _message: string) {
    if (!donationTarget) return;
    setDonations((prev) => ({
      ...prev,
      [donationTarget.id]: (prev[donationTarget.id] || 0) + amount,
    }));
    setLastDonation({ user: "익명의 팬", amount, fighterName: donationTarget.name });
    setTimeout(() => setLastDonation(null), 100);
  }

  return (
    <div className="min-h-screen" style={{ background: "#f0ece3", fontFamily: "'Inter', sans-serif" }}>
      {/* Global top nav */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3"
        style={{ background: "#111111", borderBottom: "3px solid #e8b400" }}
      >
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "1.15rem", color: "#ffffff", letterSpacing: "0.02em" }}>
          FIGHT<span style={{ color: "#e8b400" }}>HUB</span>
        </div>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: "rgba(255,255,255,0.08)" }}>
          {([
            { id: "upcoming", label: "예정 대회", icon: <Flame size={12} /> },
            { id: "archive", label: "지난 대회", icon: <Archive size={12} /> },
          ] as { id: TopTab; label: string; icon: React.ReactNode }[]).map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setTopTab(id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all"
              style={{
                background: topTab === id ? "#e8b400" : "transparent",
                color: topTab === id ? "#111111" : "#aaaaaa",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "0.8rem",
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Archive tab */}
      {topTab === "archive" && (
        <div className="max-w-4xl mx-auto px-4 py-6 pb-16">
          <PastEventsPage />
        </div>
      )}

      {topTab !== "upcoming" ? null : <>
      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
        <img
          src={EVENT.poster}
          alt="Event poster"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.4) saturate(1.1)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 55%, #f0ece3 100%)" }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-10 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="px-3 py-1 rounded uppercase tracking-widest"
              style={{ background: "#e8b400", color: "#111111", fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.68rem" }}
            >
              LIVE EVENT
            </span>
            {isCheerOpen && (
              <span
                className="px-3 py-1 rounded uppercase tracking-widest flex items-center gap-1"
                style={{ background: "rgba(232,180,0,0.2)", color: "#e8b400", border: "1px solid rgba(232,180,0,0.5)", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.68rem" }}
              >
                <Flame size={10} /> 응원 오픈
              </span>
            )}
          </div>

          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.7rem", color: "#e8b400", letterSpacing: "0.3em", marginBottom: 4 }}>
            {EVENT.org.toUpperCase()}
          </div>
          <h1
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2.2rem, 7vw, 3.5rem)",
              color: "#ffffff",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              marginBottom: 8,
            }}
          >
            {EVENT.name}
          </h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} color="#aaaaaa" />
              <span style={{ fontSize: "0.82rem", color: "#cccccc" }}>{dateStr} {timeStr}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={13} color="#aaaaaa" />
              <span style={{ fontSize: "0.82rem", color: "#cccccc" }}>{EVENT.venue}, {EVENT.location}</span>
            </div>
          </div>

          <CountdownTimer targetDate={EVENT.date} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Tabs */}
        <div
          className="flex gap-1 mb-5 p-1 rounded-xl sticky top-[57px] z-20"
          style={{ background: "rgba(240,236,227,0.97)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
        >
          {([
            { id: "fights", label: "경기 목록", icon: <Trophy size={13} /> },
            { id: "fighters", label: "선수 소개", icon: <Star size={13} /> },
            { id: "cheer", label: isCheerOpen ? "응원 댓글" : "응원 댓글 🔒", icon: <Flame size={13} /> },
          ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all"
              style={{
                background: activeTab === id ? "#111111" : "transparent",
                color: activeTab === id ? "#e8b400" : "#777777",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "0.85rem",
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Fight List Tab */}
        {activeTab === "fights" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#999999", letterSpacing: "0.15em", marginBottom: 8 }}>
              총 {EVENT.fights.length}경기
            </div>
            {EVENT.fights.map((fight) => (
              <div
                key={fight.id}
                className="overflow-hidden"
                style={{
                  background: "#ffffff",
                  border: `1px solid ${fight.isMain ? "rgba(232,180,0,0.5)" : "rgba(0,0,0,0.08)"}`,
                  borderRadius: 14,
                  boxShadow: fight.isMain
                    ? "0 4px 20px rgba(232,180,0,0.12)"
                    : "0 2px 8px rgba(0,0,0,0.05)",
                  borderLeft: fight.isMain ? "4px solid #e8b400" : undefined,
                }}
              >
                <button
                  className="w-full px-4 pt-3 pb-2 flex items-center gap-2 text-left"
                  onClick={() => { setSelectedFightId(fight.id); setActiveTab("fighters"); }}
                >
                  {fight.isMain && (
                    <span style={{ background: "#e8b400", color: "#111111", fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.62rem", letterSpacing: "0.15em", padding: "2px 8px", borderRadius: 4 }}>
                      메인 이벤트
                    </span>
                  )}
                  {fight.isCo && (
                    <span style={{ background: "rgba(232,180,0,0.15)", color: "#b38a00", border: "1px solid rgba(232,180,0,0.4)", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.62rem", letterSpacing: "0.12em", padding: "2px 8px", borderRadius: 4 }}>
                      코메인
                    </span>
                  )}
                  <span style={{ fontSize: "0.68rem", color: "#999999", marginLeft: "auto" }}>
                    {fight.weightClass} · {fight.rounds}R
                  </span>
                </button>

                <div className="px-4 pt-1 pb-3 grid items-start gap-2" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
                  {/* Fighter 1 */}
                  <div className="flex flex-col gap-2">
                    <button
                      className="flex items-center gap-2.5 text-left"
                      onClick={() => { setSelectedFightId(fight.id); setActiveTab("fighters"); }}
                    >
                      <img src={fight.fighter1.photo} alt={fight.fighter1.name} className="w-10 h-10 object-cover shrink-0" style={{ borderRadius: "50%", border: "2px solid #e8b400" }} />
                      <div className="min-w-0">
                        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "0.92rem", color: "#111111", lineHeight: 1.1 }}>
                          {fight.fighter1.nickname}
                        </div>
                        <div style={{ fontSize: "0.6rem", color: "#888888" }}>{fight.fighter1.name} · {fight.fighter1.record}</div>
                      </div>
                    </button>
                    <div style={{ fontSize: "0.6rem", color: "#b38a00", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
                      💰 {(donations[fight.fighter1.id] || 0).toLocaleString()}원
                    </div>
                    <button
                      onClick={() => setDonationTarget(fight.fighter1)}
                      className="flex items-center justify-center gap-1 py-1.5 transition-all hover:opacity-90"
                      style={{ background: "#e8b400", color: "#111111", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.7rem", borderRadius: 6 }}
                    >
                      ⚡ 후원하기
                    </button>
                  </div>

                  {/* Center */}
                  <div className="flex flex-col items-center gap-1.5 px-2 pt-1">
                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "0.9rem", color: "#cccccc", letterSpacing: "0.1em" }}>VS</span>
                    <div className="w-14">
                      <div className="flex h-1.5 overflow-hidden mb-0.5" style={{ borderRadius: 4 }}>
                        <div style={{ width: `${fight.redPct}%`, background: "#e8b400" }} />
                        <div style={{ width: `${fight.bluePct}%`, background: "#111111" }} />
                      </div>
                      <div className="flex justify-between">
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.56rem", color: "#b38a00", fontWeight: 700 }}>{fight.redPct}%</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.56rem", color: "#555555", fontWeight: 700 }}>{fight.bluePct}%</span>
                      </div>
                    </div>
                    <div style={{ fontSize: "0.56rem", color: "#aaaaaa", fontFamily: "'Inter', sans-serif" }}>
                      💬 {fight.commentCount}
                    </div>
                  </div>

                  {/* Fighter 2 */}
                  <div className="flex flex-col gap-2 items-end">
                    <button
                      className="flex items-center gap-2.5 flex-row-reverse text-right"
                      onClick={() => { setSelectedFightId(fight.id); setActiveTab("fighters"); }}
                    >
                      <img src={fight.fighter2.photo} alt={fight.fighter2.name} className="w-10 h-10 object-cover shrink-0" style={{ borderRadius: "50%", border: "2px solid #333333" }} />
                      <div className="min-w-0">
                        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "0.92rem", color: "#111111", lineHeight: 1.1 }}>
                          {fight.fighter2.nickname}
                        </div>
                        <div style={{ fontSize: "0.6rem", color: "#888888" }}>{fight.fighter2.name} · {fight.fighter2.record}</div>
                      </div>
                    </button>
                    <div style={{ fontSize: "0.6rem", color: "#b38a00", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
                      {(donations[fight.fighter2.id] || 0).toLocaleString()}원 💰
                    </div>
                    <button
                      onClick={() => setDonationTarget(fight.fighter2)}
                      className="flex items-center justify-center gap-1 py-1.5 transition-all hover:opacity-90 w-full"
                      style={{ background: "#111111", color: "#e8b400", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.7rem", borderRadius: 6 }}
                    >
                      ⚡ 후원하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Fighters Tab */}
        {activeTab === "fighters" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            {/* Donation Leaderboard */}
            <div
              className="p-4"
              style={{ background: "#ffffff", border: "1px solid rgba(232,180,0,0.3)", borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crown size={15} color="#e8b400" />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#111111" }}>
                    응원 도네이션 랭킹
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={11} color="#10b981" />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "#10b981", fontWeight: 700 }}>
                    총 {totalAllDonations.toLocaleString()}원
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {donationRanking.map(({ fighter, amount }, idx) => {
                  const pct = totalAllDonations > 0 ? (amount / totalAllDonations) * 100 : 0;
                  const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}`;
                  const isTop = idx === 0;
                  return (
                    <div key={fighter.id} className="flex items-center gap-3">
                      <div
                        className="w-6 text-center shrink-0"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: idx < 3 ? "1rem" : "0.72rem", color: "#888888" }}
                      >
                        {medal}
                      </div>
                      <img src={fighter.photo} alt={fighter.name} className="w-7 h-7 object-cover shrink-0" style={{ borderRadius: "50%", border: `1.5px solid ${isTop ? "#e8b400" : "rgba(0,0,0,0.1)"}` }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.82rem", color: isTop ? "#b38a00" : "#333333" }}>
                            {fighter.name}
                          </span>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.82rem", color: isTop ? "#b38a00" : "#111111" }}>
                            {amount.toLocaleString()}원
                          </span>
                        </div>
                        <div className="h-1 overflow-hidden" style={{ background: "rgba(0,0,0,0.06)", borderRadius: 4 }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.04 }}
                            className="h-full"
                            style={{ background: isTop ? "linear-gradient(90deg, #e8b400, #f5c800)" : "rgba(0,0,0,0.15)", borderRadius: 4 }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setDonationTarget(fighter)}
                        className="shrink-0 px-2.5 py-1 transition-all hover:opacity-90"
                        style={{
                          background: "#111111",
                          color: "#e8b400",
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          borderRadius: 6,
                        }}
                      >
                        응원
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fight selector */}
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {EVENT.fights.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFightId(f.id)}
                  className="whitespace-nowrap px-3 py-1.5 transition-all"
                  style={{
                    background: selectedFightId === f.id ? "#111111" : "#ffffff",
                    color: selectedFightId === f.id ? "#e8b400" : "#777777",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    borderRadius: 20,
                    border: selectedFightId === f.id ? "1px solid #111111" : "1px solid rgba(0,0,0,0.12)",
                  }}
                >
                  {f.isMain ? "메인 이벤트" : f.isCo ? "코메인" : f.weightClass}
                </button>
              ))}
            </div>

            <div style={{ fontFamily: "'Inter', sans-serif", textAlign: "center", fontSize: "0.72rem", color: "#aaaaaa", letterSpacing: "0.2em" }}>
              {selectedFight.weightClass.toUpperCase()}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FighterCard
                fighter={selectedFight.fighter1}
                corner="red"
                totalDonation={donations[selectedFight.fighter1.id] || 0}
                onDonate={() => setDonationTarget(selectedFight.fighter1)}
              />
              <div className="flex items-center justify-center sm:hidden">
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "1.5rem", color: "#cccccc", letterSpacing: "0.2em" }}>
                  VS
                </div>
              </div>
              <FighterCard
                fighter={selectedFight.fighter2}
                corner="blue"
                totalDonation={donations[selectedFight.fighter2.id] || 0}
                onDonate={() => setDonationTarget(selectedFight.fighter2)}
              />
            </div>

            {/* Head-to-head donation bar */}
            <div
              className="p-4"
              style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            >
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "#999999", letterSpacing: "0.1em", textAlign: "center", marginBottom: 10 }}>
                이 경기 도네이션 대결
              </div>
              {(() => {
                const a = donations[selectedFight.fighter1.id] || 0;
                const b = donations[selectedFight.fighter2.id] || 0;
                const total = a + b || 1;
                const pctA = (a / total) * 100;
                const pctB = (b / total) * 100;
                return (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.88rem", color: "#b38a00" }}>
                        {selectedFight.fighter1.name}
                      </span>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.88rem", color: "#333333" }}>
                        {selectedFight.fighter2.name}
                      </span>
                    </div>
                    <div className="flex h-3 overflow-hidden gap-0.5" style={{ borderRadius: 6 }}>
                      <motion.div
                        animate={{ width: `${pctA}%` }}
                        transition={{ duration: 0.5 }}
                        style={{ background: "linear-gradient(90deg, #e8b400, #f5c800)", minWidth: 4 }}
                      />
                      <motion.div
                        animate={{ width: `${pctB}%` }}
                        transition={{ duration: 0.5 }}
                        style={{ background: "linear-gradient(90deg, #333333, #555555)", minWidth: 4 }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#b38a00", fontWeight: 700 }}>
                        {pctA.toFixed(1)}% · {a.toLocaleString()}원
                      </span>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#555555", fontWeight: 700 }}>
                        {b.toLocaleString()}원 · {pctB.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}

        {/* Cheer Tab */}
        {activeTab === "cheer" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CheerSection
              fighters={fighterPairs}
              isOpen={isCheerOpen}
              daysLeft={daysLeft}
              onOpenDonate={setDonationTarget}
              externalDonation={lastDonation}
            />
          </motion.div>
        )}
      </div>

      {/* Donation Modal */}
      {donationTarget && (
        <DonationModal
          fighter={donationTarget}
          onClose={() => setDonationTarget(null)}
          onDonate={(amount, message) => {
            handleDonate(amount, message);
          }}
        />
      )}
      </>}
    </div>
  );
}
