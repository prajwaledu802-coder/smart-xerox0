import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import api from '../utils/api';
import { Check, AlertCircle, ArrowLeft, Loader, Upload, Wallet, Banknote, ShieldCheck, CheckCircle, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const Payment = () => {
    const { t } = useTranslation();
    const { state } = useLocation();
    const navigate = useNavigate();
    const order = state?.order;

    // Payment State
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' | 'cash'

    const totalAmount = order?.amountTotal || 0;
    const initialAdvance = Math.ceil(totalAmount / 2);

    const [payAmount, setPayAmount] = useState(initialAdvance);
    const [screenshot, setScreenshot] = useState(null);

    // Initial check
    useEffect(() => {
        if (!order) return;
        setPayAmount(Math.ceil(order.amountTotal / 2));
    }, [order]);

    if (!order) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center p-4 bg-[#e0e5ec] dark:bg-[#1a1c22]">
                <div className="card-3d p-12 text-center max-w-md mx-auto">
                    <div className="w-20 h-20 card-3d rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-black mb-4 dark:text-white">Order Not Found</h2>
                    <Button onClick={() => navigate('/order')}>Go Back</Button>
                </div>
            </div>
        );
    }

    // Construct UPI Link dynamically
    const upiLink = `upi://pay?pa=9916220476@ybl&pn=Prajwal%20A%20Amaravati&am=${payAmount}&tn=Order-${order.id}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLink)}`;

    const handleScreenshotChange = (e) => {
        if (e.target.files[0]) {
            setScreenshot(e.target.files[0]);
            toast.success("Screenshot attached!");
        }
    };

    // FIXED: Defined missing function
    const sendToWhatsApp = () => {
        const message = paymentMethod === 'online'
            ? `*New Order #${order.id}*\n--------------------------------\n*Total:* ₹${totalAmount}\n*Online Paid:* ₹${payAmount}\n*Status:* Verified\n--------------------------------\nPlease process my order.`
            : `*New Order #${order.id}*\n--------------------------------\n*Total:* ₹${totalAmount}\n*Status:* Cash on Delivery\n--------------------------------\nI will pay upon delivery.`;

        const waUrl = `https://wa.me/919916220476?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('orderId', order.id || order._id);
            formData.append('method', paymentMethod);

            if (paymentMethod === 'online') {
                formData.append('amount', payAmount);
                formData.append('transactionId', `UPI-${Date.now()}`);
                if (screenshot) {
                    formData.append('screenshot', screenshot);
                }
            } else {
                formData.append('amount', 0); // No immediate payment
            }

            const res = await api.post('/payment/verify', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                setShowSuccess(true);
                toast.success(paymentMethod === 'cash' ? 'Order Confirmed (CoD)!' : 'Payment Verified!');

                // WhatsApp Logic
                let message = '';
                if (paymentMethod === 'online') {
                    message = `
*New Order #${order.id}*
--------------------------------
*Total:* ₹${totalAmount}
*Online Paid:* ₹${payAmount}
*Method:* Online UPI
*Status:* Verified
--------------------------------
Please process my order.
`.trim();
                } else {
                    message = `
*New Order #${order.id}*
--------------------------------
*Total:* ₹${totalAmount}
*Method:* Cash on Delivery
*Status:* Pending Payment
--------------------------------
I will pay ₹${totalAmount} upon delivery.
`.trim();
                }

                const waUrl = `https://wa.me/919916220476?text=${encodeURIComponent(message)}`;

                // Removed auto-redirect. User must click manually.
                // setTimeout(() => {
                //     window.open(waUrl, '_blank');
                //     navigate('/dashboard');
                // }, 3000);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || 'Processing Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 flex justify-center items-center transition-colors duration-300">
            <AnimatePresence>
                {showSuccess ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="card-3d p-12 text-center max-w-sm w-full"
                    >
                        <div className="text-center">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <CheckCircle size={48} className="text-green-600" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-4">Payment Successful!</h2>
                            <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
                                Your order <b>#{order.id}</b> has been placed.
                                <br />
                                <span className="text-red-500 font-bold block mt-2 text-xl animate-pulse">
                                    ⚠ IMPORTANT: Send Order Summary on WhatsApp to confirm!
                                </span>
                            </p>
                            <button
                                onClick={sendToWhatsApp}
                                className="w-full py-4 bg-[#25D366] text-white rounded-xl font-bold text-xl shadow-xl hover:shadow-green-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                            >
                                <MessageCircle size={24} /> Send Summary to Admin
                            </button>
                            <button
                                onClick={() => navigate('/history')}
                                className="mt-6 text-gray-400 font-bold hover:text-gray-600"
                            >
                                Skip & Go to History
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="card-3d p-8 max-w-md w-full relative overflow-hidden"
                    >
                        <div className={`absolute top-0 w-full left-0 h-3 bg-gradient-to-r ${paymentMethod === 'online' ? 'from-blue-600 to-indigo-600' : 'from-green-500 to-emerald-600'}`}></div>

                        <div className="text-center mb-6 mt-4">
                            <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-2 text-3d">{t('complete_payment') || 'Complete Payment'}</h2>
                            <p className="text-gray-500 font-medium font-bold">Total Bill: ₹{totalAmount}</p>
                        </div>

                        {/* Payment Method Toggle */}
                        <div className="flex card-3d p-1 rounded-2xl mb-8">
                            <button
                                onClick={() => setPaymentMethod('online')}
                                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${paymentMethod === 'online' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-blue-500'}`}
                            >
                                <Wallet size={18} /> Online Pay
                            </button>
                            <button
                                onClick={() => setPaymentMethod('cash')}
                                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${paymentMethod === 'cash' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-green-500'}`}
                            >
                                <Banknote size={18} /> Cash (CoD)
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {paymentMethod === 'online' ? (
                                <motion.div
                                    key="online"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    {/* QR Display */}
                                    <div className="mx-auto w-64 h-64 card-3d p-4 mb-4 flex items-center justify-center shadow-inset bg-white relative">
                                        <img
                                            src={qrUrl}
                                            alt="UPI QR"
                                            className="w-full h-full object-contain mix-blend-multiply"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
                                            {/* Flash effect could go here */}
                                        </div>
                                    </div>

                                    <div className="text-center mb-6">
                                        <p className="text-sm font-bold text-gray-800 dark:text-white">Prajwal A Amaravati</p>
                                        <p className="text-xs text-gray-500 mt-1">Scan with GPay, PhonePe, BHIM, Paytm</p>
                                    </div>

                                    {/* Editable Amount */}
                                    <div className="mb-6">
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Amount to Pay</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">₹</span>
                                            <input
                                                type="number"
                                                value={payAmount}
                                                onChange={(e) => setPayAmount(e.target.value)}
                                                className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 input-3d"
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-2 ml-1">*You can edit this amount. QR will update automatically.</p>
                                    </div>

                                    {/* Screenshot Upload */}
                                    <div className="mb-6">
                                        <label className="block w-full py-3 px-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 transition-colors cursor-pointer text-center">
                                            <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 font-semibold text-sm">
                                                <Upload size={18} />
                                                {screenshot ? screenshot.name : "Upload Payment Screenshot (Optional)"}
                                            </div>
                                            <input type="file" accept="image/*" className="hidden" onChange={handleScreenshotChange} />
                                        </label>
                                    </div>

                                    <Button onClick={handleConfirm} disabled={loading} isLoading={loading} className="w-full py-4 text-xl shadow-xl hover:-translate-y-1">
                                        I Have Paid
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="cash"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-24 h-24 card-3d rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 bg-green-50 dark:bg-green-900/20">
                                        <ShieldCheck size={48} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Cash on Delivery</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
                                        Please pay the full amount of <span className="text-gray-900 dark:text-white font-black">₹{totalAmount}</span> directly at the counter when you collect your order.
                                    </p>

                                    <Button
                                        onClick={handleConfirm}
                                        disabled={loading}
                                        isLoading={loading}
                                        className="w-full py-4 text-xl shadow-xl hover:-translate-y-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-none"
                                    >
                                        Confirm Order
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/order')}
                                className="w-full py-3 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={16} /> Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Payment;
