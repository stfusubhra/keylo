import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import OwnerLayout from './components/layout/OwnerLayout';
import AdminLayout from './components/layout/AdminLayout';
import PublicLayout from './components/layout/PublicLayout';
import { isSupabaseConfigured, supabase } from './lib/supabase';

// Lazy-loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const FindStayPage = lazy(() => import('./pages/FindStayPage'));
const PropertyDetailsPage = lazy(() => import('./pages/PropertyDetailsPage'));
const SecureYourStayPage = lazy(() => import('./pages/SecureYourStayPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const KeyloVaultPage = lazy(() => import('./pages/KeyloVaultPage'));
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
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const ForOwnersPage = lazy(() => import('./pages/ForOwnersPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/AdminAnalyticsPage'));

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

function RouteGuard({ role, children }) {
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

  if (!isSupabaseConfigured) return children;
  if (state.loading) return <div className="min-h-screen flex items-center justify-center bg-surface-container-low font-label-caps text-label-caps text-primary">Checking your session...</div>;
  if (!state.user) return <Navigate to="/login" replace />;
  if (role && state.role !== role) return <Navigate to={state.role === 'landlord' ? '/owner' : '/dashboard'} replace />;
  return children;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: ErrorBoundary,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'find-a-stay', element: <FindStayPage /> },
      { path: 'property/:id', element: <PropertyDetailsPage /> },
      { path: 'secure-your-stay/:id', element: <SecureYourStayPage /> },
      { path: 'rentals', element: <RentEssentialsPage /> },
      { path: 'rentals/rent/:id', element: <RentItemPage /> },
      { path: 'keylo-vault', element: <KeyloVaultPage /> },
      { path: 'ai-room-inspection', element: <AIRoomInspectionPage /> },
      { path: 'digital-handover', element: <DigitalHandoverPage /> },
      { path: 'maintenance', element: <MaintenancePage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'for-owners', element: <ForOwnersPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'support', element: <SupportPage /> },
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
      { path: 'saved', element: <DashboardPage /> },
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
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: ErrorBoundary,
  },
  {
    path: '/signup',
    element: <SignupPage />,
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
