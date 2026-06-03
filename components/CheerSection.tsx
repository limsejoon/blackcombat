"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Heart, Zap, MessageCircle, Crown, TrendingUp, ChevronRight, Flame } from "lucide-react";
import { Fighter } from "@/components/EventData";
import { motion, AnimatePresence } from "motion/react";

interface Comment {
  id: string;
  user: string;
  avatar: string;
  message: string;
  targetFighter: string | null;
  targetDonor: string | null;
  time: Date;
  donationAmount?: number;
  likes: number;
  liked: boolean;
  tier: "whale" | "supporter" | "fan";
}

interface DonorStat {
  user: string;
  avatar: string;
  total: number;
  count: number;
}

interface Props {
  fighters: { red: Fighter; blue: Fighter }[];
  isOpen: boolean;
  daysLeft: number;
  onOpenDonate: (fighter: Fighter) => void;
  externalDonation?: { user: string; amount: number; fighterName: string } | null;
}

const AVATARS = ["🔥", "⚡", "💪", "🥊", "🏆", "👊", "🦅", "🐉"];

const INITIAL_DONORS: DonorStat[] = [
  { user: "익명#222", avatar: "🏆", total: 55000, count: 3 },
  { user: "익명#158", avatar: "⚡", total: 30000, count: 4 },
  { user: "익명#82", avatar: "🥊", total: 20000, count: 2 },
  { user: "익명#99", avatar: "💪", total: 10000, count: 1 },
  { user: "익명#64", avatar: "🔥", total: 5000, count: 1 },
];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: "c1", user: "익명#64", avatar: "🔥",
    message: "1라 버티면 슬로스가 이긴다고 본다",
    targetFighter: "슬로스", targetDonor: null,
    time: new Date(Date.now() - 1000 * 60 * 143), donationAmount: undefined,
    likes: 11, liked: false, tier: "fan",
  },
  {
    id: "c2", user: "익명#158", avatar: "⚡",
    message: "사무라이 넘버링 제발",
    targetFighter: "사무라이", targetDonor: null,
    time: new Date(Date.now() - 1000 * 60 * 1045), donationAmount: 10000,
    likes: 28, liked: false, tier: "supporter",
  },
  {
    id: "c3", user: "익명#245", avatar: "💪",
    message: "관장님 화이팅",
    targetFighter: "사무라이", targetDonor: null,
    time: new Date(Date.now() - 1000 * 60 * 1348), donationAmount: undefined,
    likes: 15, liked: false, tier: "fan",
  },
  {
    id: "c4", user: "익명#82", avatar: "🥊",
    message: "사무라이 넘버링 가자!",
    targetFighter: "사무라이", targetDonor: null,
    time: new Date(Date.now() - 1000 * 60 * 1393), donationAmount: 5000,
    likes: 19, liked: false, tier: "supporter",
  },
  {
    id: "c5", user: "익명#222", avatar: "🏆",
    message: "몽크야 이제 이길때 됐다. 쟤 해적왕 아니고 그냥 해적임. 수도승이 혼내줭",
    targetFighter: "몽크", targetDonor: null,
    time: new Date(Date.now() - 1000 * 60 * 1400), donationAmount: 20000,
    likes: 34, liked: false, tier: "whale",
  },
  {
    id: "c6", user: "격투팬", avatar: "🐉",
    message: "격투팬님 최고!! 응원 항상 감사해요",
    targetFighter: null, targetDonor: "익명#222",
    time: new Date(Date.now() - 1000 * 60 * 1350), donationAmount: undefined,
    likes: 8, liked: false, tier: "fan",
  },
  {
    id: "c7", user: "익명#64", avatar: "🔥",
    message: "너무하는데 박찬솔 파머 2배로 줘라.. 이건 변수자체가 없는거 아닌가..",
    targetFighter: "블랙리스트", targetDonor: null,
    time: new Date(Date.now() - 1000 * 60 * 140), donationAmount: undefined,
    likes: 22, liked: false, tier: "fan",
  },
  {
    id: "c8", user: "익명#158", avatar: "⚡",
    message: "엄지가 실력과 마이크웍도 보여주길",
    targetFighter: "엄지장군", targetDonor: null,
    time: new Date(Date.now() - 1000 * 60 * 141), donationAmount: 15000,
    likes: 17, liked: false, tier: "supporter",
  },
  {
    id: "c9", user: "익명#99", avatar: "👊",
    message: "이영웅 화이팅",
    targetFighter: "캡틴 히어로", targetDonor: null,
    time: new Date(Date.now() - 1000 * 60 * 60 * 20), donationAmount: 5000,
    likes: 13, liked: false, tier: "supporter",
  },
  {
    id: "c10", user: "익명#10", avatar: "🦅",
    message: "이미지가 중요하구나 그레네이드는 노잼이라",
    targetFighter: "그레네이드", targetDonor: null,
    time: new Date(Date.now() - 1000 * 60 * 60 * 19), donationAmount: undefined,
    likes: 6, liked: false, tier: "fan",
  },
];

const ALL_FILTERS = ["전체", "도네이션", "선수응원", "팬응원"];

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  return `${Math.floor(diff / 3600)}시간 전`;
}

function DonorCheerModal({ donor, onClose, onSend }: { donor: DonorStat; onClose: () => void; onSend: (msg: string) => void }) {
  const [msg, setMsg] = useState("");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-xl overflow-hidden"
        style={{ background: "#ffffff", border: "1px solid rgba(232,180,0,0.4)", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
      >
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(232,180,0,0.12)", border: "2px solid #e8b400", fontSize: "1.5rem" }}
            >
              {donor.avatar}
            </div>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "#111111" }}>
                {donor.user}
              </div>
              <div className="flex items-center gap-1">
                <Crown size={11} color="#e8b400" />
                <span style={{ fontSize: "0.72rem", color: "#b38a00", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
                  누적 {donor.total.toLocaleString()}원 응원 중
                </span>
              </div>
            </div>
          </div>
          <textarea
            rows={3}
            autoFocus
            placeholder={`${donor.user}님에게 응원 메시지를 보내세요...`}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl resize-none outline-none mb-3"
            style={{
              background: "#f5f5f5",
              border: "1px solid rgba(0,0,0,0.1)",
              color: "#111111",
              fontSize: "0.85rem",
              lineHeight: 1.6,
            }}
          />
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl" style={{ background: "#f0f0f0", color: "#777777", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
              취소
            </button>
            <button
              onClick={() => { if (msg.trim()) { onSend(msg.trim()); onClose(); } }}
              disabled={!msg.trim()}
              className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all"
              style={{
                background: msg.trim() ? "linear-gradient(135deg, #e8b400, #f5c800)" : "#eeeeee",
                color: msg.trim() ? "#111111" : "#aaaaaa",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
              }}
            >
              <Send size={13} /> 응원 보내기
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function CheerSection({ fighters, isOpen, daysLeft, onOpenDonate, externalDonation }: Props) {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [donors, setDonors] = useState<DonorStat[]>(INITIAL_DONORS);

  useEffect(() => {
    if (!externalDonation) return;
    const { user, amount, fighterName } = externalDonation;
    const newComment: Comment = {
      id: `ext${Date.now()}`,
      user,
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      message: `${fighterName} 선수 응원합니다! 파이팅!! 🔥`,
      targetFighter: fighterName,
      targetDonor: null,
      time: new Date(),
      donationAmount: amount,
      likes: 0,
      liked: false,
      tier: amount >= 30000 ? "whale" : amount >= 10000 ? "supporter" : "fan",
    };
    setComments((prev) => [newComment, ...prev]);
    setDonors((prev) => {
      const existing = prev.find((d) => d.user === user);
      if (existing) {
        return [...prev.map((d) => d.user === user ? { ...d, total: d.total + amount, count: d.count + 1 } : d)]
          .sort((a, b) => b.total - a.total);
      }
      return [...prev, { user, avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)], total: amount, count: 1 }]
        .sort((a, b) => b.total - a.total);
    });
  }, [externalDonation]);

  const [input, setInput] = useState("");
  const [username, setUsername] = useState("익명의 팬");
  const [selectedFighter, setSelectedFighter] = useState<string | null>(null);
  const [filter, setFilter] = useState("전체");
  const [cheerTarget, setCheerTarget] = useState<DonorStat | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const allFighters = fighters.flatMap(({ red, blue }) => [red, blue]);
  const topDonor = donors[0];
  const totalDonations = donors.reduce((s, d) => s + d.total, 0);

  function handleSend() {
    if (!input.trim()) return;
    const newComment: Comment = {
      id: `c${Date.now()}`,
      user: username || "익명의 팬",
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      message: input.trim(),
      targetFighter: selectedFighter,
      targetDonor: null,
      time: new Date(),
      likes: 0,
      liked: false,
      tier: "fan",
    };
    setComments((prev) => [newComment, ...prev]);
    setInput("");
    setTimeout(() => listRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 50);
  }

  function handleCheerDonor(donor: DonorStat, msg: string) {
    const newComment: Comment = {
      id: `ch${Date.now()}`,
      user: username || "익명의 팬",
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      message: msg,
      targetFighter: null,
      targetDonor: donor.user,
      time: new Date(),
      likes: 0,
      liked: false,
      tier: "fan",
    };
    setComments((prev) => [newComment, ...prev]);
    setTimeout(() => listRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 50);
  }

  function toggleLike(id: string) {
    setComments((prev) =>
      prev.map((c) => c.id === id ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c)
    );
  }

  const filtered = comments.filter((c) => {
    if (filter === "전체") return true;
    if (filter === "도네이션") return !!c.donationAmount;
    if (filter === "선수응원") return !!c.targetFighter;
    if (filter === "팬응원") return !!c.targetDonor;
    return true;
  });

  if (!isOpen) {
    return (
      <div className="rounded-xl p-10 flex flex-col items-center gap-4 text-center" style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#f5f2eb", border: "1px solid rgba(232,180,0,0.3)" }}>
          <MessageCircle size={28} color="#e8b400" />
        </div>
        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.5rem", fontWeight: 900, color: "#111111" }}>응원창 잠금 중</div>
          <div style={{ fontSize: "0.88rem", color: "#777777", marginTop: 4 }}>
            대회 D-{daysLeft}일 남았습니다.<br />
            <span style={{ color: "#b38a00", fontWeight: 700 }}>D-10</span>부터 응원 댓글 및 도네이션이 가능합니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* TOP DONOR SPOTLIGHT */}
      <div
        className="relative rounded-xl overflow-hidden p-4"
        style={{
          background: "#111111",
          border: "1px solid rgba(232,180,0,0.5)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Crown size={15} color="#e8b400" fill="#e8b400" />
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.85rem", color: "#e8b400", letterSpacing: "0.12em" }}>
            이번 대회 도네이션 TOP 후원자
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(232,180,0,0.15)", border: "2.5px solid #e8b400", fontSize: "1.8rem" }}
              >
                {topDonor.avatar}
              </div>
              <div
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "#e8b400" }}
              >
                <Crown size={10} color="#111" fill="#111" />
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "1.2rem", color: "#ffffff" }}>
                {topDonor.user}
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", fontWeight: 800, color: "#e8b400" }}>
                {topDonor.total.toLocaleString()}원
              </div>
              <div style={{ fontSize: "0.65rem", color: "#888888" }}>{topDonor.count}회 응원</div>
            </div>
          </div>
          <button
            onClick={() => setCheerTarget(topDonor)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all hover:scale-[1.03]"
            style={{
              background: "linear-gradient(135deg, #e8b400, #f5c800)",
              color: "#111111",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              fontSize: "0.85rem",
            }}
          >
            <Heart size={13} fill="#111111" /> 응원하기
          </button>
        </div>
      </div>

      {/* DONOR LEADERBOARD */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div className="px-4 pt-4 pb-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="flex items-center gap-2">
            <TrendingUp size={15} color="#111111" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#111111" }}>
              후원자 랭킹
            </span>
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#10b981", fontWeight: 700 }}>
            총 {totalDonations.toLocaleString()}원
          </span>
        </div>

        {donors.map((donor, idx) => {
          const pct = totalDonations > 0 ? (donor.total / totalDonations) * 100 : 0;
          const medals = ["🥇", "🥈", "🥉"];
          const isTop3 = idx < 3;
          return (
            <div
              key={donor.user}
              className="px-4 py-3 flex items-center gap-3"
              style={{
                borderBottom: idx < donors.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                background: idx === 0 ? "rgba(232,180,0,0.04)" : "transparent",
              }}
            >
              <div className="w-6 text-center shrink-0" style={{ fontSize: isTop3 ? "1.1rem" : "0.75rem", color: "#aaaaaa", fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
                {isTop3 ? medals[idx] : idx + 1}
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: idx === 0 ? "rgba(232,180,0,0.12)" : "#f5f5f5",
                  border: `1.5px solid ${idx === 0 ? "#e8b400" : "rgba(0,0,0,0.08)"}`,
                  fontSize: "1.1rem",
                }}
              >
                {donor.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.88rem", color: idx === 0 ? "#b38a00" : "#333333" }}>
                    {donor.user}
                  </span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.9rem", color: idx === 0 ? "#b38a00" : "#111111" }}>
                    {donor.total.toLocaleString()}원
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                  <motion.div
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: idx === 0 ? "linear-gradient(90deg,#e8b400,#f5c800)" : idx === 1 ? "#cccccc" : idx === 2 ? "#aaaaaa" : "rgba(0,0,0,0.12)" }}
                  />
                </div>
              </div>
              <button
                onClick={() => setCheerTarget(donor)}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all hover:scale-[1.04]"
                style={{
                  background: "#111111",
                  color: "#e8b400",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  whiteSpace: "nowrap",
                }}
              >
                <Heart size={10} /> 응원
              </button>
            </div>
          );
        })}

        <div className="px-4 py-3" style={{ background: "#f5f2eb", borderTop: "1px solid rgba(232,180,0,0.2)" }}>
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#333333" }}>
                🔥 랭킹에 올라가고 싶다면?
              </div>
              <div style={{ fontSize: "0.7rem", color: "#888888" }}>선수를 응원하고 후원자 랭킹에 이름을 올리세요</div>
            </div>
            <button
              onClick={() => onOpenDonate(allFighters[0])}
              className="flex items-center gap-1 px-3 py-2 rounded-xl transition-all hover:scale-[1.04]"
              style={{
                background: "linear-gradient(135deg, #e8b400, #f5c800)",
                color: "#111111",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                fontSize: "0.8rem",
              }}
            >
              <Zap size={12} fill="#111111" /> 지금 응원
            </button>
          </div>
        </div>
      </div>

      {/* COMMENT FEED */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div className="p-4 space-y-2" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="닉네임"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-3 py-2 rounded-xl outline-none w-28 shrink-0"
              style={{ background: "#f5f5f5", border: "1px solid rgba(0,0,0,0.1)", color: "#111111", fontSize: "0.8rem" }}
            />
            <select
              value={selectedFighter ?? ""}
              onChange={(e) => setSelectedFighter(e.target.value || null)}
              className="flex-1 px-2 py-2 rounded-xl outline-none"
              style={{ background: "#f5f5f5", border: "1px solid rgba(0,0,0,0.1)", color: "#777777", fontSize: "0.8rem" }}
            >
              <option value="">선수 태그 없음</option>
              {allFighters.map((f) => <option key={f.id} value={f.name}>{f.name}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="응원 메시지를 입력하세요..."
              className="flex-1 px-3 py-2.5 rounded-xl outline-none"
              style={{ background: "#f5f5f5", border: "1px solid rgba(0,0,0,0.1)", color: "#111111", fontSize: "0.85rem" }}
            />
            <button
              onClick={handleSend}
              className="px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all hover:opacity-90"
              style={{ background: "#111111", color: "#e8b400", fontFamily: "'Inter', sans-serif", fontWeight: 700, whiteSpace: "nowrap" }}
            >
              <Send size={14} /> 전송
            </button>
          </div>
        </div>

        <div className="px-4 py-2.5 flex gap-2" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          {ALL_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1 rounded-full text-xs transition-all"
              style={{
                background: filter === f ? "#111111" : "#f5f5f5",
                color: filter === f ? "#e8b400" : "#777777",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                border: filter === f ? "1px solid #111111" : "1px solid rgba(0,0,0,0.08)",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div ref={listRef} className="overflow-y-auto" style={{ maxHeight: 520, scrollbarWidth: "none" }}>
          <AnimatePresence initial={false}>
            {filtered.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mx-3 my-2 rounded-xl p-3"
                style={{
                  background: c.donationAmount && c.tier === "whale" ? "rgba(232,180,0,0.05)" : c.donationAmount ? "#fafafa" : "transparent",
                  border: c.donationAmount && c.tier === "whale" ? "1px solid rgba(232,180,0,0.3)" : c.donationAmount ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent",
                }}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: c.donationAmount ? "rgba(232,180,0,0.12)" : "#f5f5f5",
                      border: c.donationAmount ? "1.5px solid rgba(232,180,0,0.4)" : "1.5px solid rgba(0,0,0,0.08)",
                      fontSize: "1rem",
                    }}
                  >
                    {c.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.88rem", color: c.donationAmount ? "#b38a00" : "#333333" }}>
                        {c.user}
                      </span>

                      {c.donationAmount && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded" style={{ background: "rgba(232,180,0,0.12)", color: "#b38a00", fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.7rem" }}>
                          <Zap size={9} fill="#b38a00" />
                          {c.donationAmount.toLocaleString()}원 도네이션
                        </span>
                      )}

                      {c.targetFighter && (
                        <span className="px-1.5 py-0.5 rounded" style={{ background: "#f0f0f0", color: "#555555", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.68rem" }}>
                          → {c.targetFighter}
                        </span>
                      )}

                      {c.targetDonor && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded" style={{ background: "rgba(232,180,0,0.08)", color: "#b38a00", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.68rem" }}>
                          <Heart size={8} /> {c.targetDonor}에게
                        </span>
                      )}

                      <span style={{ fontSize: "0.65rem", color: "#aaaaaa", marginLeft: "auto" }}>{timeAgo(c.time)}</span>
                    </div>

                    <p style={{ fontSize: "0.83rem", color: "#444444", lineHeight: 1.55 }}>{c.message}</p>

                    <div className="flex items-center gap-3 mt-1.5">
                      <button
                        onClick={() => toggleLike(c.id)}
                        className="flex items-center gap-1 transition-all"
                        style={{ color: c.liked ? "#e8b400" : "#aaaaaa", fontSize: "0.72rem" }}
                      >
                        <Heart size={11} fill={c.liked ? "#e8b400" : "none"} /> {c.likes}
                      </button>

                      {c.donationAmount && (
                        <button
                          onClick={() => {
                            const f = allFighters.find((f) => f.name === c.targetFighter) ?? allFighters[0];
                            onOpenDonate(f);
                          }}
                          className="flex items-center gap-1 transition-all hover:opacity-80"
                          style={{ color: "#b38a00", fontSize: "0.7rem", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
                        >
                          <Flame size={10} /> 나도 응원
                        </button>
                      )}

                      {!c.targetDonor && (() => {
                        const donorMatch = donors.find((d) => d.user === c.user);
                        if (!donorMatch) return null;
                        return (
                          <button
                            onClick={() => setCheerTarget(donorMatch)}
                            className="flex items-center gap-1 transition-all hover:opacity-80"
                            style={{ color: "#888888", fontSize: "0.7rem", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                          >
                            <ChevronRight size={10} /> 응원 메시지 보내기
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {cheerTarget && (
        <DonorCheerModal
          donor={cheerTarget}
          onClose={() => setCheerTarget(null)}
          onSend={(msg) => handleCheerDonor(cheerTarget, msg)}
        />
      )}
    </div>
  );
}
