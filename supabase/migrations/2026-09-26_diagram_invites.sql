-- Pending diagram invites + email-confirmed acceptance trigger.
-- Assumes workspace_data.id and auth.users.id are uuid (match existing app usage).

create table if not exists public.diagram_invites (
  id uuid primary key default gen_random_uuid(),
  diagram_id uuid not null references public.workspace_data(id) on delete cascade,
  email text not null check (email = lower(email)),
  role text not null check (role in ('viewer', 'editor')),
  invited_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (diagram_id, email)
);

alter table public.diagram_invites enable row level security;

create policy "Owners can view invites on their diagrams"
on public.diagram_invites for select
using (invited_by = auth.uid());

-- Required for ON CONFLICT in accept_pending_invites (if not already present).
create unique index if not exists diagram_collaborators_diagram_user_uidx
  on public.diagram_collaborators (diagram_id, user_id);

create or replace function public.accept_pending_invites()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email_confirmed_at is null then
    return new;
  end if;

  insert into public.diagram_collaborators (diagram_id, user_id, role, invited_by)
  select i.diagram_id, new.id, i.role, i.invited_by
  from public.diagram_invites i
  where i.email = lower(new.email)
  on conflict (diagram_id, user_id) do update
    set role = excluded.role,
        invited_by = excluded.invited_by;

  delete from public.diagram_invites where email = lower(new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_confirmed_accept_invites on auth.users;
create trigger on_auth_user_confirmed_accept_invites
after insert or update of email_confirmed_at on auth.users
for each row execute function public.accept_pending_invites();
