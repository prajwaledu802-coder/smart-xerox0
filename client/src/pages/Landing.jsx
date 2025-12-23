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
                {/* Premium Gradient Background */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Light Mode: White -> Soft Sky Blue -> Subtle Lavender */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:hidden opacity-80"></div>

                    {/* Dark Mode: Deep Navy -> Purple -> Black */}
                    <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-[#0a0a0a] to-black"></div>

                    {/* Animated Blobs for Depth */}
                    <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-sky-200 dark:bg-blue-600/20 rounded-full blur-[120px] animate-pulse opacity-60"></div>
                    <div className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] bg-purple-200 dark:bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-75 opacity-60"></div>
                </div>

                <div className="w-full md:container md:mx-auto px-3 md:px-6 relative z-10 text-center">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-4xl mx-auto"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 backdrop-blur-xl shadow-sm">
                            <Star size={14} fill="currentColor" /> {t('rated_1') || 'Rated #1 Student Choice'}
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 md:mb-8 leading-[1.1] text-gray-900 dark:text-white">
                            <span className="text-gray-900 dark:text-white drop-shadow-sm">
                                {t('printing_reimagined') || 'Printing Reimagined.'}
                            </span>
                            <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
                                {t('instant_smart') || 'Instant & Smart.'}
                            </span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                            {t('hero_desc') || 'Upload documents from anywhere, pay securely, and collect instantly. The smartest way to print on campus.'}
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                onClick={() => navigate('/login')}
                                className="px-10 py-5 text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 dark:from-blue-500 dark:to-purple-500 shadow-xl shadow-blue-500/30 text-white font-bold tracking-wide transition-all hover:scale-105"
                            >
                                {t('get_started') || 'Get Started Now'}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                                className="px-10 py-5 text-lg rounded-full border border-gray-300 dark:border-white/10 text-gray-700 dark:text-white hover:bg-white/50 dark:hover:bg-white/5 font-semibold backdrop-blur-md bg-white/30 dark:bg-white/5 shadow-sm"
                            >
                                {t('view_pricing') || 'View Pricing'}
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Dashboard Mockup - Glass Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 100, rotateX: 20 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="mt-20 mx-auto max-w-5xl rounded-2xl border border-white/50 dark:border-white/10 shadow-2xl overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/20 dark:border-white/5 bg-white/50 dark:bg-white/5">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/80"></div>
                            </div>
                            <div className="flex-1 text-center text-xs font-mono text-gray-500 dark:text-gray-500">smart-xerox-dashboard.app</div>
                        </div>
                        <div className="p-6 grid grid-cols-3 gap-6 opacity-100 dark:opacity-80">
                            {/* Graphs */}
                            <div className="col-span-2 bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-white/20 dark:border-white/5 h-64 flex flex-col shadow-sm">
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
                                            className="w-full bg-gradient-to-t from-blue-200 to-blue-500 dark:from-blue-600/20 dark:to-blue-500 rounded-t-sm"
                                        ></motion.div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-1 space-y-4">
                                <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-white/20 dark:border-white/5 h-30 shadow-sm">
                                    <div className="text-xs text-gray-500 mb-1">{t('total_savings') || 'Total Savings'}</div>
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">₹ 1,240</div>
                                    <div className="text-xs text-green-600 dark:text-green-500/50 mt-1">{t('plus_12_month') || '+12% this month'}</div>
                                </div>
                                <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-white/20 dark:border-white/5 h-30 relative overflow-hidden shadow-sm">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-transparent dark:from-purple-600/20"></div>
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
            <section id="pricing" className="py-16 md:py-32 relative bg-transparent">
                <div className="w-full md:container md:mx-auto px-3 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">{t('unbeatable_pricing') || 'Unbeatable Pricing'}</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">{t('pricing_sub') || 'Transparent costs. No hidden fees. Student friendly.'}</p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 max-w-6xl mx-auto">
                        {/* Xerox B&W */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -10 }}
                            viewport={{ once: true }}
                            className="rounded-3xl p-8 bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 hover:border-yellow-500/50 transition-all duration-300 group shadow-lg dark:shadow-none"
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
                            className="rounded-3xl p-8 bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 hover:border-cyan-500/50 transition-all duration-300 group relative shadow-lg dark:shadow-none"
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
                            className="rounded-3xl p-8 bg-gradient-to-b from-blue-50/50 to-white/50 dark:from-[#1a1a1a]/80 dark:to-[#0a0a0a]/80 backdrop-blur-xl border border-blue-200 dark:border-white/10 hover:border-blue-600/50 transition-all duration-300 group ring-1 ring-blue-500/20 shadow-xl dark:shadow-none"
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
            <section className="py-16 md:py-24 bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-sm">
                <div className="w-full md:container md:mx-auto px-3 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                        {[
                            { icon: Zap, title: t('lightning_fast') || "Lightning Fast", desc: t('fast_desc') || "Order online and collect before you even reach the shop." },
                            { icon: Shield, title: t('secure_payments') || "Secure Payments", desc: t('secure_desc') || "100% secure QR code and UPI payments integration." },
                            { icon: Globe, title: t('anywhere_access') || "Anywhere Access", desc: t('access_desc') || "Upload files from your phone, laptop, or tablet instantly." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="card-3d p-8 relative overflow-hidden group hover:-translate-y-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <item.icon size={100} />
                                </div>
                                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-blue-400 w-fit mb-6 shadow-sm">
                                    <item.icon size={28} />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black mb-3 text-gray-800 dark:text-white">{item.title}</h4>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{item.desc}</p>
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
