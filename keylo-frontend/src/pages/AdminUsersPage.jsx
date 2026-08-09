import { useEffect, useState } from 'react';
import { getAdminUsers } from '../lib/supabaseData';
import { isSupabaseConfigured } from '../lib/supabase';
import { formatDate } from '../lib/format';

const roleLabels = { student: 'Student', landlord: 'Landlord', admin: 'Admin' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    getAdminUsers().then((rows) => { if (active) setUsers(rows); }).catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, []);

  const counts = {
    all: users.length,
    student: users.filter((user) => user.role === 'student').length,
    landlord: users.filter((user) => user.role === 'landlord').length,
    admin: users.filter((user) => user.role === 'admin').length,
    verified: users.filter((user) => user.is_verified).length,
  };

  return (
    <div className="bg-surface min-h-screen font-body-md text-on-surface">
      <header className="border-b-2 border-primary pb-lg mb-xl flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <p className="font-label-caps text-label-caps text-hot-pink uppercase mb-sm">Admin directory</p>
          <h1 className="font-heading text-h1-mobile md:text-h1 text-primary uppercase font-bold">Users</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Every KeyLo account with its role and verification state.</p>
        </div>
        <span className="font-label-caps text-label-caps text-on-surface-variant">{counts.all} accounts</span>
      </header>
      {error && <div role="alert" className="bg-error/10 border-2 border-error p-md mb-lg text-error">{error}</div>}

      <section className="grid grid-cols-2 lg:grid-cols-5 gap-md mb-lg">
        {[['All users', counts.all, 'people'], ['Students', counts.student, 'school'], ['Landlords', counts.landlord, 'apartment'], ['Admins', counts.admin, 'admin_panel_settings'], ['Verified landlords', counts.verified, 'verified_user']].map(([label, value, icon]) => (
          <div key={label} className="bg-surface-container-lowest border-2 border-primary p-lg">
            <div className="flex justify-between items-start"><span className="material-symbols-outlined text-primary">{icon}</span></div>
            <p className="font-price-display text-price-display text-primary mt-md">{value}</p>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-xs">{label}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-md">
        {users.length ? users.map((user) => (
          <article key={user.id} className="bg-surface-container-lowest border-2 border-primary p-lg shadow-[4px_4px_0px_0px_#000000] flex flex-col md:flex-row md:items-center justify-between gap-lg">
            <div className="flex items-center gap-md flex-1 min-w-0">
              <span className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-primary">person</span>
              </span>
              <div className="min-w-0">
                <h2 className="font-h3 text-h3 text-primary truncate">{user.full_name}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {user.phone ? `+91 ${user.phone}` : 'No phone on file'} · Joined {formatDate(user.created_at)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-sm">
              <span className={`px-sm py-xs border-2 border-primary font-label-caps text-label-caps ${user.role === 'admin' ? 'bg-hot-pink text-white' : user.role === 'landlord' ? 'bg-electric-purple text-white' : 'bg-acid-lime text-primary'}`}>
                {roleLabels[user.role] || user.role}
              </span>
              <span className={`px-sm py-xs border-2 border-primary font-label-caps text-label-caps ${user.is_verified ? 'bg-acid-lime text-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                {user.is_verified ? 'Verified' : 'Unverified'}
              </span>
              {user.owner_rating != null && <span className="px-sm py-xs border-2 border-primary font-label-caps text-label-caps bg-surface-container-lowest text-primary">{Number(user.owner_rating).toFixed(1)} ★ owner</span>}
            </div>
          </article>
        )) : (
          <p className="border-2 border-primary border-dashed p-lg text-center font-body-md text-on-surface-variant">
            {isSupabaseConfigured ? 'No user accounts found yet.' : 'Connect Supabase and sign in as an admin to see registered users.'}
          </p>
        )}
      </section>
    </div>
  );
}
