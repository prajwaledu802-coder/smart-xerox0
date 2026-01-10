import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import useThemeStore from '../../store/useThemeStore';

const IntroManager = ({ onComplete }) => {
    const { theme } = useThemeStore();
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const boxRef = useRef(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    // Fade out container
                    gsap.to(containerRef.current, {
                        opacity: 0,
                        duration: 1,
                        onComplete: () => {
                            setVisible(false);
                            // setIntroPlayed(true); // Removed to allow replay
                            if (onComplete) onComplete();
                        }
                    });
                }
            });

            // Initial State
            gsap.set(containerRef.current, { opacity: 1 });
            gsap.set(boxRef.current, { scale: 0, rotation: 0 });
            gsap.set(textRef.current, { opacity: 0, y: 50 });

            // Animation Sequence
            tl.to(boxRef.current, {
                scale: 1,
                rotation: 360,
                duration: 1.5,
                ease: "elastic.out(1, 0.3)"
            })
                .to(boxRef.current, {
                    scale: 20, // Expand to cover screen (transition effect)
                    opacity: 0,
                    duration: 1,
                    ease: "power2.inOut"
                }, "-=0.5")
                .to(textRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power4.out"
                }, "-=0.8")
                .to(textRef.current, {
                    opacity: 0,
                    scale: 2,
                    filter: 'blur(10px)',
                    duration: 0.8,
                    ease: "power2.in"
                }, "+=0.5");

        }, containerRef);

        return () => ctx.revert();
    }, [theme, onComplete]);

    if (!visible) return null;

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden ${theme === 'dark' ? 'bg-[#050510]' : 'bg-white'}`}
        >
            {/* Animated Center Object */}
            <div
                ref={boxRef}
                className={`w-24 h-24 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gradient-to-tr from-blue-600 to-purple-600 shadow-purple-500/50' : 'bg-gradient-to-tr from-blue-400 to-cyan-300 shadow-blue-400/50'}`}
            ></div>

            {/* Text Reveal */}
            <h1
                ref={textRef}
                className={`absolute text-5xl md:text-7xl font-black tracking-tighter ${theme === 'dark' ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-gray-900'}`}
            >
                SMART <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">XEROX</span>
            </h1>
        </div>
    );
};

export default IntroManager;
