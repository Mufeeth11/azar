import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Activity, LogOut } from 'lucide-react';
import { useEffect } from 'react';

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin Panel | SR Digital";
  }, []);

  // Simple hardcoded auth check
  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (isAuth !== 'true') {
      navigate('/admin/login');
    }
  }, [navigate]);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Messages', path: '/admin/messages', icon: <MessageSquare size={20} /> },
    { name: 'Manage Services', path: '/admin/activities', icon: <Activity size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-poppins">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold bg-gradient-to-r from-[#10A7FF] to-[#0A85CC] bg-clip-text text-transparent">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive
                    ? 'bg-[#10A7FF]/10 text-[#10A7FF]'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-500 font-medium hover:bg-red-50 rounded-xl transition-all duration-300"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
