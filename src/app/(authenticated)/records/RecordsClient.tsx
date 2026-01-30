'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { calculateSGPA, getSemesterName, getGradeColor } from '@/lib/grading';
import type { AcademicRecord, Subject } from '@/types';
import { ChevronDown, ChevronUp, Trash2, FileText, AlertCircle, Loader2 } from 'lucide-react';

interface RecordWithSubjects extends AcademicRecord {
    subjects: Subject[];
}

interface RecordsClientProps {
    records: RecordWithSubjects[];
}

export function RecordsClient({ records }: RecordsClientProps) {
    const router = useRouter();
    const supabase = createClient();
    const [expandedSemester, setExpandedSemester] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    const toggleSemester = (id: string) => {
        setExpandedSemester(expandedSemester === id ? null : id);
    };

    const handleDelete = async (recordId: string) => {
        setDeletingId(recordId);

        try {
            // Delete the record (cascades to subjects)
            const { error } = await supabase
                .from('academic_records')
                .delete()
                .eq('id', recordId);

            if (error) {
                console.error('Delete error:', error);
                alert('Failed to delete record. Please try again.');
            } else {
                router.refresh();
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('An error occurred. Please try again.');
        } finally {
            setDeletingId(null);
            setShowDeleteConfirm(null);
        }
    };

    if (records.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        Academic Records
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        View and manage your semester data
                    </p>
                </div>

                <div className="card p-12 text-center animate-fade-in-up stagger-1">
                    <div className="p-4 rounded-full bg-[var(--primary)] bg-opacity-10 w-fit mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-[var(--primary)]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                        No Records Found
                    </h2>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                        Your academic records may not have been fetched properly.
                        Please contact support if you believe this is an error.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8 animate-fade-in-up">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    Academic Records
                </h1>
                <p className="text-[var(--text-secondary)] mt-1">
                    {records.length} semester{records.length > 1 ? 's' : ''} • Data imported from IPU Portal
                </p>
            </div>

            <div className="space-y-4">
                {records.map((record, index) => {
                    const { sgpa, totalCredits } = calculateSGPA(record.subjects);
                    const isExpanded = expandedSemester === record.id;

                    return (
                        <div
                            key={record.id}
                            className="card overflow-hidden animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Header */}
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-[var(--hover-bg)] transition-colors"
                                onClick={() => toggleSemester(record.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-[var(--primary)] bg-opacity-10">
                                        <FileText className="w-5 h-5 text-[var(--primary)]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--text-primary)]">
                                            {getSemesterName(record.semester)}
                                        </h3>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            {record.subjects.length} subjects • {totalCredits} credits
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm text-[var(--text-muted)]">SGPA</p>
                                        <p className="text-xl font-bold text-[var(--primary)]">
                                            {sgpa.toFixed(2)}
                                        </p>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                                    )}
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="border-t border-[var(--card-border)] animate-fade-in">
                                    <div className="overflow-x-auto">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Code</th>
                                                    <th>Subject</th>
                                                    <th className="text-center">Internal</th>
                                                    <th className="text-center">External</th>
                                                    <th className="text-center">Total</th>
                                                    <th className="text-center">Grade</th>
                                                    <th className="text-center">Credits</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {record.subjects.map((subject) => (
                                                    <tr key={subject.id}>
                                                        <td className="font-mono text-sm text-[var(--text-secondary)]">
                                                            {subject.code}
                                                        </td>
                                                        <td className="text-[var(--text-primary)]">
                                                            {subject.name}
                                                        </td>
                                                        <td className="text-center text-[var(--text-secondary)]">
                                                            {subject.internal_marks}
                                                        </td>
                                                        <td className="text-center text-[var(--text-secondary)]">
                                                            {subject.external_marks}
                                                        </td>
                                                        <td className="text-center font-medium text-[var(--text-primary)]">
                                                            {subject.total_marks}
                                                        </td>
                                                        <td className="text-center">
                                                            <span
                                                                className="font-bold"
                                                                style={{ color: getGradeColor(subject.grade || '') }}
                                                            >
                                                                {subject.grade}
                                                            </span>
                                                        </td>
                                                        <td className="text-center text-[var(--text-secondary)]">
                                                            {subject.credits}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Actions */}
                                    <div className="p-4 border-t border-[var(--card-border)] flex justify-end gap-2">
                                        {showDeleteConfirm === record.id ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-[var(--text-secondary)]">
                                                    Delete this semester?
                                                </span>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(null)}
                                                    className="btn-secondary py-1.5 px-3 text-sm"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(record.id)}
                                                    disabled={deletingId === record.id}
                                                    className="py-1.5 px-3 text-sm rounded-lg bg-[var(--error)] text-white hover:opacity-90 disabled:opacity-50 flex items-center gap-1"
                                                >
                                                    {deletingId === record.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setShowDeleteConfirm(record.id)}
                                                className="text-sm text-[var(--text-muted)] hover:text-[var(--error)] flex items-center gap-1 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Warning */}
            <div className="mt-6 p-4 rounded-lg bg-[var(--warning)] bg-opacity-10 border border-[var(--warning)] border-opacity-20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[var(--warning)] flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm text-[var(--text-primary)]">
                        Deleting a semester removes all associated data permanently.
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                        This action cannot be undone. Make sure to export your data first if needed.
                    </p>
                </div>
            </div>
        </div>
    );
}
