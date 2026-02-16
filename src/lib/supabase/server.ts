import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing sessions.
                    }
                },
            },
        }
    );
}

/**
 * Cached getUser — reads user from middleware-injected headers first.
 * Falls back to supabase.auth.getUser() only if headers are missing.
 * Eliminates the duplicate auth round-trip since middleware already calls getUser().
 */
export const getUser = cache(async () => {
    const headerStore = await headers();
    const userId = headerStore.get('x-user-id');
    const userEmail = headerStore.get('x-user-email');

    if (userId) {
        return { id: userId, email: userEmail } as { id: string; email: string | null;[key: string]: any };
    }

    // Fallback for contexts without middleware (e.g. API routes)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
});

/**
 * Cached student profile — deduplicates within a single server request.
 * Called from dashboard, settings, peers, rankboard, etc.
 */
export const getStudentProfile = cache(async (userId: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', userId)
        .single();
    return { data, error };
});

/**
 * Cached academic records with subjects — deduplicates within a single request.
 * Used by dashboard and settings pages.
 */
export const getAcademicRecords = cache(async (userId: string) => {
    const supabase = await createClient();
    const { data } = await supabase
        .from('academic_records')
        .select(`*, subjects (*)`)
        .eq('student_id', userId)
        .order('semester', { ascending: true });
    return data;
});


