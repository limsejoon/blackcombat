import { createClient } from "@/lib/supabase/server";
import type { Tournament } from "@/types/database";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tournaments")
    .select("*")
    .order("created_at", { ascending: false });

  const tournaments = (data ?? []) as Tournament[];

  return (
    <main className="min-h-screen p-8" style={{ background: "var(--background)" }}>
      <h1
        className="text-2xl font-bold mb-6"
        style={{ fontFamily: "'Clash Grotesk', sans-serif", color: "var(--foreground)" }}
      >
        BlackBombat
      </h1>

      {error && (
        <p className="text-red-500 text-sm">연결 오류: {error.message}</p>
      )}

      {tournaments?.length === 0 && (
        <p style={{ color: "var(--muted-foreground)" }}>대회 없음</p>
      )}

      {tournaments?.map((t) => (
        <div
          key={t.id}
          className="p-4 rounded-2xl mb-3"
          style={{ background: "var(--card)", border: "1px solid var(--border-med)" }}
        >
          <div className="font-semibold" style={{ color: "var(--foreground)" }}>
            {t.title}
          </div>
          <div className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            상태: {t.status}
          </div>
        </div>
      ))}
    </main>
  );
}
