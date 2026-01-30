import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { RecordsClient } from './RecordsClient';
import type { AcademicRecord, Subject } from '@/types';

interface RecordWithSubjects extends AcademicRecord {
    subjects: Subject[];
}

export default async function RecordsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

    // Get all academic records with subjects
    const { data: records } = await supabase
        .from('academic_records')
        .select(`
      *,
      subjects (*)
    `)
        .eq('student_id', user.id)
        .order('semester', { ascending: true });

    return <RecordsClient records={(records as RecordWithSubjects[]) || []} />;
}
