import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Printer, Zap, Shield, Users, BarChart3, Globe, Star, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const Landing = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-transparent md:bg-white dark:bg-transparent md:dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300 font-sans overflow-x-hidden selection:bg-blue-500/30">
            {/* HER HERO SECTION */}
            <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden py-12 md:py-0">
                {/* Dynamic Background */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-blue-900/20 dark:via-[#050505] dark:to-[#050505]"></div>
                    {/* Light Mode Blobs */}
                    <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-blue-100 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse opacity-70"></div>
                    <div className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] bg-purple-100 dark:bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-75 opacity-70"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-4xl mx-auto"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-white/5 border border-blue-100 dark:border-white/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 backdrop-blur-xl shadow-sm">
                            <Star size={14} fill="currentColor" /> {t('rated_1') || 'Rated #1 Student Choice'}
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-6 md:mb-8 leading-[1.1] text-gray-900 dark:text-white">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-500">
                                {t('printing_reimagined') || 'Printing Reimagined.'}
                            </span>
                            <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-600">
                                {t('instant_smart') || 'Instant & Smart.'}
                            </span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                            {t('hero_desc') || 'Upload documents from anywhere, pay securely, and pick up in seconds. The future of campus printing is here.'}
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                onClick={() => navigate('/login')}
                                className="px-10 py-5 text-lg rounded-full bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 shadow-xl shadow-blue-500/20 text-white font-bold tracking-wide transition-all hover:scale-105"
                            >
                                {t('get_started') || 'Get Started Now'}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                                className="px-10 py-5 text-lg rounded-full border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 font-semibold backdrop-blur-md bg-white/50 dark:bg-transparent"
                            >
                                {t('view_pricing') || 'View Pricing'}
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Dashboard Mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 100, rotateX: 20 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="mt-20 mx-auto max-w-5xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden bg-white dark:bg-[#0F0F0F]"
                    >
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#1a1a1a]">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/80"></div>
                            </div>
                            <div className="flex-1 text-center text-xs font-mono text-gray-400 dark:text-gray-500">smart-xerox-dashboard.app</div>
                        </div>
                        <div className="p-6 grid grid-cols-3 gap-6 opacity-100 dark:opacity-80">
                            {/* Graphs */}
                            <div className="col-span-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-4 border border-gray-100 dark:border-white/5 h-64 flex flex-col shadow-sm dark:shadow-none">
                                <div className="flex justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('printing_analytics') || 'Printing Analytics'}</h3>
                                    <BarChart3 size={16} className="text-blue-500" />
                                </div>
                                <div className="flex-1 flex items-end justify-between gap-2 px-2">
                                    {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ duration: 1.5, delay: 1 + (i * 0.1) }}
                                            className="w-full bg-gradient-to-t from-blue-100 to-blue-500 dark:from-blue-600/20 dark:to-blue-500 rounded-t-sm"
                                        ></motion.div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-1 space-y-4">
                                <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-4 border border-gray-100 dark:border-white/5 h-30 shadow-sm dark:shadow-none">
                                    <div className="text-xs text-gray-500 mb-1">{t('total_savings') || 'Total Savings'}</div>
                                    <div className="text-2xl font-bold text-green-500 dark:text-green-400">₹ 1,240</div>
                                    <div className="text-xs text-green-600 dark:text-green-500/50 mt-1">{t('plus_12_month') || '+12% this month'}</div>
                                </div>
                                <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-4 border border-gray-100 dark:border-white/5 h-30 relative overflow-hidden shadow-sm dark:shadow-none">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-transparent dark:from-purple-600/20"></div>
                                    <div className="relative z-10">
                                        <div className="text-xs text-gray-500 mb-1">{t('active_orders') || 'Active Orders'}</div>
                                        <div className="text-2xl font-bold text-gray-800 dark:text-white">3 {t('pending') || 'Pending'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* PRICING SECTION */}
            <section id="pricing" className="py-16 md:py-32 relative bg-gray-50 dark:bg-transparent">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">{t('unbeatable_pricing') || 'Unbeatable Pricing'}</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">{t('pricing_sub') || 'Transparent costs. No hidden fees. Student friendly.'}</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Xerox B&W */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -10 }}
                            viewport={{ once: true }}
                            className="rounded-3xl p-8 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 hover:border-yellow-500/50 transition-all duration-300 group shadow-lg dark:shadow-none"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center mb-6 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-500/20 transition-colors">
                                <Printer className="text-yellow-600 dark:text-yellow-500 w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t('bw_xerox') || 'Xerox'}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 uppercase tracking-wider font-semibold">{t('bw_option') || 'Black & White'}</p>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                                    <span className="text-gray-600 dark:text-gray-300">{t('front_page') || 'Front Page'}</span>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">₹2</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                                    <span className="text-gray-600 dark:text-gray-300">{t('front_back') || 'Front & Back'}</span>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">₹3</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Printouts B&W */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -10 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                            className="rounded-3xl p-8 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 hover:border-cyan-500/50 transition-all duration-300 group relative shadow-lg dark:shadow-none"
                        >
                            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-500/20 transition-colors">
                                <Printer className="text-cyan-600 dark:text-cyan-500 w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t('bw_print') || 'Printouts'}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 uppercase tracking-wider font-semibold">{t('bw_option') || 'Black & White'}</p>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                                    <span className="text-gray-600 dark:text-gray-300">{t('front_page') || 'Front Page'}</span>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">₹3</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                                    <span className="text-gray-600 dark:text-gray-300">{t('front_back') || 'Front & Back'}</span>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">₹4</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Printouts Color */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -10 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                            className="rounded-3xl p-8 bg-gradient-to-b from-blue-50 to-white dark:from-[#1a1a1a] dark:to-[#0a0a0a] border border-blue-200 dark:border-white/10 hover:border-blue-600/50 transition-all duration-300 group ring-1 ring-blue-500/20 shadow-xl dark:shadow-none"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-600/20 flex items-center justify-center mb-6">
                                <Zap className="text-blue-600 dark:text-blue-500 w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t('color_print') || 'Printouts'}</h3>
                            <p className="text-blue-600 dark:text-blue-400 text-sm mb-6 uppercase tracking-wider font-bold">{t('color_option') || 'Colour'}</p>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center py-2 border-b border-blue-100 dark:border-white/5">
                                    <span className="text-gray-600 dark:text-gray-300">{t('front_page') || 'Front Page'}</span>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">₹5</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-blue-100 dark:border-white/5">
                                    <span className="text-gray-600 dark:text-gray-300">{t('front_back') || 'Front & Back'}</span>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">₹10</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FEATURES / SERVICES SECTION */}
            <section className="py-16 md:py-24 bg-white dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: Zap, title: t('lightning_fast') || "Lightning Fast", desc: t('fast_desc') || "Order online and collect before you even reach the shop." },
                            { icon: Shield, title: t('secure_payments') || "Secure Payments", desc: t('secure_desc') || "100% secure QR code and UPI payments integration." },
                            { icon: Globe, title: t('anywhere_access') || "Anywhere Access", desc: t('access_desc') || "Upload files from your phone, laptop, or tablet instantly." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="flex gap-4 items-start"
                            >
                                <div className="p-3 rounded-xl bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-white">
                                    <item.icon size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h4>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
