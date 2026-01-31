import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Create Supabase client with the user's token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Verify token and get user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user?.email) {
      console.error('[Check Deletion] Auth error:', userError);
      return NextResponse.json(
        { error: 'Failed to verify user' },
        { status: 401 }
      );
    }

    // Use service role to query deletion_events
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Query deletion events with hashed email
    const { data: deletionEvents, error: queryError } = await serviceSupabase.rpc(
      'get_deletion_proof',
      { p_user_email: user.email }
    );

    if (queryError) {
      console.error('[Check Deletion] Query error:', queryError);
      return NextResponse.json(
        { error: 'Failed to check deletion history' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      hasDeletedBefore: (deletionEvents?.length ?? 0) > 0,
      deletionRecords: deletionEvents || [],
      userEmail: user.email
    });
  } catch (err: any) {
    console.error('[Check Deletion] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err?.message },
      { status: 500 }
    );
  }
}
