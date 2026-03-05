'use client';

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { Habit } from '@/types';

interface MonthlyChartProps {
    habits: Habit[];
    days?: number;
}

export function MonthlyChart({ habits, days = 30 }: MonthlyChartProps) {
    const data = useMemo(() => {
        if (!habits.length) return [];

        const today = new Date();
        const startDate = subDays(today, days - 1);
        const dateRange = eachDayOfInterval({ start: startDate, end: today });

        return dateRange.map(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            let completedCount = 0;
            let totalActiveHabits = 0;

            habits.forEach(habit => {
                // Only count habits created before or on this date
                const createdAt = new Date(habit.createdAt);
                if (createdAt <= date) {
                    totalActiveHabits++;
                    const entry = habit.entries.find(e => e.date === dateStr);
                    if (entry?.completed) {
                        completedCount++;
                    }
                }
            });

            const percentage = totalActiveHabits === 0
                ? 0
                : Math.round((completedCount / totalActiveHabits) * 100);

            return {
                date: format(date, 'MMM dd'),
                percentage,
                completed: completedCount,
                total: totalActiveHabits
            };
        });
    }, [habits, days]);

    if (!habits.length) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-muted-foreground bg-secondary/50 rounded-3xl border border-dashed">
                Add habits to see your progress chart
            </div>
        );
    }

    return (
        <div className="w-full h-64 p-4 bg-card rounded-3xl border shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Completion Trend</h3>
                <p className="text-sm text-muted-foreground">Your average daily completion rate</p>
            </div>
            <div className="w-full h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                            minTickGap={20}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                            domain={[0, 100]}
                            tickFormatter={(val) => `${val}%`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--popover)',
                                borderColor: 'var(--border)',
                                borderRadius: '0.75rem',
                                color: 'var(--popover-foreground)'
                            }}
                            itemStyle={{ color: 'var(--primary)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="percentage"
                            stroke="var(--primary)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorPercentage)"
                            activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'var(--background)', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
