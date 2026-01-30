import { NextRequest, NextResponse } from 'next/server';

const IPU_BASE_URL = 'https://examweb.ggsipu.ac.in/web';

export async function POST(request: NextRequest) {
    try {
        const { username, hashedPassword, captcha, sessionId } = await request.json();

        if (!username || !hashedPassword || !captcha || !sessionId) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create form data for login
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('passwd', hashedPassword);
        formData.append('captcha', captcha);

        // Send login request to IPU server
        const response = await fetch(`${IPU_BASE_URL}/Login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': `JSESSIONID=${sessionId}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            body: formData.toString(),
            redirect: 'manual',
        });

        // Get the response headers to check for new session cookie
        const setCookie = response.headers.get('set-cookie');
        let newSessionId = sessionId;

        if (setCookie) {
            const match = setCookie.match(/JSESSIONID=([^;]+)/);
            if (match) {
                newSessionId = match[1];
            }
        }

        // Check if login was successful (redirect to studenthome.jsp)
        const location = response.headers.get('location');
        const responseText = await response.text();

        // Success is indicated by redirect to student home
        if ((location && location.includes('studenthome')) ||
            response.status === 302 ||
            responseText.includes('studenthome')) {

            return NextResponse.json({
                success: true,
                message: 'Login successful',
                sessionId: newSessionId,
            });
        }

        // Check for specific error messages
        if (responseText.includes('Captcha validation fails')) {
            return NextResponse.json({
                success: false,
                message: 'Invalid captcha. Please try again.',
            });
        }

        if (responseText.includes('Invalid') || responseText.includes('incorrect')) {
            return NextResponse.json({
                success: false,
                message: 'Invalid username or password.',
            });
        }

        // Generic failure
        return NextResponse.json({
            success: false,
            message: 'Login failed. Please try again.',
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred during login' },
            { status: 500 }
        );
    }
}
