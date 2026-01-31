import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/onboarding';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Check if user has completed onboarding
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                try {
                    // Check for deletion history server-side
                    const { data: deletionRecords, error: deletionError } = await supabase.rpc(
                        'get_deletion_proof',
                        { p_user_email: user.email }
                    );

                    if (!deletionError && deletionRecords && deletionRecords.length > 0) {
                        // User has deletion history - redirect to interstitial
                        return NextResponse.redirect(`${origin}/deletion-interstitial`);
                    }
                } catch (err) {
                    console.error('Error checking deletion history:', err);
                    // Continue with normal flow if check fails
                }

                // Check if user has completed onboarding
                const { data: student } = await supabase
                    .from('students')
                    .select('id')
                    .eq('id', user.id)
                    .single();

                // Redirect to dashboard if onboarded, otherwise to onboarding
                const redirectTo = student ? '/dashboard' : '/onboarding';
                return NextResponse.redirect(`${origin}${redirectTo}`);
            }
        }
    }

    // Return to home on error
    return NextResponse.redirect(`${origin}/`);
}
