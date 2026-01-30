import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SettingsClient } from './SettingsClient';
import type { AcademicRecord, Subject } from '@/types';

interface RecordWithSubjects extends AcademicRecord {
    subjects: Subject[];
}

export default async function SettingsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

    // Get student profile
    const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', user.id)
        .single();

    if (studentError || !student) {
        redirect('/onboarding');
    }

    // Get academic records for export
    const { data: records } = await supabase
        .from('academic_records')
        .select(`
      *,
      subjects (*)
    `)
        .eq('student_id', user.id)
        .order('semester', { ascending: true });

    // Get consent logs
    const { data: consentLogs } = await supabase
        .from('consent_log')
        .select('*')
        .eq('student_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(10);

    return (
        <SettingsClient
            student={student}
            records={(records as RecordWithSubjects[]) || []}
            consentLogs={consentLogs || []}
        />
    );
}
