"use client";

import { useState } from "react";
import { Fighter } from "@/components/EventData";
import { ChevronDown, ChevronUp, Award, Zap, Shield, Heart } from "lucide-react";

interface Props {
  fighter: Fighter;
  corner: "red" | "blue";
  totalDonation: number;
  onDonate: () => void;
}

export function FighterCard({ fighter, corner, totalDonation, onDonate }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="overflow-hidden"
      style={{
        background: "#1a1a1a",
        border: "1px solid rgba(232,180,0,0.3)",
        borderRadius: 14,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <div className="relative">
        <img
          src={fighter.photo}
          alt={fighter.name}
          className="w-full object-cover"
          style={{ height: 210 }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.3) 50%, transparent 100%)" }}
        />
        <div className="absolute top-3 left-3">
          <span
            className="px-2 py-0.5 text-xs uppercase tracking-widest"
            style={{ background: "#e8b400", color: "#111111", fontFamily: "'Inter', sans-serif", fontWeight: 700, borderRadius: 4 }}
          >
            {corner === "red" ? "선수 1" : "선수 2"}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span style={{ fontSize: "1.4rem" }}>{fighter.flag}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.65rem", fontWeight: 900, color: "#ffffff", lineHeight: 1 }}>
                {fighter.name}
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: "#e8b400", fontWeight: 600, marginTop: 2 }}>
                &ldquo;{fighter.nickname}&rdquo;
              </div>
            </div>
            <div className="text-right">
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#ffffff" }}>
                {fighter.record}
              </div>
              <div style={{ fontSize: "0.62rem", color: "#888888", letterSpacing: "0.1em" }}>전적</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Heart size={12} color="#e8b400" fill="#e8b400" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#888888" }}>
              누적 응원 도네이션
            </span>
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "#e8b400" }}>
            {totalDonation.toLocaleString()}원
          </span>
        </div>
        <button
          onClick={onDonate}
          className="w-full py-2.5 flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #e8b400, #f5c800)",
            color: "#111111",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            fontSize: "0.92rem",
            borderRadius: 8,
          }}
        >
          <Zap size={14} fill="#111111" />
          {fighter.nickname} 응원하기
        </button>
      </div>

      <div className="p-4">
        {fighter.rank && (
          <div
            className="inline-flex items-center gap-1 px-2.5 py-1 mb-3"
            style={{ background: "rgba(232,180,0,0.12)", border: "1px solid rgba(232,180,0,0.3)", borderRadius: 6 }}
          >
            <Award size={10} color="#e8b400" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#e8b400", fontWeight: 700, letterSpacing: "0.06em" }}>
              {fighter.rank}
            </span>
          </div>
        )}

        {fighter.stats && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { icon: <Zap size={12} />, label: "KO/TKO", value: fighter.stats.ko, color: "#e8b400" },
              { icon: <Shield size={12} />, label: "서브미션", value: fighter.stats.sub, color: "#f5c800" },
              { icon: <Award size={12} />, label: "판정", value: fighter.stats.dec, color: "#cccccc" },
            ].map(({ icon, label, value, color }) => (
              <div key={label} className="p-2 text-center" style={{ background: "#262626", borderRadius: 8 }}>
                <div className="flex justify-center mb-1" style={{ color }}>{icon}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "#ffffff" }}>{value}</div>
                <div style={{ fontSize: "0.56rem", color: "#888888" }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {(fighter.age || fighter.height || fighter.reach || fighter.stance) && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
            {[
              fighter.age && { label: "나이", value: `${fighter.age}세` },
              fighter.height && { label: "신장", value: fighter.height },
              fighter.reach && { label: "리치", value: fighter.reach },
              fighter.stance && { label: "스탠스", value: fighter.stance },
            ].filter(Boolean).map((item) => {
              const { label, value } = item as { label: string; value: string };
              return (
                <div key={label} className="flex justify-between items-center py-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: "0.67rem", color: "#888888" }}>{label}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#cccccc" }}>{value}</span>
                </div>
              );
            })}
          </div>
        )}

        {(fighter.bio || (fighter.recentFights && fighter.recentFights.length > 0)) && (
          <>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-full flex items-center justify-center gap-1 py-2 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", color: "#888888", fontSize: "0.76rem", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {expanded ? <><ChevronUp size={12} /> 접기</> : <><ChevronDown size={12} /> 상세 보기</>}
            </button>

            {expanded && (
              <div className="mt-3 space-y-3">
                {fighter.bio && (
                  <p style={{ fontSize: "0.8rem", color: "#888888", lineHeight: 1.7 }}>{fighter.bio}</p>
                )}
                {fighter.recentFights && fighter.recentFights.length > 0 && (
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "#888888", letterSpacing: "0.1em", marginBottom: 6 }}>
                      최근 전적
                    </div>
                    {fighter.recentFights.map((f, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <span style={{ fontSize: "0.76rem", color: "#cccccc" }}>{f.opponent}</span>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: "0.66rem", color: "#888888" }}>{f.method}</span>
                          <span
                            className="px-1.5 py-0.5"
                            style={{
                              background: f.result === "승" ? "rgba(232,180,0,0.15)" : "rgba(255,255,255,0.08)",
                              color: f.result === "승" ? "#e8b400" : "#888888",
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 700,
                              fontSize: "0.66rem",
                              borderRadius: 4,
                            }}
                          >
                            {f.result}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
