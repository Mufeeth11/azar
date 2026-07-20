import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Camera, Lock, User, CheckCircle2 } from 'lucide-react';

export default function AdminProfile() {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    document.title = "Admin Profile | SR Digital";
    const userStr = localStorage.getItem('adminUser');
    if (userStr && userStr !== 'undefined') {
      try {
        const user = JSON.parse(userStr);
        setAdminUser(user);
        setUsername(user.username);
        if (user.profile_pic) {
          setImagePreview(`http://localhost:5000${user.profile_pic}`);
        }
      } catch (e) {
        console.error('Failed to parse adminUser in AdminProfile', e);
      }
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ text: 'New passwords do not match!', type: 'error' });
      return;
    }

    if (newPassword && !currentPassword) {
      setMessage({ text: 'Current password is required to set a new password!', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const formData = new FormData();
      formData.append('username', username);
      if (currentPassword) formData.append('currentPassword', currentPassword);
      if (newPassword) formData.append('newPassword', newPassword);
      if (imageFile) formData.append('profile_pic', imageFile);

      const res = await axios.put(`http://localhost:5000/api/auth/profile/${adminUser.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Update local storage
      localStorage.setItem('adminUser', JSON.stringify(res.data.admin));
      setAdminUser(res.data.admin);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setImageFile(null);
      
      // Update top bar image
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setMessage({ 
        text: error.response?.data?.error || 'Failed to update profile. Please try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!adminUser) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Profile Data Missing</h2>
        <p className="text-gray-400 mb-6">You need to log in securely to manage your profile.</p>
        <button 
          onClick={() => window.location.href = '/admin/login'}
          className="bg-[#00d284] hover:bg-[#00b370] text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Profile Settings</h1>
          <p className="text-gray-400 mt-2">Manage your admin account and security</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-[#212b36] rounded-xl p-8 shadow-[0_2px_22px_-4px_rgba(0,0,0,0.06)]"
      >
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' ? 'bg-[#00d284]/10 text-[#00d284] border border-[#00d284]/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {message.type === 'success' && <CheckCircle2 size={18} />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-4 tracking-wide">Profile Picture</label>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-gray-700 overflow-hidden bg-[#1a222c] flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-gray-500" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-[#00d284] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#00b370] transition-colors border-2 border-[#212b36]"
                >
                  <Camera size={14} />
                </button>
              </div>
              <div className="text-sm text-gray-400">
                <p>Allowed formats: JPG, PNG, GIF</p>
                <p>Max size: 2MB</p>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-[#00d284]/20 focus:border-[#00d284] outline-none transition-all bg-[#1a222c] text-white"
                required
              />
            </div>
          </div>

          <div className="h-px w-full bg-gray-800 my-8"></div>
          
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock size={18} className="text-[#00d284]" />
            Change Password
          </h3>

          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password to make changes"
              className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-[#00d284]/20 focus:border-[#00d284] outline-none transition-all bg-[#1a222c] text-white"
            />
          </div>

          {/* New Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-[#00d284]/20 focus:border-[#00d284] outline-none transition-all bg-[#1a222c] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-[#00d284]/20 focus:border-[#00d284] outline-none transition-all bg-[#1a222c] text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`bg-[#00d284] hover:bg-[#00b370] text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg shadow-[#00d284]/20 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
