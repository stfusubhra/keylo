import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-surface-container-low font-body-md text-on-surface">
      <Header />
      <main className="pt-20 pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}