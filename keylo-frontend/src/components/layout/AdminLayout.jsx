import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-surface-container-low font-body-md text-on-surface">
      <Sidebar variant="admin" />
      <div className="lg:ml-72 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-margin-mobile lg:p-margin-desktop pt-24 pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}