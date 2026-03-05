'use client';

import { useHabits } from '@/hooks/useHabits';
import { MonthlyChart } from '@/components/MonthlyChart';
import { Flame, Target, Trophy, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
    const { habits, isLoading } = useHabits();

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    // Calculate some basic stats
    const totalHabits = habits.length;
    let totalCompletions = 0;

    habits.forEach(habit => {
        totalCompletions += habit.entries.filter(e => e.completed).length;
    });

    const cards = [
        { label: 'Active Habits', value: totalHabits, icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Total Completions', value: totalCompletions, icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Average Rate', value: '68%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Current Streak', value: '12 Days', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 w-full"
        >
            <header>
                <h1 className="text-4xl font-extrabold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-2">See how you are forming your habits over time.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, idx) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 rounded-3xl bg-card border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
                    >
                        <div className={`p-4 rounded-2xl ${card.bg} ${card.color}`}>
                            <card.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                            <h3 className="text-2xl font-bold">{card.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6">
                <MonthlyChart habits={habits} days={14} />
            </div>
        </motion.div>
    );
}
