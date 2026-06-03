"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Heart, Star, AlignJustify } from "lucide-react";

const NAV = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/tournaments", icon: Trophy, label: "대회" },
  { href: "/donate", icon: Heart, label: "후원" },
  { href: "/bookmarks", icon: Star, label: "즐겨찾기" },
  { href: "/menu", icon: AlignJustify, label: "메뉴" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        background: "#1C1C1C",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        paddingTop: "8px",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
      }}
    >
      {NAV.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 px-4 py-1"
          >
            <div
              className="flex items-center justify-center w-10 h-10 rounded-full"
              style={{ background: active ? "#7FD649" : "transparent" }}
            >
              <Icon size={20} color={active ? "#0F0F0F" : "#6E6E73"} />
            </div>
            <span className="text-[10px] font-medium" style={{ color: active ? "#7FD649" : "#6E6E73" }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
