-- Lister marketplace workspace. Lister-owned writes are constrained by RLS;
-- request transitions and earnings are performed atomically by RPCs.

alter type public.user_role add value if not exists 'lister';
