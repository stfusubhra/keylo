import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ variant = 'student' }) {
  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      <Sidebar variant={variant} />
      <div className="lg:ml-72 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-margin-mobile lg:p-margin-desktop pt-20 pb-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}