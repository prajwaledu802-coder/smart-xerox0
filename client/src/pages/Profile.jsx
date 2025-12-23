import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import useStore from '../store/useStore';
import api from '../utils/api';
import { User, Package, Lock, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const Profile = () => {
    const { t } = useTranslation();
    const { user, logout } = useStore();
    const [activeTab, setActiveTab] = useState('details');
    const [orders, setOrders] = useState([]);

    // Password Form
    const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'orders' && user) {
            fetchOrders();
        }
    }, [activeTab]);

    const fetchOrders = async () => {
        try {
            const res = await api.get(`/orders/user/${user.id}`);
            if (res.data.success) setOrders(res.data.orders);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Mock success
        setTimeout(() => {
            toast.success("Password Updated Successfully");
            setLoading(false);
            setPassData({ oldPassword: '', newPassword: '' });
        }, 1000);
    };

    if (!user) return <div className="p-20 text-center text-white">Please Login</div>;

    return (
        <div className="min-h-screen pt-24 px-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-1">
                        <div className="w-full h-full rounded-full bg-white dark:bg-black overflow-hidden relative">
                            {user.avatar ? (
                                <img src={`http://localhost:5000${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-full h-full p-4 text-gray-400 dark:text-gray-500" />
                            )}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                        <p className="text-gray-500 text-sm mt-1 font-mono">{user.mobile}</p>
                    </div>
                    <Button onClick={logout} variant="secondary" className="ml-auto flex items-center gap-2 border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
                        <LogOut size={18} /> {t('logout') || 'Logout'}
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-white/10 pb-1">
                    {[
                        { id: 'details', label: t('my_details') || 'My Details', icon: User },
                        { id: 'orders', label: t('my_orders') || 'My Orders', icon: Package },
                        { id: 'security', label: t('security') || 'Security', icon: Lock },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all relative ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-white/5 shadow-sm dark:shadow-none' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8 min-h-[400px] shadow-sm">
                    <AnimatePresence mode="wait">
                        {activeTab === 'details' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="details">
                                <h3 className="text-xl font-bold mb-6">{t('personal_info') || 'Personal Information'}</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-500 uppercase font-semibold">{t('name') || 'Full Name'}</label>
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-gray-200">{user.name}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-500 uppercase font-semibold">{t('email_addr') || 'Email Address'}</label>
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-gray-200">{user.email}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-500 uppercase font-semibold">{t('mobile_num') || 'Mobile Number'}</label>
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-gray-200">{user.mobile}</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-500 uppercase font-semibold">Language & Region</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { code: 'en', label: 'English' },
                                            { code: 'hi', label: 'Hindi' },
                                            { code: 'te', label: 'Telugu' },
                                            { code: 'ta', label: 'Tamil' },
                                            { code: 'kn', label: 'Kannada' }
                                        ].map(lang => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    i18n.changeLanguage(lang.code);
                                                    useStore.getState().setLanguage(lang.code);
                                                    toast.success(`Language changed to ${lang.label}`);
                                                }}
                                                className={`p-3 rounded-xl border text-sm font-bold transition-all ${i18n.language === lang.code
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400'
                                                    : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </motion.div>
                        )}

                        {activeTab === 'orders' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="orders">
                                <h3 className="text-xl font-bold mb-6">{t('order_history') || 'Order History'}</h3>
                                {orders.length === 0 ? (
                                    <div className="text-center text-gray-500 py-10">{t('no_orders') || 'No orders found.'}</div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map(order => (
                                            <div key={order.id} className="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 hover:border-blue-200 dark:hover:border-white/10 transition-colors">
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-white">Order #{order.id}</div>
                                                    <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-blue-500">₹{order.amountTotal}</div>
                                                    <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' :
                                                        order.orderStatus === 'printing' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400'
                                                        }`}>
                                                        {order.orderStatus}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'security' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="security">
                                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{t('change_pass') || 'Change Password'}</h3>
                                <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">{t('current_pass') || 'Current Password'}</label>
                                        <input
                                            type="password"
                                            className="w-full p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                                            value={passData.oldPassword}
                                            onChange={e => setPassData({ ...passData, oldPassword: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">{t('new_pass') || 'New Password'}</label>
                                        <input
                                            type="password"
                                            className="w-full p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                                            value={passData.newPassword}
                                            onChange={e => setPassData({ ...passData, newPassword: e.target.value })}
                                        />
                                    </div>
                                    <Button isLoading={loading} type="submit" className="w-full">{t('update_pass_btn') || 'Update Password'}</Button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div >
    );
};

export default Profile;
