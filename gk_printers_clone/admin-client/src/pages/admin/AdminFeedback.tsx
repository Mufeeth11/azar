import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, MessageSquare, Trash2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Review {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  rating: number;
  text: string;
  created_at: string;
}

export default function AdminFeedback() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reviews');
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/reviews/${id}`);
      fetchReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  if (loading) return <div className="p-8 text-gray-400">Loading feedback...</div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 tracking-wide">
          <MessageSquare className="text-[#00d284]" /> Client Feedback
        </h1>
        <span className="bg-[#00d284]/10 text-[#00d284] py-1.5 px-4 rounded-lg text-sm font-semibold">
          {reviews.length} Total
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((review, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={review.id} 
            className="bg-[#212b36] rounded-xl p-6 shadow-[0_2px_22px_-4px_rgba(0,0,0,0.06)] relative group flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-white text-lg">{review.name}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-400 font-medium">
                  <Calendar size={14} className="text-gray-500" />
                  {formatDate(review.created_at)}
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < review.rating ? 'fill-[#FFC527] text-[#FFC527]' : 'fill-gray-700 text-gray-700'} />
                ))}
              </div>
            </div>
            
            <div className="bg-[#1a222c] rounded-lg p-5 flex-1 border border-gray-700 mb-4">
              <p className="text-gray-300 leading-relaxed italic text-sm">"{review.text}"</p>
            </div>

            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleDelete(review.id)}
                className="text-red-400 hover:text-white p-2 hover:bg-red-500 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium bg-red-500/10"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </motion.div>
        ))}

        {reviews.length === 0 && (
          <div className="col-span-full text-center py-20 bg-[#212b36] rounded-xl border border-gray-700 border-dashed shadow-[0_2px_22px_-4px_rgba(0,0,0,0.06)]">
            <MessageSquare size={40} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400 font-medium">No feedback received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
