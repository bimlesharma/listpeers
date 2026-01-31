'use client';

import { ReactNode, useMemo } from 'react';
import { useCursorPosition } from '@/contexts/CursorContext';
import { useRef, useEffect, useState } from 'react';

interface CursorEffectSectionProps {
    children: ReactNode;
    variant: 'hero' | 'features' | 'accent' | 'faq' | 'cta';
    className?: string;
}

export function CursorEffectSection({ children, variant, className = '' }: CursorEffectSectionProps) {
    const elementRef = useRef<HTMLDivElement>(null);
    const globalCursorPos = useCursorPosition();
    const [isInside, setIsInside] = useState(false);
    const [relativePos, setRelativePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseEnter = () => setIsInside(true);
        const handleMouseLeave = () => setIsInside(false);

        const element = elementRef.current;
        if (element) {
            element.addEventListener('mouseenter', handleMouseEnter);
            element.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            if (element) {
                element.removeEventListener('mouseenter', handleMouseEnter);
                element.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    useEffect(() => {
        if (elementRef.current) {
            const rect = elementRef.current.getBoundingClientRect();
            setRelativePos({
                x: globalCursorPos.x - rect.left,
                y: globalCursorPos.y - rect.top,
            });
        }
    }, [globalCursorPos]);

    const getEffectConfig = () => {
        switch (variant) {
            case 'hero':
                return {
                    glows: [
                        {
                            size: 500,
                            blur: 'blur-4xl',
                            color: 'rgba(244, 63, 94, 0.25)',
                            opacity: 0.4,
                            offsetX: 0,
                            offsetY: 0,
                            delay: 0.06,
                        },
                        {
                            size: 300,
                            blur: 'blur-3xl',
                            color: 'rgba(236, 72, 153, 0.2)',
                            opacity: 0.25,
                            offsetX: 40,
                            offsetY: -40,
                            delay: 0.1,
                        },
                    ],
                };
            case 'features':
                return {
                    glows: [
                        {
                            size: 350,
                            blur: 'blur-3xl',
                            color: 'rgba(14, 165, 233, 0.25)',
                            opacity: 0.3,
                            offsetX: 0,
                            offsetY: 0,
                            delay: 0.08,
                        },
                        {
                            size: 200,
                            blur: 'blur-2xl',
                            color: 'rgba(59, 130, 246, 0.15)',
                            opacity: 0.2,
                            offsetX: -50,
                            offsetY: 50,
                            delay: 0.12,
                        },
                    ],
                };
            case 'accent':
                return {
                    glows: [
                        {
                            size: 400,
                            blur: 'blur-3xl',
                            color: 'rgba(168, 85, 247, 0.3)',
                            opacity: 0.35,
                            offsetX: 0,
                            offsetY: 0,
                            delay: 0.07,
                        },
                        {
                            size: 250,
                            blur: 'blur-2xl',
                            color: 'rgba(139, 92, 246, 0.2)',
                            opacity: 0.25,
                            offsetX: -60,
                            offsetY: -60,
                            delay: 0.11,
                        },
                    ],
                };
            case 'faq':
                return {
                    glows: [
                        {
                            size: 300,
                            blur: 'blur-2xl',
                            color: 'rgba(34, 197, 94, 0.2)',
                            opacity: 0.25,
                            offsetX: 0,
                            offsetY: 0,
                            delay: 0.1,
                        },
                    ],
                };
            case 'cta':
                return {
                    glows: [
                        {
                            size: 600,
                            blur: 'blur-4xl',
                            color: 'rgba(244, 63, 94, 0.3)',
                            opacity: 0.5,
                            offsetX: 0,
                            offsetY: 0,
                            delay: 0.05,
                        },
                        {
                            size: 400,
                            blur: 'blur-3xl',
                            color: 'rgba(236, 72, 153, 0.25)',
                            opacity: 0.3,
                            offsetX: 80,
                            offsetY: 80,
                            delay: 0.09,
                        },
                    ],
                };
            default:
                return { glows: [] };
        }
    };

    const config = getEffectConfig();

    return (
        <div ref={elementRef} className={`relative overflow-hidden ${className}`}>
            {/* Cursor tracking glows - positioned absolutely within section, on top */}
            {isInside &&
                config.glows.map((glow, idx) => (
                    <div
                        key={idx}
                        className={`pointer-events-none absolute rounded-full ${glow.blur}`}
                        style={{
                            width: `${glow.size}px`,
                            height: `${glow.size}px`,
                            background: `radial-gradient(circle, ${glow.color}, transparent)`,
                            left: `${relativePos.x - glow.size / 2 + glow.offsetX}px`,
                            top: `${relativePos.y - glow.size / 2 + glow.offsetY}px`,
                            opacity: glow.opacity,
                            transition: `all ${glow.delay}s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                            zIndex: 50,
                        }}
                    />
                ))}

            {/* Content - max-w-7xl and px-4 applied here for proper centering */}
            <div className="relative z-10 max-w-7xl mx-auto px-4">{children}</div>
        </div>
    );
}
