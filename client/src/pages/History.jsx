import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Clock, Download, ChevronLeft, Search } from 'lucide-react';
import api from '../utils/api';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const History = () => {
    const { t } = useTranslation();
    const { user } = useStore();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/myorders');
                if (res.data.success && Array.isArray(res.data.orders)) {
                    setOrders(res.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                }
            } catch (e) {
                console.error('Fetch History Error', e);
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 5000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(searchTerm) ||
        (order.fileName && order.fileName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                        <ChevronLeft size={20} /> {t('back') || 'Back'}
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Clock className="text-blue-600" />
                        {t('order_history') || 'Order History'}
                    </h1>
                </div>

                <div className="card-3d bg-white dark:bg-gray-800 rounded-2xl overflow-hidden min-h-[500px]">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder={t('search_orders') || "Search by ID or File Name..."}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-sm font-bold text-gray-500">
                            {filteredOrders.length} {t('orders') || 'Orders'}
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-gray-400">Loading history...</div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">No orders found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-700 dark:text-gray-300">
                                    <tr>
                                        <th className="px-6 py-4 font-bold tracking-wider">Order ID</th>
                                        <th className="px-6 py-4 font-bold tracking-wider">Date</th>
                                        <th className="px-6 py-4 font-bold tracking-wider">File / Name</th>
                                        <th className="px-6 py-4 font-bold tracking-wider">Amount</th>
                                        <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                                        <th className="px-6 py-4 font-bold tracking-wider text-right">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 font-mono font-medium text-gray-900 dark:text-white">#{order.id}</td>
                                            <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{order.fileName || 'Document'}</td>
                                            <td className="px-6 py-4 font-bold">₹{order.amountTotal}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize 
                                                    ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        order.orderStatus === 'ready' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${order.orderStatus === 'delivered' ? 'bg-green-500' : order.orderStatus === 'ready' ? 'bg-blue-500' : 'bg-yellow-500'}`}></span>
                                                    {order.orderStatus || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {(order.orderStatus === 'ready' || order.orderStatus === 'delivered') ? (
                                                    <a
                                                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/invoice/${order.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-end gap-1 text-purple-600 hover:text-purple-800 font-bold hover:underline"
                                                    >
                                                        <Download size={14} /> Invoice
                                                    </a>
                                                ) : <span className="text-gray-400 italic text-xs">Processing...</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;
