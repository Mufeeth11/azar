import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Plus, Trash2, Calendar, Image as ImageIcon, Edit2, X } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setImagePreview(activity.image_url ? `http://localhost:5000${activity.image_url}` : '');
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

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
      } else {
        await axios.post('http://localhost:5000/api/activities', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Column */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Plus size={20} className="text-[#10A7FF]" />
              {editId ? 'Edit Service' : 'Post New Service'}
            </h2>
            {editId && (
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            )}
          </div>

          <form onSubmit={handlePost} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Service Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Premium Business Cards"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#10A7FF] focus:ring-4 focus:ring-[#10A7FF]/10 outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Short Description (For Grid)</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary shown on the home page..."
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#10A7FF] focus:ring-4 focus:ring-[#10A7FF]/10 outline-none transition-all text-sm resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Detailed Description (For Dedicated Page)</label>
              <textarea
                value={detailedDescription}
                onChange={(e) => setDetailedDescription(e.target.value)}
                placeholder="Long, detailed explanation shown when a user clicks 'View Details'..."
                rows={6}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#10A7FF] focus:ring-4 focus:ring-[#10A7FF]/10 outline-none transition-all text-sm resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image Upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#10A7FF] focus:ring-4 focus:ring-[#10A7FF]/10 outline-none transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#10A7FF]/10 file:text-[#10A7FF] hover:file:bg-[#10A7FF]/20"
              />
              {imagePreview && (
                <div className="mt-3 rounded-lg overflow-hidden border border-gray-100 h-32 bg-gray-100 flex items-center justify-center relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#10A7FF] hover:bg-[#0A85CC] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 mt-4"
            >
              {isSubmitting ? (editId ? 'Updating...' : 'Posting...') : (editId ? 'Update Service' : 'Post Service')}
            </button>
          </form>
        </div>
      </div>

      {/* List Column */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Published Services</h2>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading services...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
            <ImageIcon size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No services published yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {activities.map((activity, idx) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={activity.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 group relative"
              >
                {activity.image_url ? (
                  <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                    <img src={`http://localhost:5000${activity.image_url}`} alt={activity.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border border-gray-100">
                    <ImageIcon className="text-gray-300" size={32} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{activity.title}</h3>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(activity)}
                        className="text-gray-400 hover:text-blue-500 p-2 bg-gray-50 hover:bg-blue-50 rounded-lg shrink-0 transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="text-gray-400 hover:text-red-500 p-2 bg-gray-50 hover:bg-red-50 rounded-lg shrink-0 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5 font-medium">
                    <Calendar size={14} />
                    {new Date(activity.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-gray-600 mt-3 text-sm line-clamp-2 leading-relaxed">{activity.description}</p>
                  {activity.detailed_description && (
                    <p className="text-gray-400 mt-2 text-xs italic">Includes detailed description.</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
