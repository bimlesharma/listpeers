import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    color?: 'primary' | 'success' | 'warning' | 'error';
    className?: string;
}

const colorClasses = {
    primary: 'text-[var(--primary)] bg-[var(--primary)]',
    success: 'text-[var(--success)] bg-[var(--success)]',
    warning: 'text-[var(--warning)] bg-[var(--warning)]',
    error: 'text-[var(--error)] bg-[var(--error)]',
};

export function StatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color = 'primary',
    className,
}: StatsCardProps) {
    return (
        <div className={cn('card p-6', className)}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-[var(--text-secondary)] mb-1">{title}</p>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-[var(--text-muted)] mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={cn('p-3 rounded-xl bg-opacity-10', colorClasses[color])}>
                    <Icon className={cn('w-6 h-6', colorClasses[color].split(' ')[0])} />
                </div>
            </div>
        </div>
    );
}
