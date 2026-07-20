import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin Login | SR Digital";
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminUser', JSON.stringify(res.data.admin));
      navigate('/admin');
    } catch (err) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] flex flex-col justify-center items-center p-6 font-poppins">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#1a222c] rounded-2xl shadow-2xl overflow-hidden border border-gray-800"
      >
        <div className="bg-[#00d284] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10 flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg">
              <Lock className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white relative z-10 tracking-wide">Admin Access</h2>
          <p className="text-white/80 mt-2 relative z-10 text-sm font-medium">Secure dashboard entry</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username..."
                className={`w-full px-4 py-3 bg-[#212b36] text-white border ${error ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-[#00d284] focus:ring-[#00d284]/20'} rounded-lg focus:ring-2 outline-none transition-all duration-300`}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className={`w-full px-4 py-3 bg-[#212b36] text-white border ${error ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-[#00d284] focus:ring-[#00d284]/20'} rounded-lg focus:ring-2 outline-none transition-all duration-300`}
              />
              {error && <p className="text-red-400 text-xs font-medium mt-2">Incorrect username or password. Please try again.</p>}
            </div>

            <button
              type="submit"
              className="w-full group bg-[#00d284] hover:bg-[#00b370] text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
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
