import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';
import axios from 'axios';

interface Review {
  id: string | number;
  name: string;
  rating: number;
  text: string;
  created_at?: string;
  date?: string;
}

const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newText, setNewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reviews');
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newText.trim() || !newPhone.trim()) return;

    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:5000/api/reviews', {
        name: newName.trim(),
        phone: newPhone.trim(),
        rating: newRating,
        text: newText.trim()
      });
      
      setNewName('');
      setNewPhone('');
      setNewText('');
      setNewRating(5);
      setShowSuccess(true);
      fetchReviews(); // Refresh the list
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="pt-24 pb-8 px-4 md:px-8 bg-gray-50 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="mb-4 flex justify-center">
            <h3 className="text-[#F47C20] font-montserrat font-bold tracking-[0.3em] uppercase text-xs md:text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Client Feedback
            </h3>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-gray-900 mb-6">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC527] to-[#f17a3a]">Clients Say</span>
          </h2>
          <p className="font-poppins text-gray-600 text-lg max-w-2xl mx-auto">
            Read reviews from our satisfied customers or share your own experience working with us.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Add Review Form */}
          <div className="lg:w-1/3">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-32">
              <h3 className="font-montserrat font-bold text-2xl text-gray-900 mb-6">Leave a Review</h3>
              
              <AnimatePresence>
                {showSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 font-poppins text-sm border border-green-100"
                  >
                    Thank you for your feedback! Your review has been added.
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10A7FF] focus:border-transparent outline-none font-poppins text-sm transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10A7FF] focus:border-transparent outline-none font-poppins text-sm transition-all"
                    placeholder="e.g. +91 9876543210"
                  />
                </div>
                
                <div>
                  <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star className={`w-8 h-8 ${star <= newRating ? 'fill-[#FFC527] text-[#FFC527]' : 'fill-gray-100 text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">Your Feedback</label>
                  <textarea
                    required
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10A7FF] focus:border-transparent outline-none font-poppins text-sm transition-all resize-none"
                    placeholder="Tell us about your experience..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-[#B33939] border-2 border-[#B33939] font-semibold py-4 rounded-xl transition-all duration-300 uppercase tracking-widest text-sm hover:bg-[#B33939] hover:text-white disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:w-2/3 space-y-6 flex flex-col">
            <AnimatePresence>
              {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-montserrat font-bold text-lg text-gray-900">{review.name}</h4>
                      <span className="text-gray-400 text-sm font-poppins">{new Date(review.created_at || review.date || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-[#FFC527] text-[#FFC527]' : 'fill-gray-100 text-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="font-poppins text-gray-600 leading-relaxed">
                    "{review.text}"
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {reviews.length > 3 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-[#B33939] border-2 border-[#B33939] rounded-full font-montserrat font-bold text-sm tracking-wider uppercase hover:bg-[#B33939] hover:text-white transition-colors"
                >
                  {showAllReviews ? 'Show Less' : 'See More Reviews'}
                </button>
              </div>
            )}
            
            {reviews.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 border-dashed">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="font-poppins text-gray-500">No reviews yet. Be the first to leave one!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
