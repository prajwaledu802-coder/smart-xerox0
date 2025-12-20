import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Stars } from '@react-three/drei';

import useThemeStore from '../../store/useThemeStore';

const Particles = (props) => {
    const ref = useRef();

    // Manual random sphere generation to avoid maath NaN issues
    const sphere = useMemo(() => {
        const temp = new Float32Array(5000);
        for (let i = 0; i < 5000; i += 3) {
            const r = 1.5 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            temp[i] = r * Math.sin(phi) * Math.cos(theta);
            temp[i + 1] = r * Math.sin(phi) * Math.sin(theta);
            temp[i + 2] = r * Math.cos(phi);
        }
        return temp;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color={props.color || "#ffa0e0"}
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

const DarkScene = () => {
    return (
        <>
            <color attach="background" args={['#050510']} />
            <fog attach="fog" args={['#050510', 5, 15]} />
            <ambientLight intensity={0.5} />
            <Particles color="#8800ff" />
            <Particles color="#00ccff" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </>
    );
};

const LiveBackground = () => {
    const { theme } = useThemeStore();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (theme === 'light') {
        return (
            <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-blue-50 to-indigo-50"></div>
        );
    }

    // Mobile: Static Dark Background (No 3D)
    if (isMobile) {
        return (
            <div className="fixed inset-0 z-0 pointer-events-none bg-[#050510]"></div>
        );
    }

    // PC: Full 3D Universe
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <DarkScene />
            </Canvas>
        </div>
    );
};

export default LiveBackground;
