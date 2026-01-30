import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { RankboardClient } from './RankboardClient';

export default async function RankboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

    // Get current user's profile
    const { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!student) {
        redirect('/onboarding');
    }

    // Only fetch rankboard if user has opted in
    let rankboardData: {
        id: string;
        display_name: string;
        batch: string | null;
        branch: string | null;
        college: string | null;
        cgpa: number;
    }[] = [];

    if (student.consent_rankboard) {
        // Get all opted-in students with their calculated CGPAs
        // This would normally use the rankboard_safe view
        const { data: rankedStudents } = await supabase
            .from('students')
            .select(`
        id,
        name,
        batch,
        branch,
        college,
        display_mode,
        consent_rankboard
      `)
            .eq('consent_rankboard', true);

        if (rankedStudents) {
            // Calculate CGPAs for each student
            for (const s of rankedStudents) {
                const { data: records } = await supabase
                    .from('academic_records')
                    .select('*, subjects (*)')
                    .eq('student_id', s.id);

                let totalCreditPoints = 0;
                let totalCredits = 0;

                if (records) {
                    for (const record of records) {
                        const subjects = (record as { subjects: { credits: number; grade_point: number }[] }).subjects || [];
                        for (const sub of subjects) {
                            if (sub.credits && sub.grade_point) {
                                totalCreditPoints += sub.credits * sub.grade_point;
                                totalCredits += sub.credits;
                            }
                        }
                    }
                }

                const cgpa = totalCredits > 0 ? totalCreditPoints / totalCredits : 0;

                // Apply display mode
                let displayName = 'Anonymous';
                if (s.display_mode === 'visible') {
                    displayName = s.name || 'Student';
                } else if (s.display_mode === 'pseudonymous') {
                    displayName = `Student ${s.id.substring(0, 4)}`;
                }

                rankboardData.push({
                    id: s.id,
                    display_name: displayName,
                    batch: s.batch,
                    branch: s.branch,
                    college: s.college,
                    cgpa: Math.round(cgpa * 100) / 100,
                });
            }

            // Sort by CGPA descending
            rankboardData.sort((a, b) => b.cgpa - a.cgpa);
        }
    }

    return (
        <RankboardClient
            student={student}
            rankboardData={rankboardData}
            currentUserId={user.id}
        />
    );
}
