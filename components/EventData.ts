export interface Fighter {
  id: string;
  name: string;
  nickname: string;
  nationality: string;
  flag: string;
  record: string;
  photo: string;
  rank: string;
  bio?: string;
  age?: number;
  height?: string;
  weight?: string;
  reach?: string;
  stance?: string;
  stats?: { ko: number; sub: number; dec: number; totalWins: number };
  recentFights?: { opponent: string; result: string; method: string; date: string }[];
}

export interface Fight {
  id: string;
  isMain: boolean;
  isCo: boolean;
  weightClass: string;
  boutLabel: string;
  fighter1: Fighter;
  fighter2: Fighter;
  rounds: number;
  title?: string;
  redPct: number;
  bluePct: number;
  commentCount: number;
}

export interface Event {
  id: string;
  org: string;
  name: string;
  subtitle: string;
  date: string;
  venue: string;
  location: string;
  poster: string;
  fights: Fight[];
}

export const EVENT: Event = {
  id: "black-combat-rise09",
  org: "블랙컴뱃",
  name: "라이즈 09",
  subtitle: "BLACK COMBAT RISE 09",
  date: "2026-06-06T18:00:00+09:00",
  venue: "블랙아고라",
  location: "경기도 오산시",
  poster: "https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=1200&h=600&fit=crop&auto=format",
  fights: [
    {
      id: "r09-f1",
      isMain: true,
      isCo: false,
      weightClass: "플라이급",
      boutLabel: "FLYWEIGHT BOUT",
      rounds: 3,
      redPct: 53,
      bluePct: 47,
      commentCount: 22,
      fighter1: {
        id: "jeong-won-hee",
        name: "정원희",
        nickname: "투견",
        nationality: "대한민국",
        flag: "🇰🇷",
        record: "9W 9L",
        rank: "플라이급 #9",
        photo: "https://images.unsplash.com/photo-1549476464-37392f717541?w=400&h=500&fit=crop&auto=format",
        bio: "강렬한 투지로 어떤 상대에도 물러서지 않는 파이터. 이름처럼 끝까지 싸우는 스타일.",
      },
      fighter2: {
        id: "lee-young-woong",
        name: "이영웅",
        nickname: "캡틴 히어로",
        nationality: "대한민국",
        flag: "🇰🇷",
        record: "4W 0L",
        rank: "플라이급 #14",
        photo: "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=400&h=500&fit=crop&auto=format",
        bio: "무패의 신예. 라이즈08에서 메탈 리를 TKO로 꺾으며 강렬한 인상을 남겼다.",
      },
    },
    {
      id: "r09-f2",
      isMain: false,
      isCo: true,
      weightClass: "웰터급",
      boutLabel: "WELTERWEIGHT BOUT",
      rounds: 3,
      redPct: 47,
      bluePct: 53,
      commentCount: 24,
      fighter1: {
        id: "yeo-dong-ju",
        name: "여동주",
        nickname: "엄지장군",
        nationality: "대한민국",
        flag: "🇰🇷",
        record: "4W 1L",
        rank: "미들급 #6",
        photo: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=500&fit=crop&auto=format",
        bio: "마이크웍과 실력을 모두 갖춘 캐릭터형 파이터. 팬들에게 인기가 높다.",
      },
      fighter2: {
        id: "fabricio-azevedo",
        name: "Fabricio Azevedo",
        nickname: "젠틀맨",
        nationality: "브라질",
        flag: "🇧🇷",
        record: "12W 3L",
        rank: "—",
        photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop&auto=format",
        bio: "12승 경력의 베테랑. 압도적인 경험치로 도전자들을 꺾어온 브라질 파이터.",
      },
    },
    {
      id: "r09-f3",
      isMain: false,
      isCo: false,
      weightClass: "페더급",
      boutLabel: "FEATHERWEIGHT BOUT",
      rounds: 3,
      redPct: 13,
      bluePct: 87,
      commentCount: 37,
      fighter1: {
        id: "heo-sun-haeng",
        name: "허선행",
        nickname: "사이보그",
        nationality: "대한민국",
        flag: "🇰🇷",
        record: "5W 4L 1D",
        rank: "페더급 #24",
        photo: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=500&fit=crop&auto=format",
        bio: "업셋을 노리는 언더독. 승부예측을 뒤집는 이변을 만들어낼 수 있을까.",
      },
      fighter2: {
        id: "ortsa-gudaev",
        name: "Ortsa Gudaev",
        nickname: "데드샷",
        nationality: "러시아",
        flag: "🇷🇺",
        record: "14W 4L",
        rank: "—",
        photo: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=500&fit=crop&auto=format",
        bio: "14승의 강력한 파이터. 87%의 압도적인 승부예측을 받고 있는 강력한 우승 후보.",
      },
    },
    {
      id: "r09-f4",
      isMain: false,
      isCo: false,
      weightClass: "-100kg 캐치웨이트",
      boutLabel: "-100KG CATCHWEIGHT BOUT",
      rounds: 3,
      redPct: 62,
      bluePct: 38,
      commentCount: 17,
      fighter1: {
        id: "lee-jong-gu",
        name: "이종구",
        nickname: "알밤",
        nationality: "대한민국",
        flag: "🇰🇷",
        record: "2W 0L",
        rank: "헤비급 #7",
        photo: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=400&h=500&fit=crop&auto=format",
        bio: "무패의 헤비급 신예. 강한 타격력을 바탕으로 2전 전승 기록 중.",
      },
      fighter2: {
        id: "hong-hee-won",
        name: "홍희원",
        nickname: "세비지",
        nationality: "대한민국",
        flag: "🇰🇷",
        record: "2W 1L",
        rank: "미들급 #12",
        photo: "https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?w=400&h=500&fit=crop&auto=format",
        bio: "공격적인 스타일의 미들급 파이터. 이종구의 태클 방어를 어떻게 풀어낼지 주목된다.",
      },
    },
    {
      id: "r09-f5",
      isMain: false,
      isCo: false,
      weightClass: "라이트급",
      boutLabel: "LIGHTWEIGHT BOUT",
      rounds: 3,
      redPct: 67,
      bluePct: 33,
      commentCount: 27,
      fighter1: {
        id: "bruno-itamar",
        name: "Bruno Itamar",
        nickname: "글래디에이터",
        nationality: "브라질",
        flag: "🇧🇷",
        record: "4W 0L",
        rank: "라이트급 #13",
        photo: "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=400&h=500&fit=crop&auto=format",
        bio: "무패의 라이트급 파이터. 압도적인 피지컬로 상대를 제압하는 스타일.",
      },
      fighter2: {
        id: "jang-geun-young",
        name: "장근영",
        nickname: "슬로스",
        nationality: "대한민국",
        flag: "🇰🇷",
        record: "3W 4L",
        rank: "라이트급 #20",
        photo: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=500&fit=crop&auto=format",
        bio: "1라운드만 버티면 체력에서 역전할 수 있다는 팬들의 기대를 받고 있는 파이터.",
      },
    },
    {
      id: "r09-f6",
      isMain: false,
      isCo: false,
      weightClass: "웰터급",
      boutLabel: "WELTERWEIGHT BOUT",
      rounds: 3,
      redPct: 77,
      bluePct: 23,
      commentCount: 22,
      fighter1: {
        id: "patrick-kelvin",
        name: "Patrick Kelvin",
        nickname: "사무라이",
        nationality: "브라질",
        flag: "🇧🇷",
        record: "9W 2L",
        rank: "미들급 #2 / 웰터급 #7",
        photo: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=500&fit=crop&auto=format",
        bio: "넘버링을 향한 팬들의 열망을 받고 있는 실력파. 77%의 높은 승부예측을 받고 있다.",
      },
      fighter2: {
        id: "kim-yul",
        name: "김율",
        nickname: "블랙맘바",
        nationality: "대한민국",
        flag: "🇰🇷",
        record: "9W 8L",
        rank: "웰터급 #9",
        photo: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&h=500&fit=crop&auto=format",
        bio: "풍부한 경험의 베테랑. 9승 8패의 경력으로 어떤 상대도 만만히 볼 수 없는 파이터.",
      },
    },
    {
      id: "r09-f7",
      isMain: false,
      isCo: false,
      weightClass: "밴텀급",
      boutLabel: "BANTAMWEIGHT BOUT",
      rounds: 3,
      redPct: 49,
      bluePct: 51,
      commentCount: 25,
      fighter1: {
        id: "maicon-bruno",
        name: "Maicon Bruno",
        nickname: "몽크",
        nationality: "브라질",
        flag: "🇧🇷",
        record: "5W 6L",
        rank: "밴텀급 #19",
        photo: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=500&fit=crop&auto=format",
        bio: "팬들에게 꾸준히 사랑받는 파이터. '이제 이길 때 됐다'는 응원을 받고 있다.",
      },
      fighter2: {
        id: "lee-gang-nam",
        name: "이강남",
        nickname: "해적왕",
        nationality: "대한민국",
        flag: "🇰🇷",
        record: "3W 3L",
        rank: "밴텀급 #22",
        photo: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=500&fit=crop&auto=format",
        bio: "라이즈08에서 카우보이를 꺾은 밴텀급 파이터. 연속 승리를 노린다.",
      },
    },
    {
      id: "r09-f8",
      isMain: false,
      isCo: false,
      weightClass: "웰터급",
      boutLabel: "WELTERWEIGHT BOUT",
      rounds: 3,
      redPct: 16,
      bluePct: 84,
      commentCount: 19,
      fighter1: {
        id: "park-chan-sol",
        name: "박찬솔",
        nickname: "블랙리스트",
        nationality: "대한민국",
        flag: "🇰🇷",
        record: "5W 2L",
        rank: "웰터급 #12",
        photo: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=500&fit=crop&auto=format",
        bio: "팬들도 인정한 미스매치. 그래도 파이터는 싸운다.",
      },
      fighter2: {
        id: "wallison-silva",
        name: "Wallison Silva",
        nickname: "Big Bull",
        nationality: "브라질",
        flag: "🇧🇷",
        record: "6W 0L",
        rank: "—",
        photo: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=500&fit=crop&auto=format",
        bio: "6전 전승의 언비튼 파이터. 84%의 압도적 승부예측이 말해주는 강자.",
      },
    },
    {
      id: "r09-f9",
      isMain: false,
      isCo: false,
      weightClass: "웰터급",
      boutLabel: "WELTERWEIGHT BOUT",
      rounds: 3,
      redPct: 24,
      bluePct: 76,
      commentCount: 20,
      fighter1: {
        id: "lee-seol-ho",
        name: "이설호",
        nickname: "그레네이드",
        nationality: "대한민국",
        flag: "🇰🇷",
        record: "4W 7L",
        rank: "웰터급 #19",
        photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop&auto=format",
        bio: "팬들에게 '노잼'이라는 평가를 받고 있지만, 링에선 항상 최선을 다한다.",
      },
      fighter2: {
        id: "son-min",
        name: "손민",
        nickname: "스톤골렘",
        nationality: "대한민국",
        flag: "🇰🇷",
        record: "4W 3L",
        rank: "라이트급 #26",
        photo: "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=400&h=500&fit=crop&auto=format",
        bio: "76%의 승부예측을 받으며 강력한 우승 후보. 그레네이드를 상대로 무난히 이길 것으로 예상.",
      },
    },
  ],
};
