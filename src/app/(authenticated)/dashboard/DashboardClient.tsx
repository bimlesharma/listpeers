'use client';

import { StatsCard } from '@/components/StatsCard';
import { SGPATrendChart, GradeDistributionChart, SemesterCreditsChart } from '@/components/Charts';
import { calculateSGPA, calculateCGPA, getGradeDistribution, getCGPADivision, getSemesterName } from '@/lib/grading';
import type { Student, AcademicRecord, Subject } from '@/types';
import { GraduationCap, TrendingUp, Award, BookOpen, FileText, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface RecordWithSubjects extends AcademicRecord {
    subjects: Subject[];
}

interface DashboardClientProps {
    student: Student;
    records: RecordWithSubjects[];
}

export function DashboardClient({ student, records }: DashboardClientProps) {
    // Calculate analytics
    const allSubjects = records.flatMap(r => r.subjects);

    const semesterStats = records.map(record => {
        const { sgpa, totalCredits } = calculateSGPA(record.subjects);
        return {
            semester: getSemesterName(record.semester),
            semesterNum: record.semester,
            sgpa,
            credits: totalCredits,
            subjectCount: record.subjects.length,
        };
    });

    const cgpa = calculateCGPA(
        semesterStats.map(s => ({ sgpa: s.sgpa, totalCredits: s.credits }))
    );

    const totalCredits = semesterStats.reduce((sum, s) => sum + s.credits, 0);
    const gradeDistribution = getGradeDistribution(allSubjects);
    const division = getCGPADivision(cgpa);

    // Prepare chart data
    const sgpaTrendData = semesterStats.map(s => ({
        semester: `Sem ${s.semesterNum}`,
        sgpa: s.sgpa,
    }));

    const creditsChartData = semesterStats.map(s => ({
        semester: `Sem ${s.semesterNum}`,
        credits: s.credits,
        sgpa: s.sgpa,
    }));

    const hasData = records.length > 0;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Welcome Header */}
            <div className="mb-8 animate-fade-in-up">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    Welcome back, {student.name || 'Student'}
                </h1>
                <p className="text-[var(--text-secondary)] mt-1">
                    {student.enrollment_no} • {student.branch || 'Branch not set'} • {student.batch || 'Batch not set'}
                </p>
            </div>

            {!hasData ? (
                /* Empty State */
                <div className="card p-12 text-center animate-fade-in-up stagger-1">
                    <div className="p-4 rounded-full bg-[var(--primary)] bg-opacity-10 w-fit mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-[var(--primary)]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                        No Academic Data Found
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                        Your academic records may not have been fetched properly during registration.
                        Please contact support if you believe this is an error.
                    </p>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="animate-fade-in-up stagger-1">
                            <StatsCard
                                title="CGPA"
                                value={cgpa.toFixed(2)}
                                subtitle={division}
                                icon={GraduationCap}
                                color="primary"
                            />
                        </div>
                        <div className="animate-fade-in-up stagger-2">
                            <StatsCard
                                title="Latest SGPA"
                                value={semesterStats[semesterStats.length - 1]?.sgpa.toFixed(2) || '0.00'}
                                subtitle={semesterStats[semesterStats.length - 1]?.semester}
                                icon={TrendingUp}
                                color="success"
                            />
                        </div>
                        <div className="animate-fade-in-up stagger-3">
                            <StatsCard
                                title="Total Credits"
                                value={totalCredits}
                                subtitle={`${records.length} semester${records.length > 1 ? 's' : ''}`}
                                icon={Award}
                                color="warning"
                            />
                        </div>
                        <div className="animate-fade-in-up stagger-4">
                            <StatsCard
                                title="Subjects"
                                value={allSubjects.length}
                                subtitle={`Best: ${gradeDistribution[0]?.grade || 'N/A'}`}
                                icon={BookOpen}
                                color="primary"
                            />
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="animate-fade-in-up stagger-3">
                            <SGPATrendChart data={sgpaTrendData} />
                        </div>
                        <div className="animate-fade-in-up stagger-4">
                            <GradeDistributionChart data={gradeDistribution} />
                        </div>
                    </div>

                    {/* Credits Chart */}
                    <div className="mb-8 animate-fade-in-up stagger-5">
                        <SemesterCreditsChart data={creditsChartData} />
                    </div>

                    {/* Semester Summary Table */}
                    <div className="card overflow-hidden animate-fade-in-up stagger-5">
                        <div className="p-4 border-b border-[var(--card-border)]">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                Semester Summary
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Semester</th>
                                        <th>Subjects</th>
                                        <th>Credits</th>
                                        <th>SGPA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {semesterStats.map((sem) => (
                                        <tr key={sem.semesterNum}>
                                            <td className="font-medium text-[var(--text-primary)]">
                                                {sem.semester}
                                            </td>
                                            <td className="text-[var(--text-secondary)]">
                                                {sem.subjectCount}
                                            </td>
                                            <td className="text-[var(--text-secondary)]">
                                                {sem.credits}
                                            </td>
                                            <td>
                                                <span className="font-semibold text-[var(--primary)]">
                                                    {sem.sgpa.toFixed(2)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Consent Notice */}
                    {!student.consent_analytics && (
                        <div className="mt-6 p-4 rounded-lg bg-[var(--warning)] bg-opacity-10 border border-[var(--warning)] border-opacity-20 flex items-start gap-3 animate-fade-in-up">
                            <AlertCircle className="w-5 h-5 text-[var(--warning)] flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-[var(--text-primary)]">
                                    Analytics are currently disabled.
                                </p>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">
                                    Enable analytics in <Link href="/settings" className="text-[var(--primary)] hover:underline">Settings</Link> to view your performance insights.
                                </p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
