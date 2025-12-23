import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Plus, FileText, User } from 'lucide-react';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { id: 'dashboard', icon: Home, label: 'Home', path: '/dashboard' },
        { id: 'history', icon: FileText, label: 'Orders', path: '/history' },
        { id: 'new', icon: Plus, label: 'New', path: '/order', isFab: true },
        { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
    ];

    // Hide if we are not on these main pages (optional, but good for UX)
    // For now, show always on mobile if authenticated 
    // (This component should be conditionally rendered in Layout or Dashboard)

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#0F0F0F]/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 pb-safe z-50">
            <div className="flex justify-around items-end h-16 px-2">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;

                    if (tab.isFab) {
                        return (
                            <button
                                key={tab.id}
                                onClick={() => navigate(tab.path)}
                                className="relative -top-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg shadow-blue-500/40 hover:scale-105 transition-transform"
                                aria-label="New Order"
                            >
                                <Plus size={24} strokeWidth={3} />
                            </button>
                        );
                    }

                    return (
                        <button
                            key={tab.id}
                            onClick={() => navigate(tab.path)}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive
                                ? 'text-black dark:text-white scale-110'
                                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            <tab.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-bold">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
