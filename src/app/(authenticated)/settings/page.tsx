import { getUser, getStudentProfile, getAcademicRecords, createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { AcademicRecord, Subject } from '@/types';
import { HeaderSkeleton } from '@/components/SkeletonLoader';

const SettingsClient = dynamic(() => import('./SettingsClient').then(mod => ({ default: mod.SettingsClient })), {
    loading: () => (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <HeaderSkeleton />
            <div className="space-y-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="animate-pulse bg-(--card-bg) border border-(--card-border) rounded-xl p-6 h-32" />
                ))}
            </div>
        </div>
    )
});

interface RecordWithSubjects extends AcademicRecord {
    subjects: Subject[];
}

export default async function SettingsPage() {
    const user = await getUser();

    if (!user) {
        redirect('/');
    }

    // Fetch profile, records, and consent logs in parallel
    const supabase = await createClient();
    const [{ data: student, error: studentError }, records, { data: consentLogs }] = await Promise.all([
        getStudentProfile(user.id),
        getAcademicRecords(user.id),
        supabase
            .from('consent_log')
            .select('*')
            .eq('student_id', user.id)
            .order('logged_at', { ascending: false })
            .limit(10),
    ]);

    if (studentError || !student) {
        redirect('/onboarding');
    }

    return (
        <SettingsClient
            student={student}
            records={(records as RecordWithSubjects[]) || []}
            consentLogs={consentLogs || []}
        />
    );
}
