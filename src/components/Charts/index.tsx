'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from 'recharts';

interface SGPATrendChartProps {
    data: { semester: string; sgpa: number }[];
}

export function SGPATrendChart({ data }: SGPATrendChartProps) {
    return (
        <div className="card p-6">
            <h3 className="text-lg font-semibold text-(--text-primary) mb-4">
                SGPA Trend
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                        <XAxis
                            dataKey="semester"
                            stroke="var(--text-muted)"
                            fontSize={12}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 10]}
                            stroke="var(--text-muted)"
                            fontSize={12}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                            }}
                            labelStyle={{ color: 'var(--text-secondary)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="sgpa"
                            stroke="var(--primary)"
                            strokeWidth={3}
                            dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: 'var(--primary)' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

interface GradeDistributionChartProps {
    data: { grade: string; count: number; color: string }[];
}

export function GradeDistributionChart({ data }: GradeDistributionChartProps) {
    const total = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="card p-6">
            <h3 className="text-lg font-semibold text-(--text-primary) mb-4">
                Grade Distribution
            </h3>
            <div className="h-64 flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="grade"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                            }}
                            formatter={(value, name) => {
                                const val = Number(value) || 0;
                                return [
                                    `${val} subjects (${((val / total) * 100).toFixed(1)}%)`,
                                    String(name),
                                ];
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {data.map((item) => (
                    <div key={item.grade} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-(--text-secondary)">
                            {item.grade}: {item.count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface SemesterCreditsChartProps {
    data: { semester: string; credits: number; sgpa: number }[];
}

export function SemesterCreditsChart({ data }: SemesterCreditsChartProps) {
    return (
        <div className="card p-6">
            <h3 className="text-lg font-semibold text-(--text-primary) mb-4">
                Credits per Semester
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                        <XAxis
                            dataKey="semester"
                            stroke="var(--text-muted)"
                            fontSize={12}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="var(--text-muted)"
                            fontSize={12}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                            }}
                        />
                        <Bar
                            dataKey="credits"
                            fill="var(--primary)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
