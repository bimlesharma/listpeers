/**
 * Grading System Utilities
 * Based on standard Indian university grading scale
 */

import type { Subject, GradeCount } from '@/types';

// Grade Scale: Marks → Grade → Grade Point
export const GRADE_SCALE = [
    { minMarks: 90, maxMarks: 100, grade: 'O', gradePoint: 10, label: 'Outstanding', color: '#10b981' },
    { minMarks: 75, maxMarks: 89, grade: 'A+', gradePoint: 9, label: 'Excellent', color: '#06b6d4' },
    { minMarks: 65, maxMarks: 74, grade: 'A', gradePoint: 8, label: 'Very Good', color: '#3b82f6' },
    { minMarks: 55, maxMarks: 64, grade: 'B+', gradePoint: 7, label: 'Good', color: '#8b5cf6' },
    { minMarks: 50, maxMarks: 54, grade: 'B', gradePoint: 6, label: 'Above Average', color: '#a855f7' },
    { minMarks: 45, maxMarks: 49, grade: 'C', gradePoint: 5, label: 'Average', color: '#f59e0b' },
    { minMarks: 40, maxMarks: 44, grade: 'P', gradePoint: 4, label: 'Pass', color: '#f97316' },
    { minMarks: 0, maxMarks: 39, grade: 'F', gradePoint: 0, label: 'Fail', color: '#ef4444' },
] as const;

// Division based on CGPA
export const DIVISION_SCALE = [
    { minCGPA: 10.0, maxCGPA: 10.0, division: 'Exemplary Performance' },
    { minCGPA: 6.50, maxCGPA: 9.99, division: 'First Division' },
    { minCGPA: 5.00, maxCGPA: 6.49, division: 'Second Division' },
    { minCGPA: 4.00, maxCGPA: 4.99, division: 'Third Division' },
    { minCGPA: 0, maxCGPA: 3.99, division: 'Fail' },
] as const;

/**
 * Convert total marks (out of 100) to letter grade
 */
export function marksToGrade(marks: number): string {
    for (const scale of GRADE_SCALE) {
        if (marks >= scale.minMarks && marks <= scale.maxMarks) {
            return scale.grade;
        }
    }
    return 'F';
}

/**
 * Convert total marks (out of 100) to grade point
 */
export function marksToGradePoint(marks: number): number {
    for (const scale of GRADE_SCALE) {
        if (marks >= scale.minMarks && marks <= scale.maxMarks) {
            return scale.gradePoint;
        }
    }
    return 0;
}

/**
 * Get grade color for UI
 */
export function getGradeColor(grade: string): string {
    const scale = GRADE_SCALE.find(s => s.grade === grade);
    return scale?.color || '#6b7280';
}

/**
 * Get CGPA division
 */
export function getCGPADivision(cgpa: number): string {
    for (const scale of DIVISION_SCALE) {
        if (cgpa >= scale.minCGPA && cgpa <= scale.maxCGPA) {
            return scale.division;
        }
    }
    return 'N/A';
}

/**
 * Calculate SGPA for a semester
 * SGPA = Σ(Credits × Grade Points) / Σ(Credits)
 */
export function calculateSGPA(subjects: Subject[]): { sgpa: number; totalCredits: number } {
    if (!subjects || subjects.length === 0) {
        return { sgpa: 0, totalCredits: 0 };
    }

    let totalCreditPoints = 0;
    let totalCredits = 0;

    for (const subject of subjects) {
        const gradePoint = subject.grade_point ?? marksToGradePoint(subject.total_marks);
        const credits = subject.credits;

        if (gradePoint > 0 && credits > 0) {
            totalCreditPoints += credits * gradePoint;
            totalCredits += credits;
        }
    }

    const sgpa = totalCredits > 0 ? totalCreditPoints / totalCredits : 0;

    return {
        sgpa: Math.round(sgpa * 100) / 100,
        totalCredits,
    };
}

/**
 * Calculate CGPA across all semesters
 * CGPA = Σ(all semester credits × grade points) / Σ(all semester credits)
 */
export function calculateCGPA(
    semesters: { sgpa: number; totalCredits: number }[]
): number {
    if (!semesters || semesters.length === 0) {
        return 0;
    }

    let totalCreditPoints = 0;
    let totalCredits = 0;

    for (const sem of semesters) {
        totalCreditPoints += sem.sgpa * sem.totalCredits;
        totalCredits += sem.totalCredits;
    }

    return totalCredits > 0
        ? Math.round((totalCreditPoints / totalCredits) * 100) / 100
        : 0;
}

/**
 * Get grade distribution from subjects
 */
export function getGradeDistribution(subjects: Subject[]): GradeCount[] {
    const distribution = new Map<string, number>();

    for (const subject of subjects) {
        const grade = subject.grade ?? marksToGrade(subject.total_marks);
        distribution.set(grade, (distribution.get(grade) || 0) + 1);
    }

    const gradeOrder = ['O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F'];

    return gradeOrder
        .filter(grade => distribution.has(grade))
        .map(grade => ({
            grade,
            count: distribution.get(grade) || 0,
            color: getGradeColor(grade),
        }));
}

/**
 * Get the best grade from subjects
 */
export function getBestGrade(subjects: Subject[]): string {
    if (!subjects || subjects.length === 0) return 'N/A';

    const maxMarks = Math.max(...subjects.map(s => s.total_marks || 0));
    return marksToGrade(maxMarks);
}

/**
 * Get semester name from number
 */
export function getSemesterName(num: number): string {
    const names = [
        '',
        'First Semester',
        'Second Semester',
        'Third Semester',
        'Fourth Semester',
        'Fifth Semester',
        'Sixth Semester',
        'Seventh Semester',
        'Eighth Semester',
        'Ninth Semester',
        'Tenth Semester',
    ];
    return names[num] || `Semester ${num}`;
}
