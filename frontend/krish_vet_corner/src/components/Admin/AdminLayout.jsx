import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ProtectedRoute from '../common/ProtectedRoute';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <ProtectedRoute>
        <div className="flex">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col lg:ml-0 transition-all duration-300">
            {/* Header */}
            <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
            
            {/* Page Content */}
            <main className="flex-1 p-6 lg:p-8 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </ProtectedRoute>
    </div>
  );
};

export default AdminLayout;
