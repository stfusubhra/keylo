import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

const sidebarItems = [
  { path: '/dashboard', label: 'Overview', icon: 'grid_view' },
  { path: '/dashboard/bookings', label: 'Bookings', icon: 'calendar_today' },
  { path: '/dashboard/messages', label: 'Messages', icon: 'chat_bubble' },
  { path: '/dashboard/saved', label: 'Wishlist', icon: 'favorite' },
  { path: '/dashboard/disputes', label: 'Disputes', icon: 'gavel' },
];

const ownerSidebarItems = [
  { path: '/owner', label: 'Overview', icon: 'grid_view' },
  { path: '/owner/properties', label: 'Properties', icon: 'apartment' },
  { path: '/owner/tenants', label: 'Tenants', icon: 'group' },
  { path: '/owner/rentals', label: 'Rentals', icon: 'receipt_long' },
  { path: '/owner/deposits', label: 'Deposits', icon: 'account_balance_wallet' },
  { path: '/owner/claims', label: 'Claims', icon: 'gavel' },
];

const adminSidebarItems = [
  { path: '/admin', label: 'Overview', icon: 'grid_view' },
  { path: '/admin/disputes', label: 'Disputes', icon: 'gavel' },
  { path: '/admin/users', label: 'Users', icon: 'people' },
  { path: '/admin/properties', label: 'Properties', icon: 'apartment' },
  { path: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
];

function KeyLoLogo() {
  return (
    <div className="flex items-center gap-2">
      <svg className="h-8 w-8 flex-shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="0" y="0" width="40" height="40" rx="6" fill="#000000"/>
        <path d="M20 10 L20 30 M10 20 L30 20" stroke="#C7F000" strokeWidth="3" strokeLinecap="round"/>
      </svg>
      <span className="font-h3 text-h3 tracking-tight text-primary whitespace-nowrap">keylo</span>
    </div>
  );
}

export default function Sidebar({ variant = 'student' }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null); // { fullName, email } or null

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    supabase.auth.getUser()
      .then(async ({ data }) => {
        if (!active || !data?.user) return;
        let fullName = data.user.user_metadata?.full_name || '';
        if (!fullName) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', data.user.id)
            .maybeSingle();
          if (profile?.full_name) fullName = profile.full_name;
        }
        if (active) setAuthUser({ fullName, email: data.user.email || '' });
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const fallbackLabel = variant === 'owner' ? 'Owner' : variant === 'admin' ? 'Admin' : 'Student';
  const displayName = authUser?.fullName || authUser?.email?.split('@')[0] || (isSupabaseConfigured ? 'Guest' : fallbackLabel);
  const displayEmail = authUser?.email || (isSupabaseConfigured ? 'Not signed in' : 'Demo mode');

  const items = variant === 'owner' ? ownerSidebarItems : variant === 'admin' ? adminSidebarItems : sidebarItems;

  const isActive = (path) => {
    if (path === '/dashboard' || path === '/owner' || path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <>
      <div className="h-20 px-lg flex items-center border-b-2 border-primary bg-surface">
        <KeyLoLogo />
      </div>
      <nav className="flex-1 p-md flex flex-col gap-xs overflow-y-auto" aria-label={`${variant} dashboard navigation`}>
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-md py-lg border-2 border-transparent hover:border-primary transition-all group ${
              isActive(item.path)
                ? 'bg-primary text-on-primary'
                : 'text-on-surface'
            }`}
            aria-current={isActive(item.path) ? 'page' : undefined}
            onClick={() => setMobileOpen(false)}
          >
            <span className="material-symbols-outlined mr-md">{item.icon}</span>
            <span className="font-label-caps text-label-caps">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-md border-t-2 border-primary">
        <div className="flex items-center gap-md">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-primary-container">person</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-label-caps text-label-caps text-primary truncate">{displayName}</p>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm truncate">{displayEmail}</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-surface-container-low border-r-2 border-primary z-50 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Toggle Button */}
      <button
        className="lg:hidden fixed top-20 left-0 z-50 px-md py-md bg-primary text-on-primary border-2 border-primary rounded-r-lg shadow-[2px_2px_0px_0px_#000000]"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={mobileOpen}
      >
        <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-72 bg-surface-container-low border-r-2 border-primary z-50 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
