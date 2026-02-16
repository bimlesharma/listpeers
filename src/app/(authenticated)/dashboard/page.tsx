import { getUser, getStudentProfile, getAcademicRecords } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { AcademicRecord, Subject } from '@/types';
import { Suspense } from 'react';
import { HeaderSkeleton, ChartSkeleton, TableSkeleton, GridSkeleton } from '@/components/SkeletonLoader';

const DashboardClient = dynamic(() => import('./DashboardClient').then(mod => ({ default: mod.DashboardClient })), {
    loading: () => (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <HeaderSkeleton />
            <GridSkeleton count={6} />
            <ChartSkeleton />
            <ChartSkeleton />
            <TableSkeleton />
        </div>
    )
});

interface RecordWithSubjects extends AcademicRecord {
    subjects: Subject[];
}

export default async function DashboardPage() {
    const user = await getUser();

    if (!user) {
        redirect('/');
    }

    // Fetch student profile and academic records in parallel
    const [{ data: student, error: studentError }, records] = await Promise.all([
        getStudentProfile(user.id),
        getAcademicRecords(user.id),
    ]);

    if (studentError || !student) {
        redirect('/onboarding');
    }

    return (
        <Suspense
            fallback={
                <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                    <HeaderSkeleton />
                    <GridSkeleton count={4} />
                    <ChartSkeleton />
                    <ChartSkeleton />
                    <TableSkeleton />
                </div>
            }
        >
            <DashboardClient
                student={student}
                records={(records as RecordWithSubjects[]) || []}
                consentAnalytics={student.consent_analytics || false}
            />
        </Suspense>
    );
}
