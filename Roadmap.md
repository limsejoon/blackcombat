# BlackBombat 프로젝트 로드맵

## 1. PRD (Product Requirements Document)

### 서비스 개요
스포츠 대회에서 팬이 선수에게 직접 후원하고 응원 메시지를 남기는 후원 댓글 피드 서비스.
라이브 영상 송출 및 OBS 오버레이는 저작권 이슈로 제외한다.

### 확정된 결정사항
- **결제 PG**: 토스페이먼츠
- **후원 금액**: 고정 옵션 (1,000 / 5,000 / 10,000 / 50,000원)
- **사용자 인증**: 카카오/네이버 소셜 로그인 후 결제 (익명 닉네임 입력 방식 사용 안 함)
- **대회 상태 전환**: 관리자 수동 변경 (자동 전환 없음)
- **관리자 계정**: Supabase Auth에서 직접 생성 (초대 이메일 방식)

### 핵심 가치
- 팬이 경기 중 선수에게 실시간으로 후원 의사를 표현할 수 있다.
- 소셜 로그인으로 신원이 확인된 사용자만 후원하므로 도배·어뷰징을 구조적으로 차단한다.
- 후원이 완료된 메시지만 피드에 노출되어 신뢰도를 확보한다.

### 범위 외 (Out of Scope)
- 라이브 영상 스트리밍
- OBS 오버레이
- 자유 채팅
- 익명 닉네임 후원

---

## 2. MVP 기능 목록

| 우선순위 | 기능 | 설명 |
|---|---|---|
| P0 | 대회 목록 페이지 | 진행 중/예정 대회 목록 표시 |
| P0 | 대회 상세 페이지 | 선수 목록 + 후원 댓글 피드 |
| P0 | 소셜 로그인 | 카카오/네이버 OAuth (Supabase Auth) |
| P0 | 선수 선택 | 대회 참가 선수 중 1명 선택 |
| P0 | 후원 폼 | 고정 금액 선택 (1K/5K/10K/50K) + 응원 메시지 입력 |
| P0 | 결제 처리 | 토스페이먼츠 결제 성공 시 donations 저장 |
| P0 | 후원 댓글 피드 | 최신순 후원 메시지 목록 (수동 새로고침) |
| P1 | 5초 자동 갱신 | setInterval 기반 폴링 |
| P2 | Supabase Realtime | 실시간 구독으로 교체 |
| P1 | 관리자 메시지 숨김 | 부적절 메시지 is_hidden 처리 |
| P1 | 관리자 대회 관리 | 대회 생성/수정/상태 변경 |

---

## 3. 화면 구성

### 공개 페이지

```
/                        대회 목록
/tournaments/[id]        대회 상세 (선수 목록 + 후원 피드)
/tournaments/[id]/donate 후원 플로우 (선수 선택 → 금액 → 메시지 → 결제)
/donate/success          결제 완료 확인
/auth/callback           소셜 로그인 콜백
```

### 관리자 페이지

```
/admin                   대시보드
/admin/tournaments       대회 관리 (생성/수정/상태 변경)
/admin/donations         후원 내역 + 메시지 숨김 처리
```

### 대회 상세 페이지 레이아웃

```
┌─────────────────────────────────────┐
│  대회명 / 날짜 / 상태               │
├──────────────┬──────────────────────┤
│  선수 목록   │  후원 피드           │
│  ┌────────┐  │  ┌──────────────┐   │
│  │ 선수A  │  │  │ 카카오닉네임 │   │
│  │ 선수B  │  │  │ 선수B에게    │   │
│  │ 선수C  │  │  │ 10,000원     │   │
│  └────────┘  │  │ "파이팅!"    │   │
│              │  └──────────────┘   │
│  [후원하기]  │  ...                │
└──────────────┴──────────────────────┘
```

### 후원 플로우 (모달 or 페이지)

```
1단계: 선수 선택
2단계: 금액 선택 [1,000 / 5,000 / 10,000 / 50,000]
3단계: 응원 메시지 입력 (최대 100자)
4단계: 로그인 확인 → 미로그인 시 카카오/네이버 로그인 유도
5단계: 토스페이먼츠 결제창
6단계: 완료 페이지 (피드로 바로 이동)
```

---

## 4. 데이터 모델

### tournaments
```sql
id          uuid primary key
title       text not null
description text
starts_at   timestamptz
ends_at     timestamptz
status      text check (status in ('upcoming','ongoing','finished'))
created_at  timestamptz default now()
```
- `status` 변경은 관리자 수동 처리 (자동 전환 없음)

### players
```sql
id              uuid primary key
tournament_id   uuid references tournaments(id)
name            text not null
nickname        text
image_url       text
created_at      timestamptz default now()
```

### donations
```sql
id              uuid primary key
tournament_id   uuid references tournaments(id)
player_id       uuid references players(id)
donor_id        uuid references auth.users(id)  -- 소셜 로그인 사용자
donor_nickname  text not null                    -- 소셜 로그인 시 가져온 이름
amount          integer not null                 -- 단위: 원 (1000/5000/10000/50000)
message         text not null
is_hidden       boolean default false            -- 관리자 숨김 여부
payment_key     text                             -- 토스페이먼츠 paymentKey
order_id        text unique                      -- 토스페이먼츠 orderId (중복 결제 방지)
created_at      timestamptz default now()
```

### RLS 정책
- `donations` SELECT: `is_hidden = false`인 행만 공개 (anon 포함)
- `donations` INSERT: service_role key만 허용 (API Route에서만)
- `donations` UPDATE (`is_hidden`): authenticated + admin role만 허용
- `tournaments`, `players` SELECT: 공개 읽기 허용
- `tournaments`, `players` INSERT/UPDATE/DELETE: admin role만 허용

---

## 5. 개발 순서

### Phase 1 — 기반 셋업
1. Next.js + TypeScript 프로젝트 생성
2. Supabase 프로젝트 생성, 테이블/RLS 설정
3. shadcn/ui + Tailwind 설정
4. Vercel 배포 연결
5. 카카오/네이버 OAuth 앱 등록 + Supabase Auth 설정

### Phase 2 — 공개 기능 (수동 새로고침)
6. 대회 목록 페이지
7. 대회 상세 페이지 (선수 목록 + 후원 피드)
8. 소셜 로그인 플로우 (카카오/네이버)
9. 후원 폼 UI (선수 선택 → 금액 고정 옵션 → 메시지)
10. 토스페이먼츠 결제 연동
11. 결제 완료 webhook → donations INSERT (orderId 중복 체크 포함)
12. 후원 피드 표시 (수동 새로고침)

### Phase 3 — 자동 갱신
13. 5초 폴링으로 피드 자동 갱신

### Phase 4 — 관리자
14. 관리자 계정 생성 (Supabase Auth 직접 등록)
15. 관리자 미들웨어 (role 체크)
16. 관리자 대회 CRUD + 상태 변경
17. 관리자 메시지 숨김/해제 처리

### Phase 5 — Realtime
18. Supabase Realtime 구독으로 폴링 교체

---

## 6. Supabase Realtime 적용 시점

| 단계 | 방식 | 이유 |
|---|---|---|
| MVP | 수동 새로고침 | 가장 빠른 구현, 검증 우선 |
| Phase 3 | 5초 폴링 (setInterval) | UX 개선, 추가 인프라 불필요 |
| Phase 5 | Supabase Realtime | 트래픽 증가 시 폴링 비용 대체 |

**Realtime 전환 조건**: 동시 접속자 증가로 폴링 부하가 체감될 때.
전환 방법: `useEffect`의 `setInterval`을 `supabase.channel().on('postgres_changes')` 구독으로 교체.

---

## 7. 관리자 메시지 관리 방식

### 숨김 처리 흐름
1. 관리자가 `/admin/donations`에서 후원 목록을 확인한다.
2. 부적절한 메시지에 "숨기기" 버튼 클릭 → `is_hidden = true` UPDATE.
3. 공개 피드 쿼리는 `where is_hidden = false` 조건 포함.
4. 숨김 해제도 동일한 UI에서 가능.

### 관리자 계정 관리
- Supabase Auth 대시보드에서 직접 이메일/패스워드 계정 생성.
- `profiles` 테이블 또는 custom claims로 `role: 'admin'` 부여.
- 관리자 페이지 접근 시 서버사이드에서 role 검증 (Next.js middleware).

### RLS 보안
- 관리자만 `is_hidden` 컬럼을 UPDATE할 수 있도록 RLS 정책 설정.
- 일반 사용자는 `is_hidden = false`인 행만 조회 가능 (RLS SELECT 정책).

### 향후 고려 (MVP 이후)
- 자동 필터링 (욕설 키워드 감지)
- 신고 기능 (사용자가 직접 신고 → 관리자 검토 큐)

---

## 8. 결제 흐름 (토스페이먼츠)

```
클라이언트                     서버 (API Route)         토스페이먼츠
    │                               │                        │
    │  1. orderId 생성 (UUID)        │                        │
    │  2. requestPayment() 호출 ────────────────────────────>│
    │                               │                        │
    │<─────────────── 3. 결제창 표시 ──────────────────────── │
    │                               │                        │
    │  4. 결제 성공 → successUrl 리다이렉트                    │
    │  5. /api/payment/confirm 호출 >│                        │
    │                               │  6. confirmPayment() ─>│
    │                               │<─ 7. 결제 확인 응답 ──  │
    │                               │  8. donations INSERT   │
    │<─────────────── 9. 완료 응답  ─│                        │
```

- `orderId`는 서버에서 UUID로 생성, `donations` 테이블에 `unique` 제약으로 중복 결제 방지.
- 결제 확인은 반드시 서버사이드에서 토스페이먼츠 API 호출 후 검증.
