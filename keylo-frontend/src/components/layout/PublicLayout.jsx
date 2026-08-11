import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-surface-container-low font-body-md text-on-surface">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-acid-lime focus:text-primary focus:border-2 focus:border-primary focus:font-label-caps focus:text-label-caps"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="pt-20 pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}