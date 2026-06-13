create table if not exists guestbook (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  message     text not null,
  link        text,
  status      text not null default 'pending' check (status in ('pending','approved')),
  created_at  timestamptz not null default now()
);
create index if not exists guestbook_status_created_idx on guestbook (status, created_at desc);
