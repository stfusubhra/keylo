import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { getUnreadMessageCount } from '../../lib/supabaseData';

const navItems = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/find-a-stay', label: 'Find a Stay', icon: 'search' },
  { path: '/rentals', label: 'Rentals', icon: 'inventory_2' },
  { path: '/how-it-works', label: 'How It Works', icon: 'psychology' },
  { path: '/for-owners', label: 'For Owners', icon: 'business' },
  { path: '/lister', label: 'For Listers', icon: 'storefront' },
];

const ownerNavItems = [
  { path: '/owner', label: 'Overview', icon: 'grid_view' },
  { path: '/owner/properties', label: 'Properties', icon: 'apartment' },
  { path: '/owner/tenants', label: 'Tenants', icon: 'group' },
  { path: '/owner/rentals', label: 'Rentals', icon: 'receipt_long' },
  { path: '/owner/messages', label: 'Messages', icon: 'chat_bubble' },
  { path: '/owner/deposits', label: 'Deposits', icon: 'account_balance_wallet' },
  { path: '/owner/claims', label: 'Claims', icon: 'gavel' },
];

function KeyLoLogo({ className = '', textClass = 'text-primary' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg className="h-8 w-8 flex-shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="0" y="0" width="40" height="40" rx="6" fill="#000000"/>
        <path d="M20 10 L20 30 M10 20 L30 20" stroke="#C7F000" strokeWidth="3" strokeLinecap="round"/>
      </svg>
      <span className={`font-h3 text-h3 tracking-tight whitespace-nowrap ${textClass}`}>keylo</span>
    </div>
  );
}

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null); // { name, email } when signed in
  const [unreadCount, setUnreadCount] = useState(0);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    const syncUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (data?.user) {
         const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
         setAuthUser({
           name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'KeyLo user',
           email: data.user.email || '',
           role: profile?.role || 'student',
         });
      } else {
        setAuthUser(null);
      }
    };
    syncUser();
    const { data: listener } = supabase.auth.onAuthStateChange(() => { syncUser(); });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !authUser) {
      setUnreadCount(0);
      return undefined;
    }
    let active = true;
    getUnreadMessageCount()
      .then((count) => { if (active) setUnreadCount(count); })
      .catch(() => {});
    return () => { active = false; };
  }, [authUser, location.pathname]);

  const handleLogout = async () => {
    setSigningOut(true);
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setAuthUser(null);
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/' || path === '/owner') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const isLandlord = authUser?.role === 'landlord';
  const headerNav = isLandlord ? ownerNavItems : navItems;

  const notificationsLink = (
    <Link
      to={authUser?.role === 'landlord' ? '/owner/messages' : '/dashboard/messages'}
      className="relative p-xs text-on-surface-variant hover:text-primary transition-colors"
      aria-label={`Messages${unreadCount ? ` (${unreadCount} unread)` : ''}`}
      title={isSupabaseConfigured ? 'Messages' : 'Messages'}
    >
      <span className="material-symbols-outlined">chat_bubble</span>
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-hot-pink text-white border-2 border-primary rounded-full font-label-caps text-[10px] leading-[10px] flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b-2 border-primary">
      <div className="relative h-20 w-full px-margin-mobile lg:px-margin-desktop flex items-center justify-between">
        {/* Logo */}
        <Link to={isLandlord ? '/owner' : '/'} className="flex items-center" aria-label={isLandlord ? 'KeyLo Owner Workspace' : 'KeyLo Home'}>
          <KeyLoLogo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-lg lg:absolute lg:left-1/2 lg:-translate-x-1/2" aria-label="Main navigation">
          {!isLandlord && navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`transition-all py-2 ${
                isActive(item.path)
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'font-label-caps text-label-caps text-on-surface-variant hover:text-primary'
              }`}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
         <div className="flex items-center gap-2 sm:gap-md min-w-0">
          {authUser && notificationsLink}
          <div className="w-px h-6 bg-outline-variant mx-xs hidden sm:block" aria-hidden="true"></div>

           {authUser ? (
             <>
               <div className="relative">
                 <button type="button" onClick={() => setAccountMenuOpen((open) => !open)} aria-label="Open account menu" aria-expanded={accountMenuOpen} className="flex items-center gap-sm px-sm sm:px-md py-sm border-2 border-primary bg-surface-container-lowest text-primary max-w-[min(48vw,220px)] hover:bg-acid-lime transition-colors">
                   <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></span>
                   <span className="hidden sm:block font-label-caps text-label-caps truncate">{authUser.name}</span>
                   <span className="material-symbols-outlined text-[18px]">{accountMenuOpen ? 'expand_less' : 'expand_more'}</span>
                 </button>
                 {accountMenuOpen && <div className="absolute right-0 top-full mt-2 z-[60] w-72 max-w-[calc(100vw-2rem)] bg-surface border-2 border-primary shadow-[6px_6px_0px_0px_#000000] p-md">
                   <p className="font-label-caps text-label-caps text-primary truncate">{authUser.name}</p>
                   <p className="font-body-sm text-on-surface-variant truncate mt-xs">{authUser.email}</p>
                   <p className="font-label-caps text-[10px] text-electric-purple uppercase mt-xs">{authUser.role}</p>
                   <Link to={authUser.role === 'landlord' ? '/owner' : authUser.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setAccountMenuOpen(false)} className="block mt-md px-md py-sm bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary text-center">OPEN DASHBOARD</Link>
                   <button type="button" onClick={handleLogout} disabled={signingOut} className="w-full mt-sm px-md py-sm bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps disabled:opacity-50">{signingOut ? 'SIGNING OUT...' : 'LOG OUT'}</button>
                 </div>}
               </div>
             </>
          ) : (
            <>
              <Link to="/login" className="px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-hard transition-all hidden sm:inline-flex">
                Log In
              </Link>
              <Link to="/signup" className="px-lg py-md bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps hover:bg-surface-container-lowest hover:text-primary transition-all hidden sm:inline-flex">
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-xs text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-t-2 border-primary px-margin-mobile py-md">
          <nav className="flex flex-col gap-sm" aria-label="Mobile navigation">
            {headerNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-md px-md py-lg border-2 border-transparent hover:border-primary transition-all ${
                  isActive(item.path)
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-sm mt-md pt-md border-t-2 border-primary">
              {authUser ? (
                <>
                  <div className="px-md py-lg border-2 border-primary bg-surface-container-lowest flex items-center gap-md">
                    <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-on-primary text-[20px]">person</span>
                    </span>
                    <span className="font-label-caps text-label-caps text-primary truncate">{authUser.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={signingOut}
                    className="px-lg py-md bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps text-center disabled:opacity-50"
                  >
                    {signingOut ? 'Signing out...' : 'Logout'}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-lg py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary text-center" onClick={() => setMobileMenuOpen(false)}>
                    Log In
                  </Link>
                  <Link to="/signup" className="px-lg py-md bg-primary text-on-primary border-2 border-primary font-label-caps text-label-caps text-center" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
