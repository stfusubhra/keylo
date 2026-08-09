import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import OwnerLayout from './components/layout/OwnerLayout';
import AdminLayout from './components/layout/AdminLayout';
import PublicLayout from './components/layout/PublicLayout';

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
const RentEssentialsPage = lazy(() => import('./pages/RentEssentialsPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const ForOwnersPage = lazy(() => import('./pages/ForOwnersPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));

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
      { path: 'keylo-vault', element: <KeyloVaultPage /> },
      { path: 'ai-room-inspection', element: <AIRoomInspectionPage /> },
      { path: 'digital-handover', element: <DigitalHandoverPage /> },
      { path: 'maintenance', element: <MaintenancePage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'for-owners', element: <ForOwnersPage /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    errorElement: ErrorBoundary,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'bookings', element: <DashboardPage /> },
      { path: 'messages', element: <DashboardPage /> },
      { path: 'saved', element: <DashboardPage /> },
    ],
  },
  {
    path: '/owner',
    element: <OwnerLayout />,
    errorElement: ErrorBoundary,
    children: [
      { index: true, element: <OwnerPortalPage /> },
      { path: 'properties', element: <OwnerPortalPage /> },
      { path: 'tenants', element: <OwnerPortalPage /> },
      { path: 'rentals', element: <OwnerPortalPage /> },
      { path: 'deposits', element: <OwnerPortalPage /> },
      { path: 'claims', element: <OwnerPortalPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: ErrorBoundary,
    children: [
      { index: true, element: <AdminDisputeCenterPage /> },
      { path: 'disputes', element: <AdminDisputeCenterPage /> },
      {
        path: 'users',
        element: (
          <div className="p-8 text-center">
            <h1 className="font-h1 text-h1 text-on-surface mb-4">Admin Panel</h1>
            <p className="font-body-lg text-on-surface-variant">Admin dashboard.</p>
          </div>
        ),
      },
      {
        path: 'properties',
        element: (
          <div className="p-8 text-center">
            <h1 className="font-h1 text-h1 text-on-surface mb-4">Admin Panel</h1>
            <p className="font-body-lg text-on-surface-variant">Admin panel.</p>
          </div>
        ),
      },
      {
        path: 'analytics',
        element: (
          <div className="p-8 text-center">
            <h1 className="font-h1 text-h1 text-on-surface mb-4">Admin Panel</h1>
            <p className="font-body-lg text-on-surface-variant">Analytics dashboard.</p>
          </div>
        ),
      },
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