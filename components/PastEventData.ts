export interface PastFighter {
  nickname: string;
  realName: string;
  record: string;
  nationality: "KR" | "BR" | "JP" | "VN" | "Other";
  rank?: string;
}

export interface PastFight {
  id: string;
  weightClass: string;
  boutType: string;
  isMain: boolean;
  red: PastFighter;
  blue: PastFighter;
  redPct: number;
  bluePct: number;
  winner: "red" | "blue" | null;
  method?: string;
}

export interface PastEvent {
  id: string;
  org: string;
  name: string;
  date: string;
  venue: string;
  location: string;
  poster: string;
  fights: PastFight[];
}

const FLAG: Record<string, string> = {
  KR: "🇰🇷", BR: "🇧🇷", JP: "🇯🇵", VN: "🇻🇳", Other: "🌐",
};
export function flag(nat: PastFighter["nationality"]) { return FLAG[nat]; }

export const PAST_EVENTS: PastEvent[] = [
  {
    id: "black-combat-rise08",
    org: "블랙컴뱃",
    name: "라이즈 08",
    date: "2025-12-06",
    venue: "블랙아고라",
    location: "경기도 오산시",
    poster: "https://images.unsplash.com/photo-1549476464-37392f717541?w=1200&h=500&fit=crop&auto=format",
    fights: [
      {
        id: "r08-f1",
        isMain: true,
        weightClass: "플라이급",
        boutType: "FLYWEIGHT BOUT",
        red: { nickname: "김관장", realName: "김성재", record: "9W 10L 1D", nationality: "KR", rank: "플라이급 #5" },
        blue: { nickname: "크로커다일", realName: "Elias Da Cruz", record: "18W 4L 1D", nationality: "BR", rank: "플라이급 #4" },
        redPct: 36, bluePct: 64,
        winner: "blue",
        method: "판정",
      },
      {
        id: "r08-f2",
        isMain: false,
        weightClass: "플라이급",
        boutType: "FLYWEIGHT BOUT",
        red: { nickname: "앤쵸비", realName: "박태호", record: "9W 7L", nationality: "KR", rank: "플라이급 #7" },
        blue: { nickname: "부기맨", realName: "Rangel dos Santos", record: "12W 6L 1D", nationality: "BR", rank: "플라이급 #10" },
        redPct: 49, bluePct: 51,
        winner: null,
      },
      {
        id: "r08-f3",
        isMain: false,
        weightClass: "스트로급",
        boutType: "STRAWWEIGHT BOUT",
        red: { nickname: "조커", realName: "정도한", record: "2W 8L", nationality: "KR", rank: "플라이급 #20 / 언더그라운드 #2" },
        blue: { nickname: "드래곤 보이", realName: "Sawada Ryuto", record: "15W 10L 1D", nationality: "JP" },
        redPct: 36, bluePct: 64,
        winner: "blue",
        method: "판정",
      },
      {
        id: "r08-f4",
        isMain: false,
        weightClass: "플라이급",
        boutType: "FLYWEIGHT BOUT",
        red: { nickname: "메탈 리", realName: "핫토리 슈토", record: "2W 1L", nationality: "JP", rank: "플라이급 #18" },
        blue: { nickname: "캡틴 히어로", realName: "이영웅", record: "4W 0L", nationality: "KR", rank: "플라이급 #14" },
        redPct: 68, bluePct: 32,
        winner: "blue",
        method: "TKO",
      },
      {
        id: "r08-f5",
        isMain: false,
        weightClass: "밴텀급",
        boutType: "BANTAMWEIGHT BOUT",
        red: { nickname: "카우보이", realName: "Diogenes Neto", record: "0W 2L", nationality: "BR", rank: "밴텀급 #26" },
        blue: { nickname: "해적왕", realName: "이강남", record: "3W 3L", nationality: "KR", rank: "밴텀급 #22" },
        redPct: 45, bluePct: 55,
        winner: "blue",
        method: "TKO",
      },
      {
        id: "r08-f6",
        isMain: false,
        weightClass: "웰터급",
        boutType: "WELTERWEIGHT BOUT",
        red: { nickname: "너드", realName: "Sander Silva", record: "4W 0L", nationality: "BR", rank: "웰터급 #10" },
        blue: { nickname: "쿠빌라이", realName: "뷰렌저릭", record: "16W 19L", nationality: "Other", rank: "웰터급 #11" },
        redPct: 58, bluePct: 42,
        winner: null,
      },
      {
        id: "r08-f7",
        isMain: false,
        weightClass: "아토믹급 (여성)",
        boutType: "ATOMWEIGHT BOUT",
        red: { nickname: "고스트", realName: "홍예린", record: "5W 6L", nationality: "KR", rank: "여성부 #2" },
        blue: { nickname: "kindergarten teacher", realName: "Lò Thị Phung", record: "4W 1L", nationality: "VN" },
        redPct: 78, bluePct: 22,
        winner: "red",
        method: "판정",
      },
      {
        id: "r08-f8",
        isMain: false,
        weightClass: "웰터급",
        boutType: "WELTERWEIGHT BOUT",
        red: { nickname: "니카", realName: "Gilberto Macedo", record: "3W 2L", nationality: "BR", rank: "웰터급 #16" },
        blue: { nickname: "그레네이드", realName: "이설호", record: "4W 7L", nationality: "KR", rank: "웰터급 #19" },
        redPct: 81, bluePct: 19,
        winner: null,
      },
    ],
  },
];
