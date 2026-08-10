import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { createProperty, getOwnerMessages, getOwnerWorkspaceData, listUniversities, markMessagesRead, sendMessage } from '../lib/supabaseData';
import { formatDate, formatDateTime } from '../lib/format';

const emptyForm = { name: '', universityId: '', area: '', propertyType: 'pg', monthlyRent: '', securityDeposit: '', distance: '', description: '' };
const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

function Status({ value }) {
  return <span className={`px-sm py-xs border-2 border-primary font-label-caps text-[10px] uppercase ${['confirmed', 'active', 'published', 'held'].includes(value) ? 'bg-acid-lime text-primary' : value === 'disputed' ? 'bg-hot-pink text-white' : 'bg-surface-container text-primary'}`}>{value}</span>;
}

function PropertyForm({ universities, form, setForm, onSubmit, onClose }) {
  const fields = [['name', 'Property name', 'Jadavpur Scholar House'], ['area', 'Area', 'Jadavpur'], ['monthlyRent', 'Monthly rent', '8500'], ['securityDeposit', 'Security deposit', '10000'], ['distance', 'Distance to university (km)', '0.8']];
  return <div className="fixed inset-0 z-[100] bg-primary/60 flex items-center justify-center p-lg"><form onSubmit={onSubmit} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface border-2 border-primary p-lg shadow-[8px_8px_0px_0px_#C7F000]"><div className="flex justify-between items-center mb-lg"><div><p className="font-label-caps text-label-caps text-electric-purple uppercase">New inventory</p><h2 className="font-h3 text-h3 text-primary">Add a Kolkata property</h2></div><button type="button" onClick={onClose} className="material-symbols-outlined text-primary" aria-label="Close form">close</button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-md">{fields.map(([name, label, placeholder]) => <label key={name} className="flex flex-col gap-xs"><span className="font-label-caps text-label-caps text-primary">{label}</span><input required name={name} value={form[name]} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} placeholder={placeholder} className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary" /></label>)}<label className="flex flex-col gap-xs"><span className="font-label-caps text-label-caps text-primary">University</span><select required name="universityId" value={form.universityId} onChange={(event) => setForm((current) => ({ ...current, universityId: event.target.value }))} className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary"><option value="">Choose university</option>{universities.map((university) => <option key={university.id} value={university.id}>{university.name}</option>)}</select></label><label className="flex flex-col gap-xs"><span className="font-label-caps text-label-caps text-primary">Property type</span><select name="propertyType" value={form.propertyType} onChange={(event) => setForm((current) => ({ ...current, propertyType: event.target.value }))} className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary"><option value="pg">PG</option><option value="flat">Flat</option></select></label><label className="md:col-span-2 flex flex-col gap-xs"><span className="font-label-caps text-label-caps text-primary">Description</span><textarea required name="description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={4} className="border-2 border-primary px-md py-md bg-surface-container-lowest text-primary" /></label></div><button type="submit" className="w-full mt-lg px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary">SAVE AS DRAFT</button></form></div>;
}

export default function OwnerPortalPage() {
  const location = useLocation();
  const [data, setData] = useState({ properties: [], bookings: [], tenants: [], deposits: [], messages: [] });
  const [universities, setUniversities] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [viewerId, setViewerId] = useState('');
  const [messageRows, setMessageRows] = useState([]);
  const [activeConvKey, setActiveConvKey] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const refresh = () => Promise.all([getOwnerWorkspaceData(), getOwnerMessages()]).then(([workspace, messages]) => { setData(workspace); setMessageRows(messages || []); }).catch((err) => setError(err.message || 'Unable to load owner data.'));
  useEffect(() => { if (!isSupabaseConfigured) return undefined; listUniversities().then(setUniversities).catch((err) => setError(err.message)); supabase.auth.getUser().then(({ data: userData }) => { if (userData?.user) setViewerId(userData.user.id); }).catch(() => {}); refresh(); return undefined; }, []);

  const handleSubmit = async (event) => { event.preventDefault(); setError(''); try { await createProperty(form); setForm(emptyForm); setShowForm(false); setMessage('Property saved as a draft.'); await refresh(); } catch (err) { setError(err.message); } };
  const route = location.pathname.split('/')[2] || 'overview';
  const title = { overview: 'Landlord overview', properties: 'Properties', tenants: 'Tenants', rentals: 'Rentals', messages: 'Messages', deposits: 'Deposits' }[route] || 'Landlord overview';
  const published = data.properties.filter((property) => property.status === 'published');
  const totalRent = data.bookings.reduce((sum, booking) => sum + Number(booking.rent_amount || 0), 0);

  const header = <section className="flex flex-col md:flex-row md:items-end justify-between gap-lg"><div><p className="font-label-caps text-label-caps text-electric-purple uppercase mb-sm">KeyLo landlord workspace</p><h1 className="font-heading text-h1-mobile md:text-h1 text-on-surface font-bold uppercase">{title}</h1><p className="font-body-lg text-body-lg text-on-surface-variant mt-sm max-w-2xl">{route === 'properties' ? 'Manage your listings, drafts, evidence, and availability.' : route === 'tenants' ? 'See every tenant connected to one of your properties.' : route === 'rentals' ? 'Track stay applications, confirmed bookings, and rent economics.' : route === 'messages' ? 'Read and reply to tenants messaging you about their bookings.' : route === 'deposits' ? 'Monitor protected deposits and release or dispute status.' : 'Manage Kolkata listings, tenant activity, and KeyLo success fees.'}</p></div>{(route === 'overview' || route === 'properties') && <button onClick={() => setShowForm(true)} className="px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary shadow-[4px_4px_0px_0px_#000000]">+ Add property</button>}</section>;

  const overview = <><section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md"><div className="bg-surface-container border-2 border-primary p-lg"><p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Published properties</p><p className="font-price-display text-price-display text-primary mt-lg">{published.length}</p></div><div className="bg-surface-container border-2 border-primary p-lg"><p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Bookings</p><p className="font-price-display text-price-display text-primary mt-lg">{data.bookings.length}</p></div><div className="bg-surface-container border-2 border-primary p-lg"><p className="font-label-caps text-label-caps text-on-surface-variant uppercase">5% KeyLo fee</p><p className="font-price-display text-price-display text-primary mt-lg">{money(totalRent * 0.05)}</p></div><div className="bg-surface-container border-2 border-primary p-lg"><p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Tenants</p><p className="font-price-display text-price-display text-primary mt-lg">{data.tenants.length}</p></div></section><section className="grid grid-cols-1 lg:grid-cols-2 gap-xl"><div className="bg-primary text-on-primary border-2 border-primary p-lg shadow-[8px_8px_0px_0px_#C7F000]"><p className="font-label-caps text-label-caps text-acid-lime uppercase">Revenue model</p><h2 className="font-h3 text-h3 mt-sm">Only pay when rent is collected.</h2><p className="mt-md text-on-primary/80">Current booked rent: <strong className="text-acid-lime">{money(totalRent)}</strong></p></div><div className="bg-surface-container-lowest border-2 border-primary p-lg"><h2 className="font-h3 text-h3 text-primary mb-md">Recent bookings</h2>{data.bookings.slice(0, 5).map((booking) => <div key={booking.id} className="border-t-2 border-primary py-md flex justify-between gap-md"><div><p className="text-primary">{booking.property_name}</p><p className="text-on-surface-variant">{booking.tenant_name} · <Status value={booking.status} /></p></div><strong className="text-primary">{money(booking.rent_amount)}</strong></div>)}{!data.bookings.length && <p className="text-on-surface-variant">No bookings yet.</p>}</div></section></>;

  const properties = <section className="bg-surface-container border-2 border-primary p-lg"><div className="flex justify-between border-b-2 border-primary pb-md mb-md"><h2 className="font-h3 text-h3 text-primary">Your properties</h2><span className="font-label-caps text-label-caps text-on-surface-variant">{data.properties.length} records</span></div><div className="grid grid-cols-1 md:grid-cols-2 gap-md">{data.properties.map((property) => <article key={property.id} className="bg-surface-container-lowest border-2 border-primary p-md"><div className="flex justify-between gap-md"><div><h3 className="font-h3 text-h3 text-primary">{property.name}</h3><p className="text-on-surface-variant">{property.area}, {property.city} · {property.property_type.toUpperCase()}</p><p className="text-primary mt-sm">{money(property.monthly_rent)} / month · Trust {property.trust_score || 0}/100</p></div><Status value={property.status} /></div><div className="flex gap-md mt-md font-label-caps text-[10px] text-on-surface-variant uppercase"><span>{property.is_ai_inspected ? '✓ AI inspected' : '○ AI pending'}</span><span>{property.is_documents_verified ? '✓ Documents' : '○ Documents pending'}</span></div></article>)}</div>{!data.properties.length && <p className="text-on-surface-variant">No properties yet. Add your first draft.</p>}</section>;

  const tenants = <section className="bg-surface-container-lowest border-2 border-primary p-lg overflow-x-auto"><h2 className="font-h3 text-h3 text-primary mb-md">Tenant directory</h2><table className="w-full min-w-[700px] text-left"><thead className="bg-primary text-on-primary"><tr>{['Tenant', 'Email', 'Bookings', 'Active', 'Last booking'].map((item) => <th key={item} className="px-md py-sm font-label-caps text-[10px] uppercase">{item}</th>)}</tr></thead><tbody>{data.tenants.map((tenant) => <tr key={tenant.id} className="border-t-2 border-primary/20"><td className="px-md py-md text-primary">{tenant.full_name}</td><td className="px-md py-md text-on-surface-variant">{tenant.email}</td><td className="px-md py-md text-primary">{tenant.booking_count}</td><td className="px-md py-md text-primary">{tenant.active_bookings}</td><td className="px-md py-md text-on-surface-variant">{formatDateTime(tenant.last_booking_at)}</td></tr>)}</tbody></table>{!data.tenants.length && <p className="text-on-surface-variant mt-md">No tenants have booked your properties.</p>}</section>;

  const rentals = <section className="bg-surface-container-lowest border-2 border-primary p-lg overflow-x-auto"><h2 className="font-h3 text-h3 text-primary mb-md">Stay bookings and rent</h2><table className="w-full min-w-[850px] text-left"><thead className="bg-primary text-on-primary"><tr>{['Tenant', 'Property', 'Status', 'Booked', 'Move-in', 'Rent', 'KeyLo fee'].map((item) => <th key={item} className="px-md py-sm font-label-caps text-[10px] uppercase">{item}</th>)}</tr></thead><tbody>{data.bookings.map((booking) => <tr key={booking.id} className="border-t-2 border-primary/20"><td className="px-md py-md text-primary">{booking.tenant_name}<br /><span className="text-[11px] text-on-surface-variant">{booking.tenant_email}</span></td><td className="px-md py-md text-primary">{booking.property_name}<br /><span className="text-[11px] text-on-surface-variant">{booking.property_area}</span></td><td className="px-md py-md"><Status value={booking.status} /></td><td className="px-md py-md text-on-surface-variant">{formatDateTime(booking.created_at)}</td><td className="px-md py-md text-on-surface-variant">{formatDate(booking.move_in_date)}</td><td className="px-md py-md text-primary">{money(booking.rent_amount)}</td><td className="px-md py-md text-electric-purple">{money(Number(booking.rent_amount) * 0.05)}</td></tr>)}</tbody></table>{!data.bookings.length && <p className="text-on-surface-variant mt-md">No bookings for your properties.</p>}</section>;

  const deposits = <section className="bg-surface-container-lowest border-2 border-primary p-lg overflow-x-auto"><h2 className="font-h3 text-h3 text-primary mb-md">Protected deposits</h2><table className="w-full min-w-[800px] text-left"><thead className="bg-primary text-on-primary"><tr>{['Tenant', 'Property', 'Amount', 'Status', 'Held at', 'Release requested'].map((item) => <th key={item} className="px-md py-sm font-label-caps text-[10px] uppercase">{item}</th>)}</tr></thead><tbody>{data.deposits.map((deposit) => <tr key={deposit.id} className="border-t-2 border-primary/20"><td className="px-md py-md text-primary">{deposit.tenant_name}<br /><span className="text-[11px] text-on-surface-variant">{deposit.tenant_email}</span></td><td className="px-md py-md text-primary">{deposit.property_name}</td><td className="px-md py-md text-primary">{money(deposit.amount)}</td><td className="px-md py-md"><Status value={deposit.status} /></td><td className="px-md py-md text-on-surface-variant">{formatDateTime(deposit.held_at)}</td><td className="px-md py-md text-on-surface-variant">{formatDateTime(deposit.release_requested_at)}</td></tr>)}</tbody></table>{!data.deposits.length && <p className="text-on-surface-variant mt-md">No protected deposits linked to your properties.</p>}</section>;

  const conversations = useMemo(() => {
    if (!viewerId) return [];
    const map = new Map();
    for (const message of messageRows) {
      const otherId = message.sender_id === viewerId ? message.recipient_id : message.sender_id;
      if (!otherId) continue;
      const key = `${message.booking_id || 'x'}::${otherId}`;
      let conv = map.get(key);
      if (!conv) {
        conv = { key, bookingId: message.booking_id, otherId, otherName: '', otherEmail: '', propertyName: message.property_name || '', messages: [], unread: 0, lastAt: message.created_at };
        map.set(key, conv);
      }
      if (message.sender_id === otherId) {
        conv.otherName = message.sender_name || conv.otherName;
        conv.otherEmail = message.sender_email || conv.otherEmail;
        if (!message.read_at) conv.unread += 1;
      } else {
        conv.otherName = message.recipient_name || conv.otherName;
        conv.otherEmail = message.recipient_email || conv.otherEmail;
      }
      if (!conv.propertyName && message.property_name) conv.propertyName = message.property_name;
      if (message.created_at > conv.lastAt) conv.lastAt = message.created_at;
      conv.messages.push(message);
    }
    return [...map.values()]
      .map((conv) => ({ ...conv, messages: [...conv.messages].sort((a, b) => (a.created_at < b.created_at ? -1 : 1)) }))
      .sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));
  }, [messageRows, viewerId]);

  const activeConversation = conversations.find((conv) => conv.key === activeConvKey) || null;

  const openConversation = async (conv) => {
    setActiveConvKey(conv.key);
    if (conv.unread > 0) {
      try {
        await markMessagesRead({ bookingId: conv.bookingId, fromId: conv.otherId });
        setError('');
        await refresh();
      } catch (err) {
        setError(err.message || 'Unable to update read status.');
      }
    }
  };

  const handleReply = async (event) => {
    event.preventDefault();
    const conv = activeConversation;
    if (!conv || !replyText.trim() || sendingReply) return;
    setSendingReply(true);
    try {
      await sendMessage({ bookingId: conv.bookingId, recipientId: conv.otherId, body: replyText });
      setReplyText('');
      setError('');
      await refresh();
    } catch (err) {
      setError(err.message || 'Unable to send reply.');
    } finally {
      setSendingReply(false);
    }
  };

  const messages = <section className="bg-surface-container-lowest border-2 border-primary"><div className="border-b-2 border-primary px-lg py-md flex items-center justify-between gap-md"><div><h2 className="font-h3 text-h3 text-primary">Conversations</h2><p className="font-body-md text-body-md text-on-surface-variant mt-xs">Messages from tenants on your properties, attached to each booking.</p></div><span className="font-label-caps text-label-caps text-on-surface-variant">{conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}</span></div>{!conversations.length ? <div className="p-lg font-body-md text-body-md text-on-surface-variant">No messages yet. When a tenant books one of your properties and messages you, the conversation appears here.</div> : <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]"><div className="border-b-2 lg:border-b-0 lg:border-r-2 border-primary max-h-[540px] overflow-y-auto">{conversations.map((conv) => <button key={conv.key} type="button" onClick={() => openConversation(conv)} className={`w-full text-left px-lg py-md border-b-2 border-primary/20 last:border-b-0 flex items-start gap-md transition-colors ${activeConvKey === conv.key ? 'bg-acid-lime' : 'hover:bg-surface-container'}`}><span className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-caps text-label-caps flex-shrink-0">{(conv.otherName || '?').slice(0, 1).toUpperCase()}</span><span className="flex-1 min-w-0"><span className="flex items-center justify-between gap-sm"><span className="font-label-caps text-label-caps text-primary truncate">{conv.otherName || 'Tenant'}</span><span className="font-label-caps text-[10px] text-on-surface-variant whitespace-nowrap">{formatDateTime(conv.lastAt)}</span></span><span className="block font-label-caps text-[10px] text-on-surface-variant uppercase mt-xs truncate">{conv.propertyName || 'Property'}</span><span className="block font-body-md text-body-md text-on-surface-variant mt-xs truncate">{(conv.messages[conv.messages.length - 1].body || '').slice(0, 90)}</span></span>{conv.unread > 0 && <span className="flex-shrink-0 min-w-[20px] h-5 px-1 bg-hot-pink text-white rounded-full font-label-caps text-[10px] flex items-center justify-center">{conv.unread}</span>}</button>)}</div><div className="flex flex-col min-h-[420px]">{activeConversation ? <><div className="px-lg py-md border-b-2 border-primary bg-surface-container"><p className="font-label-caps text-label-caps text-primary">{activeConversation.otherName || 'Tenant'}</p><p className="font-body-md text-body-md text-on-surface-variant text-sm truncate">{[activeConversation.otherEmail, activeConversation.propertyName].filter(Boolean).join(' · ')}</p></div><div className="flex-1 px-lg py-md flex flex-col gap-md max-h-[380px] overflow-y-auto">{activeConversation.messages.map((message) => { const fromMe = message.sender_id === viewerId; return <div key={message.id} className={`flex ${fromMe ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[78%] px-md py-sm border-2 border-primary ${fromMe ? 'bg-primary text-on-primary' : 'bg-surface-container'}`}><p className="font-body-md text-body-md">{message.body}</p><p className={`font-label-caps text-[10px] mt-xs ${fromMe ? 'text-on-primary/70' : 'text-on-surface-variant'}`}>{formatDateTime(message.created_at)}{!fromMe && !message.read_at ? ' · NEW' : ''}</p></div></div>; })}</div><form className="border-t-2 border-primary p-lg flex flex-col sm:flex-row gap-sm" onSubmit={handleReply}><label className="sr-only" htmlFor="owner-message-reply">Reply to tenant</label><input id="owner-message-reply" value={replyText} onChange={(event) => setReplyText(event.target.value)} placeholder={`Reply to ${activeConversation.otherName || 'tenant'}...`} className="flex-1 border-2 border-primary bg-surface px-md py-md text-primary" /><button type="submit" disabled={sendingReply || !replyText.trim()} className="px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary disabled:opacity-50">{sendingReply ? 'SENDING...' : 'REPLY'}</button></form></> : <div className="flex-1 flex items-center justify-center p-lg font-body-md text-body-md text-on-surface-variant">Select a conversation to read and reply.</div>}</div></div>}</section>;

  return <div className="flex flex-col gap-xl">{header}{message && <div className="border-2 border-primary bg-acid-lime p-md text-primary">{message}</div>}{error && <div role="alert" className="border-2 border-error bg-error/10 p-md text-error">{error}</div>}{route === 'properties' ? properties : route === 'tenants' ? tenants : route === 'rentals' ? rentals : route === 'messages' ? messages : route === 'deposits' ? deposits : overview}{showForm && <PropertyForm universities={universities} form={form} setForm={setForm} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}</div>;
}
