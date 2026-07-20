import { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Printer, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
    case 'Shipped': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'Delivered': return 'bg-green-500/10 text-green-400 border border-green-500/20';
    case 'Cancel':
    case 'Cancelled': return 'bg-red-500/10 text-red-400 border border-red-500/20';
    default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
  }
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    let amount: number | undefined = undefined;

    if (newStatus === 'Delivered') {
      const inputAmount = window.prompt("Enter the final sale amount for this delivered order (in ₹):", "0");
      if (inputAmount === null) return; // User cancelled

      amount = parseInt(inputAmount, 10);
      if (isNaN(amount) || amount < 0) {
        alert("Invalid amount entered.");
        return;
      }
    }

    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus, amount });
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00d284]/10 rounded-lg flex items-center justify-center">
            <ShoppingCart className="text-[#00d284]" size={24} />
          </div>
          Orders Management
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#212b36] rounded-2xl p-6 overflow-hidden flex flex-col print:hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-gray-700/50">
                <th className="pb-4 font-medium whitespace-nowrap">Order ID</th>
                <th className="pb-4 font-medium whitespace-nowrap">Customer</th>
                <th className="pb-4 font-medium whitespace-nowrap">Phone</th>
                <th className="pb-4 font-medium whitespace-nowrap">Date</th>
                <th className="pb-4 font-medium whitespace-nowrap">Status</th>
                <th className="pb-4 font-medium whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 font-medium">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-700/50 hover:bg-white/5 transition-colors">
                    <td className="py-4 text-gray-300 font-medium">#{order.id.toString().padStart(4, '0')}</td>
                    <td className="py-4 text-gray-300">{order.customer_name}</td>
                    <td className="py-4 text-gray-300">{order.phone || 'N/A'}</td>
                    <td className="py-4 text-gray-300">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`${getStatusColor(order.status)} px-3 py-1.5 rounded-md text-xs font-semibold outline-none cursor-pointer appearance-none text-center`}
                        style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                      >
                        <option value="Pending" className="bg-[#212b36] text-orange-400">Pending</option>
                        <option value="Shipped" className="bg-[#212b36] text-blue-400">Shipped</option>
                        <option value="Delivered" className="bg-[#212b36] text-emerald-400">Delivered</option>
                        <option value="Cancel" className="bg-[#212b36] text-red-400">Cancel</option>
                      </select>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-[#00d284] transition-colors bg-white/5 hover:bg-[#00d284]/10 px-3 py-1.5 rounded-lg"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Order Details Modal / Print View */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm print:hidden"
              onClick={() => setSelectedOrder(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#212b36] print:bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-10 print:shadow-none print:max-w-full"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-700/50 print:border-gray-200 flex justify-between items-center bg-gray-800/50 print:bg-transparent">
                <h2 className="text-xl font-bold text-white print:text-black">Order Details: #{selectedOrder.id.toString().padStart(4, '0')}</h2>
                <div className="flex items-center gap-3 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-[#00d284] hover:bg-[#00b370] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Printer size={18} />
                    Save as PDF
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body (This area is printed) */}
              <div className="p-8 print:p-0 text-gray-300 print:text-black space-y-8" id="print-area">

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-gray-400 print:text-gray-500 mb-1">Customer Name</p>
                    <p className="font-medium text-lg">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 print:text-gray-500 mb-1">Date Placed</p>
                    <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 border-t border-gray-700/50 print:border-gray-200 pt-8">
                  <div>
                    <p className="text-sm text-gray-400 print:text-gray-500 mb-1">Email</p>
                    <p className="font-medium">{selectedOrder.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 print:text-gray-500 mb-1">Phone</p>
                    <p className="font-medium">{selectedOrder.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="border-t border-gray-700/50 print:border-gray-200 pt-8">
                  <p className="text-sm text-gray-400 print:text-gray-500 mb-2">Order Details / Needs</p>
                  <p className="font-medium bg-white/5 print:bg-gray-100 p-4 rounded-lg whitespace-pre-wrap">{selectedOrder.details}</p>
                </div>

                <div className="border-t border-gray-700/50 print:border-gray-200 pt-8">
                  <p className="text-sm text-gray-400 print:text-gray-500 mb-1">Status</p>
                  <span className={`inline-block ${getStatusColor(selectedOrder.status)} print:bg-transparent print:text-black print:border print:border-gray-300 px-3 py-1 rounded-md text-sm font-semibold`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

