export function LiveBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
      style={{ background: "rgba(255,69,58,0.15)", color: "#FF453A" }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ background: "#FF453A" }}
      />
      Live
    </span>
  );
}
