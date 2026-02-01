import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

type LinkedEnrollmentRequest = {
  enrollmentNo?: string;
  college?: string | null;
};

const maskEmail = (email?: string | null) => {
  if (!email || !email.includes('@')) {
    return null;
  }

  const [local, domain] = email.split('@');
  const visibleLocal = local.length <= 2 ? local[0] ?? '' : local.slice(0, 2);
  const maskedLocal = `${visibleLocal}${'*'.repeat(Math.max(local.length - visibleLocal.length, 1))}`;
  return `${maskedLocal}@${domain}`;
};

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'Failed to verify user' }, { status: 401 });
    }

    const body = (await request.json()) as LinkedEnrollmentRequest;
    const enrollmentNo = body.enrollmentNo?.trim().toUpperCase();
    const college = body.college?.trim();

    if (!enrollmentNo) {
      return NextResponse.json({ maskedEmail: null }, { status: 200 });
    }

    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    let query = serviceSupabase
      .from('students')
      .select('email')
      .eq('enrollment_no', enrollmentNo);

    if (college) {
      query = query.eq('college', college);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error('[Linked Enrollment] Query error:', error);
      return NextResponse.json({ maskedEmail: null }, { status: 200 });
    }

    return NextResponse.json({ maskedEmail: maskEmail(data?.email ?? null) });
  } catch (err: any) {
    console.error('[Linked Enrollment] Error:', err);
    return NextResponse.json({ maskedEmail: null }, { status: 200 });
  }
}
