-- Public lister contact details for the rental details page.
--
-- lister_profiles and profiles are RLS-locked to their own rows, so the
-- public rental page cannot select from them directly. This guarded,
-- security-definer RPC exposes only the minimal fields a prospective renter
-- needs (name, phone) and only for listings that are publicly visible.
-- Phone is withheld unless the lister has opted into a public profile
-- (lister_settings.public_profile, default true).

create or replace function public.get_public_lister(p_item_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item public.lister_items;
  v_name text;
  v_phone text;
  v_public_profile boolean;
begin
  select * into v_item
  from public.lister_items
  where id = p_item_id;

  if v_item.id is null then
    return null;
  end if;

  -- Only expose contact details for publicly visible listings, unless the
  -- caller owns the listing or is an admin.
  if v_item.availability <> 'available'
     and auth.uid() is distinct from v_item.lister_id
     and not public.is_admin() then
    return null;
  end if;

  select coalesce(lp.display_name, p.full_name, null)
    into v_name
  from public.lister_profiles lp
  left join public.profiles p on p.id = lp.id
  where lp.id = v_item.lister_id;

  if v_name is null then
    return null;
  end if;

  select coalesce(public_profile, true)
    into v_public_profile
  from public.lister_settings
  where lister_id = v_item.lister_id;

  select phone into v_phone
  from public.lister_profiles
  where id = v_item.lister_id;

  return jsonb_build_object(
    'name', v_name,
    'phone', case when v_public_profile then v_phone else null end
  );
end;
$$;

revoke all on function public.get_public_lister(uuid) from public;
grant execute on function public.get_public_lister(uuid) to anon, authenticated;
