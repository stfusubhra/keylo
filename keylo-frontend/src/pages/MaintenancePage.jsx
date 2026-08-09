import { useState } from 'react';

const categories = [
  { value: 'plumbing', icon: 'water_drop', label: 'Plumbing' },
  { value: 'electricity', icon: 'bolt', label: 'Electricity' },
  { value: 'furniture', icon: 'chair', label: 'Furniture' },
  { value: 'internet', icon: 'wifi', label: 'Internet' },
];

export default function MaintenancePage() {
  const [category, setCategory] = useState('plumbing');
  const [priority, setPriority] = useState('low');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [files, setFiles] = useState([]);
  const [tickets, setTickets] = useState([{ id: 'REQ-4091', title: 'No hot water in master bath', category: 'Plumbing', priority: 'Urgent', status: 'Notified' }, { id: 'REQ-3820', title: 'Loose hinge on wardrobe', category: 'Furniture', priority: 'Low', status: 'Resolved' }]);
  const [message, setMessage] = useState('');

  const submitRequest = (event) => {
    event.preventDefault();
    if (!title.trim() || !details.trim()) {
      setMessage('Add a short title and details so the team can triage this request.');
      return;
    }
    const ticket = { id: `REQ-${Math.floor(4000 + Math.random() * 899)}`, title: title.trim(), category: category[0].toUpperCase() + category.slice(1), priority: priority === 'med' ? 'Medium' : priority[0].toUpperCase() + priority.slice(1), status: 'Submitted' };
    setTickets((current) => [ticket, ...current]);
    setTitle('');
    setDetails('');
    setFiles([]);
    setMessage(`${ticket.id} submitted. KeyLo will notify the property team.`);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface"><div className="grid grid-cols-1 lg:grid-cols-12 gap-xl px-margin-mobile md:px-margin-desktop py-xl md:py-[80px]">
      <section className="lg:col-span-8 flex flex-col gap-lg"><div><h1 className="font-heading text-h1-mobile md:text-h1 text-on-surface uppercase border-b-2 border-primary pb-sm inline-block mb-md font-bold">Something Broken?</h1><p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Log an issue and keep a timestamped record of what happens next.</p></div>
        {message && <div role="status" aria-live="polite" className="border-2 border-primary bg-acid-lime p-md font-body-md text-primary">{message}</div>}
        <form className="flex flex-col gap-xl" onSubmit={submitRequest}>
          <div><h2 className="font-h3 text-h3 text-on-surface border-b-2 border-primary pb-xs w-fit mb-md">1. Select Category</h2><div className="grid grid-cols-2 sm:grid-cols-4 gap-md">{categories.map((item) => <label key={item.value} className="cursor-pointer"><input className="peer sr-only" name="category" type="radio" value={item.value} checked={category === item.value} onChange={() => setCategory(item.value)} /><div className="border-2 border-primary bg-surface p-md flex flex-col items-center justify-center gap-sm peer-checked:bg-acid-lime shadow-[4px_4px_0px_0px_#000000]"><span className="material-symbols-outlined text-[32px]">{item.icon}</span><span className="font-label-caps text-label-caps text-center">{item.label}</span></div></label>)}</div></div>
          <div><h2 className="font-h3 text-h3 text-on-surface border-b-2 border-primary pb-xs w-fit mb-md">2. Describe the Issue</h2><div className="flex flex-col gap-sm"><label className="font-label-caps text-label-caps" htmlFor="issue-title">Short Title</label><input required id="issue-title" value={title} onChange={(event) => setTitle(event.target.value)} className="w-full bg-surface border-2 border-primary p-md font-body-lg text-on-surface" placeholder="e.g. Leaking pipe under sink" /><label className="font-label-caps text-label-caps mt-md" htmlFor="issue-desc">Details</label><textarea required id="issue-desc" value={details} onChange={(event) => setDetails(event.target.value)} className="w-full bg-surface border-2 border-primary p-md font-body-lg text-on-surface resize-none" placeholder="What happened and when?" rows="4" /><label className="border-2 border-primary border-dashed p-lg flex items-center gap-md bg-surface-container-low cursor-pointer" htmlFor="maintenance-files"><span className="material-symbols-outlined text-[36px]">add_photo_alternate</span><span><span className="block font-label-caps text-label-caps">{files.length ? `${files.length} attachment${files.length > 1 ? 's' : ''}` : 'Attach photo or video'}</span><span className="block font-body-sm text-on-surface-variant">Evidence helps resolve issues faster.</span></span><input id="maintenance-files" className="sr-only" type="file" accept="image/*,video/*" multiple onChange={(event) => setFiles(Array.from(event.target.files || []))} /></label></div></div>
          <div><h2 className="font-h3 text-h3 text-on-surface border-b-2 border-primary pb-xs w-fit mb-md">3. Priority Level</h2><div className="flex gap-md">{[['low', 'Low'], ['med', 'Medium'], ['urgent', 'Urgent']].map(([value, label]) => <label key={value} className="cursor-pointer flex-1"><input className="peer sr-only" name="priority" type="radio" value={value} checked={priority === value} onChange={() => setPriority(value)} /><div className="border-2 border-primary bg-surface p-md text-center peer-checked:bg-acid-lime font-label-caps text-label-caps">{label}</div></label>)}</div></div>
          <button className="w-full md:w-auto px-[40px] py-lg bg-acid-lime border-2 border-primary font-h3 text-h3 uppercase shadow-[8px_8px_0px_0px_#000000]" type="submit">Raise Request <span className="material-symbols-outlined align-middle">arrow_forward</span></button>
        </form>
      </section>
      <aside className="lg:col-span-4 border-2 border-primary bg-surface-container-low p-lg shadow-[8px_8px_0px_0px_#000000] h-fit"><h2 className="font-h3 text-h3 text-on-surface uppercase border-b-2 border-primary pb-sm mb-lg">Active Tickets</h2><div className="flex flex-col gap-md">{tickets.map((ticket) => <article key={ticket.id} className="border-2 border-primary bg-surface p-md"><div className="flex justify-between gap-sm"><span className="font-label-caps text-label-caps text-electric-purple">{ticket.priority} · {ticket.category}</span><span className="font-label-caps text-[10px] bg-acid-lime border border-primary px-xs">{ticket.id}</span></div><h3 className="font-body-lg text-body-lg text-primary font-bold my-md">{ticket.title}</h3><span className="font-label-caps text-label-caps text-primary">{ticket.status}</span></article>)}</div></aside>
    </div></div>
  );
}
