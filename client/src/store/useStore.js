import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            theme: 'light',
            language: 'en',

            setUser: (user) => set({ user, isAuthenticated: !!user }),
            logout: async () => {
                localStorage.removeItem('token');
                try {
                    const { auth } = await import('../firebase');
                    await auth.signOut();
                } catch (error) {
                    console.error("Logout Error:", error);
                }
                set({ user: null, isAuthenticated: false });
            },
            setTheme: (theme) => {
                set({ theme });
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            },
            setLanguage: (language) => set({ language }),
        }),
        {
            name: 'smart-xerox-storage', // unique name
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                theme: state.theme,
                language: state.language
            }),
        }
    )
);

export default useStore;
