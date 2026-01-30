import { NextRequest, NextResponse } from 'next/server';
import type { IPUResult } from '@/types/ipu';

const IPU_BASE_URL = 'https://examweb.ggsipu.ac.in/web';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const sessionId = searchParams.get('sessionId');
        const semester = searchParams.get('semester') || '100'; // Default to ALL

        if (!sessionId) {
            return NextResponse.json(
                { success: false, message: 'Session ID required' },
                { status: 401 }
            );
        }

        // Fetch results from IPU API
        const response = await fetch(
            `${IPU_BASE_URL}/StudentSearchProcess?flag=2&euno=${semester}`,
            {
                method: 'GET',
                headers: {
                    'Cookie': `JSESSIONID=${sessionId}`,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json, text/plain, */*',
                    'Referer': 'https://examweb.ggsipu.ac.in/web/student/studenthome.jsp',
                },
            }
        );

        // Get response text first to inspect
        const responseText = await response.text();

        // Check if session expired or not authorized
        const isLoginPage = response.status === 401 ||
            response.status === 403 ||
            responseText.includes('StudentLogin.jsp') ||
            responseText.includes('login.jsp') ||
            responseText.includes('<form') && responseText.includes('password');

        if (isLoginPage) {
            return NextResponse.json(
                { success: false, message: 'Session expired. Please login again.' },
                { status: 401 }
            );
        }

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: `Failed to fetch results: ${response.status}` },
                { status: response.status }
            );
        }

        // Try to parse as JSON
        let data: IPUResult[];
        try {
            data = JSON.parse(responseText);
        } catch {
            return NextResponse.json(
                { success: false, message: 'Invalid response from server. Session may have expired.' },
                { status: 401 }
            );
        }

        // If no data or empty array
        if (!data || !Array.isArray(data) || data.length === 0) {
            return NextResponse.json({
                success: true,
                results: [],
                message: 'No results found'
            });
        }

        return NextResponse.json({
            success: true,
            results: data,
        });

    } catch (error) {
        console.error('Results fetch error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch results' },
            { status: 500 }
        );
    }
}
