import { useRef, useEffect, useState } from 'react';

export interface CursorPosition {
    x: number;
    y: number;
}

export function useCursorTracker() {
    const elementRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState<CursorPosition>({ x: 0, y: 0 });
    const [isInside, setIsInside] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (elementRef.current) {
                const rect = elementRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setMousePosition({ x, y });
            }
        };

        const handleMouseEnter = () => setIsInside(true);
        const handleMouseLeave = () => setIsInside(false);

        const element = elementRef.current;
        if (element) {
            element.addEventListener('mouseenter', handleMouseEnter);
            element.addEventListener('mouseleave', handleMouseLeave);
        }

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (element) {
                element.removeEventListener('mouseenter', handleMouseEnter);
                element.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    return { elementRef, mousePosition, isInside };
}
