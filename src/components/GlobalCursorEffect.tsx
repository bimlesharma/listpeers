'use client';

import { useCursorPosition } from '@/contexts/CursorContext';
import { useEffect, useRef } from 'react';

export function GlobalCursorEffect() {
    const cursorPos = useCursorPosition();
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
        >
            {/* Primary glow - rose */}
            <div
                className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(244, 63, 94, 0.6), transparent)',
                    left: `${cursorPos.x - 192}px`,
                    top: `${cursorPos.y - 192}px`,
                    transition: 'all 0.08s ease-out',
                }}
            />
            {/* Secondary glow - pink */}
            <div
                className="absolute w-64 h-64 rounded-full blur-2xl opacity-15"
                style={{
                    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.5), transparent)',
                    left: `${cursorPos.x - 128}px`,
                    top: `${cursorPos.y - 128}px`,
                    transition: 'all 0.1s ease-out',
                }}
            />
        </div>
    );
}
