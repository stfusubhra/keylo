import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  getListerSession,
  getListerProfile,
  getListerItemById,
  createListerItem,
  updateListerItem,
  listerCategories,
  listerCategoryLabel,
  listerCategoryImages,
  itemConditions,
  fileToDataUrl,
  listerMoney,
} from '../lib/listerData';

const inr = listerMoney;
const MAX_PHOTOS = 5;

const emptyForm = {
  name: '',
  category: '',
  description: '',
  pricePerDay: '',
  pricePerWeek: '',
  deposit: '',
  condition: 'Good',
  location: '',
  availability: 'available',
  rules: '',
  fulfilment: '',
};

export default function ListerListingFormPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [form, setForm] = useState(emptyForm);
  const [photos, setPhotos] = useState([]);
  const [photoError, setPhotoError] = useState('');
  const [photoLoading, setPhotoLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const isEdit = Boolean(itemId);

  useEffect(() => {
    let active = true;
    Promise.all([getListerSession(), getListerProfile()]).then(([nextSession, nextProfile]) => {
      if (!active) return;
      setSession(nextSession); setProfile(nextProfile);
      if (!isEdit) { setLoaded(true); setAuthLoading(false); return; }
      return getListerItemById(itemId).then((item) => {
        if (!item || item.listerId !== nextProfile.id) { navigate('/lister/listings', { replace: true }); return; }
        setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      pricePerDay: String(item.pricePerDay || ''),
      pricePerWeek: String(item.pricePerWeek || ''),
      deposit: String(item.deposit || ''),
      condition: item.condition || 'Good',
      location: item.location,
      availability: item.availability,
      rules: item.rules,
      fulfilment: item.fulfilment,
        });
        setPhotos(item.photos || []); setLoaded(true); setAuthLoading(false);
      });
    }).catch(() => { if (active) { setLoaded(true); setAuthLoading(false); } });
    return () => { active = false; };
  }, [isEdit, itemId, navigate]);

  if (authLoading) return <div className="py-xl text-center font-label-caps text-label-caps text-on-surface-variant">Checking your session...</div>;
  if (!session || !profile) {
    return <Navigate to="/lister/login" replace state={{ from: `/lister/list-an-item${itemId ? `/${itemId}` : ''}` }} />;
  }

  if (!loaded) {
    return <div className="py-xl text-center font-label-caps text-label-caps text-on-surface-variant">Loading listing...</div>;
  }

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handlePhotos = async (e) => {
    const files = Array.from(e.target.files || []);
    setPhotoError('');
    if (photos.length + files.length > MAX_PHOTOS) {
      setPhotoError(`You can add up to ${MAX_PHOTOS} photos.`);
      return;
    }
    setPhotoLoading(true);
    try {
      const urls = [];
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        urls.push(await fileToDataUrl(file, 900, 0.72));
      }
      setPhotos((prev) => [...prev, ...urls].slice(0, MAX_PHOTOS));
    } catch (err) {
      setPhotoError(err.message || 'Could not read that image.');
    } finally {
      setPhotoLoading(false);
      e.target.value = '';
    }
  };

  const removePhoto = (index) => setPhotos((prev) => prev.filter((_, i) => i !== index));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Give your item a name.';
    if (!form.category) errs.category = 'Choose a category.';
    if (form.description.trim().length < 20) errs.description = 'Describe your item in at least 20 characters.';
    const day = Number(form.pricePerDay);
    if (!day || day <= 0) errs.pricePerDay = 'Enter a daily price.';
    if (!form.location.trim()) errs.location = 'Where can this be picked up from?';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitError('');
    if (!validate()) return;
    setSaving(true);
    try {
      const data = {
        name: form.name,
        category: form.category,
        description: form.description,
        photos,
        pricePerDay: Number(form.pricePerDay),
        pricePerWeek: Number(form.pricePerWeek) || 0,
        deposit: Number(form.deposit) || 0,
        condition: form.condition,
        location: form.location,
        availability: form.availability,
        rules: form.rules,
        fulfilment: form.fulfilment,
      };
      if (isEdit) {
        await updateListerItem(itemId, profile, data);
      } else {
        await createListerItem(profile, data);
      }
      navigate('/lister/listings');
    } catch (err) {
      setSubmitError(err.message || 'Could not save your listing.');
    } finally {
      setSaving(false);
    }
  };

  const previewItem = {
    name: form.name || 'Your item name',
    category: form.category || 'other',
    photos: photos.length ? photos : [listerCategoryImages[form.category] || listerCategoryImages.other],
    pricePerDay: Number(form.pricePerDay) || 0,
    pricePerWeek: Number(form.pricePerWeek) || 0,
    deposit: Number(form.deposit) || 0,
    condition: form.condition,
    location: form.location || 'Pickup location',
    availability: form.availability,
    description: form.description || 'Your item description will appear here.',
    rules: form.rules,
    fulfilment: form.fulfilment,
  };

  const inputClass = (invalid) =>
    `w-full px-md py-md bg-surface-container-lowest border-2 ${invalid ? 'border-error' : 'border-primary'} focus:outline-none focus:ring-4 ring-[#C7F000] font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-all`;

  const labelClass = 'font-label-caps text-label-caps text-on-surface block mb-xs';

  return (
    <div className="flex flex-col gap-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-sm">{isEdit ? 'Edit listing' : 'New listing'}</p>
          <h1 className="font-heading text-h1-mobile md:text-h1 text-primary font-bold uppercase tracking-tight">{isEdit ? 'Edit your item' : 'List an item'}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm max-w-2xl">
            Tell students what you are renting out, set a fair price, and publish. Your listing goes live on the public rentals page the moment you hit publish.
          </p>
        </div>
        <Link to="/lister/listings" className="shrink-0 px-lg py-md bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-acid-lime transition-colors flex items-center gap-xs">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span> BACK TO LISTINGS
        </Link>
      </section>

      {submitError && <div role="alert" className="border-2 border-error bg-error/10 p-md text-error">{submitError}</div>}

      <form className="flex flex-col gap-xl" onSubmit={(e) => { e.preventDefault(); setPreviewOpen(true); }} noValidate>
        {/* Basics */}
        <section className="bg-surface border-2 border-primary p-lg lg:p-xl shadow-[6px_6px_0px_0px_#000000] flex flex-col gap-lg">
          <h2 className="font-h3 text-h3 text-primary uppercase border-b-2 border-primary pb-xs w-fit">Basics</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
            <div>
              <label htmlFor="itemName" className={labelClass}>Item name</label>
              <input id="itemName" value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="e.g. Sony Alpha Camera Kit" className={inputClass(errors.name)} />
              {errors.name && <p className="mt-xs font-body-sm text-error">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="itemCategory" className={labelClass}>Category</label>
              <select id="itemCategory" value={form.category} onChange={(e) => setField('category', e.target.value)} className={`${inputClass(errors.category)} cursor-pointer`}>
                <option value="">Choose a category...</option>
                {listerCategories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              {errors.category && <p className="mt-xs font-body-sm text-error">{errors.category}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="itemDescription" className={labelClass}>Description</label>
            <textarea id="itemDescription" rows={4} value={form.description} onChange={(e) => setField('description', e.target.value)} placeholder="Condition, what's included, why it's great for students..." className={`${inputClass(errors.description)} resize-none`} />
            {errors.description ? <p className="mt-xs font-body-sm text-error">{errors.description}</p> : <p className="mt-xs font-body-sm text-on-surface-variant/70">{form.description.length} characters</p>}
          </div>

          <div>
            <label className={labelClass}>Photos <span className="text-on-surface-variant normal-case">({photos.length}/{MAX_PHOTOS})</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-md">
              {photos.map((src, i) => (
                <div key={`${src.slice(0, 24)}-${i}`} className="relative aspect-square border-2 border-primary overflow-hidden group">
                  <img src={src} alt={`Listing photo ${i + 1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removePhoto(i)} aria-label={`Remove photo ${i + 1}`} className="absolute top-1 right-1 w-7 h-7 bg-coral text-white border-2 border-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <label className="aspect-square border-2 border-dashed border-primary bg-surface-container-lowest flex flex-col items-center justify-center gap-sm cursor-pointer hover:bg-acid-lime/20 transition-colors">
                  <span className="material-symbols-outlined text-[36px] text-electric-purple">{photoLoading ? 'progress_activity' : 'add_a_photo'}</span>
                  <span className="font-label-caps text-label-caps text-primary">{photoLoading ? 'Processing...' : 'Add photos'}</span>
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={handlePhotos} />
                </label>
              )}
            </div>
            {photoError && <p className="mt-xs font-body-sm text-error">{photoError}</p>}
            <p className="mt-xs font-body-sm text-on-surface-variant/70">Clear photos get 3× more bookings. If you skip photos, a category cover image is used automatically.</p>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-surface border-2 border-primary p-lg lg:p-xl shadow-[6px_6px_0px_0px_#000000] flex flex-col gap-lg">
          <h2 className="font-h3 text-h3 text-primary uppercase border-b-2 border-primary pb-xs w-fit">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-lg">
            <div>
              <label htmlFor="itemPriceDay" className={labelClass}>Price per day (₹)</label>
              <input id="itemPriceDay" type="number" min="1" value={form.pricePerDay} onChange={(e) => setField('pricePerDay', e.target.value)} placeholder="e.g. 300" className={inputClass(errors.pricePerDay)} />
              {errors.pricePerDay && <p className="mt-xs font-body-sm text-error">{errors.pricePerDay}</p>}
            </div>
            <div>
              <label htmlFor="itemPriceWeek" className={labelClass}>Price per week (₹) <span className="text-on-surface-variant normal-case">(optional)</span></label>
              <input id="itemPriceWeek" type="number" min="0" value={form.pricePerWeek} onChange={(e) => setField('pricePerWeek', e.target.value)} placeholder="e.g. 1500" className={inputClass()} />
            </div>
            <div>
              <label htmlFor="itemDeposit" className={labelClass}>Security deposit (₹) <span className="text-on-surface-variant normal-case">(optional)</span></label>
              <input id="itemDeposit" type="number" min="0" value={form.deposit} onChange={(e) => setField('deposit', e.target.value)} placeholder="e.g. 2000" className={inputClass()} />
              <p className="mt-xs font-body-sm text-on-surface-variant/70">Refunded at return, held by KeyLo Vault.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
            <div>
              <label htmlFor="itemCondition" className={labelClass}>Condition</label>
              <select id="itemCondition" value={form.condition} onChange={(e) => setField('condition', e.target.value)} className={`${inputClass()} cursor-pointer`}>
                {itemConditions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="itemLocation" className={labelClass}>Pickup location</label>
              <input id="itemLocation" value={form.location} onChange={(e) => setField('location', e.target.value)} placeholder="e.g. Jadavpur, Kolkata" className={inputClass(errors.location)} />
              {errors.location && <p className="mt-xs font-body-sm text-error">{errors.location}</p>}
            </div>
          </div>
        </section>

        {/* Availability & rules */}
        <section className="bg-surface border-2 border-primary p-lg lg:p-xl shadow-[6px_6px_0px_0px_#000000] flex flex-col gap-lg">
          <h2 className="font-h3 text-h3 text-primary uppercase border-b-2 border-primary pb-xs w-fit">Availability & rules</h2>

          <div>
            <p className={labelClass}>Availability</p>
            <div className="flex gap-md">
              {[
                { value: 'available', label: 'Available', sub: 'Live on the rentals page', icon: 'visibility' },
                { value: 'unavailable', label: 'Unavailable', sub: 'Keep as a draft, not listed', icon: 'visibility_off' },
              ].map((opt) => (
                <label key={opt.value} className="cursor-pointer flex-1">
                  <input className="peer sr-only" type="radio" name="availability" value={opt.value} checked={form.availability === opt.value} onChange={() => setField('availability', opt.value)} />
                  <div className={`border-2 border-primary p-md flex items-center gap-sm transition-all ${form.availability === opt.value ? 'bg-acid-lime shadow-[-3px_3px_0px_0px_#000000]' : 'bg-surface-container-lowest hover:bg-acid-lime/30'}`}>
                    <span className="material-symbols-outlined text-primary">{opt.icon}</span>
                    <div>
                      <p className="font-label-caps text-label-caps text-primary">{opt.label}</p>
                      <p className="font-label-caps text-[10px] text-on-surface-variant">{opt.sub}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="itemRules" className={labelClass}>Rental rules <span className="text-on-surface-variant normal-case">(optional)</span></label>
            <textarea id="itemRules" rows={3} value={form.rules} onChange={(e) => setField('rules', e.target.value)} placeholder="e.g. No smoking, return with all accessories, 24h cancellation..." className={`${inputClass()} resize-none`} />
          </div>

          <div>
            <label htmlFor="itemFulfilment" className={labelClass}>Delivery / pickup info</label>
            <textarea id="itemFulfilment" rows={3} value={form.fulfilment} onChange={(e) => setField('fulfilment', e.target.value)} placeholder="e.g. Pickup from Jadavpur, paid delivery within Kolkata ₹99" className={`${inputClass()} resize-none`} />
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-sm">
          <button type="submit" disabled={saving}
            className="flex-1 py-md bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary hover:bg-acid-lime transition-colors disabled:opacity-50 flex items-center justify-center gap-sm">
            <span className="material-symbols-outlined text-[18px]">visibility</span> PREVIEW LISTING
          </button>
          <button type="button" onClick={handleSubmit} disabled={saving}
            className="flex-1 py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all disabled:opacity-50 flex items-center justify-center gap-sm">
            {saving ? <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> SAVING...</> : <>
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span> {isEdit ? 'SAVE CHANGES' : 'PUBLISH LISTING'}
            </>}
          </button>
        </div>
      </form>

      {/* ── Preview modal ── */}
      {previewOpen && (
        <div className="fixed inset-0 z-[100] bg-primary/60 flex items-center justify-center p-lg" role="dialog" aria-modal="true">
          <div className="w-full max-w-[36rem] max-h-[90vh] overflow-y-auto bg-surface border-2 border-primary shadow-[8px_8px_0px_0px_#C7F000]">
            <div className="sticky top-0 z-10 bg-surface border-b-2 border-primary px-lg py-md flex items-center justify-between">
              <h2 className="font-h3 text-h3 text-primary uppercase">Preview</h2>
              <button type="button" onClick={() => setPreviewOpen(false)} aria-label="Close preview" className="material-symbols-outlined text-primary">close</button>
            </div>
            <div className="p-lg">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-md">This is how your listing appears to students on the rentals page.</p>

              {/* Card preview */}
              <div className="bg-surface border-2 border-primary shadow-[8px_8px_0px_0px_#000000] mb-lg">
                <div className="relative aspect-square border-b-2 border-primary overflow-hidden bg-surface-container-high">
                  <span className="absolute top-md left-md z-10 px-sm py-xs bg-[#C7F000] text-primary font-label-caps text-[10px] uppercase border-2 border-primary">By Owner</span>
                  <img src={previewItem.photos[0]} alt={previewItem.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-lg">
                  <div className="flex justify-between items-start mb-md">
                    <div>
                      <h3 className="font-h3 text-h3 text-primary mb-xs">{previewItem.name}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">{listerCategoryLabel(previewItem.category)}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-price-display text-price-display text-primary block">{inr(previewItem.pricePerDay)}</span>
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">/ Day</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="border-2 border-primary divide-y-2 divide-primary">
                {[
                  { label: 'Description', value: previewItem.description },
                  { label: 'Weekly rate', value: previewItem.pricePerWeek ? inr(previewItem.pricePerWeek) : 'Not set' },
                  { label: 'Security deposit', value: previewItem.deposit ? inr(previewItem.deposit) : 'None' },
                  { label: 'Condition', value: previewItem.condition },
                  { label: 'Pickup location', value: previewItem.location },
                  { label: 'Availability', value: previewItem.availability === 'available' ? 'Listed on rentals page' : 'Hidden from rentals' },
                  { label: 'Delivery / pickup', value: previewItem.fulfilment || 'Not specified' },
                  { label: 'Rules', value: previewItem.rules || 'No special rules' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-md px-md py-sm">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase flex-shrink-0">{label}</span>
                    <span className="font-body-md text-body-md text-primary text-right">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-lg flex gap-sm">
                <button type="button" onClick={() => setPreviewOpen(false)} className="flex-1 py-md bg-surface-container-lowest border-2 border-primary font-label-caps text-label-caps text-primary">KEEP EDITING</button>
                <button type="button" onClick={handleSubmit} disabled={saving} className="flex-1 py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all disabled:opacity-50">
                  {saving ? 'SAVING...' : isEdit ? 'SAVE CHANGES' : 'PUBLISH LISTING'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
