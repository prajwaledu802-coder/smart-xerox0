import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useStore from '../store/useStore';
import Button from '../components/ui/Button';
import { FileText, Clock, CheckCircle, AlertCircle, Download, Plus, Home, Briefcase, User, TrendingUp, Users, ShieldCheck, ChevronRight, Wallet, MessageCircle, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// --- Helper Components Defined FIRST to prevent hoisting/Reference Errors ---

const PromoCard = ({ title, desc, icon: Icon, color, tag }) => {
    const colorMap = {
        orange: 'from-orange-500 to-red-500 shadow-orange-500/30',
        blue: 'from-blue-500 to-cyan-500 shadow-blue-500/30',
        purple: 'from-purple-500 to-pink-500 shadow-purple-500/30'
    };
    const gradient = colorMap[color] || 'from-gray-500 to-gray-700';

    return (
        <div className={`relative group min-h-[280px] p-8 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-xl bg-white dark:bg-gray-800 flex flex-col justify-between`}>
            {/* Gradient Background Effect on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

            <div className="flex justify-between items-start relative z-10">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg transform transition-transform group-hover:scale-110`}>
                    <Icon size={32} />
                </div>
                <span className={`text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 group-hover:bg-white group-hover:text-${color}-600 transition-colors shadow-sm`}>
                    {tag}
                </span>
            </div>

            <div className="relative z-10 mt-6">
                <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all">
                    {title}
                </h3>
                <p className="text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    {desc}
                </p>
            </div>

            {/* Decorative Circle */}
            <div className={`absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br ${gradient} rounded-full opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-700`} />
        </div>
    );
};

const LiveOrderTracker = ({ order, t }) => {
    // Status Logic matched to Backend Enum (received, ready, delivered)
    const steps = ['received', 'ready', 'delivered'];

    // Fallback: If status is unknown (e.g. legacy 'pending'), default to 0
    const stepIndex = steps.indexOf(order?.orderStatus);
    const currentStep = stepIndex !== -1 ? stepIndex : 0;

    return (
        <div className="card-3d p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                    <h4 className="font-bold text-blue-800 dark:text-blue-300 text-lg flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                        {t('track_latest') || "Live Status: Latest Order"}
                    </h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">Order #{order?.id} • {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</p>
                </div>
                <div className="text-right">
                    <p className="font-black text-2xl text-blue-700 dark:text-blue-300">₹{order?.amountTotal || 0}</p>
                </div>
            </div>

            <div className="relative flex justify-between items-center z-10">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

                {/* Received/Pending */}
                <div className={`relative z-10 flex flex-col items-center gap-2 ${currentStep >= 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 0 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-100 border-gray-300'}`}>
                        <Clock size={14} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-gray-900 px-1">{t('pending') || "Received"}</span>
                </div>

                {/* Ready/Approved */}
                <div className={`relative z-10 flex flex-col items-center gap-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-100 border-gray-300'}`}>
                        {currentStep === 1 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>}
                        <CheckCircle size={14} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-gray-900 px-1">{t('approved') || "Approved"}</span>
                </div>

                {/* Delivered */}
                <div className={`relative z-10 flex flex-col items-center gap-2 ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'bg-green-600 border-green-600 text-white' : 'bg-gray-100 border-gray-300'}`}>
                        <CheckCircle size={14} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-gray-900 px-1">{t('delivered') || "Delivered"}</span>
                </div>
            </div>
        </div>
    );
};

const Footer = ({ t }) => (
    <footer className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-800 text-center pb-8">
        <p className="font-bold text-gray-500 dark:text-gray-400 mb-2">
            {t('lic_footer') || "Licensed by Smart Xerox & Co. \u00A9 2024"}
        </p>
        <p className="text-xs text-gray-400 font-medium">
            v4.2.0 • {t('made_with_love') || "Made with \u2764\uFE0F for Students"}
        </p>
    </footer>
);

const StatCard = ({ icon: Icon, label, value, subtext, color }) => (
    <div className={`card-3d p-6 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 bg-${color}-50 dark:bg-${color}-900/10 border-l-4 border-${color}-500`}>
        <div className={`absolute top-0 right-0 p-4 opacity-5 transform group-hover:scale-125 transition-transform duration-700 text-${color}-600`}>
            {/* Safety check for Icon */}
            {Icon && <Icon size={100} />}
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 card-3d rounded-2xl text-${color}-600 dark:text-${color}-400`}>
                    {Icon && <Icon size={24} />}
                </div>
                <span className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs">{label}</span>
            </div>
            <h3 className="text-5xl font-black text-gray-800 dark:text-gray-100 mb-2">{value}</h3>
            <p className={`text-${color}-600 dark:text-${color}-400 font-semibold flex items-center gap-2`}>
                <TrendingUp size={16} /> {subtext}
            </p>
        </div>
    </div>
);

const ServiceRow = ({ name, label, p1, p2, t }) => (
    <div className="group flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors border-b last:border-0 border-gray-200 dark:border-gray-700">
        <div className="font-bold text-gray-800 dark:text-white text-lg mb-2 md:mb-0 w-full md:w-1/3">{t(name) || label}</div>
        <div className="flex w-full md:w-2/3 justify-between gap-4">
            <div className="flex-1 card-3d p-3 text-center">
                <div className="text-xs text-gray-400 uppercase font-bold mb-1">{t('single_side') || 'Single'}</div>
                <div className="font-bold text-blue-600 dark:text-blue-400">{p1}</div>
            </div>
            <div className="flex-1 card-3d p-3 text-center">
                <div className="text-xs text-gray-400 uppercase font-bold mb-1">{t('double_side') || 'Double'}</div>
                <div className="font-bold text-blue-600 dark:text-blue-400">{p2}</div>
            </div>
        </div>
    </div>
);

const OrderCard = ({ order, t }) => {
    // Check Status and Apply Color
    const statusColors = {
        pending: 'text-yellow-600 bg-yellow-100',
        received: 'text-yellow-600 bg-yellow-100',
        printing: 'text-blue-600 bg-blue-100',
        completed: 'text-green-600 bg-green-100',
        ready: 'text-blue-600 bg-blue-100',
        delivered: 'text-purple-600 bg-purple-100'
    };

    return (
        <motion.div
            variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            whileHover={{ y: -8, rotateX: 2 }}
            className="card-3d p-6 relative group"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 card-3d rounded-xl text-gray-600 dark:text-gray-300">
                    <FileText size={20} />
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${statusColors[order?.orderStatus] || 'text-gray-500 bg-gray-200'}`}>
                    {order?.orderStatus || 'Unknown'}
                </span>
            </div>

            <h3 className="text-xl font-bold mb-2 truncate text-gray-800 dark:text-white" title={order?.fileName}>
                {/* Display first item name or generic */}
                {order?.items && order.items.length > 0 ? `${order.items.length} Items` : (order?.fileName || 'Order')}
            </h3>
            <p className="text-sm text-gray-400 font-medium mb-6">
                {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date'} • ID: #{order?.id}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="font-black text-2xl text-gray-800 dark:text-white">
                    ₹{order?.amountTotal || 0}
                </div>
                {(order?.orderStatus === 'ready' || order?.orderStatus === 'delivered') ? (
                    <a href={`http://localhost:5000/invoice/${order.id}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 flex items-center gap-1 font-bold text-sm bg-purple-50 px-3 py-1 rounded-full transition-colors">
                        <Download size={16} /> Invoice
                    </a>
                ) : (
                    <span className="text-gray-400 text-xs font-bold uppercase flex items-center gap-1">
                        <Clock size={12} /> Processing
                    </span>
                )}
            </div>
        </motion.div>
    );
};

// --- Main Dashboard Component ---

const Dashboard = () => {
    const { t } = useTranslation();
    const { user } = useStore();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('home');
    const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0, saved: 0 });
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [graphData, setGraphData] = useState(null);

    useEffect(() => {
        // Dynamic Quote Logic: Day of Year % 5
        try {
            const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
            setQuoteIndex(dayOfYear % 5);
        } catch (e) { console.error('Quote Error', e); }
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/myorders');
                if (res.data.success && Array.isArray(res.data.orders)) {
                    const sorted = res.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setOrders(sorted);

                    // 1. Calculate stats (Safe Parsing)
                    const spent = sorted.reduce((acc, curr) => acc + (Number(curr.amountTotal) || 0), 0);
                    setStats({
                        totalOrders: sorted.length,
                        totalSpent: spent,
                        saved: Math.floor(spent * 0.2) // Mock savings 20%
                    });

                    // 2. Calculate Spending Analysis (Last 7 Days)
                    const last7Days = Array(7).fill(0);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Normalize today to midnight

                    sorted.forEach(order => {
                        const orderDate = new Date(order.createdAt);
                        orderDate.setHours(0, 0, 0, 0); // Normalize order date to midnight

                        const diffTime = today - orderDate;
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays >= 0 && diffDays < 7) {
                            const idx = 6 - diffDays; // 0=oldest (6 days ago), 6=today
                            last7Days[idx] += (Number(order.amountTotal) || 0);
                        }
                    });

                    // Check if Empty
                    const totalVal = last7Days.reduce((a, b) => a + b, 0);
                    if (totalVal === 0) {
                        // DEMO MODE: Show nice pattern if no data
                        setGraphData({ values: [30, 50, 40, 70, 60, 90, 80], raw: [0, 0, 0, 0, 0, 0, 0] });
                    } else {
                        // Normalize for graph height (0-100%)
                        const maxVal = Math.max(...last7Days, 100);
                        const normalized = last7Days.map(v => (v / maxVal) * 100);
                        setGraphData({ values: normalized, raw: last7Days });
                    }
                } else {
                    // Fallback absolute
                    setGraphData({ values: [30, 50, 40, 70, 60, 90, 80], raw: [0, 0, 0, 0, 0, 0, 0] });
                }
            } catch (e) {
                console.error('Fetch Orders Error', e);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchOrders();
    }, [user]);

    const variants = {
        hidden: { opacity: 0, y: 30, rotateX: 10 },
        visible: { opacity: 1, y: 0, rotateX: 0 }
    };

    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 pb-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto perspective-1000">

                {/* 3D Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl font-black text-gray-800 dark:text-gray-100 tracking-tight text-3d"
                        >
                            {t('dashboard') || 'Dashboard'}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-500 dark:text-gray-400 mt-2 text-xl font-medium"
                        >
                            {t('welcome') || 'Welcome back'}, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">{user?.name}</span>
                        </motion.p>
                    </div>

                    <div className="flex card-3d p-2 rounded-2xl">
                        {[
                            { id: 'home', icon: Home, label: t('overview') || 'Overview' },
                            { id: 'services', icon: Briefcase, label: t('services') || 'Services' },
                            { id: 'profile', icon: User, label: t('profile') || 'Profile' },
                            { id: 'support', icon: MessageCircle, label: t('support') || 'Support' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 transform scale-105'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-blue-500'
                                    }`}
                            >
                                <tab.icon size={20} />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[600px]">
                    {activeTab === 'home' && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={variants}
                            transition={{ type: 'spring', damping: 20 }}
                            className="space-y-10"
                        >
                            {/* Actions */}
                            <div className="flex justify-end">
                                <Button onClick={() => navigate('/order')} className="gap-2 text-lg">
                                    <Plus size={24} /> {t('newOrder') || 'New Order'}
                                </Button>
                            </div>

                            {/* 1. Stats Block (Top Priority) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    icon={FileText}
                                    label={t('total_orders')}
                                    value={stats?.totalOrders || 0}
                                    color="purple"
                                    subtext="Lifetime Orders"
                                />
                                <StatCard
                                    icon={Wallet}
                                    label={t('total_spent')}
                                    value={`₹${stats?.totalSpent || 0}`}
                                    color="blue"
                                    subtext="Total Invested"
                                />
                                <StatCard
                                    icon={CheckCircle}
                                    label={t('saved')}
                                    value={`₹${stats?.saved || 0}`}
                                    color="green"
                                    subtext="Money Saved"
                                />
                                <StatCard
                                    icon={Users}
                                    label={t('trusted_users')}
                                    value="1.2k+"
                                    color="orange"
                                    subtext="Community"
                                />
                            </div>

                            {/* 3. Spending Graph (Enhanced Premium) */}
                            <div className="card-3d p-8 relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                                <div className="mb-8 flex justify-between items-center z-10">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100 flex items-center gap-3">
                                            <TrendingUp className="text-blue-600" size={28} />
                                            {t('spending_analysis') || "Spending Analysis"}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1 pl-10">Your last 7 days of activity</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">{t('last_7_days') || "Last 7 Days"}</span>
                                    </div>
                                </div>

                                {/* Graph Area with Grid Background */}
                                <div className="relative flex-1 flex items-end justify-between gap-4 px-4 pb-2 z-10 w-full">
                                    {/* Background Grid Lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="w-full h-px bg-gray-500"></div>
                                        ))}
                                    </div>

                                    {/* Data Logic with Fallback for Zero Data */}
                                    {(() => {
                                        let values = (graphData && graphData.values) ? graphData.values : [0, 0, 0, 0, 0, 0, 0];
                                        let raw = (graphData && graphData.raw) ? graphData.raw : [0, 0, 0, 0, 0, 0, 0];

                                        // If total sum is 0, use DEMO DATA to make it look good
                                        const sum = values.reduce((a, b) => a + b, 0);
                                        const isDemo = sum === 0;

                                        if (isDemo) {
                                            values = [30, 50, 40, 70, 60, 90, 80];
                                            raw = [150, 250, 200, 350, 300, 450, 400]; // Mock amounts
                                        }

                                        return values.map((h, i) => (
                                            <div key={i} className="flex flex-col items-center gap-3 group flex-1 h-full justify-end">
                                                {/* Explicit Height Container for Bar */}
                                                <div className="relative w-full max-w-[50px] h-[200px] flex items-end border-b border-gray-100 dark:border-gray-700">
                                                    <motion.div
                                                        key={`bar-${i}-${isDemo ? 'demo' : 'live'}`} // Force re-render on mode switch
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${h}%` }}
                                                        transition={{ duration: 1.5, type: 'spring', bounce: 0.5, delay: i * 0.2 }} // Slower, more bouncy animation
                                                        className={`w-full rounded-t-xl relative overflow-hidden min-h-[10px] shadow-lg ${isDemo ? 'bg-gradient-to-t from-gray-400 via-gray-300 to-gray-200 opacity-60' : 'bg-gradient-to-t from-blue-600 via-purple-500 to-pink-500 shadow-blue-500/30'}`}
                                                    >
                                                        {/* Shine Effect */}
                                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </motion.div>

                                                    {/* Floating Tooltip */}
                                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg shadow-xl whitespace-nowrap z-20 pointer-events-none">
                                                        {isDemo ? 'Demo: ' : ''}₹{raw[i]}
                                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
                                                    {new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                                                </span>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>

                            {/* 3. Recent Orders List */}
                            <div className="card-3d overflow-hidden bg-white dark:bg-gray-800 rounded-2xl">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                                        <Clock size={20} className="text-blue-600" />
                                        {t('recent_orders') || 'Recent Orders'}
                                    </h2>
                                    <Button onClick={() => navigate('/history')} variant="secondary" className="text-xs h-8">
                                        {t('view_all') || 'View All'}
                                    </Button>
                                </div>

                                {loading ? (
                                    <div className="p-8 text-center text-gray-400">Loading...</div>
                                ) : orders.length === 0 ? (
                                    <div className="p-12 text-center text-gray-500">
                                        <p>{t('no_orders') || 'No orders yet'}</p>
                                        <Button onClick={() => navigate('/order')} className="mt-4">{t('create_first_order') || 'Order Now'}</Button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-700 dark:text-gray-300">
                                                <tr>
                                                    <th className="px-6 py-4 font-bold tracking-wider">Order ID</th>
                                                    <th className="px-6 py-4 font-bold tracking-wider">File / Name</th>
                                                    <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                                                    <th className="px-6 py-4 font-bold tracking-wider text-right">Invoice</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                {orders.slice(0, 5).map(order => (
                                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                        <td className="px-6 py-4 font-mono font-medium text-gray-900 dark:text-white">
                                                            #{order.id}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]" title={order.fileName}>
                                                                {order.fileName || 'Document'}
                                                            </div>
                                                            <div className="text-xs text-gray-400 mt-0.5">
                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </td>
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
                                                                    href={`http://localhost:5000/invoice/${order.id}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-all font-bold text-xs"
                                                                >
                                                                    <Download size={16} /> Download
                                                                </a>
                                                            ) : (
                                                                <span className="text-gray-400 text-xs italic">Processing</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* 4. Service Promo Cards (Bottom) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-gray-200 dark:border-gray-800">
                                <PromoCard
                                    title={t('morning_express') || "Morning Express"}
                                    desc={t('morning_desc') || "Order before 8 AM, Pickup by 10:00 AM."}
                                    icon={Clock}
                                    color="orange"
                                    tag={t('conditions_apply') || "Conditions Apply"}
                                />
                                <PromoCard
                                    title={t('live_pdf_editor') || "Live PDF Editor"}
                                    desc={t('live_pdf_desc') || "Edit, Rotate, Delete pages instantly."}
                                    icon={FileText}
                                    color="blue"
                                    tag="New"
                                />
                                <PromoCard
                                    title={t('glass_binding') || "Glass Sheet Binding"}
                                    desc={t('glass_desc') || "Premium binding for valid documents."}
                                    icon={Briefcase}
                                    color="purple"
                                    tag="Available"
                                />
                            </div>

                            {/* Daily Quote Section (Moved to bottom as per flow, or kept as filler) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative rounded-2xl p-8 overflow-hidden text-center mt-8"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 opacity-90"></div>
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                <div className="relative z-10 text-white">
                                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-3 opacity-90">{t('daily_quote') || "Daily Motivation"}</h3>
                                    <p className="text-2xl md:text-3xl font-black leading-tight italic max-w-2xl mx-auto">
                                        "{t(`quote_${quoteIndex + 1}`) || "technology is best when it brings people together."}"
                                    </p>
                                    <p className="mt-4 font-bold opacity-80">- {t(`quote_author_${quoteIndex + 1}`) || "Matt Mullenweg"}</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === 'services' && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card-3d p-10">
                            <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-10 text-center text-3d">{t('our_services') || 'Our Services & Pricing'}</h2>
                            <div className="space-y-4">
                                <ServiceRow t={t} name="bw_xerox" label="Xerox (B&W)" p1="₹2.00" p2="₹3.00" />
                                <ServiceRow t={t} name="bw_print" label="Printouts (B&W)" p1="₹3.00" p2="₹4.00" />
                                <ServiceRow t={t} name="color_print" label="Color Print" p1="₹5.00" p2="₹10.00" />
                                <ServiceRow t={t} name="spiral" label="Spiral Binding" p1="₹30.00" p2="-" />
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="max-w-xl mx-auto">
                            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card-3d p-12 text-center">
                                <div className="w-32 h-32 card-3d rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-[#e0e5ec] dark:border-[#2c3038]">
                                    <User size={64} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{user?.name}</h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-10">{user?.email || 'Student'}</p>
                                <Button onClick={() => navigate('/profile')} className="w-full text-lg">
                                    {t('go_profile') || 'Manage Profile'}
                                </Button>
                            </motion.div>
                        </div>
                    )}
                    {activeTab === 'support' && (
                        <div className="max-w-xl mx-auto">
                            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card-3d p-12 text-center border-t-4 border-green-500">
                                <div className="w-32 h-32 card-3d rounded-full flex items-center justify-center mx-auto mb-8 bg-green-50 dark:bg-green-900/20 text-green-600">
                                    <Phone size={64} />
                                </div>
                                <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-4">{t('contact_support') || 'Contact & Support'}</h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                                    {t('need_help_desc') || 'Need help with an order? Want manual document formatting? Chat with us directly on WhatsApp.'}
                                </p>
                                <a
                                    href={`https://wa.me/919916220476?text=${encodeURIComponent(`Hi I am ${user?.name || 'User'}. Need help with this.`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-full py-4 bg-[#25D366] text-white rounded-xl font-bold text-xl shadow-lg hover:shadow-green-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                                >
                                    <MessageCircle size={24} /> {t('chat_whatsapp') || 'Chat on WhatsApp'}
                                </a>
                                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('support_hours') || 'Support Hours'}</p>
                                    <p className="font-bold text-gray-800 dark:text-white mt-1">10:00 AM - 10:00 PM</p>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <Footer t={t} />
            </div>
        </div>
    );
};

export default Dashboard;
