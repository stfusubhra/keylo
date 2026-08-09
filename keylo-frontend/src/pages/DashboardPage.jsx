import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getDashboardData } from '../lib/supabaseData';
import { isSupabaseConfigured } from '../lib/supabase';

const dashboardSections = {
  '/dashboard/bookings': {
    eyebrow: 'Your stays',
    title: 'Bookings',
    description: 'Track upcoming move-ins, active stays, and completed rentals in one place.',
    icon: 'calendar_today',
  },
  '/dashboard/messages': {
    eyebrow: 'Stay connected',
    title: 'Messages',
    description: 'Keep conversations with landlords and KeyLo support attached to each rental.',
    icon: 'chat_bubble',
  },
  '/dashboard/saved': {
    eyebrow: 'Shortlist',
    title: 'Saved spaces',
    description: 'Your bookmarked Kolkata homes, ready for the next comparison.',
    icon: 'favorite',
  },
};

function DashboardSection({ section, pathname, liveData }) {
  const isMessages = pathname.endsWith('messages');
  const isBookings = pathname.endsWith('bookings');
  const liveSaved = liveData?.saved?.length;
  const cards = isBookings && liveData?.bookings?.length
    ? liveData.bookings.map((booking) => [booking.properties?.name || 'KeyLo booking', `${booking.properties?.area || 'Kolkata'} · Move-in ${booking.move_in_date}`, booking.status.toUpperCase(), `₹${Number(booking.rent_amount).toLocaleString('en-IN')} / month`, 'calendar_today', booking.property_id])
    : isBookings
    ? [
        ['College Street Co-Living', 'University of Calcutta · Room 304', 'ACTIVE', '₹7,800 / month', 'directions_walk'],
        ['Lake View Student PG', 'Jadavpur University · Move-in 01 Sept', 'UPCOMING', '₹9,500 / month', 'event'],
        ['Rajarhat Campus Flat', "St. Xavier's University · Completed", 'COMPLETED', '₹19,500 / month', 'history'],
      ]
    : isMessages
      ? [
          ['Riya Sen · Lake View Student PG', 'Your inspection report is ready to review.', '2 min ago', 'verified_user'],
          ['KeyLo Support', 'Your deposit release timeline has been updated.', 'Yesterday', 'support_agent'],
          ['Property manager', 'The Wi-Fi installation is scheduled for move-in day.', '12 Oct', 'wifi'],
        ]
      : liveSaved
      ? liveData.saved.map((saved) => [saved.properties?.name || 'Saved stay', `${saved.properties?.area || 'Kolkata'} · ${saved.properties?.property_type === 'pg' ? 'PG' : 'Flat'} · ₹${Number(saved.properties?.monthly_rent || 0).toLocaleString('en-IN')}/mo`, `${saved.properties?.profiles?.owner_rating || '4.8'} ★`, 'favorite'])
      : [
          ['Lake View Student PG', 'Near Jadavpur University · PG · ₹9,500/mo', '4.9 ★', 'favorite'],
          ['Adamas Green PG', 'Near Adamas University · PG · ₹8,500/mo', '4.8 ★', 'favorite'],
          ['Rajarhat Campus Flat', "Near St. Xavier's University · Flat · ₹19,500/mo", '4.6 ★', 'favorite'],
        ];
  const isDemo = isMessages || (isBookings && !liveData?.bookings?.length) || (!isBookings && !isMessages && !liveSaved);

  return (
    <div className="bg-surface min-h-screen font-body-md text-on-surface p-lg lg:p-xl">
      <div className="max-w-5xl mx-auto">
        <div className="bg-primary text-on-primary border-2 border-primary p-lg lg:p-xl shadow-[8px_8px_0px_0px_#C7F000] mb-xl">
          <div className="flex items-start justify-between gap-md"><div><p className="font-label-caps text-label-caps text-acid-lime uppercase mb-sm">{section.eyebrow}</p><h1 className="font-heading text-h1-mobile md:text-h1 text-on-primary font-bold uppercase">{section.title}</h1><p className="font-body-lg text-body-lg text-on-primary/80 mt-sm max-w-2xl">{section.description}</p></div><span className="material-symbols-outlined text-acid-lime text-[48px]">{section.icon}</span></div>
        </div>
        <div className="flex flex-col gap-md">{cards.map(([title, detail, status, meta, icon, propertyId]) => <article key={title} className="bg-surface-container-lowest border-2 border-primary p-lg shadow-[4px_4px_0px_0px_#000000] flex flex-col md:flex-row md:items-center gap-lg"><div className="w-14 h-14 bg-acid-lime border-2 border-primary flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-primary">{icon}</span></div><div className="flex-1"><h2 className="font-h3 text-h3 text-primary">{title}</h2><p className="font-body-md text-body-md text-on-surface-variant mt-xs">{detail}</p></div><div className="md:text-right"><span className="inline-block px-sm py-xs bg-surface-container border-2 border-primary font-label-caps text-label-caps text-primary">{status}</span><p className="font-label-caps text-label-caps text-on-surface-variant mt-sm">{meta}</p></div>{pathname.endsWith('bookings') && <Link to={propertyId ? `/secure-your-stay/${propertyId}` : '/secure-your-stay/jadavpur-pg'} className="px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary text-center">View</Link>}</article>)}</div>
        {isDemo && <div className="mt-xl bg-surface-container border-2 border-primary p-lg flex items-center gap-md"><span className="material-symbols-outlined text-electric-purple">info</span><p className="font-body-md text-body-md text-on-surface-variant">These demo records will become live once KeyLo connects to the booking and messaging backend.</p></div>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const location = useLocation();
  const section = dashboardSections[location.pathname];
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    getDashboardData().then((data) => { if (active) setLiveData(data); }).catch(() => {});
    return () => { active = false; };
  }, []);

  if (section) return <DashboardSection section={section} pathname={location.pathname} liveData={liveData} />;

  const activityLog = [
    {
      id: 1,
      title: 'Rent Payment Successful',
      subtitle: '₹8,500 via UPI',
      time: '2 HRS AGO',
      icon: 'account_balance_wallet',
      iconBg: 'bg-electric-purple',
      iconColor: 'text-white',
    },
    {
      id: 2,
      title: 'Maintenance Request #402',
      subtitle: 'AC cooling issue reported',
      time: 'YESTERDAY',
      icon: 'build',
      iconBg: 'bg-surface-container-lowest',
      iconColor: 'text-primary',
    },
    {
      id: 3,
      title: 'Scooter Rental Confirmed',
      subtitle: 'Ather 450X assigned',
      time: 'OCT 12',
      icon: 'two_wheeler',
      iconBg: 'bg-surface-container-lowest',
      iconColor: 'text-primary',
    },
  ];

  return (
    <div className="bg-surface font-body-md text-on-surface">
      {/* Hero Section */}
      <div className="relative w-full h-[320px] -mt-20 pt-20 flex flex-col justify-end pb-lg px-lg bg-surface-container overflow-hidden group">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtK3SB6TozgnOSRqM_zUZ0r3SzPNZtylbzfu_tVG-SSR0n6xK2pHv3p9YQzAK5J_-GpSdOhtaGAv9pZPaB-KdKen7bYGiWhCpEayzm8iu82scclP1gtv7tmqN4kvLtsC-tm6NzH6pcG-ttkKOFYyEOfMEc01BTiP6KayvbJXi-Db4DCHBBj2-kpPAhzB_LpezluGRFh1FBNsod07cy5BBqqULYhT5ESditMPD2YIsCtnB1uHtRqS4u')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-90"></div>
        <div className="relative z-10 flex flex-col gap-sm mix-blend-difference text-white">
          <h1 className="font-heading text-h1-mobile md:text-h1 text-white font-bold">
            Hey! Ready for your next move? 👋
          </h1>
          <p className="font-body-lg text-body-lg text-white/80">
            Your student life, engineered for speed.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-xl grid grid-cols-12 gap-gutter max-w-[1440px] mx-auto w-full">
        {/* Left Column: Active Rental Card */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          <div className="w-full bg-surface-container-lowest border-2 border-primary relative group">
            <div className="h-48 w-full border-b-2 border-primary bg-cover bg-center">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmqfhnjwc40Dh-QaEu0O0pXV41I6QhCqTeNFItdYsXdhIznPs0HZ7jVn4rvMMlaxR5r3LHRHqFIR5EpujTM3XRbPBEd45EK-dNkRxJvbTL9MnSqQG-0Ad-D6qjUptZ2njwyN7wjOeZR96A99OpMPaDXJezMePEimYnvOBgk-w72BytHplAv3AWAVytQhvLYo8_qXm_0hzv4uQyu1DEtFfvP0bvGbtOxsuRCYF6C89Y_qDzXp_QHcPy"
                alt="Lake View Student PG room"
              />
            </div>
            <div className="p-lg flex flex-col gap-md">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-h3 text-h3 text-on-surface">
                     {liveData?.bookings?.[0]?.properties?.name || 'Lake View Student PG'}
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                     {liveData?.bookings?.[0]?.properties?.area ? `${liveData.bookings[0].properties.area}, Kolkata` : 'Room 304, North Wing'}
                  </p>
                </div>
                <span className="inline-block px-sm py-xs bg-electric-purple text-white font-label-caps text-label-caps border-2 border-primary">
                  ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-md border-t-2 border-primary pt-md mt-sm">
                <div className="flex-1">
                  <p className="font-price-display text-price-display text-primary">
                     {liveData?.bookings?.[0] ? 'LIVE' : '23'}
                  </p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                     {liveData?.bookings?.[0] ? 'Booking Status' : 'Days Remaining'}
                  </p>
                </div>
                <div className="h-10 w-2 bg-primary"></div>
                <div className="flex-1">
                  <p className="font-h3 text-h3 text-primary">24 Nov</p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                    Checkout
                  </p>
                </div>
              </div>
              <Link
                to="/secure-your-stay/jadavpur-pg"
                className="w-full mt-sm px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:shadow-[4px_4px_0px_0px_#000000] transition-all relative overflow-hidden group/btn"
              >
                <span className="relative z-10 flex items-center justify-center gap-sm">
                  EXTEND STAY{' '}
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Stats & Activity */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-gutter">
          <div className="bg-primary text-on-primary border-2 border-primary p-lg shadow-[6px_6px_0px_0px_#C7F000]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-md mb-md"><div><p className="font-label-caps text-label-caps text-acid-lime uppercase">Your KeyLo protection</p><h2 className="font-h3 text-h3 text-on-primary">Deposit release timeline</h2></div><span className="px-sm py-xs bg-acid-lime text-primary border-2 border-on-primary font-label-caps text-label-caps">ACTIVE</span></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">{[['check_circle', 'Move-in record', 'Completed'], ['shield', 'Deposit protected', '₹10,000 held'], ['schedule', 'Move-out review', 'Due at checkout']].map(([icon, title, detail]) => <div key={title} className="flex items-center gap-sm border border-on-primary/30 p-sm"><span className="material-symbols-outlined text-acid-lime">{icon}</span><div><p className="font-label-caps text-[10px] text-on-primary/70 uppercase">{title}</p><p className="font-label-caps text-label-caps text-on-primary mt-xs">{detail}</p></div></div>)}</div>
          </div>
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter w-full">
            {/* Deposit Vault */}
            <Link
              to="/vault"
              className="bg-surface-container-highest border-2 border-primary p-md flex flex-col justify-between aspect-square group hover:bg-acid-lime transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-[32px] text-primary">
                  account_balance_wallet
                </span>
                <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-primary mb-xs">
                  Deposit Vault
                </p>
                <p className="font-h2 text-h2 text-primary">₹10K</p>
              </div>
            </Link>

            {/* Active Rental */}
            <div className="bg-surface-container-highest border-2 border-primary p-md flex flex-col justify-between aspect-square group hover:bg-acid-lime transition-colors cursor-pointer relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[120px]">
                  two_wheeler
                </span>
              </div>
              <div className="flex justify-between items-start relative z-10">
                <span className="material-symbols-outlined text-[32px] text-primary">
                  two_wheeler
                </span>
                <span className="px-xs py-[2px] bg-sky-cyan text-primary font-label-caps text-[10px] border-2 border-primary">
                  LIVE
                </span>
              </div>
              <div className="relative z-10">
                <p className="font-label-caps text-label-caps text-primary mb-xs">
                  Active Rental
                </p>
                <p className="font-h3 text-h3 text-primary truncate">
                  Ather 450X
                </p>
              </div>
            </div>

            {/* Maintenance */}
            <Link
              to="/maintenance"
              className="bg-surface-container-highest border-2 border-primary p-md flex flex-col justify-between aspect-square group hover:bg-acid-lime transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-[32px] text-primary">
                  build
                </span>
                <span className="w-6 h-6 rounded-full border-2 border-primary bg-hot-pink flex items-center justify-center font-label-caps text-[10px] text-primary">
                  1
                </span>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-primary mb-xs">
                  Maintenance
                </p>
                <p className="font-h3 text-h3 text-primary">Pending</p>
              </div>
            </Link>

            {/* Agreement */}
            <div className="bg-primary border-2 border-primary p-md flex flex-col justify-between aspect-square group hover:bg-surface-container-highest transition-colors cursor-pointer">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-[32px] text-white">
                  draw
                </span>
                <span className="material-symbols-outlined text-white text-[20px]">
                  check_circle
                </span>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-acid-lime mb-xs">
                  Agreement
                </p>
                <p className="font-h3 text-h3 text-white">Signed</p>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="w-full bg-surface-container-lowest border-2 border-primary p-lg">
            <div className="flex justify-between items-end mb-lg border-b-2 border-primary pb-sm">
              <h3 className="font-h3 text-h3 text-primary">Activity Log</h3>
              <button className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors">
                VIEW ALL
              </button>
            </div>
            <div className="flex flex-col relative">
              <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-primary"></div>
              {activityLog.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-md relative pl-10 py-sm group"
                >
                  <div
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-primary rounded-none group-hover:scale-125 transition-transform ${
                      item.iconBg === 'bg-electric-purple'
                        ? 'bg-electric-purple'
                        : 'bg-surface-container-lowest'
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="font-body-md text-body-md text-primary font-bold">
                      {item.title}
                    </p>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                      {item.subtitle}
                    </p>
                  </div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
