import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, Calendar, Image as ImageIcon, Edit2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Activity {
  id: number;
  title: string;
  description: string;
  detailed_description?: string;
  image_url?: string;
  created_at: string;
}

export default function AdminActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [quickEditId, setQuickEditId] = useState<number | null>(null);
  const quickImageInputRef = useRef<HTMLInputElement>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/activities');
      setActivities(response.data.activities);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
    setDetailedDescription('');
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (activity: Activity) => {
    setEditId(activity.id);
    setTitle(activity.title);
    setDescription(activity.description);
    setDetailedDescription(activity.detailed_description || '');
    setImageFile(null);
    let previewUrl = '';
    if (activity.image_url) {
      if (activity.image_url.startsWith('http') || activity.image_url.startsWith('/assets')) {
        previewUrl = activity.image_url;
      } else {
        previewUrl = `http://localhost:5000${activity.image_url}`;
      }
    }
    setImagePreview(previewUrl);
    setTimeout(() => {
      const formElement = document.getElementById('activity-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    if (!confirm(`Are you sure you want to ${editId ? 'update' : 'publish'} this service?`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (detailedDescription) formData.append('detailed_description', detailedDescription);
      if (imageFile) formData.append('image', imageFile);

      if (editId) {
        await axios.put(`http://localhost:5000/api/activities/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Service updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/activities', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Service published successfully!');
      }

      resetForm();
      fetchActivities();
    } catch (error) {
      console.error('Failed to post activity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/activities/${id}`);
      if (editId === id) resetForm();
      fetchActivities();
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  const triggerQuickImageUpload = (id: number) => {
    setQuickEditId(id);
    if (quickImageInputRef.current) {
      quickImageInputRef.current.click();
    }
  };

  const handleQuickImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && quickEditId) {
      if (!confirm('Are you sure you want to upload this new image?')) {
        setQuickEditId(null);
        if (quickImageInputRef.current) quickImageInputRef.current.value = '';
        return;
      }

      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      try {
        await axios.put(`http://localhost:5000/api/activities/${quickEditId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Image updated successfully!');
        fetchActivities();
      } catch (error) {
        console.error('Failed to quick-update image:', error);
      } finally {
        setQuickEditId(null);
        if (quickImageInputRef.current) quickImageInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Form Section */}
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-[#212b36] rounded-xl p-8 shadow-[0_2px_22px_-4px_rgba(0,0,0,0.06)]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-wide">
              {editId ? 'Edit Service' : 'Post New Service'}
            </h2>
            {editId && (
              <button onClick={resetForm} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            )}
          </div>

          <form id="activity-form" onSubmit={handlePost} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide">Service Title</label>
              <input
                type="text"
                placeholder="E.g., Digital Printing"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-[#00d284]/20 focus:border-[#00d284] outline-none transition-all bg-[#1a222c] text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide">Short Description</label>
              <textarea
                placeholder="Brief description of the service..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-[#00d284]/20 focus:border-[#00d284] outline-none transition-all resize-none bg-[#1a222c] text-white"
                rows={3}
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide">Detailed Description (Optional)</label>
              <textarea
                placeholder="Full details of the service..."
                value={detailedDescription}
                onChange={(e) => setDetailedDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-[#00d284]/20 focus:border-[#00d284] outline-none transition-all min-h-[120px] resize-y bg-[#1a222c] text-white"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide">Featured Image</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#00d284] hover:bg-[#00d284]/5 transition-all group bg-[#1a222c]"
              >
                <ImageIcon className="text-gray-500 group-hover:text-[#00d284] mb-2 transition-colors" size={24} />
                <span className="text-sm text-gray-400 font-medium group-hover:text-[#00d284] transition-colors">
                  {imageFile ? imageFile.name : (imagePreview ? 'Change Image' : 'Click to upload image')}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
              />
              {imagePreview && (
                <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden border border-gray-700 shadow-sm">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#00d284] hover:bg-[#00b370] text-white py-3.5 rounded-lg font-semibold transition-all shadow-md shadow-[#00d284]/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    {editId ? <Edit2 size={18} /> : <Plus size={18} />}
                    {editId ? 'Update Service' : 'Publish Service'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* List Section */}
      <div className="w-full space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">Published Services</h2>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading services...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-20 bg-[#212b36] rounded-xl border border-gray-700 border-dashed shadow-sm">
            <ImageIcon size={40} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400 font-medium">No services published yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            <input
              type="file"
              ref={quickImageInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleQuickImageUpload}
            />
            {activities.map((activity, idx) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={activity.id}
                className="bg-[#212b36] rounded-xl p-6 shadow-[0_2px_22px_-4px_rgba(0,0,0,0.06)] flex flex-col md:flex-row gap-6 group relative"
              >
                {activity.image_url ? (
                  <div
                    className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 bg-gray-800 cursor-pointer relative group/image border border-gray-700"
                    onDoubleClick={() => triggerQuickImageUpload(activity.id)}
                    title="Double click to quickly change image"
                  >
                    <img
                      src={
                        activity.image_url.startsWith('http')
                          ? activity.image_url
                          : activity.image_url.startsWith('/assets')
                            ? activity.image_url
                            : `http://localhost:5000${activity.image_url}`
                      }
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover/image:opacity-75 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 pointer-events-none transition-opacity bg-black/40">
                      <ImageIcon className="text-white drop-shadow-md" size={24} />
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 bg-gray-800 flex items-center justify-center border border-gray-700 cursor-pointer relative group/image hover:bg-gray-700 transition-colors"
                    onDoubleClick={() => triggerQuickImageUpload(activity.id)}
                    title="Double click to upload image"
                  >
                    <ImageIcon className="text-gray-500 group-hover/image:scale-110 transition-transform" size={32} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-bold text-white leading-tight">{activity.title}</h3>
                    <div className="flex flex-col gap-2 shrink-0 md:w-32 justify-center">
                      <button
                        onClick={() => handleEdit(activity)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#00d284]/10 text-[#00d284] hover:bg-[#00d284] hover:text-white rounded-lg transition-colors font-medium text-sm"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-medium text-sm"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5 font-medium">
                    <Calendar size={14} />
                    {new Date(activity.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-gray-300 mt-3 text-sm line-clamp-2 leading-relaxed">{activity.description}</p>
                  {activity.detailed_description && (
                    <p className="text-gray-500 mt-2 text-xs italic">Includes detailed description.</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-semibold flex items-center gap-2 z-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
