'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CursorPosition {
    x: number;
    y: number;
}

interface CursorContextType {
    position: CursorPosition;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children }: { children: ReactNode }) {
    const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <CursorContext.Provider value={{ position }}>
            {children}
        </CursorContext.Provider>
    );
}

export function useCursorPosition() {
    const context = useContext(CursorContext);
    if (!context) {
        throw new Error('useCursorPosition must be used within CursorProvider');
    }
    return context.position;
}
