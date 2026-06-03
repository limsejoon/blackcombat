"use client";

import { useState } from "react";
import { X, Heart, Zap } from "lucide-react";
import { Fighter } from "@/components/EventData";

interface Props {
  fighter: Fighter;
  onClose: () => void;
  onDonate: (amount: number, message: string) => void;
}

const PRESETS = [1000, 3000, 5000, 10000, 30000, 50000];

export function DonationModal({ fighter, onClose, onDonate }: Props) {
  const [amount, setAmount] = useState<number | "">("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"form" | "done">("form");

  function handleSubmit() {
    const val = Number(amount);
    if (!val || val < 500) return;
    onDonate(val, message);
    setStep("done");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-xl overflow-hidden"
        style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
      >
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", background: "#111111" }}>
          <div className="flex items-center gap-2">
            <Heart size={18} color="#e8b400" fill="#e8b400" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#ffffff" }}>
              응원 도네이션
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} color="#aaaaaa" />
          </button>
        </div>

        {step === "form" ? (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f5f2eb", border: "1px solid rgba(232,180,0,0.2)" }}>
              <img src={fighter.photo} alt={fighter.name} className="w-12 h-12 rounded-full object-cover" style={{ border: "2px solid #e8b400" }} />
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, color: "#111111" }}>{fighter.name}</div>
                <div style={{ fontSize: "0.75rem", color: "#888888" }}>&ldquo;{fighter.nickname}&rdquo;에게 응원을 보내세요!</div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", color: "#777777", display: "block", marginBottom: 8 }}>금액 선택</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setAmount(p)}
                    className="py-2 rounded-xl transition-all"
                    style={{
                      background: amount === p ? "#111111" : "#f5f2eb",
                      color: amount === p ? "#e8b400" : "#555555",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      border: `1px solid ${amount === p ? "#111111" : "rgba(0,0,0,0.1)"}`,
                    }}
                  >
                    {p.toLocaleString()}원
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="직접 입력 (최소 500원)"
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3 py-2.5 rounded-xl outline-none"
                style={{
                  background: "#f5f5f5",
                  border: "1px solid rgba(0,0,0,0.1)",
                  color: "#111111",
                  fontSize: "0.9rem",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", color: "#777777", display: "block", marginBottom: 8 }}>응원 메시지 (선택)</label>
              <textarea
                rows={3}
                placeholder="선수에게 전하고 싶은 응원 메시지를 입력하세요..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl resize-none outline-none"
                style={{
                  background: "#f5f5f5",
                  border: "1px solid rgba(0,0,0,0.1)",
                  color: "#111111",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!amount || Number(amount) < 500}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
              style={{
                background: !amount || Number(amount) < 500 ? "#eeeeee" : "linear-gradient(135deg, #e8b400, #f5c800)",
                color: !amount || Number(amount) < 500 ? "#aaaaaa" : "#111111",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                fontSize: "1rem",
                letterSpacing: "0.05em",
                cursor: !amount || Number(amount) < 500 ? "not-allowed" : "pointer",
              }}
            >
              <Zap size={16} />
              {amount ? `${Number(amount).toLocaleString()}원 응원하기` : "금액을 선택하세요"}
            </button>

            <p style={{ fontSize: "0.7rem", color: "#aaaaaa", textAlign: "center" }}>
              * 본 도네이션은 데모 시뮬레이션입니다.
            </p>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center gap-4 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(232,180,0,0.15)", border: "2px solid #e8b400" }}
            >
              <Heart size={28} color="#e8b400" fill="#e8b400" />
            </div>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.5rem", fontWeight: 900, color: "#111111" }}>
                응원 전송 완료!
              </div>
              <div style={{ fontSize: "0.85rem", color: "#777777", marginTop: 4 }}>
                {fighter.name} 선수에게 {Number(amount).toLocaleString()}원을 응원했습니다!
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl"
              style={{ background: "#111111", color: "#e8b400", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
