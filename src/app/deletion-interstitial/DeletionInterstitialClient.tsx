'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  AlertTriangle,
  Eye,
  RotateCcw,
  CheckCircle,
  Calendar,
  ShieldCheck,
  FileText,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DeletionRecord {
  deletion_date: string;
  data_deleted: string[];
  compliance_verified: boolean;
  verification_date: string;
}

interface Props {
  deletionRecords: DeletionRecord[];
}

export default function DeletionInterstitialClient({ deletionRecords }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState('');
  const [showRecords, setShowRecords] = useState(false);
  const [acknowledging, setAcknowledging] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const latestRecord = deletionRecords[0];
  const formatDate = (value?: string) => {
    if (!value) return 'N/A';
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
    }).format(new Date(value));
  };

  const handleRegisterNew = async () => {
    if (!acknowledged) {
      setError('Please acknowledge the conditions before proceeding');
      return;
    }

    setAcknowledging(true);
    try {
      router.push('/onboarding?allowOnboarding=1');
    } catch (err) {
      setError('Failed to proceed. Please try again.');
      setAcknowledging(false);
    }
  };

  const handleGoBack = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore sign out errors
    }

    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Ignore storage errors (e.g., blocked)
    }

    window.location.href = '/';
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-32 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/60 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure Deletion Verification
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Your deletion history is preserved — your data isn’t
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            You previously deleted your account. We keep an immutable, privacy-safe audit trail to prove deletion, but your academic data is never restored.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <FileText className="h-3.5 w-3.5" />
              {deletionRecords.length} record{deletionRecords.length === 1 ? '' : 's'} found
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Lock className="h-3.5 w-3.5" />
              Immutable audit log
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <CheckCircle className="h-3.5 w-3.5" />
              OAuth-verified identity
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/60">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Deletion Records
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Last deletion: {formatDate(latestRecord?.deletion_date)}
                  </p>
                </div>
                <button
                  onClick={() => setShowRecords((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600"
                >
                  <Eye className="h-3.5 w-3.5" />
                  {showRecords ? 'Hide records' : 'View records'}
                  {showRecords ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
              </div>

              {showRecords && (
                <div className="mt-5 space-y-4">
                  {deletionRecords.map((record, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                          <Calendar className="h-4 w-4 text-rose-500" />
                          Deletion Event #{idx + 1}
                        </div>
                        {record.compliance_verified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(record.deletion_date)}
                      </div>
                      <div className="mt-3">
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-500">
                          Data deleted
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {record.data_deleted?.map((item, i) => (
                            <span
                              key={i}
                              className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-rose-200/60 bg-rose-50/70 p-6 shadow-sm dark:border-rose-500/20 dark:bg-rose-500/10">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-rose-600 dark:text-rose-300" />
                <div>
                  <h3 className="text-base font-semibold text-rose-900 dark:text-rose-200">
                    Important: permanent deletion
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-rose-800/90 dark:text-rose-200/90">
                    <li>• Your previous data is permanently deleted.</li>
                    <li>• Deleted data cannot be restored under any circumstances.</li>
                    <li>• Re-registration creates a brand-new profile.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acknowledge"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-rose-300 accent-rose-500"
                />
                <label htmlFor="acknowledge" className="text-sm text-rose-900/90 dark:text-rose-100/90">
                  I understand that my previous data is permanently deleted and cannot be recovered. I want to register as a new user.
                </label>
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-rose-200 bg-white/70 px-3 py-2 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-900/30 dark:text-rose-200">
                  {error}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleGoBack}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                >
                  Go Back
                </button>
                <button
                  onClick={handleRegisterNew}
                  disabled={!acknowledged || acknowledging}
                  className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-rose-600 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {acknowledging ? 'Processing…' : 'Register as New User'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/60">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Why this check exists</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                We verify deletion events after OAuth sign-in to protect you from data restoration and provide compliance-grade proof.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Deleted data is never restored
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Transparent proof for GDPR/DPDP requests
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Explicit informed consent before re-registration
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/60">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">What happens next</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-xs font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">1</span>
                  Confirm you understand the deletion policy
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-xs font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">2</span>
                  Start a new onboarding flow
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-xs font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">3</span>
                  Create a fresh profile and consent log
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
