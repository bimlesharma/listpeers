import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardClient } from './DashboardClient';
import type { AcademicRecord, Subject } from '@/types';

interface RecordWithSubjects extends AcademicRecord {
    subjects: Subject[];
}

export default async function DashboardPage() {
    const supabase = await createClient();

    // Get current user
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

    // Get academic records with subjects
    const { data: records } = await supabase
        .from('academic_records')
        .select(`
      *,
      subjects (*)
    `)
        .eq('student_id', user.id)
        .order('semester', { ascending: true });

    return (
        <DashboardClient
            student={student}
            records={(records as RecordWithSubjects[]) || []}
        />
    );
}
