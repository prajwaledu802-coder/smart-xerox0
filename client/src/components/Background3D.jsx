import { motion } from 'framer-motion';
import { FileText, Printer, Copy, Layers, Zap, Hexagon } from 'lucide-react';

const Background3D = () => {
    // Configuration for floating elements
    const elements = [
        { Icon: FileText, color: 'text-blue-500', size: 64, delay: 0, duration: 25, x: ['-10%', '110%'], y: ['10%', '20%'] },
        { Icon: Printer, color: 'text-purple-500', size: 48, delay: 5, duration: 30, x: ['110%', '-10%'], y: ['40%', '80%'] },
        { Icon: Copy, color: 'text-indigo-500', size: 56, delay: 2, duration: 28, x: ['-10%', '110%'], y: ['70%', '10%'] },
        { Icon: Layers, color: 'text-pink-500', size: 72, delay: 8, duration: 35, x: ['110%', '-10%'], y: ['20%', '60%'] },
        // Abstract Shapes
        { Icon: Hexagon, color: 'text-cyan-500', size: 120, delay: 0, duration: 40, x: ['0%', '100%'], y: ['0%', '100%'], rotate: 360 },
        { Icon: Zap, color: 'text-yellow-500', size: 80, delay: 10, duration: 32, x: ['100%', '0%'], y: ['100%', '0%'], rotate: -360 },
    ];

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/30 to-purple-50/30 dark:via-blue-900/10 dark:to-purple-900/10" />

            {/* Floating Elements */}
            {elements.map((el, index) => (
                <motion.div
                    key={index}
                    initial={{ x: el.x[0], y: el.y[0], opacity: 0, rotate: 0 }}
                    animate={{
                        x: el.x[1],
                        y: el.y[1],
                        opacity: [0, 0.4, 0.4, 0], // Fade in/out at edges
                        rotate: el.rotate || 180
                    }}
                    transition={{
                        duration: el.duration,
                        repeat: Infinity,
                        delay: el.delay,
                        ease: "linear",
                        fill: "forwards"
                    }}
                    className={`absolute ${el.color} opacity-20 dark:opacity-10 blur-[1px]`}
                >
                    <el.Icon size={el.size} />
                </motion.div>
            ))}

            {/* Floating Orbs (Glassmorphism blobs) */}
            <motion.div
                animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl"
            />
            <motion.div
                animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl"
            />
        </div>
    );
};

export default Background3D;
