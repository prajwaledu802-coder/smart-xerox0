import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore'; // Auth Store
import useThemeStore from '../store/useThemeStore'; // THEME Store
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, LogOut, User, Globe, ChevronDown } from 'lucide-react';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { t } = useTranslation();
    const { user, isAuthenticated, logout } = useStore(); // Auth
    const { theme, toggleTheme } = useThemeStore(); // Theme
    const navigate = useNavigate();
    const [showGuide, setShowGuide] = useState(true);
    const [showLang, setShowLang] = useState(false);

    useEffect(() => {
        setShowGuide(true);
        const timer = setTimeout(() => setShowGuide(false), 10000);
        return () => clearTimeout(timer);
    }, [theme]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="hidden md:flex fixed top-2 md:top-4 left-0 right-0 z-50 justify-center pointer-events-none"
        >
            <div className="bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-full px-4 py-2 md:px-6 md:py-3 flex items-center gap-3 md:gap-6 pointer-events-auto max-w-5xl w-full mx-2 md:mx-4 justify-between">

                {/* Brand */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                        <span className="font-black text-xs">SX</span>
                    </div>
                    <span className="text-xl font-black bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {t('brand_name') || 'Smart Xerox'}
                    </span>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {/* Custom Language Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowLang(!showLang)}
                            className="flex items-center gap-2 bg-gray-100/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full py-1.5 pl-3 pr-3 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors"
                        >
                            <Globe size={18} className="text-blue-500" />
                            <span className="text-sm">{i18n.language || "en"}</span>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${showLang ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showLang && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full mt-2 right-0 w-32 py-2 bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                                >
                                    {[
                                        { code: 'en', label: 'English' },
                                        { code: 'hi', label: 'Hindi' },
                                        { code: 'bn', label: 'Bengali' },
                                        { code: 'te', label: 'Telugu' },
                                        { code: 'mr', label: 'Marathi' },
                                        { code: 'ta', label: 'Tamil' },
                                        { code: 'kn', label: 'Kannada' }
                                    ].map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                i18n.changeLanguage(lang.code);
                                                useStore.getState().setLanguage(lang.code);
                                                setShowLang(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-between group"
                                        >
                                            {lang.label}
                                            {i18n.language === lang.code && <motion.div layoutId="activeLang" className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Theme Toggle & Helper Popup */}
                    <div className="relative flex flex-col items-center">
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-full bg-gray-100/50 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-yellow-400 hover:bg-blue-50 dark:hover:bg-white/10 transition-all active:scale-95 z-10"
                            title="Toggle Theme"
                        >
                            {theme === 'light' ? <Moon size={22} strokeWidth={2.5} /> : <Sun size={22} strokeWidth={2.5} />}
                        </button>

                        <AnimatePresence>
                            {showGuide && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 5, scale: 1 }}
                                    exit={{ opacity: 0, y: -5, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="hidden md:block absolute top-full mt-2 w-48 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 pointer-events-none"
                                >
                                    {/* Arrow */}
                                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-800 rotate-45 border-l border-t border-gray-100 dark:border-gray-700"></div>

                                    {/* Content */}
                                    <p className="relative text-[10px] leading-relaxed font-medium text-center text-gray-600 dark:text-gray-300">
                                        {theme === 'dark'
                                            ? "☀ Toggle Light Mode for a clean, focused workspace"
                                            : "✨ Switch to Dark Mode for an immersive Live 3D experience"}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="hidden md:block text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {t('nav_dashboard') || 'Dashboard'}
                            </Link>

                            <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-2 hidden md:block"></div>

                            <div className="flex items-center gap-2">
                                <Link to="/profile" className="flex items-center gap-2 pl-1 pr-3 py-1 bg-gray-100/50 dark:bg-white/5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-800">
                                    {user?.avatar ? (
                                        <img src={`http://localhost:5000${user.avatar}`} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-300">
                                            <User size={16} />
                                        </div>
                                    )}

                                    <div className="hidden sm:block">
                                        {/* Hide Name on very small screens, show only avatar */}
                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-200 max-w-[80px] truncate">
                                            {user?.name?.split(' ')[0]}
                                        </span>
                                    </div>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                                    title={t('nav_logout')}
                                >
                                    <LogOut size={20} strokeWidth={2.5} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="hidden sm:block text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
                                {t('nav_login')}
                            </Link>
                            <Link to="/signup" className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all">
                                {t('nav_signup')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
