import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, Calendar, User, X, Send, ShoppingCart, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// WhatsApp Icon Component
const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

interface NormalizedMessage {
  id: string; // 'msg-1' or 'order-1'
  name: string;
  email: string;
  phone: string;
  message: string;
  type: 'Inquiry' | 'Order';
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<NormalizedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<NormalizedMessage | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchMessagesAndOrders();
  }, []);

  const fetchMessagesAndOrders = async () => {
    try {
      const [messagesRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/contact/messages'),
        axios.get('http://localhost:5000/api/orders')
      ]);

      const msgs: NormalizedMessage[] = messagesRes.data.messages.map((m: any) => ({
        id: `msg-${m.id}`,
        name: `${m.first_name} ${m.last_name}`.trim(),
        email: m.email,
        phone: m.phone,
        message: m.message,
        type: 'Inquiry',
        created_at: m.created_at
      }));

      const orders: NormalizedMessage[] = ordersRes.data.orders.map((o: any) => ({
        id: `order-${o.id}`,
        name: o.customer_name,
        email: o.email,
        phone: o.phone,
        message: o.details,
        type: 'Order',
        created_at: o.created_at
      }));

      const all = [...msgs, ...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setMessages(all);
    } catch (error) {
      console.error('Failed to fetch communications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = () => {
    if (!replyingTo || !replyText.trim()) return;

    if (!replyingTo.phone) {
      alert("This customer did not provide a phone number.");
      return;
    }

    const cleanPhone = replyingTo.phone.replace(/\D/g, '');
    const contextText = replyingTo.type === 'Order' ? `regarding your order: "${replyingTo.message}"` : `in response to your message: "${replyingTo.message}"`;
    const fullReply = `*SR Digital*\n\nHi ${replyingTo.name}, ${contextText}\n\n${replyText}`;
    const message = encodeURIComponent(fullReply);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;

    window.open(whatsappUrl, '_blank');

    setReplyingTo(null);
    setReplyText('');
  };

  if (loading) return <div className="p-8">Loading messages...</div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <Mail className="text-[#00d284]" /> Customer Messages
        </h1>
        <span className="bg-[#00d284]/10 text-[#00d284] py-1.5 px-4 rounded-lg text-sm font-semibold">
          {messages.length} Total
        </span>
      </div>

      <div className="grid gap-6">
        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={msg.id} 
            className="bg-[#212b36] rounded-xl p-6 shadow-[0_2px_22px_-4px_rgba(0,0,0,0.06)] relative overflow-hidden group"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${msg.type === 'Order' ? 'bg-[#3399ff]' : 'bg-[#00d284]'} scale-y-0 group-hover:scale-y-100 transition-transform origin-top`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${msg.type === 'Order' ? 'bg-[#1b4e85]/20 border-[#1b4e85]/50' : 'bg-gray-800 border-gray-700'}`}>
                  {msg.type === 'Order' ? <ShoppingCart size={20} className="text-[#3399ff]" /> : <MessageSquare size={20} className="text-[#00d284]" />}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white text-lg">{msg.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${msg.type === 'Order' ? 'bg-[#3399ff]/10 text-[#3399ff]' : 'bg-[#00d284]/10 text-[#00d284]'}`}>
                      {msg.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    {msg.email && (
                      <span className="flex items-center gap-1.5 text-sm text-gray-400 font-medium">
                        <Mail size={14} className="text-gray-500" /> {msg.email}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-sm text-gray-400 font-medium">
                      <Phone size={14} className="text-gray-500" /> {msg.phone || 'No phone'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                  <Calendar size={14} />
                  {new Date(msg.created_at).toLocaleString()}
                </span>
                <button 
                  onClick={() => setReplyingTo(msg)}
                  className="flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <WhatsAppIcon size={16} />
                  WhatsApp
                </button>
              </div>
            </div>
            
            <div className="bg-[#1a222c] rounded-lg p-5 mt-4 border border-gray-700">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">{msg.message}</p>
            </div>
          </motion.div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-20 bg-[#212b36] rounded-xl border border-gray-700 border-dashed shadow-[0_2px_22px_-4px_rgba(0,0,0,0.06)]">
            <Mail size={40} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 font-medium">No communications received yet.</p>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {replyingTo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setReplyingTo(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#212b36] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 border-b border-gray-700/50 flex justify-between items-center bg-gray-800/50">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#25D366]"><WhatsAppIcon size={20} /></span> Reply via WhatsApp
                </h2>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">To Phone:</label>
                  <div className="bg-gray-800/50 px-4 py-2 rounded-lg text-gray-300 text-sm border border-gray-700">
                    {replyingTo.phone || 'No phone number provided'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Message:</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your WhatsApp message here..."
                    className="w-full bg-[#1a222c] border border-gray-700 text-white rounded-lg p-4 h-32 focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] transition-all resize-none text-sm placeholder-gray-600"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-700/50 flex justify-end gap-3 bg-gray-800/50">
                <button
                  onClick={() => setReplyingTo(null)}
                  className="px-4 py-2 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || !replyingTo.phone}
                  className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] disabled:bg-gray-700 disabled:text-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  <Send size={16} /> Open WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
