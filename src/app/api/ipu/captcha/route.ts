import { NextResponse } from 'next/server';

const IPU_BASE_URL = 'https://examweb.ggsipu.ac.in/web';

// Session store with expiration (in production, use Redis or similar)
interface SessionEntry {
    cookie: string;
    expiresAt: number;
}

const sessionStore = new Map<string, SessionEntry>();
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

// Clean up expired sessions periodically
function cleanupExpiredSessions() {
    const now = Date.now();
    for (const [key, entry] of sessionStore.entries()) {
        if (entry.expiresAt < now) {
            sessionStore.delete(key);
        }
    }
}

// Export session store for use in login route
export function getSessionCookie(sessionId: string): string | undefined {
    const entry = sessionStore.get(sessionId);
    if (entry && entry.expiresAt > Date.now()) {
        return entry.cookie;
    }
    return undefined;
}

export async function GET() {
    try {
        // Clean up expired sessions before processing
        cleanupExpiredSessions();

        const timestamp = Date.now();

        // Fetch captcha from IPU server
        const response = await fetch(`${IPU_BASE_URL}/CaptchaServlet?${timestamp}`, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: 'Failed to fetch captcha' },
                { status: 500 }
            );
        }

        // Get the session cookie from the response
        const setCookie = response.headers.get('set-cookie');
        let sessionId = '';

        if (setCookie) {
            const match = setCookie.match(/JSESSIONID=([^;]+)/);
            if (match) {
                sessionId = match[1];
                sessionStore.set(sessionId, {
                    cookie: setCookie,
                    expiresAt: Date.now() + SESSION_TTL_MS
                });
            }
        }

        // Convert the captcha image to base64
        const imageBuffer = await response.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        const captchaDataUrl = `data:image/png;base64,${base64Image}`;

        return NextResponse.json({
            success: true,
            captchaImage: captchaDataUrl,
            sessionId: sessionId,
        });
    } catch (error) {
        console.error('Captcha fetch error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch captcha' },
            { status: 500 }
        );
    }
}
