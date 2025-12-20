import { motion } from 'framer-motion';
import { FileText, Printer, Sparkles, Cloud, Zap, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

const LiveBackground = () => {
    // Generate random positions for floating elements
    const [elements, setElements] = useState([]);

    useEffect(() => {
        // Create 20 random floating elements
        const items = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // %
            delay: Math.random() * 5,
            duration: 15 + Math.random() * 20, // Slow float
            size: 20 + Math.random() * 40,
            icon: [FileText, Printer, Sparkles, Cloud, Zap, Star][Math.floor(Math.random() * 6)],
            color: [
                'text-blue-500/10',
                'text-purple-500/10',
                'text-green-500/10',
                'text-pink-500/10'
            ][Math.floor(Math.random() * 4)]
        }));
        setElements(items);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            {elements.map((el) => (
                <motion.div
                    key={el.id}
                    className={`absolute ${el.color}`}
                    initial={{ y: "110vh", x: `${el.x}vw`, opacity: 0, scale: 0.5, rotate: 0 }}
                    animate={{
                        y: "-10vh",
                        opacity: [0, 0.8, 0],
                        rotate: 360
                    }}
                    transition={{
                        duration: el.duration,
                        repeat: Infinity,
                        delay: el.delay,
                        ease: "linear"
                    }}
                    style={{
                        width: el.size,
                        height: el.size,
                    }}
                >
                    <el.icon size={el.size} />
                </motion.div>
            ))}

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white/80 dark:via-gray-900/50 dark:to-gray-900/80 -z-20" />
        </div>
    );
};

export default LiveBackground;
