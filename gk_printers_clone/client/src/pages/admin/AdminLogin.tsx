import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin Login | SR Digital";
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded password for now: "admin123"
    if (password === 'admin123') {
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 font-poppins">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#10A7FF] to-[#0A85CC] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10 flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Lock className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white relative z-10">Admin Access</h2>
          <p className="text-white/80 mt-2 relative z-10 text-sm">Secure dashboard entry</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className={`w-full px-4 py-3 bg-gray-50 border ${error ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-[#10A7FF] focus:ring-[#10A7FF]/20'} rounded-xl focus:ring-4 outline-none transition-all duration-300`}
                autoFocus
              />
              {error && <p className="text-red-500 text-xs font-medium mt-2">Incorrect password. Please try again.</p>}
            </div>

            <button
              type="submit"
              className="w-full group bg-gray-900 hover:bg-black text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              Login to Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
