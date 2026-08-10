import { useEffect, useState } from 'react';
import { getAdminProperties, moderateProperty } from '../lib/supabaseData';
import { isSupabaseConfigured } from '../lib/supabase';

export default function AdminDisputeCenterPage() {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const refresh = () => getAdminProperties().then(setProperties).catch((err) => setError(err.message));
  useEffect(() => { if (isSupabaseConfigured) refresh(); }, []);

  const updateStatus = async (id, status) => {
    try { await moderateProperty(id, status); setMessage(`Listing ${status}.`); await refresh(); } catch (err) { setError(err.message); }
  };

  const visible = properties.filter((property) => filter === 'all' || property.status === filter);
  return (
    <div className="w-full">
      <header className="border-b-2 border-primary pb-lg mb-xl flex flex-col md:flex-row md:items-end justify-between gap-lg"><div><p className="font-label-caps text-label-caps text-hot-pink uppercase mb-sm">Admin moderation</p><h1 className="font-heading text-h1-mobile md:text-h1 text-primary uppercase font-bold">Trust control room</h1><p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Review property evidence and decide what students are allowed to see.</p></div><div className="bg-electric-purple text-white border-2 border-primary px-md py-sm font-label-caps text-label-caps">AI assists · humans decide</div></header>
      {message && <div className="bg-acid-lime border-2 border-primary p-md mb-lg text-primary">{message}</div>}
      {error && <div role="alert" className="bg-error/10 border-2 border-error p-md mb-lg text-error">{error}</div>}
      <div className="flex flex-wrap gap-sm mb-lg">{['all', 'draft', 'published', 'paused'].map((status) => <button key={status} onClick={() => setFilter(status)} className={`px-md py-sm border-2 border-primary font-label-caps text-label-caps uppercase ${filter === status ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-primary hover:bg-acid-lime'}`}>{status === 'all' ? 'All listings' : status}</button>)}</div>
      <section className="flex flex-col gap-md">{visible.length ? visible.map((property) => <article key={property.id} className="bg-surface-container-lowest border-2 border-primary p-lg shadow-[4px_4px_0px_0px_#000000]"><div className="flex flex-col lg:flex-row lg:items-center justify-between gap-lg"><div className="flex-1"><div className="flex flex-wrap gap-sm mb-sm"><span className="px-sm py-xs bg-surface-container border border-primary font-label-caps text-[10px] uppercase">{property.status}</span><span className="px-sm py-xs bg-acid-lime border border-primary font-label-caps text-[10px]">Trust {property.trust_score || 0}/100</span></div><h2 className="font-h3 text-h3 text-primary">{property.name}</h2><p className="font-body-md text-body-md text-on-surface-variant mt-xs">{property.area}, {property.city} · {property.property_type.toUpperCase()} · Near {property.universities?.name}</p><div className="flex flex-wrap gap-md mt-md font-label-caps text-[10px] uppercase text-on-surface-variant"><span><span className="material-symbols-outlined text-[16px] align-middle mr-xs">{property.is_ai_inspected ? 'check_circle' : 'pending'}</span>AI inspection</span><span><span className="material-symbols-outlined text-[16px] align-middle mr-xs">{property.is_documents_verified ? 'check_circle' : 'pending'}</span>Documents</span><span><span className="material-symbols-outlined text-[16px] align-middle mr-xs">verified_user</span>{property.profiles?.is_verified ? 'Landlord verified' : 'Landlord pending'}</span></div></div><div className="flex flex-wrap gap-sm"><button onClick={() => updateStatus(property.id, 'published')} disabled={property.status === 'published'} className="px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary disabled:opacity-40">Approve listing</button><button onClick={() => updateStatus(property.id, 'paused')} disabled={property.status === 'paused'} className="px-md py-sm bg-surface border-2 border-coral font-label-caps text-label-caps text-coral disabled:opacity-40">Pause</button></div></div></article>) : <div className="border-2 border-primary p-xl text-center bg-surface-container"><span className="material-symbols-outlined text-[48px] text-on-surface-variant">fact_check</span><h2 className="font-h3 text-h3 text-primary mt-md">No listings in this queue</h2><p className="font-body-md text-on-surface-variant mt-sm">New landlord submissions will appear here for review.</p></div>}</section>
      {!isSupabaseConfigured && <p className="mt-lg font-label-caps text-label-caps text-on-surface-variant">Connect Supabase and sign in as an admin to moderate live listings.</p>}
    </div>
  );
}
