import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

const AnimatedCounter = ({ value }) => {
    const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current));

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span>{display}</motion.span>;
};

export default AnimatedCounter;
