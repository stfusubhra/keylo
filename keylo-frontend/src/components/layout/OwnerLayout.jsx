import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function OwnerLayout() {
  return (
    <div className="min-h-screen bg-surface-container-low font-body-md text-on-surface">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-acid-lime focus:text-primary focus:border-2 focus:border-primary focus:font-label-caps focus:text-label-caps"
      >
        Skip to main content
      </a>
      <Sidebar variant="owner" />
      <div className="lg:ml-72 flex flex-col min-h-screen">
        <Header />
        <main id="main-content" className="flex-1 p-margin-mobile lg:p-margin-desktop pt-32 pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}