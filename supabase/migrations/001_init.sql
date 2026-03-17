create table posts (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  content text not null,
  status text not null default 'pending',  -- pending | approved | declined
  decline_comment text,
  version integer not null default 1,
  source_doc_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
