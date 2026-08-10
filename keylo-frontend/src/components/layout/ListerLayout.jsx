import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import { getListerProfile, listerLogout } from '../../lib/listerData';

const listerNavItems = [
  { path: '/lister', label: 'Overview', icon: 'grid_view', exact: true },
  { path: '/lister/listings', label: 'My Listings', icon: 'inventory_2' },
  { path: '/lister/requests', label: 'Rental Requests', icon: 'inbox' },
  { path: '/lister/earnings', label: 'Earnings', icon: 'account_balance_wallet' },
  { path: '/lister/profile', label: 'Profile', icon: 'person' },
  { path: '/lister/settings', label: 'Settings', icon: 'settings' },
];

function isItemActive(pathname, item) {
  if (item.exact) return pathname === item.path;
  return pathname.startsWith(item.path);
}

export default function ListerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState(getListerProfile());
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setProfile(getListerProfile()), 0);
    return () => clearTimeout(t);
  }, [location.pathname]);

  const handleLogout = async () => {
    setSigningOut(true);
    await listerLogout();
    navigate('/');
  };

  const sidebarContent = (
    <>
      <div className="px-lg py-md border-b-2 border-primary bg-surface-container-low">
        <p className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">
          Lister Dashboard
        </p>
      </div>
      <nav className="flex-1 p-md flex flex-col gap-xs overflow-y-auto" aria-label="Lister dashboard navigation">
        {listerNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-md py-lg border-2 border-transparent hover:border-primary transition-all group ${
              isItemActive(location.pathname, item)
                ? 'bg-primary text-on-primary'
                : 'text-on-surface'
            }`}
            aria-current={isItemActive(location.pathname, item) ? 'page' : undefined}
            onClick={() => setMobileOpen(false)}
          >
            <span className="material-symbols-outlined mr-md">{item.icon}</span>
            <span className="font-label-caps text-label-caps">{item.label}</span>
          </Link>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          disabled={signingOut}
          className="flex items-center px-md py-lg border-2 border-transparent hover:border-primary transition-all group text-on-surface mt-xs w-full text-left disabled:opacity-50"
        >
          <span className="material-symbols-outlined mr-md">logout</span>
          <span className="font-label-caps text-label-caps">{signingOut ? 'Signing out...' : 'Logout'}</span>
        </button>
      </nav>
      <div className="p-md border-t-2 border-primary">
        <div className="flex items-center gap-md">
          {profile?.photo ? (
            <img src={profile.photo} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-primary flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-primary-container">person</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-label-caps text-label-caps text-primary truncate">{profile?.name || 'Lister'}</p>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm truncate">{profile?.email || '—'}</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface-container-low font-body-md text-on-surface">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-20 h-[calc(100vh-5rem)] w-72 bg-surface-container-low border-r-2 border-primary z-40 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-24 left-0 z-40 px-md py-md bg-primary text-on-primary border-2 border-primary rounded-r-lg shadow-[2px_2px_0px_0px_#000000]"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={mobileOpen}
      >
        <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-black/50 z-30" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`lg:hidden fixed left-0 top-20 h-[calc(100vh-5rem)] w-72 bg-surface-container-low border-r-2 border-primary z-40 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      <div className="lg:ml-72 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-margin-mobile lg:p-margin-desktop pt-32 pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
