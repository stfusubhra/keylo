import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabase';
import { getPropertyById } from '../lib/supabaseData';
import { demoProperties } from '../lib/demoCatalog';

const FALLBACK_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBpdL7vWvL_O-xc18tzYWi629aE-h1jY9yzcqbWYnBWZXmo2dubOK745kuei6KLvKmt4UWczT6j7qH3faU51oLf-wdjNQB77a_E7iy6CWe24-GmeGrTBVoi1cK9Ef-LyNt0MceHlYWt3PwVdZR9beaj_URGIxwt1pKGwc32Jm-TZv8-IfW6xw6sr7aJf6VioF8sZD8hLJOUwcWaPPtJsnorw_wz8AtvVCMgEkmmi0UYnlUr-zw-eUQ-',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ_iq_Bjm8FH6Y-N9Bc0Md_KBoSognydvBlRNK5GRcQjayQzaD6jVsO2j7IFbshKul1dDzcirEgznYkGY2_BYrIxwqXxm7C9unXpPWBgJ6D8mpKw8XwVmau156lOuwQ_9X6VTS8w_L_6iQe8BIq5Etfj1gM4AcHEQhsgrmIbSOdoIQIlLdCtSol2gnvEdVPD_1P9sPcTahVmDlYqdGBWTi0vXVpn9FF1FJWEJsblAVc7kxKrK68rnL',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC8GKTWhZscKHX2BQ9jwIFAZmQMk-l_30pDz4ZlKLdBtainDSghHKdmTf3Xkc5l96TvsXFgAgoEmYIYgxdnekCMnc7lAfDGLbFJRY7d3r5n9KHIoTjljUM8kkzIJbvLLWwvvKDJC690ZhctzIaNnrj_GCHjpuaipNpKddV5mu6TZOraZoS7gvR5LHsALn6N6rq2SEThFuBqXKFH60VzeLz9k-8oeWsPfd1Gdsn_5X0WwFUyu9oedEow',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCRIjlP8T0GOAZXoU4LP9mQ_lHjkhrWMEtgbjXjuXue61jA5JHEBae0zcfzNN5O_bmpLNykvvtULzsQv-WV6jpl4Y8qQdHj71q_uOgC_PoxrvT8zIyAvM6PSeVizkZ4fFsJbIysQARQIA3fOyXYb7AZaO6C3Hl_mBVZnxwGryxC_ZC6iNhQNznN9_PY8EPIfMvibkdbGaijKYQcvVTfKi_UwBUakUL3S43i-PdA_quSRVdrvsxowC3T',
];

const DEFAULT_DESCRIPTION =
  'Experience premium student living in the heart of Kolkata. Designed specifically for students and young professionals near campus, this space offers a perfect balance of privacy for focus and community areas for socializing. High-speed Wi-Fi, daily housekeeping, and 24/7 security come standard.';

const formatMoney = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;

export default function PropertyDetailsPage() {
  const { id = 'jadavpur-pg' } = useParams();
  const [selectedRoom, setSelectedRoom] = useState('twin');
  const [row, setRow] = useState(null); // Supabase row when configured, else null

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    getPropertyById(id)
      .then((property) => { if (active) setRow(property); })
      .catch(() => {});
    return () => { active = false; };
  }, [id]);

  const demo = demoProperties.find((p) => p.id === id) || demoProperties.find((p) => p.id === 'jadavpur-pg');

  const name = row?.name || demo?.name || 'Lake View Student PG';
  const area = row?.area || demo?.area || 'Jadavpur';
  const universityName = row?.universities?.name || demo?.university || 'Jadavpur University';
  const distance = row?.distance_to_university_km != null
    ? `${row.distance_to_university_km} km`
    : (demo?.distance || '0.6 km');
  const rating = row?.profiles?.owner_rating != null
    ? String(row.profiles.owner_rating)
    : (demo?.rating || '4.8');
  const rent = row?.monthly_rent != null
    ? Number(row.monthly_rent)
    : (demo ? Number(String(demo.price).replace(/[^\d]/g, '')) || 8500 : 8500);
  const deposit = row?.security_deposit != null
    ? Number(row.security_deposit)
    : (demo ? Number(String(demo.deposit).replace(/[^\d]/g, '')) || 10000 : 10000);
  const fee = 997;
  const total = rent + deposit + fee;
  const privatePrice = rent + 5500; // premium single-occupancy demo price
  const description = row?.description || DEFAULT_DESCRIPTION;
  const amenities = row?.amenities?.length ? row.amenities : (demo?.amenities || ['Gigabit Wi-Fi', 'Daily Housekeeping', 'In-house Laundry', '24/7 Security']);
  const trustScore = row?.trust_score ?? 92;
  const isVerified = row?.is_documents_verified ?? true;
  const coverImage = row?.cover_image_url || demo?.image || FALLBACK_IMAGES[0];
  const ownerName = row?.profiles?.full_name || 'Riya Sen';
  const ownerRating = row?.profiles?.owner_rating || '4.9';
  const propertyImages = [coverImage, ...FALLBACK_IMAGES.slice(1)];

  return (
    <div className="bg-surface-container-low font-body-md text-on-surface">
      {/* Image Gallery Grid */}
      <section className="w-full px-margin-mobile md:px-margin-desktop mb-xl mt-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md md:gap-gutter h-[400px] md:h-[500px]">
          <div className="col-span-1 md:col-span-2 h-full rounded-xl overflow-hidden shadow-md border-2 border-primary">
            <img
              className="w-full h-full object-cover"
              src={propertyImages[0]}
              alt="Main property view"
            />
          </div>
          <div className="col-span-1 md:col-span-1 h-full rounded-xl overflow-hidden shadow-md border-2 border-primary hidden md:block">
            <img
              className="w-full h-full object-cover"
              src={propertyImages[1]}
              alt="Study desk detail"
            />
          </div>
          <div className="col-span-1 md:col-span-1 flex flex-col gap-md md:gap-gutter h-full">
            <div className="h-1/2 rounded-xl overflow-hidden shadow-md border-2 border-primary">
              <img
                className="w-full h-full object-cover"
                src={propertyImages[2]}
                alt="Kitchen area"
              />
            </div>
            <div className="h-1/2 rounded-xl overflow-hidden shadow-md border-2 border-primary relative cursor-pointer group">
              <img
                className="w-full h-full object-cover"
                src={propertyImages[3]}
                alt="Lounge area"
              />
              <div className="absolute inset-0 bg-primary/60 flex items-center justify-center transition-all group-hover:bg-primary/80">
                <span className="font-h3 text-h3 text-on-primary">+8 Photos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-xl relative">
        {/* Left Column: Details */}
        <div className="lg:col-span-8 flex flex-col gap-xl pb-xl">
          {/* Header Info */}
          <div className="flex flex-col gap-md border-b-2 border-primary pb-lg relative">
            <div className="flex items-baseline gap-sm">
              <span className="px-sm py-xs bg-hot-pink text-on-primary border-2 border-primary font-label-caps text-label-caps shadow-[2px_2px_0px_0px_#000000]">
                FAST FILLING
              </span>
              <span className={`px-sm py-xs border-2 border-primary font-label-caps text-label-caps shadow-[2px_2px_0px_0px_#000000] ${isVerified ? 'bg-verified text-primary' : 'bg-outline text-on-primary'}`}>
                {isVerified ? 'VERIFIED' : 'VERIFICATION PENDING'}
              </span>
            </div>
            <h1 className="font-heading text-h1-mobile md:text-h1 text-primary font-bold">{name}</h1>
            <div className="flex flex-wrap items-center gap-md font-body-md text-body-md text-on-surface-variant">
              <div className="flex items-center gap-xs text-primary font-bold">
                <span className="material-symbols-outlined text-[#F59E0B]">star</span>
                <span>{rating}</span>
                <span className="text-on-surface-variant font-normal">(124 reviews)</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-primary"></div>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">location_on</span>
                <span>{area}, Kolkata</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-primary"></div>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined">directions_walk</span>
                <span>{distance} to {universityName}</span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <section className="flex flex-col gap-md">
            <h2 className="font-h3 text-h3 text-primary">About this Space</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {description}
            </p>
          </section>

          {/* Trust & Verification */}
          <section className="bg-primary text-on-primary border-2 border-primary p-lg shadow-[8px_8px_0px_0px_#7C3AED]">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-md mb-lg">
              <div>
                <p className="font-label-caps text-label-caps text-acid-lime uppercase mb-xs">KeyLo Trust Check</p>
                <h2 className="font-h3 text-h3 text-on-primary">Verified before you book.</h2>
              </div>
              <span className="px-sm py-xs bg-acid-lime text-primary border-2 border-on-primary font-label-caps text-label-caps">{trustScore} / 100 TRUST SCORE</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
              {[
                ['verified_user', 'Landlord identity', 'Verified'],
                ['document_scanner', 'Property documents', isVerified ? 'Checked' : 'Pending'],
                ['camera', 'Room inspection', '12 Oct 2026'],
                ['payments', 'Deposit rules', 'Transparent'],
              ].map(([icon, title, value]) => (
                <div key={title} className="border-2 border-on-primary/40 p-sm bg-primary-container">
                  <span className="material-symbols-outlined text-acid-lime">{icon}</span>
                  <p className="font-label-caps text-[10px] text-on-primary/70 uppercase mt-sm">{title}</p>
                  <p className="font-label-caps text-label-caps text-on-primary mt-xs">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Inspection Evidence */}
          <section className="flex flex-col gap-md">
            <div className="flex items-end justify-between border-b-2 border-primary pb-sm gap-md"><div><p className="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">Evidence, not promises</p><h2 className="font-h3 text-h3 text-primary">AI inspection report</h2></div><span className="font-label-caps text-label-caps text-on-surface-variant">Last checked 12 Oct 2026</span></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {['Walls & paint', 'Furniture condition', 'Safety & utilities'].map((item) => <div key={item} className="bg-surface-container-lowest border-2 border-primary p-md"><div className="flex items-center justify-between mb-md"><span className="material-symbols-outlined text-electric-purple">fact_check</span><span className="font-label-caps text-[10px] bg-acid-lime border border-primary px-xs py-[2px] text-primary">PASS</span></div><h3 className="font-label-caps text-label-caps text-primary uppercase">{item}</h3><p className="font-body-md text-body-md text-on-surface-variant mt-xs">No major issues detected during move-in scan.</p></div>)}
            </div>
          </section>

          {/* Amenities Bento Grid */}
          <section className="flex flex-col gap-md">
            <h2 className="font-h3 text-h3 text-primary">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
              {amenities.slice(0, 4).map((amenity) => (
                <div key={amenity} className="flex flex-col items-center justify-center p-md bg-surface-container border-2 border-primary rounded-xl shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-h2 mb-xs">check_circle</span>
                  <span className="font-label-caps text-label-caps text-center">{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Room Options */}
          <section className="flex flex-col gap-md">
            <h2 className="font-h3 text-h3 text-primary flex items-center justify-between border-b-2 border-primary pb-sm">
              <span>Room Configuration</span>
            </h2>
            <div className="flex flex-col gap-md">
              {/* Option 1 */}
              <div
                className={`p-lg bg-surface border-2 border-primary rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-md shadow-[4px_4px_0px_0px_#000000] cursor-pointer transition-all ${
                  selectedRoom === 'twin'
                    ? 'border-acid-lime ring-4 ring-acid-lime/20'
                    : 'hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000]'
                }`}
                onClick={() => setSelectedRoom('twin')}
              >
                <div>
                  <h3 className="font-h3 text-h3 text-primary mb-xs">Twin Sharing</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Spacious room with individual wardrobes and study desks. Attached washroom.</p>
                </div>
                <div className="flex flex-col items-start md:items-end w-full md:w-auto">
                  <span className="font-price-display text-price-display text-primary">{formatMoney(rent)}</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">per month</span>
                </div>
              </div>
              {/* Option 2 */}
              <div
                className={`p-lg bg-surface-container-low border-2 border-primary rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-md shadow-[4px_4px_0px_0px_#000000] cursor-pointer transition-all opacity-70 ${
                  selectedRoom === 'private'
                    ? 'border-acid-lime ring-4 ring-acid-lime/20 opacity-100'
                    : 'hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000]'
                }`}
                onClick={() => setSelectedRoom('private')}
              >
                <div>
                  <div className="flex items-center gap-sm mb-xs">
                    <h3 className="font-h3 text-h3 text-primary">Private Room</h3>
                    <span className="px-sm py-xs bg-outline text-on-primary border-2 border-primary font-label-caps text-label-caps">
                      SOLD OUT
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">Premium single occupancy with en-suite bathroom and mini-fridge.</p>
                </div>
                <div className="flex flex-col items-start md:items-end w-full md:w-auto">
                  <span className="font-price-display text-price-display text-primary line-through decoration-2">{formatMoney(privatePrice)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Rules & Distance */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-md border-t-2 border-primary pt-lg mt-lg">
            <div>
              <h3 className="font-h3 text-h3 text-primary mb-sm">House Rules</h3>
              <ul className="font-body-md text-body-md text-on-surface-variant flex flex-col gap-sm">
                <li className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                  Curfew: 11:30 PM
                </li>
                <li className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary text-[20px]">group_off</span>
                  No overnight guests
                </li>
                <li className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary text-[20px]">smoking_rooms</span>
                  No smoking indoors
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-h3 text-h3 text-primary mb-sm">Location Map</h3>
              <div
                className="w-full h-[150px] border-2 border-primary rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#000000]"
                data-location={`${area}, Kolkata`}
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDL0uRgDabT-jpQJI9EjGSIDPDq0mQju2COV0VU34xnDVXd63BrFsfqT22YD940nszEuecax3zvIxu_3VdItC_uBni52cBSOEM0keoMxhxM3rMvI70mZY7a0i8eN-I-9j-FDa4839hkuzmBIvWGZVvibzCm3Kw-vNmJv38VlvoLoAlKnGZopnvsg2PIUo7O7hn4xzmT01uWzV6IFbOvdz3rRWFH4nUBycoJR00unXaY_xqO8MQNMGBw')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>
            </div>
          </section>

          {/* Handover & Deposit Timeline */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-lg border-t-2 border-primary pt-lg">
            <div>
              <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">Digital handover</p>
              <h3 className="font-h3 text-h3 text-primary mb-md">Move in with proof.</h3>
              <div className="flex flex-col gap-sm">
                {['Confirm room condition', 'Upload meter readings', 'Sign digital handover', 'Get your move-in record'].map((step, index) => <div key={step} className="flex items-center gap-sm"><span className="w-7 h-7 flex items-center justify-center bg-acid-lime border-2 border-primary font-label-caps text-label-caps">{index + 1}</span><span className="font-body-md text-body-md text-on-surface-variant">{step}</span></div>)}
              </div>
            </div>
            <div className="bg-surface-container border-2 border-primary p-md">
              <p className="font-label-caps text-label-caps text-electric-purple uppercase mb-xs">Deposit release plan</p>
              <h3 className="font-h3 text-h3 text-primary mb-md">{formatMoney(deposit)} protected</h3>
              <div className="flex flex-col gap-md">{[['today', 'Deposit held in KeyLo Vault'], ['move-out', 'AI condition check'], ['within 7 days', 'Refund released or dispute opened']].map(([label, text], index) => <div key={label} className="flex gap-sm"><div className="flex flex-col items-center"><span className={`w-3 h-3 rounded-full border-2 border-primary ${index === 0 ? 'bg-acid-lime' : 'bg-surface-container-lowest'}`}></span>{index < 2 && <span className="w-px h-7 bg-primary"></span>}</div><div><p className="font-label-caps text-[10px] text-on-surface-variant uppercase">{label}</p><p className="font-body-md text-body-md text-primary">{text}</p></div></div>)}</div>
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Booking Card & KeyLo Protection */}
        <div className="lg:col-span-4 flex flex-col gap-xl">
          {/* Sticky Booking Widget */}
          <div className="sticky top-[100px] bg-surface border-2 border-primary rounded-xl p-lg flex flex-col gap-lg shadow-[8px_8px_0px_0px_#000000]">
            <div className="flex justify-between items-end border-b-2 border-primary pb-sm">
              <div className="flex flex-col">
                <span className="font-price-display text-price-display text-primary">{formatMoney(rent)}</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">/ month</span>
              </div>
              <div className="px-sm py-xs bg-acid-lime border-2 border-primary font-label-caps text-label-caps shadow-[2px_2px_0px_0px_#000000]">
                AVAILABLE NOW
              </div>
            </div>
            <div className="flex flex-col gap-sm font-body-md text-body-md text-primary">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Monthly Rent</span>
                <span className="font-bold">{formatMoney(rent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Security Deposit (Refundable)</span>
                <span className="font-bold">{formatMoney(deposit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">First-booking KeyLo fee</span>
                <span className="font-bold">{formatMoney(fee)}</span>
              </div>
              <div className="w-full h-px bg-primary my-xs"></div>
              <div className="flex justify-between font-h3 text-h3">
                <span>Total Move-in</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>
            <Link
              to={`/secure-your-stay/${id}`}
              className="w-full py-md bg-acid-lime border-2 border-primary font-h3 text-h3 text-primary uppercase flex items-center justify-center gap-sm hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] transition-all group"
            >
              RESERVE THIS SPACE
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Featured Section: KeyLo Deposit Protection */}
          <div className="bg-primary text-on-primary border-2 border-primary rounded-xl p-lg flex flex-col gap-md shadow-[8px_8px_0px_0px_#7C3AED] relative overflow-hidden">
            {/* Decorative bg accent */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-electric-purple blur-3xl opacity-30 rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="flex items-center gap-sm relative z-10">
              <span
                className="material-symbols-outlined text-acid-lime text-h2"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shield_locked
              </span>
              <h3 className="font-h3 text-h3 text-acid-lime">KEYLO DEPOSIT PROTECTION</h3>
            </div>
            <p className="font-price-display text-price-display text-on-primary tracking-tight relative z-10">
              {formatMoney(deposit)} Secured
            </p>
            <p className="font-body-md text-body-md text-on-primary/80 relative z-10 border-b border-on-primary/20 pb-sm">
              Your security deposit is held safely by KeyLo, not the owner.
            </p>
            <ul className="flex flex-col gap-sm font-label-caps text-label-caps text-on-primary/90 mt-xs relative z-10">
              <li className="flex items-start gap-xs">
                <span className="material-symbols-outlined text-acid-lime text-[16px]">check_circle</span>
                <span>100% Refund guarantee on term completion</span>
              </li>
              <li className="flex items-start gap-xs">
                <span className="material-symbols-outlined text-acid-lime text-[16px]">check_circle</span>
                <span>No arbitrary deductions by landlords</span>
              </li>
              <li className="flex items-start gap-xs">
                <span className="material-symbols-outlined text-acid-lime text-[16px]">check_circle</span>
                <span>Dispute resolution support</span>
              </li>
            </ul>
            <div className="border-t border-on-primary/30 pt-md mt-xs flex items-center gap-sm relative z-10"><span className="material-symbols-outlined text-acid-lime">verified_user</span><div><p className="font-label-caps text-label-caps text-acid-lime">Landlord verified</p><p className="font-body-md text-body-md text-on-primary/70">{ownerName} · {ownerRating} owner rating</p></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
