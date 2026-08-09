import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      <Sidebar variant="admin" />
      <div className="lg:ml-72 flex flex-col min-h-screen">
        <main className="flex-1 p-margin-mobile lg:p-margin-desktop pt-20 pb-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}