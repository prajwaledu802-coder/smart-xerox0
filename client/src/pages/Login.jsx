import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../components/ui/Button';
import useStore from '../store/useStore';
import api from '../utils/api'; // We might still use this to sync with backend
import { Mail, Lock, User, Upload, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useStore();

    const isSignupRoute = location.pathname === '/signup';
    const [isSignup, setIsSignup] = useState(isSignupRoute);

    useEffect(() => {
        setIsSignup(location.pathname === '/signup');
    }, [location.pathname]);

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const toggleMode = () => {
        const newMode = !isSignup;
        setIsSignup(newMode);
        navigate(newMode ? '/signup' : '/login');
        setFormData({ name: '', email: '', mobile: '', password: '', confirmPassword: '' });
        setAvatar(null);
        setAvatarPreview(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignup) {
                if (formData.password !== formData.confirmPassword) {
                    toast.error("Passwords do not match");
                    setLoading(false);
                    return;
                }

                // Create User in Firebase
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;

                // Update Profile
                await updateProfile(user, { displayName: formData.name });

                // Get Token to sync with backend
                const token = await user.getIdToken();

                // Send to backend to create user record/session
                // We send formData to save extra fields like mobile, avatar if we upload it there
                // For now, we'll try to sync with the backend
                try {
                    const data = new FormData();
                    data.append('name', formData.name);
                    data.append('email', formData.email);
                    data.append('mobile', formData.mobile);
                    data.append('firebaseUid', user.uid);
                    if (avatar) data.append('avatar', avatar);

                    // Note: We might need a new endpoint that accepts Firebase UID or Token
                    // For now, let's assume we update the backend to handle this or just rely on Firebase
                    // But to keep existing flow (redirect to dashboard, setUser), we do:

                    const res = await api.post('/auth/firebase-sync', data, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (res.data.success) {
                        setUser(res.data.user);
                    } else {
                        // Fallback if backend fails, strictly use Firebase user object
                        setUser({
                            uid: user.uid,
                            email: user.email,
                            name: user.displayName,
                            // Avatar might be missing here if backend didn't process it
                        });
                    }

                } catch (backendError) {
                    console.error("Backend Sync Error:", backendError);
                    // Still proceed as Firebase Auth is successful
                    setUser({
                        uid: user.uid,
                        email: user.email,
                        name: user.displayName,
                        photoURL: user.photoURL
                    });
                }

                toast.success("Welcome to Smart Xerox!");
                navigate('/dashboard');

            } else {
                // Login
                const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;

                const token = await user.getIdToken();
                localStorage.setItem('firebaseToken', token); // Store if needed for API calls

                // Verify with backend
                try {
                    const res = await api.post('/auth/firebase-login', { token });
                    if (res.data.success) {
                        setUser(res.data.user);
                    } else {
                        setUser({
                            uid: user.uid,
                            email: user.email,
                            name: user.displayName,
                            photoURL: user.photoURL
                        });
                    }
                } catch (backendErr) {
                    console.error("Backend Login Error:", backendErr);
                    setUser({
                        uid: user.uid,
                        email: user.email,
                        name: user.displayName,
                        photoURL: user.photoURL
                    });
                }

                toast.success("Welcome Back!");
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            const msg = err.message.replace('Firebase: ', '');
            toast.error(msg || 'Authentication Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-16 flex items-center justify-center bg-white dark:bg-[#0a0a0a] relative overflow-hidden transition-colors duration-300">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[40%] -left-[20%] w-[70vw] h-[70vw] bg-blue-100 dark:bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] bg-purple-100 dark:bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-lg p-8 m-4 bg-white/80 dark:bg-white/5 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl text-gray-900 dark:text-white"
            >
                <div className="text-center mb-8">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 mb-6 shadow-lg shadow-blue-500/30"
                    >
                        <Sparkles className="text-white w-8 h-8" />
                    </motion.div>
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400 font-sans tracking-tight mb-2">
                        {isSignup ? (t('create_account') || "Create Account") : (t('welcome_back') || "Welcome Back")}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        {isSignup ? (t('signup_subtitle') || "Join the smartest printing network") : (t('login_subtitle') || "Continue your premium experience")}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {isSignup && (
                        <div className="flex gap-4">
                            <div className="w-full">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 ml-1">{t('name') || "Full Name"}</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-sm"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required={isSignup}
                                    />
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 ml-1 text-center">Avatar</label>
                                <label className="w-14 h-14 rounded-full bg-black/30 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden relative group">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Upload size={20} className="text-gray-400 group-hover:text-white" />
                                    )}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                </label>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 ml-1">{t('email_addr') || "Email Address"}</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                            <input
                                name="email"
                                type="email"
                                placeholder="hello@example.com"
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-sm"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {isSignup && (
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 ml-1">{t('mobile_num') || "Mobile Number"}</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-blue-400 transition-colors font-mono">+91</span>
                                <input
                                    name="mobile"
                                    type="tel"
                                    placeholder="9876543210"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-sm"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required={isSignup}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 ml-1">{t('current_pass') || "Password"}</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-sm"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {isSignup && (
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 ml-1">{t('confirm_pass') || "Confirm Password"}</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-sm"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required={isSignup}
                                />
                            </div>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-none shadow-xl shadow-blue-500/20 text-lg font-bold tracking-wide transform transition-all active:scale-[0.98] mt-4"
                        isLoading={loading}
                    >
                        {isSignup ? (t('create_account') || "Create Account") : (t('login_btn') || "Sign In")} <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        {isSignup ? (t('already_account') || "Already have an account? ") : (t('no_account') || "Don't have an account? ")}
                        <button
                            onClick={toggleMode}
                            className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-all ml-1"
                        >
                            {isSignup ? (t('login_btn') || "Sign In") : (t('nav_signup') || "Sign Up")}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
