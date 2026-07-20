import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Activity, LogOut, Star, User, Users, ChevronDown, ShoppingCart, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    document.title = "Admin Panel | SR Digital";
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleNotificationClick = async (notif: any) => {
    try {
      if (!notif.is_read) {
        await axios.put(`http://localhost:5000/api/notifications/${notif.id}/read`);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(notifications.map(n => n.id === notif.id ? { ...n, is_read: 1 } : n));
      }
      setShowNotificationsMenu(false);

      // Navigate based on type
      if (notif.type === 'order') navigate('/admin/orders');
      if (notif.type === 'message') navigate('/admin/messages');
      if (notif.type === 'feedback') navigate('/admin/feedback');
    } catch (error) {
      console.error('Failed to mark read:', error);
    }
  };

  // Simple hardcoded auth check
  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (isAuth !== 'true') {
      navigate('/admin/login');
    }
  }, [navigate]);

  const adminUserStr = localStorage.getItem('adminUser');
  let adminUser = null;
  try {
    adminUser = adminUserStr && adminUserStr !== 'undefined' ? JSON.parse(adminUserStr) : null;
  } catch (e) {
    console.error('Failed to parse adminUser from localStorage', e);
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
    }
  };

  return (
    <div className="flex h-screen bg-[#111827] text-gray-200 font-poppins">
      {/* Sidebar - Dark Theme */}
      <aside className="w-64 bg-[#1a222c] text-gray-400 flex flex-col shadow-lg z-20 shrink-0 border-r border-gray-800 print:hidden">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#00d284] rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-[#00d284]/30">SR</div>
          <h1 className="text-xl font-bold text-white tracking-wide">SR Digital</h1>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {[{ name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, exact: true },
          { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
          { name: 'Manage Services', path: '/admin/activities', icon: <Activity size={20} /> },
          { name: 'Messages', path: '/admin/messages', icon: <MessageSquare size={20} /> },
          { name: 'Feedback', path: '/admin/feedback', icon: <Star size={20} /> }
          ].map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                  ? 'bg-gradient-to-r from-[#00d284]/20 to-transparent text-white font-medium before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#00d284] before:rounded-r-full'
                  : 'hover:bg-white/5 hover:text-gray-200'
                }`
              }
            >
              <div className="text-gray-500 group-hover:text-gray-300">
                {item.icon}
              </div>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-4 py-2"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible print:bg-white">
        <header className="h-16 bg-[#1a222c] border-b border-gray-800 flex items-center justify-between px-8 shrink-0 z-10 print:hidden">
          <div className="flex items-center text-gray-200">
            <span className="text-lg font-semibold tracking-wide">Dashboard</span>
          </div>

          <div className="flex items-center gap-6 relative">

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotificationsMenu(!showNotificationsMenu);
                  setShowProfileMenu(false);
                }}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1a222c]"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotificationsMenu && (
                <div className="absolute right-0 top-12 mt-2 w-80 bg-[#212b36] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.3)] border border-gray-700/50 overflow-hidden py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-700/50 flex justify-between items-center">
                    <h3 className="font-bold text-white text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">No notifications yet.</div>
                    ) : (
                      notifications.map((notif: any) => (
                        <button
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-start gap-3 border-b border-gray-700/20 last:border-0 ${!notif.is_read ? 'bg-[#00d284]/5' : ''
                            }`}
                        >
                          <div className={`mt-1 shrink-0 ${!notif.is_read ? 'text-[#00d284]' : 'text-gray-500'}`}>
                            {notif.type === 'order' ? <ShoppingCart size={14} /> :
                              notif.type === 'message' ? <MessageSquare size={14} /> : <Star size={14} />}
                          </div>
                          <div>
                            <div className={`text-sm ${!notif.is_read ? 'text-white font-medium' : 'text-gray-300'}`}>
                              {notif.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{notif.message}</div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotificationsMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-all"
            >
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center border border-gray-600 overflow-hidden">
                {adminUser?.profile_pic ? (
                  <img src={`http://localhost:5000${adminUser.profile_pic}`} alt="Admin Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={16} />
                )}
              </div>
              <span className="hidden sm:block">{adminUser?.username || 'Admin'}</span>
              <ChevronDown size={14} className={`transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 top-12 mt-2 w-48 bg-[#212b36] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.3)] border border-gray-700/50 overflow-hidden py-1 z-50">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/admin/profile');
                  }}
                >
                  <User size={16} />
                  Profile
                </button>
                <div className="h-px bg-gray-700/50 w-full my-1"></div>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative print:p-0 print:overflow-visible print:bg-white">
          <div className="max-w-6xl mx-auto print:max-w-none print:w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
