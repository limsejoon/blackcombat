# Design System — BlackBombat

## Product Context
- **What this is:** 스포츠 대회 팬 후원 댓글 피드 서비스
- **Who it's for:** 한국 스포츠 팬 (모바일 우선)
- **Space/industry:** 후원 플랫폼 (Ko-fi 감성, 스포츠 커뮤니티)
- **Project type:** Mobile-first web app

## Memorable Thing
"내 응원이 피드에 살아있다" — 피드가 주인공. 후원 화면은 배우.

## Aesthetic Direction
- **Direction:** Warm Light — 따뜻한 크림 배경, 절제된 액센트
- **Decoration level:** Minimal (타이포그래피와 여백이 대부분의 일을 함)
- **Mood:** Ko-fi처럼 친근하고 따뜻하되, 스포츠 커뮤니티의 에너지가 살짝 배어있음. 과하지 않게.
- **Reference:** Ko-fi (ko-fi.com)

## Typography
- **Display/금액:** Clash Grotesk — 숫자 타이포그래피가 특히 임팩트 있음. `10,000원`이 시각적으로 존재감 있게 보임
- **UI/한국어:** Pretendard — 한국어 웹폰트 중 부동의 1위. 간결하고 가독성 최상
- **Mono/타임스탬프:** Geist Mono — 시간 표시, 주문번호 등에 사용
- **Loading:** CDN (Google Fonts + jsdelivr/pretendard)
- **Scale:**
  - xs: 11px / sm: 12px / base: 14px / md: 15px / lg: 17px / xl: 20px / 2xl: 26px / 3xl: 38px

## Color
- **Approach:** Restrained (액센트는 드물게, 의미 있는 곳에만)

```
--bg:           #EDEBE4   배경 (따뜻한 크림)
--surface:      #F5F3EE   섹션/헤더 배경
--card:         #FDFCFA   카드 배경
--card-warm:    #FBF8F2   선택/spotlight 카드 배경

--accent:       #D95F2B   후원자 닉네임, CTA 버튼, spotlight 강조
--accent-soft:  rgba(217,95,43,0.10)
--accent-border: rgba(217,95,43,0.25)

--secondary:    #4A7EC7   카테고리 레이블, 인터랙티브 보조
--secondary-soft: rgba(74,126,199,0.10)

--text:         #1C1C2A   본문 텍스트
--text-sub:     #4A4A5A   보조 텍스트
--muted:        #9090A0   플레이스홀더, 타임스탬프

--border:       rgba(0,0,0,0.07)
--border-med:   rgba(0,0,0,0.11)

--success:      #2E9E5B
--warning:      #D97706
--error:        #DC2626
```

- **Dark mode:** 미지원 (MVP 범위 외)

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable
- **Scale:** 2(2px) 4(4px) 8(8px) 12(12px) 16(16px) 20(20px) 24(24px) 32(32px) 48(48px) 64(64px)

## Layout
- **Approach:** Mobile-first, grid-disciplined
- **Max content width:** 480px (모바일 앱), 1200px (어드민)
- **Border radius:** sm(8px) md(12px) lg(16px) xl(18px) full(9999px)
- **Grid:** 단일 컬럼 (모바일), 2컬럼 (선수 선택 그리드)

## Motion
- **Approach:** Minimal-functional
- **Easing:** enter(ease-out) exit(ease-in)
- **Duration:** micro(100ms) short(150ms) medium(250ms)
- **New donation spotlight:** subtle fade-in + 살짝 위로 올라오는 트랜지션

## Key Components
- **DonationCard** — 후원자명(accent) + 선수명 + 금액(Clash Grotesk) + 메시지
- **SpotlightCard** — DonationCard의 강조 variant. 따뜻한 배경 + accent 테두리
- **PlayerCard** — 선수 선택 카드. active 상태에 accent 테두리 + 체크마크
- **AmountChip** — 고정 금액 선택 칩. selected 상태에 accent
- **LiveBadge** — LIVE 표시. accent 배경 + 점멸하는 dot

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-28 | Warm Light (라이트 모드) | Ko-fi 레퍼런스 기반, 사용자 요청 |
| 2026-05-28 | Pretendard + Clash Grotesk | 한국어 최적화 + 금액 숫자 임팩트 |
| 2026-05-28 | Accent #D95F2B (소프트 테라코타) | 초기 #FF6B2C에서 다운. 덜 강렬하게 |
| 2026-05-28 | Spotlight 카드 | 최신 후원 카드만 시각적으로 강조 — "내 응원이 살아있다" |
