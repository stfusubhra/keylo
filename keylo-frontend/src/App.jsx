import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import OwnerLayout from './components/layout/OwnerLayout';
import AdminLayout from './components/layout/AdminLayout';
import ListerLayout from './components/layout/ListerLayout';
import PublicLayout from './components/layout/PublicLayout';
import { ToastProvider } from './components/ui/ToastProvider';
import LoadingScreen from './components/ui/LoadingScreen';
import { isSupabaseConfigured, supabase } from './lib/supabase';
// Lazy-loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const FindStayPage = lazy(() => import('./pages/FindStayPage'));
const PropertyDetailsPage = lazy(() => import('./pages/PropertyDetailsPage'));
const SecureYourStayPage = lazy(() => import('./pages/SecureYourStayPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const KeyloVaultPage = lazy(() => import('./pages/KeyloVaultPage'));
const VaultLoginRequiredPage = lazy(() => import('./pages/VaultLoginRequiredPage'));
const AIRoomInspectionPage = lazy(() => import('./pages/AIRoomInspectionPage'));
const DigitalHandoverPage = lazy(() => import('./pages/DigitalHandoverPage'));
const OwnerPortalPage = lazy(() => import('./pages/OwnerPortalPage'));
const MaintenancePage = lazy(() => import('./pages/MaintenancePage'));
const AdminDisputeCenterPage = lazy(() => import('./pages/AdminDisputeCenterPage'));
const AdminOverviewPage = lazy(() => import('./pages/AdminOverviewPage'));
const AdminDisputesPage = lazy(() => import('./pages/AdminDisputesPage'));
const DepositDisputesPage = lazy(() => import('./pages/DepositDisputesPage'));
const LandlordDisputesPage = lazy(() => import('./pages/LandlordDisputesPage'));
const RentEssentialsPage = lazy(() => import('./pages/RentEssentialsPage'));
const RentItemPage = lazy(() => import('./pages/RentItemPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const ForOwnersPage = lazy(() => import('./pages/ForOwnersPage'));
const ForListersPage = lazy(() => import('./pages/ForListersPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const AccessibilityStatementPage = lazy(() => import('./pages/AccessibilityStatementPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
const AdminVaultPage = lazy(() => import('./pages/AdminVaultPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/AdminAnalyticsPage'));
const ListerDashboardPage = lazy(() => import('./pages/ListerDashboardPage'));
const ListerSignupPage = lazy(() => import('./pages/ListerSignupPage'));
const ListerLoginPage = lazy(() => import('./pages/ListerLoginPage'));
const ListerListingFormPage = lazy(() => import('./pages/ListerListingFormPage'));
const ThreeDWorldPage = lazy(() => import('./pages/ThreeDWorldPage'));

const ErrorBoundary = (
  <div className="min-h-screen bg-surface-container-low font-body-md text-on-surface flex items-center justify-center">
    <div className="text-center p-8">
      <h2 className="font-h1 text-h1 text-on-surface mb-2">Something went wrong</h2>
      <p className="font-body-lg text-on-surface-variant">Please try again or navigate back to the homepage.</p>
      <a href="/" className="mt-4 inline-block px-6 py-2 bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary hover:-translate-y-1 hover:shadow-hard transition-all">
        Go Home
      </a>
    </div>
  </div>
);

function useAuthRole() {
  const [state, setState] = useState({ loading: isSupabaseConfigured, user: null, role: null });

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!active) return;
      if (error || !data.user) {
        setState({ loading: false, user: null, role: null });
        return;
      }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
      if (active) setState({ loading: false, user: data.user, role: profile?.role || 'student' });
    };
    loadUser();
    const { data: listener } = supabase.auth.onAuthStateChange(() => { loadUser(); });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);
  return state;
}

function LoadingSession() {
  return <LoadingScreen label="Checking your session..." className="min-h-screen bg-surface-container-low" />;
}

function RouteGuard({ role, children }) {
  const state = useAuthRole();
  if (!isSupabaseConfigured) return children;
  if (state.loading) return <LoadingSession />;
  if (!state.user) return <Navigate to="/login" replace />;
  if (role && state.role !== role) return <Navigate to={state.role === 'landlord' ? '/owner' : state.role === 'lister' ? '/lister' : '/dashboard'} replace />;
  return children;
}

// Keeps signed-in owners inside their workspace: marketing/student pages and
// auth pages redirect to /owner so owners cannot browse the site like students.
function PublicRouteGuard({ children }) {
  const state = useAuthRole();
  if (!isSupabaseConfigured) return children;
  if (state.loading) return <LoadingSession />;
    if (state.user && state.role === 'landlord') return <Navigate to="/owner" replace />;
    if (state.user && state.role === 'lister') return <Navigate to="/lister" replace />;
  return children;
}

// Student-only pages (KeyLo Vault): require a signed-in user like RouteGuard,
// and keep owners/listers out of the student workspace like PublicRouteGuard.
// Signed-out visitors see a vault explainer with a login prompt (VaultLoginRequiredPage)
// instead of being silently redirected to /login.
function StudentRouteGuard({ children }) {
  const state = useAuthRole();
  if (!isSupabaseConfigured) return children;
  if (state.loading) return <LoadingSession />;
  if (!state.user) return <VaultLoginRequiredPage />;
  if (state.role === 'landlord') return <Navigate to="/owner" replace />;
  if (state.role === 'lister') return <Navigate to="/lister" replace />;
  return children;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: ErrorBoundary,
    children: [
      { index: true, element: <PublicRouteGuard><LandingPage /></PublicRouteGuard> },
      { path: 'find-a-stay', element: <PublicRouteGuard><FindStayPage /></PublicRouteGuard> },
      { path: 'property/:id', element: <PublicRouteGuard><PropertyDetailsPage /></PublicRouteGuard> },
      { path: 'secure-your-stay/:id', element: <PublicRouteGuard><SecureYourStayPage /></PublicRouteGuard> },
      { path: 'rentals', element: <PublicRouteGuard><RentEssentialsPage /></PublicRouteGuard> },
      { path: 'rentals/rent/:id', element: <PublicRouteGuard><RentItemPage /></PublicRouteGuard> },
      { path: 'search', element: <PublicRouteGuard><SearchResultsPage /></PublicRouteGuard> },
      { path: 'keylo-vault', element: <StudentRouteGuard><KeyloVaultPage /></StudentRouteGuard> },
      { path: 'ai-room-inspection', element: <PublicRouteGuard><AIRoomInspectionPage /></PublicRouteGuard> },
      { path: 'digital-handover', element: <PublicRouteGuard><DigitalHandoverPage /></PublicRouteGuard> },
      { path: 'maintenance', element: <PublicRouteGuard><MaintenancePage /></PublicRouteGuard> },
      { path: 'how-it-works', element: <PublicRouteGuard><HowItWorksPage /></PublicRouteGuard> },
      { path: 'for-owners', element: <PublicRouteGuard><ForOwnersPage /></PublicRouteGuard> },
      { path: 'for-listers', element: <PublicRouteGuard><ForListersPage /></PublicRouteGuard> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'accessibility', element: <AccessibilityStatementPage /> },
    ],
  },
  {
    path: '/dashboard',
    element: <RouteGuard><DashboardLayout /></RouteGuard>,
    errorElement: ErrorBoundary,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'bookings', element: <DashboardPage /> },
      { path: 'messages', element: <DashboardPage /> },
      { path: 'saved', element: <WishlistPage /> },
      { path: 'disputes', element: <DepositDisputesPage /> },
    ],
  },
  {
    path: '/owner',
    element: <RouteGuard role="landlord"><OwnerLayout /></RouteGuard>,
    errorElement: ErrorBoundary,
    children: [
      { index: true, element: <OwnerPortalPage /> },
      { path: 'properties', element: <OwnerPortalPage /> },
      { path: 'tenants', element: <OwnerPortalPage /> },
      { path: 'rentals', element: <OwnerPortalPage /> },
      { path: 'messages', element: <OwnerPortalPage /> },
      { path: 'deposits', element: <OwnerPortalPage /> },
      { path: 'claims', element: <LandlordDisputesPage /> },
    ],
  },
  {
    path: '/admin',
    element: <RouteGuard role="admin"><AdminLayout /></RouteGuard>,
    errorElement: ErrorBoundary,
    children: [
      { index: true, element: <AdminOverviewPage /> },
      { path: 'disputes', element: <AdminDisputesPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'properties', element: <AdminDisputeCenterPage /> },
      { path: 'analytics', element: <AdminAnalyticsPage /> },
      { path: 'vault', element: <AdminVaultPage /> },
    ],
  },
  {
    path: '/lister',
    element: <RouteGuard role="lister"><ListerLayout /></RouteGuard>,
    errorElement: ErrorBoundary,
    children: [
      { index: true, element: <ListerDashboardPage /> },
      { path: 'listings', element: <ListerDashboardPage /> },
      { path: 'requests', element: <ListerDashboardPage /> },
      { path: 'earnings', element: <ListerDashboardPage /> },
      { path: 'profile', element: <ListerDashboardPage /> },
      { path: 'settings', element: <ListerDashboardPage /> },
      { path: 'list-an-item', element: <ListerListingFormPage /> },
      { path: 'list-an-item/:itemId', element: <ListerListingFormPage /> },
    ],
  },
  {
    path: '/lister/signup',
    element: <ListerSignupPage />,
    errorElement: ErrorBoundary,
  },
  {
    path: '/lister/login',
    element: <ListerLoginPage />,
    errorElement: ErrorBoundary,
  },
  {
    path: '/3d-world',
    element: <PublicRouteGuard><ThreeDWorldPage /></PublicRouteGuard>,
    errorElement: ErrorBoundary,
  },
  {
    path: '/login',
    element: <PublicRouteGuard><LoginPage /></PublicRouteGuard>,
    errorElement: ErrorBoundary,
  },
  {
    path: '/signup',
    element: <PublicRouteGuard><SignupPage /></PublicRouteGuard>,
    errorElement: ErrorBoundary,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
    errorElement: ErrorBoundary,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
    errorElement: ErrorBoundary,
  },
  {
    path: '*',
    element: (
      <div className="p-8 text-center">
        <h1 className="font-h1 text-h1 text-on-surface mb-2">404</h1>
        <p className="font-body-lg text-on-surface-variant">Page not found.</p>
      </div>
    ),
  },
]);

function App() {
  return (
    <ToastProvider>
      <Suspense fallback={<LoadingScreen label="Loading..." className="min-h-screen bg-surface-container-low" />}>
        <RouterProvider router={router} />
      </Suspense>
    </ToastProvider>
  );
}

export default App;
