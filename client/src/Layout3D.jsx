import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useThemeStore from './store/useThemeStore';
import LiveBackground from './components/3d/LiveBackground';
import IntroManager from './components/Intro/IntroManager';
import Navbar from './components/Navbar';
import { AnimatePresence, motion } from 'framer-motion';

const Layout3D = ({ children }) => {
    const { theme, introPlayed } = useThemeStore();
    const location = useLocation();

    // Sync CSS class for Tailwind
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className={`min-h-screen transition-colors duration-700 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} overflow-x-hidden selection:bg-blue-500 selection:text-white`}>

            {/* 1. Global 3D Background */}
            <LiveBackground />

            {/* 2. Intro Layer (Shows on every refresh) */}
            <IntroManager />

            {/* 3. Main Content Layer */}
            <div className="relative z-10 font-sans">
                <Navbar />

                {/* Page Transitions */}
                <AnimatePresence mode="wait">
                    <motion.main
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="w-full md:container md:mx-auto md:px-4 md:py-8"
                    >
                        {children}
                    </motion.main>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Layout3D;
