import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contact/messages');
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return <div className="p-8">Loading messages...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Customer Messages</h1>
        <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-sm font-semibold">
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
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-[#10A7FF] scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                  <User size={20} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{msg.first_name} {msg.last_name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Mail size={14} /> {msg.email}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Phone size={14} /> {msg.phone || 'No phone'}
                    </span>
                  </div>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Calendar size={14} />
                {formatDate(msg.created_at)}
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-5 mt-4 border border-gray-100">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
            </div>
          </motion.div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
            <Mail size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No messages received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
