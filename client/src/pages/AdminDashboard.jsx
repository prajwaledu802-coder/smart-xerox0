import { useEffect, useState } from 'react';
import api from '../utils/api';
import Button from '../components/ui/Button';
import { RefreshCw, CheckCircle, Truck, Download, FileText, Check, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, pending: 0, total: 0 });

    const fetchOrders = async () => {
        try {
            const res = await api.get('/admin/orders');
            if (res.data.success) {
                setOrders(res.data.orders);
                // Calc stats
                const revenue = res.data.orders.reduce((acc, o) => acc + (o.amountTotal || 0), 0);
                const pending = res.data.orders.filter(o => o.orderStatus !== 'delivered').length;
                setStats({ revenue, pending, total: res.data.orders.length });
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/admin/order/${id}`, { status });
            fetchOrders();
        } catch (err) {
            alert('Update Failed');
        }
    };

    const getChartData = () => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString(); // Use local date string comparison
        }).reverse();

        const data = last7Days.map(date => {
            const dayRevenue = orders
                .filter(o => new Date(o.createdAt).toLocaleDateString() === date)
                .reduce((acc, o) => acc + (parseFloat(o.amountTotal) || 0), 0);
            return { date, value: dayRevenue };
        });
        // Check if we have any data, otherwise use Demo Data for visualization
        const totalRev = data.reduce((acc, d) => acc + d.value, 0);
        if (totalRev === 0) {
            return [
                { date: 'Mon', value: 150 },
                { date: 'Tue', value: 300 },
                { date: 'Wed', value: 200 },
                { date: 'Thu', value: 450 },
                { date: 'Fri', value: 100 },
                { date: 'Sat', value: 50 },
                { date: 'Sun', value: 500 }
            ];
        }
        return data;
    };

    return (
        <div className="min-h-screen pt-24 px-4 bg-gray-100 dark:bg-gray-900 pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold dark:text-white flex items-center gap-2">
                        Admin Dashboard <span className="text-sm font-normal text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded-full">Live</span>
                    </h1>
                    <Button onClick={fetchOrders} variant="secondary" className="p-2 aspect-square"><RefreshCw size={20} /></Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-6">
                        <StatCard title="Total Revenue" value={`Rs. ${stats.revenue || 0}`} icon={<TrendingUp size={24} className="text-green-500" />} />
                        <StatCard title="Active Orders" value={stats.pending || 0} icon={<FileText size={24} className="text-blue-500" />} />
                        <StatCard title="Total Orders" value={stats.total || 0} icon={<CheckCircle size={24} className="text-purple-500" />} />
                    </div>
                    <div className="lg:col-span-2 glass-card p-6 flex flex-col">
                        <h3 className="text-sm text-gray-500 uppercase font-medium mb-6">Spending Analysis (Last 7 Days)</h3>
                        <SpendingGraph data={getChartData()} />
                    </div>
                </div>

                {/* Section 1: New Requests */}
                <h2 className="text-xl font-bold dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
                    New Requests (Accept Needed)
                </h2>
                <div className="glass-card overflow-hidden mb-8 border-l-4 border-yellow-500">
                    <OrderTable
                        orders={orders.filter(o => o.orderStatus === 'received')}
                        onUpdate={updateStatus}
                    />
                </div>

                {/* Section 2: Processing */}
                <h2 className="text-xl font-bold dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    Processing & Ready (Deliver Needed)
                </h2>
                <div className="glass-card overflow-hidden border-l-4 border-blue-500">
                    <OrderTable
                        orders={orders.filter(o => ['printing', 'ready'].includes(o.orderStatus))}
                        onUpdate={updateStatus}
                    />
                </div>

                {/* Section 3: History */}
                <details className="mt-8 group">
                    <summary className="text-gray-500 font-bold cursor-pointer list-none flex items-center gap-2">
                        <span>Show Completed Orders History ({orders.filter(o => o.orderStatus === 'delivered').length})</span>
                    </summary>
                    <div className="mt-4 glass-card overflow-hidden opacity-75">
                        <OrderTable
                            orders={orders.filter(o => o.orderStatus === 'delivered')}
                            onUpdate={updateStatus}
                        />
                    </div>
                </details>

            </div>
        </div>
    );
};

const OrderTable = ({ orders, onUpdate }) => {
    if (orders.length === 0) return <div className="p-8 text-center text-gray-400 italic">No orders in this section.</div>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Files</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4">
                                <span className="font-mono text-xs text-gray-400">#{order.id}</span>
                                <div className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </td>
                            <td className="px-6 py-4 dark:text-gray-200">
                                <div className="font-bold">{order.User?.name || 'Guest'}</div>
                                <a href={`tel:${order.User?.mobile}`} className="text-xs text-blue-500 hover:underline">{order.User?.mobile}</a>
                            </td>
                            <td className="px-6 py-4 dark:text-gray-200">
                                <div className="flex flex-col gap-2">
                                    {order.items && order.items.map(item => (
                                        <div key={item.id} className="flex items-center gap-2 group">
                                            <div className="text-xs text-gray-500 truncate max-w-[150px]" title={item.fileName}>
                                                {item.fileName} <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-1 rounded">{item.pages}p</span>
                                            </div>
                                            <a
                                                href={`http://localhost:5000${item.fileUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:scale-110 transition-all"
                                                title="Download File"
                                            >
                                                <Download size={14} />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4 font-bold dark:text-gray-200">
                                Rs. {order.amountTotal}
                                <div className={`text-[10px] uppercase font-bold mt-1 ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-orange-500'}`}>{order.paymentStatus}</div>
                            </td>
                            <td className="px-6 py-4">
                                <StatusBadge status={order.orderStatus} />
                                {order.invoiceUrl && (
                                    <a href={`http://localhost:5000${order.invoiceUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-purple-600 mt-2 hover:underline font-bold">
                                        <FileText size={10} /> Invoice
                                    </a>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-4">
                                    {order.orderStatus === 'received' && (
                                        <ActionBtn onClick={() => onUpdate(order.id, 'ready')} icon={<CheckCircle size={24} />} color="text-green-500 bg-green-50 hover:bg-green-100" />
                                    )}
                                    {['printing', 'ready'].includes(order.orderStatus) && (
                                        <ActionBtn onClick={() => onUpdate(order.id, 'delivered')} icon={<Truck size={24} />} color="text-blue-500 bg-blue-50 hover:bg-blue-100" />
                                    )}
                                    {order.orderStatus === 'delivered' && (
                                        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400"><Check size={20} /></div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const StatCard = ({ title, value, icon }) => (
    <div className="glass-card p-6 flex items-center justify-between">
        <div>
            <h3 className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-wider">{title}</h3>
            <p className="text-3xl font-black dark:text-white">{value}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">{icon}</div>
    </div>
);

const ActionBtn = ({ onClick, icon, color }) => (
    <button onClick={onClick} className={`p-3 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-sm ${color}`}>
        {icon}
    </button>
);

const StatusBadge = ({ status }) => {
    const styles = {
        received: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        printing: 'bg-orange-100 text-orange-700 border-orange-200',
        ready: 'bg-blue-100 text-blue-700 border-blue-200',
        delivered: 'bg-green-100 text-green-700 border-green-200'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>{status}</span>;
};

const SpendingGraph = ({ data }) => {
    // Styling: Neon/Glassmorphism look
    const maxVal = Math.max(...data.map(d => d.value), 100);

    return (
        <div className="flex-1 flex items-end justify-between gap-3 h-48 pt-8 px-4 relative">
            {/* Background Grid */}
            <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
                <div className="border-t border-gray-500 w-full"></div>
                <div className="border-t border-gray-500 w-full"></div>
                <div className="border-t border-gray-500 w-full"></div>
                <div className="border-t border-gray-500 w-full"></div>
                <div className="border-t border-gray-500 w-full"></div>
            </div>

            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group z-10 h-full justify-end">

                    {/* Bar Container */}
                    <div className="relative w-full max-w-[40px] h-full flex items-end">
                        {/* The Bar */}
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(d.value / maxVal) * 100}%` }}
                            transition={{ type: 'spring', damping: 20, delay: i * 0.1 }}
                            className="w-full rounded-t-lg relative overflow-hidden bg-gradient-to-t from-blue-600 via-purple-500 to-pink-500 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/60 transition-all duration-300 min-h-[6px]"
                        >
                            {/* Inner Shine */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </motion.div>

                        {/* Floating Tooltip Value */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded shadow-xl pointer-events-none whitespace-nowrap z-20">
                            Rs.{d.value}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                    </div>

                    {/* Date Label */}
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider group-hover:text-blue-500 transition-colors">
                        {d.date.split('/')[0]}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default AdminDashboard;
