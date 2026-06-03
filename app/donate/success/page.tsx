import Link from "next/link";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ tid?: string; player?: string; amount?: string }>;
}) {
  const { tid, player, amount } = await searchParams;

  const formattedAmount = amount
    ? Number(amount).toLocaleString("ko-KR") + "원"
    : "";

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-[480px] w-full text-center">
        {/* 완료 아이콘 */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(217,95,43,0.10)" }}
        >
          <span className="text-3xl">🎉</span>
        </div>

        <h1
          className="text-[24px] font-bold mb-2"
          style={{ fontFamily: "'Clash Grotesk', sans-serif", color: "var(--foreground)" }}
        >
          후원 완료!
        </h1>

        {player && formattedAmount && (
          <p className="text-[15px] mb-1" style={{ color: "var(--text-sub)" }}>
            <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{player}</span> 선수에게
          </p>
        )}
        {formattedAmount && (
          <p
            className="text-[32px] font-bold mb-6"
            style={{ fontFamily: "'Clash Grotesk', sans-serif", color: "var(--accent)" }}
          >
            {formattedAmount}
          </p>
        )}

        <p className="text-[14px] mb-8" style={{ color: "var(--muted-foreground)" }}>
          응원이 피드에 올라갔습니다
        </p>

        {tid && (
          <Link
            href={`/tournaments/${tid}`}
            className="block w-full py-4 rounded-2xl text-[15px] font-semibold"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            피드 보러가기
          </Link>
        )}
      </div>
    </main>
  );
}
