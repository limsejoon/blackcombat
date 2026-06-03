"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Tournament, Player } from "@/types/database";

const AMOUNTS = [1000, 5000, 10000, 50000];

function formatAmount(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export function DonateFlow({
  tournament,
  players,
}: {
  tournament: Tournament;
  players: Player[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const canNext =
    (step === 1 && selectedPlayer !== null) ||
    (step === 2 && selectedAmount !== null) ||
    (step === 3 && message.trim().length > 0) ||
    (step === 4 && nickname.trim().length > 0);

  const stepTitles = ["선수 선택", "후원 금액", "응원 메시지", "닉네임"];

  const handleNext = async () => {
    if (!canNext) return;
    if (step < 4) {
      setStep((s) => s + 1);
      return;
    }

    // Step 4: 제출
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tournament_id: tournament.id,
          player_id: selectedPlayer!.id,
          donor_nickname: nickname.trim(),
          amount: selectedAmount,
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setSubmitError(err.error ?? "오류가 발생했습니다");
        return;
      }

      router.push(
        `/donate/success?tid=${tournament.id}&player=${encodeURIComponent(selectedPlayer!.name)}&amount=${selectedAmount}`
      );
    } catch {
      setSubmitError("네트워크 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pb-28" style={{ background: "var(--background)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 px-5 py-4"
        style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-[480px] mx-auto">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="text-[12px] mb-3 flex items-center gap-1"
              style={{ color: "var(--muted-foreground)" }}
            >
              ← 이전
            </button>
          ) : (
            <Link
              href={`/tournaments/${tournament.id}`}
              className="inline-flex items-center gap-1 text-[12px] mb-3"
              style={{ color: "var(--muted-foreground)" }}
            >
              ← 대회로 돌아가기
            </Link>
          )}

          <h1
            className="text-[17px] font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {stepTitles[step - 1]}
          </h1>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {tournament.title}
          </p>

          {/* Progress bar */}
          <div className="flex gap-1.5 mt-3">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className="h-1 rounded-full flex-1 transition-all duration-300"
                style={{ background: s <= step ? "var(--accent)" : "rgba(0,0,0,0.10)" }}
              />
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto px-4 py-6">
        {/* Step 1: 선수 선택 */}
        {step === 1 && (
          players.length === 0 ? (
            <div className="text-center py-14" style={{ color: "var(--muted-foreground)" }}>
              <p className="text-[14px]">등록된 선수가 없습니다</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {players.map((p) => {
                const isSelected = selectedPlayer?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlayer(p)}
                    className="p-4 rounded-2xl text-left transition-all"
                    style={{
                      background: isSelected ? "var(--card-warm)" : "var(--card)",
                      border: isSelected
                        ? "1.5px solid rgba(217,95,43,0.25)"
                        : "1px solid var(--border-med)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <div
                          className="text-[15px] font-semibold truncate"
                          style={{ color: isSelected ? "var(--accent)" : "var(--foreground)" }}
                        >
                          {p.name}
                        </div>
                        {p.nickname && (
                          <div className="text-[12px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                            {p.nickname}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <span className="shrink-0 text-[14px]" style={{ color: "var(--accent)" }}>✓</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )
        )}

        {/* Step 2: 금액 선택 */}
        {step === 2 && (
          <div>
            <div
              className="p-3 rounded-xl mb-5 text-[13px]"
              style={{ background: "var(--card)", border: "1px solid var(--border-med)", color: "var(--text-sub)" }}
            >
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>{selectedPlayer!.name}</span> 선수에게 후원합니다
            </div>
            <div className="grid grid-cols-2 gap-3">
              {AMOUNTS.map((amount) => {
                const isSelected = selectedAmount === amount;
                return (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className="py-6 rounded-2xl transition-all"
                    style={{
                      background: isSelected ? "var(--accent)" : "var(--card)",
                      border: isSelected ? "none" : "1px solid var(--border-med)",
                    }}
                  >
                    <span
                      className="text-[22px] font-bold"
                      style={{
                        fontFamily: "'Clash Grotesk', sans-serif",
                        color: isSelected ? "#fff" : "var(--foreground)",
                      }}
                    >
                      {formatAmount(amount)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: 메시지 */}
        {step === 3 && (
          <div>
            <div
              className="p-3 rounded-xl mb-5 text-[13px]"
              style={{ background: "var(--card)", border: "1px solid var(--border-med)", color: "var(--text-sub)" }}
            >
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>{selectedPlayer!.name}</span> 선수에게{" "}
              <span
                style={{ fontFamily: "'Clash Grotesk', sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--foreground)" }}
              >
                {formatAmount(selectedAmount!)}
              </span>{" "}후원
            </div>
            <label className="block">
              <span
                className="text-[11px] font-semibold uppercase tracking-wider mb-2 block"
                style={{ color: "var(--muted-foreground)" }}
              >
                응원 메시지
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 100))}
                placeholder="선수에게 응원의 말을 전해보세요!"
                rows={5}
                autoFocus
                className="w-full p-4 rounded-xl resize-none text-[14px] outline-none"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border-med)",
                  color: "var(--foreground)",
                  fontFamily: "'Pretendard', sans-serif",
                }}
              />
            </label>
            <div className="text-right text-[12px] mt-1" style={{ color: "var(--muted-foreground)" }}>
              {message.length}/100
            </div>
          </div>
        )}

        {/* Step 4: 닉네임 */}
        {step === 4 && (
          <div>
            <div
              className="p-3 rounded-xl mb-5 text-[13px]"
              style={{ background: "var(--card)", border: "1px solid var(--border-med)", color: "var(--text-sub)" }}
            >
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>{selectedPlayer!.name}</span>{" "}
              ·{" "}
              <span style={{ fontFamily: "'Clash Grotesk', sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--foreground)" }}>
                {formatAmount(selectedAmount!)}
              </span>
            </div>

            <label className="block">
              <span
                className="text-[11px] font-semibold uppercase tracking-wider mb-2 block"
                style={{ color: "var(--muted-foreground)" }}
              >
                피드에 표시될 닉네임
              </span>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value.slice(0, 20))}
                placeholder="닉네임 입력"
                autoFocus
                className="w-full p-4 rounded-xl text-[14px] outline-none"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border-med)",
                  color: "var(--foreground)",
                  fontFamily: "'Pretendard', sans-serif",
                }}
              />
            </label>
            <div className="text-right text-[12px] mt-1" style={{ color: "var(--muted-foreground)" }}>
              {nickname.length}/20
            </div>

            {submitError && (
              <p className="mt-3 text-[13px]" style={{ color: "#DC2626" }}>
                {submitError}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3"
        style={{ background: "linear-gradient(to top, var(--background) 80%, transparent)" }}
      >
        <div className="max-w-[480px] mx-auto">
          <button
            onClick={handleNext}
            disabled={!canNext || isSubmitting}
            className="w-full py-4 rounded-2xl text-[15px] font-semibold transition-all"
            style={{
              background: canNext && !isSubmitting ? "var(--accent)" : "rgba(0,0,0,0.08)",
              color: canNext && !isSubmitting ? "#fff" : "var(--muted-foreground)",
              cursor: canNext && !isSubmitting ? "pointer" : "default",
            }}
          >
            {isSubmitting ? "제출 중..." : step === 4 ? "후원하기" : "다음"}
          </button>
        </div>
      </div>
    </main>
  );
}
