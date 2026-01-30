'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { Student, AcademicRecord, Subject, ConsentLog } from '@/types';
import {
    Settings,
    Shield,
    Eye,
    Download,
    Trash2,
    Loader2,
    CheckCircle2,
    AlertCircle,
    History,
    User
} from 'lucide-react';

interface RecordWithSubjects extends AcademicRecord {
    subjects: Subject[];
}

interface SettingsClientProps {
    student: Student;
    records: RecordWithSubjects[];
    consentLogs: ConsentLog[];
}

export function SettingsClient({ student, records, consentLogs }: SettingsClientProps) {
    const router = useRouter();
    const supabase = createClient();

    const [consentAnalytics, setConsentAnalytics] = useState(student.consent_analytics);
    const [consentRankboard, setConsentRankboard] = useState(student.consent_rankboard);
    const [displayMode, setDisplayMode] = useState(student.display_mode);
    const [marksVisibility, setMarksVisibility] = useState(student.marks_visibility);

    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const [showMarksConfirm, setShowMarksConfirm] = useState(false);

    const handleSaveConsent = async () => {
        setSaving(true);
        setError(null);
        setSaveSuccess(false);

        try {
            const { error: updateError } = await supabase
                .from('students')
                .update({
                    consent_analytics: consentAnalytics,
                    consent_rankboard: consentRankboard,
                    display_mode: displayMode,
                    marks_visibility: marksVisibility,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', student.id);

            if (updateError) {
                setError('Failed to save settings. Please try again.');
            } else {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
                router.refresh();
            }
        } catch (err) {
            console.error('Save error:', err);
            setError('An unexpected error occurred.');
        } finally {
            setSaving(false);
        }
    };

    const handleExportData = () => {
        const exportData = {
            profile: {
                enrollment_no: student.enrollment_no,
                name: student.name,
                batch: student.batch,
                branch: student.branch,
                college: student.college,
                created_at: student.created_at,
            },
            consent: {
                analytics: student.consent_analytics,
                rankboard: student.consent_rankboard,
                display_mode: student.display_mode,
                marks_visibility: student.marks_visibility,
            },
            academic_records: records.map(r => ({
                semester: r.semester,
                submitted_at: r.submitted_at,
                subjects: r.subjects.map(s => ({
                    code: s.code,
                    name: s.name,
                    internal_marks: s.internal_marks,
                    external_marks: s.external_marks,
                    total_marks: s.total_marks,
                    credits: s.credits,
                    grade: s.grade,
                    grade_point: s.grade_point,
                })),
            })),
            consent_log: consentLogs,
            exported_at: new Date().toISOString(),
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `peerlist-export-${student.enrollment_no}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDeleteAllData = async () => {
        if (deleteConfirmText !== student.enrollment_no) {
            setError('Please type your enrollment number to confirm deletion.');
            return;
        }

        setDeleting(true);
        setError(null);

        try {
            // Delete user from auth (this cascades to students table via RLS)
            // For now, we'll delete the student record which cascades to records/subjects
            const { error: deleteError } = await supabase
                .from('students')
                .delete()
                .eq('id', student.id);

            if (deleteError) {
                setError('Failed to delete data. Please try again.');
                setDeleting(false);
                return;
            }

            // Sign out
            await supabase.auth.signOut();
            router.push('/');
        } catch (err) {
            console.error('Delete error:', err);
            setError('An unexpected error occurred.');
            setDeleting(false);
        }
    };

    const handleMarksVisibilityToggle = (checked: boolean) => {
        if (checked) {
            setShowMarksConfirm(true);
        } else {
            setMarksVisibility(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-8 animate-fade-in-up">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
                <p className="text-[var(--text-secondary)] mt-1">
                    Manage your privacy settings and data
                </p>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-[var(--error)] bg-opacity-10 text-[var(--error)] mb-6 animate-fade-in">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {saveSuccess && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-[var(--success)] bg-opacity-10 text-[var(--success)] mb-6 animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">Settings saved successfully!</p>
                </div>
            )}

            {/* Profile Info */}
            <div className="card p-6 mb-6 animate-fade-in-up stagger-1">
                <div className="flex items-center gap-3 mb-4">
                    <User className="w-5 h-5 text-[var(--primary)]" />
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">Profile</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-[var(--text-muted)]">Enrollment:</span>
                        <span className="ml-2 text-[var(--text-primary)] font-mono">{student.enrollment_no}</span>
                    </div>
                    <div>
                        <span className="text-[var(--text-muted)]">Batch:</span>
                        <span className="ml-2 text-[var(--text-primary)]">{student.batch || 'Not set'}</span>
                    </div>
                    <div>
                        <span className="text-[var(--text-muted)]">Branch:</span>
                        <span className="ml-2 text-[var(--text-primary)]">{student.branch || 'Not set'}</span>
                    </div>
                    <div>
                        <span className="text-[var(--text-muted)]">College:</span>
                        <span className="ml-2 text-[var(--text-primary)]">{student.college || 'Not set'}</span>
                    </div>
                </div>
            </div>

            {/* Privacy Settings */}
            <div className="card p-6 mb-6 animate-fade-in-up stagger-2">
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-[var(--primary)]" />
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">Privacy Settings</h2>
                </div>

                <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={consentAnalytics}
                            onChange={(e) => setConsentAnalytics(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded accent-[var(--primary)]"
                        />
                        <div>
                            <span className="text-sm text-[var(--text-primary)]">
                                Personal Analytics
                            </span>
                            <p className="text-xs text-[var(--text-muted)]">
                                View your SGPA/CGPA trends and grade distributions
                            </p>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={consentRankboard}
                            onChange={(e) => setConsentRankboard(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded accent-[var(--primary)]"
                        />
                        <div>
                            <span className="text-sm text-[var(--text-primary)]">
                                Participate in Rankboard
                            </span>
                            <p className="text-xs text-[var(--text-muted)]">
                                Share your CGPA and compare with peers
                            </p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Display Settings */}
            <div className="card p-6 mb-6 animate-fade-in-up stagger-3">
                <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-5 h-5 text-[var(--primary)]" />
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">Display Mode</h2>
                </div>

                <div className="space-y-3">
                    {[
                        { value: 'anonymous', label: 'Anonymous', desc: 'Show only as "Anonymous"' },
                        { value: 'pseudonymous', label: 'Pseudonymous', desc: 'Show as "Student xxxx"' },
                        { value: 'visible', label: 'Visible', desc: 'Show your name on rankboard' },
                    ].map((mode) => (
                        <label key={mode.value} className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="displayMode"
                                value={mode.value}
                                checked={displayMode === mode.value}
                                onChange={(e) => setDisplayMode(e.target.value as typeof displayMode)}
                                className="mt-1 w-4 h-4 accent-[var(--primary)]"
                            />
                            <div>
                                <span className="text-sm text-[var(--text-primary)]">{mode.label}</span>
                                <p className="text-xs text-[var(--text-muted)]">{mode.desc}</p>
                            </div>
                        </label>
                    ))}
                </div>

                {/* Marks Visibility */}
                <div className="mt-6 pt-4 border-t border-[var(--card-border)]">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={marksVisibility}
                            onChange={(e) => handleMarksVisibilityToggle(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded accent-[var(--warning)]"
                        />
                        <div>
                            <span className="text-sm text-[var(--text-primary)]">
                                Share Marks with Classmates
                            </span>
                            <p className="text-xs text-[var(--text-muted)]">
                                Allow other opted-in users to see your detailed subject marks
                            </p>
                        </div>
                    </label>
                    {student.marks_visibility_at && (
                        <p className="text-xs text-[var(--text-muted)] mt-2 ml-7">
                            Enabled on: {new Date(student.marks_visibility_at).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>

            {/* Save Button */}
            <div className="mb-6">
                <button
                    onClick={handleSaveConsent}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Settings className="w-5 h-5" />
                            Save Settings
                        </>
                    )}
                </button>
            </div>

            {/* Consent History */}
            {consentLogs.length > 0 && (
                <div className="card p-6 mb-6 animate-fade-in-up stagger-4">
                    <div className="flex items-center gap-3 mb-4">
                        <History className="w-5 h-5 text-[var(--primary)]" />
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Consent History</h2>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {consentLogs.map((log) => (
                            <div key={log.id} className="flex items-center justify-between text-sm py-2 border-b border-[var(--card-border)] last:border-0">
                                <div>
                                    <span className="text-[var(--text-primary)]">{log.consent_type}</span>
                                    <span className={`ml-2 badge ${log.action === 'granted' ? 'badge-success' : 'badge-error'}`}>
                                        {log.action}
                                    </span>
                                </div>
                                <span className="text-[var(--text-muted)] text-xs">
                                    {new Date(log.logged_at).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Data Management */}
            <div className="card p-6 animate-fade-in-up stagger-5">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Data Management</h2>

                <div className="flex flex-wrap gap-4 mb-6">
                    <button
                        onClick={handleExportData}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                        Export All Data
                    </button>
                </div>

                {/* Danger Zone */}
                <div className="p-4 rounded-lg bg-[var(--error)] bg-opacity-5 border border-[var(--error)] border-opacity-20">
                    <h3 className="text-sm font-semibold text-[var(--error)] mb-2">Danger Zone</h3>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="text-sm text-[var(--text-secondary)] hover:text-[var(--error)] flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete All My Data
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-[var(--text-secondary)]">
                                This will permanently delete all your data including academic records.
                                Type your enrollment number <strong>{student.enrollment_no}</strong> to confirm:
                            </p>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="Type enrollment number"
                                className="input w-full"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeleteConfirmText('');
                                    }}
                                    className="btn-secondary py-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAllData}
                                    disabled={deleting || deleteConfirmText !== student.enrollment_no}
                                    className="py-2 px-4 rounded-lg bg-[var(--error)] text-white hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Delete Permanently
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Marks Visibility Confirmation Modal */}
            {showMarksConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="card max-w-md w-full p-6 animate-scale-in">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                            Confirm Marks Visibility
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">
                            I understand my academic marks will be visible to other opted-in students.
                            This can be revoked at any time.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowMarksConfirm(false)}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setMarksVisibility(true);
                                    setShowMarksConfirm(false);
                                }}
                                className="btn-primary"
                            >
                                I Understand, Enable
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
