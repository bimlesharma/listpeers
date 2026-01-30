'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { Student } from '@/types';
import { Trophy, Lock, Users, Filter, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface RankboardEntry {
    id: string;
    display_name: string;
    batch: string | null;
    branch: string | null;
    college: string | null;
    cgpa: number;
}

interface RankboardClientProps {
    student: Student;
    rankboardData: RankboardEntry[];
    currentUserId: string;
}

export function RankboardClient({ student, rankboardData, currentUserId }: RankboardClientProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [batchFilter, setBatchFilter] = useState<string>('all');
    const [branchFilter, setBranchFilter] = useState<string>('all');

    // Get unique batches and branches for filters
    const batches = [...new Set(rankboardData.map(r => r.batch).filter(Boolean))] as string[];
    const branches = [...new Set(rankboardData.map(r => r.branch).filter(Boolean))] as string[];

    // Apply filters
    let filteredData = rankboardData;
    if (batchFilter !== 'all') {
        filteredData = filteredData.filter(r => r.batch === batchFilter);
    }
    if (branchFilter !== 'all') {
        filteredData = filteredData.filter(r => r.branch === branchFilter);
    }

    const handleOptIn = async () => {
        setLoading(true);
        try {
            await supabase
                .from('students')
                .update({ consent_rankboard: true })
                .eq('id', currentUserId);

            router.refresh();
        } catch (err) {
            console.error('Opt-in error:', err);
        } finally {
            setLoading(false);
        }
    };

    const minParticipants = 5;
    const hasMinimumParticipants = filteredData.length >= minParticipants;

    // Not opted in - show gate
    if (!student.consent_rankboard) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="card p-8 text-center animate-fade-in-up">
                    <div className="p-4 rounded-full bg-[var(--primary)] bg-opacity-10 w-fit mx-auto mb-4">
                        <Lock className="w-10 h-10 text-[var(--primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                        Rankboard Access
                    </h1>
                    <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                        To view and participate in the rankboard, you need to share your academic data.
                        This is a fair-trade model: you share to see, others share to be seen.
                    </p>

                    <div className="p-4 rounded-lg bg-[var(--secondary)] border border-[var(--card-border)] mb-6 text-left">
                        <h3 className="font-medium text-[var(--text-primary)] mb-2">
                            What happens when you opt in:
                        </h3>
                        <ul className="text-sm text-[var(--text-secondary)] space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--success)]">✓</span>
                                Your CGPA appears on the rankboard
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--success)]">✓</span>
                                You can see other opted-in students&apos; rankings
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--success)]">✓</span>
                                Your identity is <strong>anonymous by default</strong>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--success)]">✓</span>
                                You can opt out anytime in Settings
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={handleOptIn}
                        disabled={loading}
                        className="btn-primary flex items-center gap-2 mx-auto disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Opting in...
                            </>
                        ) : (
                            <>
                                <Users className="w-5 h-5" />
                                Opt In to Rankboard
                            </>
                        )}
                    </button>

                    <p className="text-xs text-[var(--text-muted)] mt-4">
                        By opting in, you agree to share your anonymized academic performance.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8 animate-fade-in-up">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        Rankboard
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        {filteredData.length} participant{filteredData.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Link href="/settings" className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)]">
                    Manage participation →
                </Link>
            </div>

            {/* Filters */}
            {(batches.length > 0 || branches.length > 0) && (
                <div className="card p-4 mb-6 animate-fade-in-up stagger-1">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-[var(--text-muted)]" />
                            <span className="text-sm text-[var(--text-secondary)]">Filters:</span>
                        </div>

                        {batches.length > 0 && (
                            <select
                                value={batchFilter}
                                onChange={(e) => setBatchFilter(e.target.value)}
                                className="input text-sm py-1.5"
                            >
                                <option value="all">All Batches</option>
                                {batches.map(b => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                        )}

                        {branches.length > 0 && (
                            <select
                                value={branchFilter}
                                onChange={(e) => setBranchFilter(e.target.value)}
                                className="input text-sm py-1.5"
                            >
                                <option value="all">All Branches</option>
                                {branches.map(b => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            )}

            {/* Minimum threshold warning */}
            {!hasMinimumParticipants && (
                <div className="p-4 rounded-lg bg-[var(--warning)] bg-opacity-10 border border-[var(--warning)] border-opacity-20 flex items-start gap-3 mb-6 animate-fade-in-up stagger-2">
                    <AlertCircle className="w-5 h-5 text-[var(--warning)] flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-[var(--text-primary)]">
                            Minimum {minParticipants} participants required
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                            Rankings are hidden until enough students from your cohort join.
                            Currently {filteredData.length} participant{filteredData.length !== 1 ? 's' : ''}.
                        </p>
                    </div>
                </div>
            )}

            {/* Rankboard Table */}
            {hasMinimumParticipants ? (
                <div className="card overflow-hidden animate-fade-in-up stagger-2">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="w-16">Rank</th>
                                    <th>Student</th>
                                    <th>Batch</th>
                                    <th>Branch</th>
                                    <th className="text-right">CGPA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((entry, index) => {
                                    const isCurrentUser = entry.id === currentUserId;
                                    const rank = index + 1;

                                    return (
                                        <tr
                                            key={entry.id}
                                            className={isCurrentUser ? 'bg-[var(--primary)] bg-opacity-5' : ''}
                                        >
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    {rank <= 3 ? (
                                                        <Trophy
                                                            className={`w-5 h-5 ${rank === 1 ? 'text-yellow-500' :
                                                                    rank === 2 ? 'text-gray-400' :
                                                                        'text-amber-600'
                                                                }`}
                                                        />
                                                    ) : (
                                                        <span className="text-[var(--text-muted)] font-medium pl-1">
                                                            {rank}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={`font-medium ${isCurrentUser ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]'}`}>
                                                {entry.display_name}
                                                {isCurrentUser && (
                                                    <span className="ml-2 text-xs badge badge-success">You</span>
                                                )}
                                            </td>
                                            <td className="text-[var(--text-secondary)]">
                                                {entry.batch || '-'}
                                            </td>
                                            <td className="text-[var(--text-secondary)]">
                                                {entry.branch || '-'}
                                            </td>
                                            <td className="text-right">
                                                <span className="font-bold text-[var(--primary)]">
                                                    {entry.cgpa.toFixed(2)}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="card p-12 text-center animate-fade-in-up stagger-3">
                    <div className="p-4 rounded-full bg-[var(--secondary)] w-fit mx-auto mb-4">
                        <Users className="w-10 h-10 text-[var(--text-muted)]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                        Waiting for More Participants
                    </h2>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                        Share this platform with your classmates to unlock rankings!
                    </p>
                </div>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-center text-[var(--text-muted)] mt-6">
                Rankings are based on voluntarily submitted data and do not represent official academic standings.
            </p>
        </div>
    );
}
