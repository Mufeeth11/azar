import { motion } from 'framer-motion';
import { TrendingUp, Calendar, ShoppingCart, Clock, Users, Activity, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({
    revenue: 0, todayRevenue: 0, todayOrders: 0, pendingOrders: 0, totalUsers: 0, activeUsers: 0, recentActivities: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get('http://localhost:5000/api/dashboard/stats');
        setStats(statsRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8 relative overflow-hidden flex flex-col justify-center"
        style={{
          background: 'linear-gradient(135deg, #cc2b2e 0%, #175d49 100%)'
        }}
      >
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2 tracking-wide">
            <span>👋</span> Hello Admin,
          </h2>
          <p className="text-white/90 text-md max-w-lg leading-relaxed font-medium">
            Welcome to your Dashboard. Here is your system overview.
          </p>
        </div>
      </motion.div>

      {/* Huge Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Today's Orders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#212b36] rounded-3xl p-8 relative overflow-hidden border border-gray-700/50 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#1b4e85]/20 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="text-[#3399ff]" size={28} />
            </div>
            <span className="text-gray-300 font-semibold text-lg tracking-wide">Today's Orders</span>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {stats.todayOrders}
            </h3>
          </div>
        </motion.div>

        {/* Pending Orders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#212b36] rounded-3xl p-8 relative overflow-hidden border border-gray-700/50 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#8c2323]/20 rounded-2xl flex items-center justify-center">
              <Clock className="text-[#ff4d4d]" size={28} />
            </div>
            <span className="text-gray-300 font-semibold text-lg tracking-wide">Pending Orders</span>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {stats.pendingOrders}
            </h3>
          </div>
        </motion.div>

        {/* Total Users */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#212b36] rounded-3xl p-8 relative overflow-hidden border border-gray-700/50 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#9c27b0]/20 rounded-2xl flex items-center justify-center">
              <Users className="text-[#e040fb]" size={28} />
            </div>
            <span className="text-gray-300 font-semibold text-lg tracking-wide">Total Users</span>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {stats.totalUsers}
            </h3>
          </div>
        </motion.div>

        {/* Active Users */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#212b36] rounded-3xl p-8 relative overflow-hidden border border-gray-700/50 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#00bcd4]/20 rounded-2xl flex items-center justify-center">
              <Activity className="text-[#00e5ff]" size={28} />
            </div>
            <span className="text-gray-300 font-semibold text-lg tracking-wide">Active Users (30d)</span>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {stats.activeUsers}
            </h3>
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-[#212b36] rounded-3xl p-8 relative overflow-hidden border border-gray-700/50 shadow-xl"
      >
        <div className="flex items-center gap-4 mb-6 border-b border-gray-700/50 pb-4">
          <Bell className="text-gray-400" size={24} />
          <h3 className="text-xl font-bold text-white tracking-wide">Recent Activities</h3>
        </div>

        <div className="space-y-4">
          {stats.recentActivities && stats.recentActivities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activities.</p>
          ) : (
            stats.recentActivities?.map((activity: any) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.type === 'order' ? 'bg-[#3399ff]/20 text-[#3399ff]' :
                    activity.type === 'message' ? 'bg-[#ffac33]/20 text-[#ffac33]' :
                      'bg-[#00d284]/20 text-[#00d284]'
                  }`}>
                  {activity.type === 'order' ? <ShoppingCart size={20} /> :
                    activity.type === 'message' ? <Bell size={20} /> :
                      <Activity size={20} />}
                </div>
                <div>
                  <h4 className="text-white font-medium">{activity.title}</h4>
                  <p className="text-gray-400 text-sm mt-1">{activity.message}</p>
                  <p className="text-gray-600 text-xs mt-2">{new Date(activity.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
