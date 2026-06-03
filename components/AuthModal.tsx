"use client";

import { X } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

interface Props {
  onClose: () => void;
}

export function AuthModal({ onClose }: Props) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-sm rounded-xl overflow-hidden"
        style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
      >
        <div
          className="flex items-center justify-between p-5"
          style={{ background: "#111111", borderBottom: "3px solid #e8b400" }}
        >
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#ffffff" }}>
            로그인
          </span>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} color="#aaaaaa" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p style={{ fontSize: "0.9rem", color: "#555555", textAlign: "center" }}>
            응원 도네이션을 하려면 로그인이 필요합니다
          </p>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "#ffffff",
              border: "1.5px solid #dadce0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "#3c4043",
              cursor: "pointer",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Google로 계속하기
          </button>
        </div>
      </div>
    </div>
  );
}
