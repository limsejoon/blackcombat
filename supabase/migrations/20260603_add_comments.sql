-- 응원 댓글 테이블
-- Supabase Dashboard > SQL Editor 에서 실행

create table if not exists comments (
  id            uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  author_name   text not null check (char_length(author_name) > 0),
  fighter_slug  text,
  content       text not null check (char_length(content) > 0 and char_length(content) <= 100),
  created_at    timestamptz not null default now()
);

create index if not exists comments_tournament_id_idx
  on comments(tournament_id, created_at desc);

alter table comments enable row level security;

create policy "comments: 누구나 읽기"
  on comments for select
  using (true);

create policy "comments: 누구나 쓰기"
  on comments for insert
  with check (true);
