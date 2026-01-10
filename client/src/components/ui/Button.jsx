import { motion } from 'framer-motion';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false, isLoading = false }) => {

    // We update variants to use 3D classes from index.css or direct styles for the 3D look
    const variants = {
        primary: 'btn-3d btn-3d-primary', // Uses the class we defined
        secondary: 'btn-3d bg-[#e0e5ec] dark:bg-[#2c3038] text-gray-700 dark:text-gray-200 border border-transparent',
        outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20' // Keeping outline somewhat standard but clean
    };

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`px-8 py-3 rounded-xl font-bold transition-all duration-200 transform flex items-center justify-center ${variant === 'primary' ? 'btn-3d btn-3d-primary' : variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2" />
            ) : null}
            {children}
        </motion.button>
    );
};

export default Button;
