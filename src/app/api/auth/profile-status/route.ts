import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const maskEmail = (email?: string | null) => {
  if (!email || !email.includes('@')) {
    return null;
  }

  const [local, domain] = email.split('@');
  const visibleLocal = local.length <= 2 ? local[0] ?? '' : local.slice(0, 2);
  const maskedLocal = `${visibleLocal}${'*'.repeat(Math.max(local.length - visibleLocal.length, 1))}`;
  return `${maskedLocal}@${domain}`;
};

export async function GET(request: NextRequest) {
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

    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const { data: ownProfile, error: ownProfileError } = await serviceSupabase
      .from('students')
      .select('id, enrollment_no, email, college')
      .eq('id', user.id)
      .maybeSingle();

    if (ownProfileError) {
      console.error('[Profile Status] Own profile lookup error:', ownProfileError);
      return NextResponse.json({ error: 'Failed to check profile status' }, { status: 500 });
    }

    if (ownProfile) {
      return NextResponse.json({
        status: 'profile-exists',
        enrollmentNo: ownProfile.enrollment_no,
        college: ownProfile.college,
      });
    }

    if (user.email) {
      const { data: emailMatches, error: emailMatchError } = await serviceSupabase
        .from('students')
        .select('id, enrollment_no, email, college')
        .eq('email', user.email)
        .limit(1);

      if (emailMatchError) {
        console.error('[Profile Status] Email lookup error:', emailMatchError);
        return NextResponse.json({ error: 'Failed to check profile status' }, { status: 500 });
      }

      const linkedProfile = emailMatches?.find((profile) => profile.id !== user.id);
      if (linkedProfile) {
        return NextResponse.json({
          status: 'email-linked-profile',
          maskedEmail: maskEmail(linkedProfile.email),
          enrollmentNo: linkedProfile.enrollment_no,
          college: linkedProfile.college,
        });
      }
    }

    return NextResponse.json({ status: 'needs-onboarding' });
  } catch (err: unknown) {
    const details = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Profile Status] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error', details },
      { status: 500 }
    );
  }
}