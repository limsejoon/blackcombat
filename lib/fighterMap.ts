export const TOURNAMENT_ID = "bc000000-0000-0000-0000-000000000001";

export const FIGHTER_TO_PLAYER_ID: Record<string, string> = {
  "jeong-won-hee":   "bc000000-0000-0000-0000-100000000001",
  "lee-young-woong": "bc000000-0000-0000-0000-100000000002",
  "yeo-dong-ju":     "bc000000-0000-0000-0000-100000000003",
  "fabricio-azevedo":"bc000000-0000-0000-0000-100000000004",
  "heo-sun-haeng":   "bc000000-0000-0000-0000-100000000005",
  "ortsa-gudaev":    "bc000000-0000-0000-0000-100000000006",
  "lee-jong-gu":     "bc000000-0000-0000-0000-100000000007",
  "hong-hee-won":    "bc000000-0000-0000-0000-100000000008",
  "bruno-itamar":    "bc000000-0000-0000-0000-100000000009",
  "jang-geun-young": "bc000000-0000-0000-0000-100000000010",
  "patrick-kelvin":  "bc000000-0000-0000-0000-100000000011",
  "kim-yul":         "bc000000-0000-0000-0000-100000000012",
  "maicon-bruno":    "bc000000-0000-0000-0000-100000000013",
  "lee-gang-nam":    "bc000000-0000-0000-0000-100000000014",
  "park-chan-sol":   "bc000000-0000-0000-0000-100000000015",
  "wallison-silva":  "bc000000-0000-0000-0000-100000000016",
  "lee-seol-ho":     "bc000000-0000-0000-0000-100000000017",
  "son-min":         "bc000000-0000-0000-0000-100000000018",
};

export const PLAYER_ID_TO_FIGHTER: Record<string, string> = Object.fromEntries(
  Object.entries(FIGHTER_TO_PLAYER_ID).map(([slug, uuid]) => [uuid, slug])
);
