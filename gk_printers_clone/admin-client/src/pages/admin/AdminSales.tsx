import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Printer, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function AdminSales() {
  const [sales, setSales] = useState<any[]>([]);
  const [filter, setFilter] = useState('All Time');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      // Filter only orders with status Delivered
      const completedOrders = res.data.orders.filter((order: any) => order.status === 'Delivered');
      setSales(completedOrders);
    } catch (error) {
      console.error('Failed to fetch sales:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredSales = useMemo(() => {
    const now = new Date();
    return sales.filter((sale) => {
      if (filter === 'All Time') return true;
      const saleDate = new Date(sale.created_at);
      
      if (filter === 'Today') {
        return saleDate.toDateString() === now.toDateString();
      }
      if (filter === 'This Month') {
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
      }
      if (filter === 'This Year') {
        return saleDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [sales, filter]);

  const totalSales = filteredSales.reduce((sum, sale) => sum + (sale.amount || 0), 0);

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ffac33]/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-[#ffac33]" size={24} />
          </div>
          Total Sales History
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="relative flex items-center bg-[#212b36] border border-gray-700 rounded-lg px-3 py-2 print:hidden">
            <Filter size={16} className="text-gray-400 mr-2" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-gray-300 text-sm outline-none appearance-none cursor-pointer pr-4"
            >
              <option value="All Time" className="bg-[#212b36]">All Time</option>
              <option value="Today" className="bg-[#212b36]">Today</option>
              <option value="This Month" className="bg-[#212b36]">This Month</option>
              <option value="This Year" className="bg-[#212b36]">This Year</option>
            </select>
          </div>
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#00d284] hover:bg-[#00b370] text-white px-4 py-2 rounded-lg font-medium transition-colors print:hidden"
          >
            <Printer size={18} />
            Print Report
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#212b36] rounded-2xl p-6 overflow-hidden flex flex-col print:bg-white print:text-black"
      >
        <div className="flex justify-between items-center mb-6 border-b border-gray-700/50 pb-4 print:border-gray-300">
          <h3 className="font-bold text-white text-lg print:text-black">
            Sales Ledger <span className="text-gray-500 text-sm ml-2 font-normal">({filter})</span>
          </h3>
          <h3 className="font-bold text-[#00d284] text-xl">Total: ₹{totalSales.toLocaleString()}</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-gray-700/50 print:border-gray-300 print:text-gray-600">
                <th className="pb-4 font-medium whitespace-nowrap">Order ID</th>
                <th className="pb-4 font-medium whitespace-nowrap">Customer</th>
                <th className="pb-4 font-medium whitespace-nowrap">Date</th>
                <th className="pb-4 font-medium whitespace-nowrap">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500 font-medium print:text-gray-400">
                    No sales recorded for this period. Mark an order as "Delivered" to add it here.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-700/50 print:border-gray-200 hover:bg-white/5 transition-colors">
                    <td className="py-4 text-gray-300 print:text-gray-700 font-medium">#{sale.id.toString().padStart(4, '0')}</td>
                    <td className="py-4 text-gray-300 print:text-gray-700">{sale.customer_name}</td>
                    <td className="py-4 text-gray-300 print:text-gray-700">{new Date(sale.created_at).toLocaleDateString()}</td>
                    <td className="py-4 font-bold text-[#ffac33] print:text-black">₹{sale.amount || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
