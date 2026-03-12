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

function extractCookieHeader(setCookieHeader: string): string {
    return setCookieHeader
        .split(/,(?=[^;]+=)/)
        .map((cookiePart) => cookiePart.split(';', 1)[0].trim())
        .filter(Boolean)
        .join('; ');
}

export function storeSessionCookie(sessionId: string, cookie: string) {
    if (!sessionId || !cookie) {
        return;
    }

    sessionStore.set(sessionId, {
        cookie,
        expiresAt: Date.now() + SESSION_TTL_MS,
    });
}

export function updateSessionCookie(previousSessionId: string, setCookieHeader: string): string {
    const cookie = extractCookieHeader(setCookieHeader);
    const match = cookie.match(/JSESSIONID=([^;]+)/);
    const nextSessionId = match?.[1] || previousSessionId;

    storeSessionCookie(nextSessionId, cookie);

    if (previousSessionId && previousSessionId !== nextSessionId) {
        sessionStore.delete(previousSessionId);
    }

    return nextSessionId;
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
                { success: false, message: 'The IPU server returned an error. The server may be undergoing maintenance or experiencing issues. Please try again later.', serverError: true },
                { status: 502 }
            );
        }

        // Get the session cookie from the response
        const setCookie = response.headers.get('set-cookie');
        let sessionId = '';

        if (setCookie) {
            const match = setCookie.match(/JSESSIONID=([^;]+)/);
            if (match) {
                sessionId = match[1];
                storeSessionCookie(sessionId, extractCookieHeader(setCookie));
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
        const isTimeout = error instanceof Error && (error.message.includes('timeout') || error.message.includes('ETIMEDOUT') || error.message.includes('ECONNREFUSED') || error.message.includes('ECONNRESET') || error.message.includes('ENOTFOUND'));
        const message = isTimeout
            ? 'Unable to reach the IPU server. The server may be down or temporarily unavailable. Please try again after some time.'
            : 'Unable to connect to the IPU server. Please check your connection and try again.';
        return NextResponse.json(
            { success: false, message, serverError: true },
            { status: 502 }
        );
    }
}
