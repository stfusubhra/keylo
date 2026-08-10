-- Preserve the selected signup role when the auth trigger creates a profile.
-- Role assignment happens inside the trusted trigger because normal users are
-- intentionally forbidden from promoting themselves through profile updates.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role public.user_role := case
    when new.raw_user_meta_data->>'role' = 'landlord' then 'landlord'::public.user_role
    when new.raw_user_meta_data->>'role' = 'admin' then 'student'::public.user_role
    else 'student'::public.user_role
  end;
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'KeyLo user'), v_role)
  on conflict (id) do update set
    full_name = excluded.full_name,
    role = case when public.profiles.role = 'admin' then public.profiles.role else excluded.role end,
    updated_at = now();
  return new;
end;
$$;
