-- ============================================================================
-- Public owner/lister names for listing cards.
--
-- profiles and lister_profiles are RLS-locked to their own rows, so the
-- anonymous REST path cannot join names onto published listings (the
-- profiles!properties_owner_id_fkey join silently returns null). These two
-- guarded security-definer RPCs expose only the display name — never phone,
-- email, or address — and only for publicly visible rows, so every listing
-- card can render "Listed by <name>" with one batch call.
--
-- Mirror of the existing per-item get_public_lister() (20260811000000) but
-- batched: pass the ids you already loaded, or call with no args to get every
-- visible listing's owner/lister name.
-- ============================================================================

create or replace function public.get_public_owner_names(p_property_ids uuid[] default null)
returns table(property_id uuid, owner_name text)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select pr.id as property_id,
         coalesce(pl.full_name, 'KeyLo landlord') as owner_name
  from public.properties pr
  left join public.profiles pl on pl.id = pr.owner_id
  where pr.status = 'published'
    and (p_property_ids is null or pr.id = any(p_property_ids));
end;
$$;

create or replace function public.get_public_lister_names(p_item_ids uuid[] default null)
returns table(item_id uuid, lister_name text)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select li.id as item_id,
         coalesce(lp.display_name, pl.full_name, 'KeyLo lister') as lister_name
  from public.lister_items li
  left join public.lister_profiles lp on lp.id = li.lister_id
  left join public.profiles pl on pl.id = li.lister_id
  where li.availability = 'available'
    and (p_item_ids is null or li.id = any(p_item_ids));
end;
$$;

revoke all on function public.get_public_owner_names(uuid[]) from public;
revoke all on function public.get_public_lister_names(uuid[]) from public;
grant execute on function public.get_public_owner_names(uuid[]) to anon, authenticated;
grant execute on function public.get_public_lister_names(uuid[]) to anon, authenticated;
