import { NextRequest, NextResponse } from 'next/server';
import type { IPUResult } from '@/types/ipu';
import { getSessionCookie } from '../captcha/route';

const IPU_BASE_URL = 'https://examweb.ggsipu.ac.in/web';

interface IPUResultsErrorResponse {
    status?: string;
    message?: string;
}

interface IPUStudentProfile {
    nrollno?: string;
    stname?: string;
    byoa?: number | string;
    yoa?: number | string;
    prgname?: string;
    iname?: string;
}

type IPUResultRow = [
    number | string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
];

interface IPUNewResultsResponse {
    report?: string;
    stprofile?: IPUStudentProfile;
    header?: string[];
    stresult?: IPUResultRow[];
}

function isNewIPUResultsResponse(data: unknown): data is IPUNewResultsResponse {
    return !!data && typeof data === 'object' && Array.isArray((data as IPUNewResultsResponse).stresult);
}

function isIPUResultsErrorResponse(data: unknown): data is IPUResultsErrorResponse {
    return !!data && typeof data === 'object' && 'message' in data;
}

function normalizeIPUResults(data: IPUNewResultsResponse): IPUResult[] {
    const profile = data.stprofile ?? {};
    const rows = Array.isArray(data.stresult) ? data.stresult : [];

    return rows.map((row) => {
        const [semester, paperCode, subjectName, internal, external, total, status, , declaredDate] = row;

        return {
            stname: profile.stname || '',
            nrollno: profile.nrollno || '',
            iname: profile.iname || '',
            instname: profile.iname || '',
            prgname: profile.prgname || '',
            progname: profile.prgname || '',
            batch: profile.byoa ? String(profile.byoa) : undefined,
            yoa: profile.yoa ? String(profile.yoa) : undefined,
            byoa: profile.byoa ? String(profile.byoa) : undefined,
            papercode: paperCode || '',
            papername: subjectName || '',
            minorprint: internal || '0',
            majorprint: external || '0',
            moderatedprint: total || '0',
            eugpa: status || '',
            declareddate: declaredDate || '',
            euno: semester,
        };
    });
}

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
        const sessionCookie = getSessionCookie(sessionId) || `JSESSIONID=${sessionId}`;

        const response = await fetch(
            `${IPU_BASE_URL}/StudentSearchProcess?flag=2&euno=${semester}`,
            {
                method: 'GET',
                headers: {
                    'Cookie': sessionCookie,
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
        let data: IPUResult[] | IPUResultsErrorResponse | IPUNewResultsResponse;
        try {
            data = JSON.parse(responseText);
        } catch {
            return NextResponse.json(
                { success: false, message: 'Invalid response from server. Session may have expired.' },
                { status: 401 }
            );
        }

        if (!data) {
            return NextResponse.json(
                { success: false, message: 'Empty response from server.' },
                { status: 502 }
            );
        }

        if (!Array.isArray(data) && isNewIPUResultsResponse(data)) {
            data = normalizeIPUResults(data);
        }

        if (!Array.isArray(data)) {
            const message = isIPUResultsErrorResponse(data)
                ? data.message || 'Unexpected response from results server.'
                : 'Unexpected response from results server.';
            const isSessionError = /session expired|log in again|login again/i.test(message);

            console.error('Unexpected IPU results response shape:', data);

            return NextResponse.json(
                { success: false, message },
                { status: isSessionError ? 401 : 502 }
            );
        }

        // If empty array, the login is valid but there are no declared results.
        if (data.length === 0) {
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
