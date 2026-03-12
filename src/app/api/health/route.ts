import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Health check endpoint to keep Supabase free tier database alive.
 * Call this endpoint every 6 days to prevent auto-suspension (7-day inactivity limit).
 * 
 * Usage:
 * - Use a free cron service like cron-job.org, easycron.com, or updown.io
 * - Set to call: https://yourapp.com/api/health every 6 days
 */
export async function GET() {
    try {
        const supabase = await createClient();

        // Simple read query to wake up the database
        const { data, error } = await supabase
            .from('students')
            .select('id')
            .limit(1);

        if (error) {
            console.error('Health check error:', error);
            return NextResponse.json(
                { status: 'error', message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: 'active',
            message: 'Supabase database is responsive',
        });
    } catch (err) {
        console.error('Health check exception:', err);
        return NextResponse.json(
            { status: 'error', message: 'Failed to reach database' },
            { status: 500 }
        );
    }
}
