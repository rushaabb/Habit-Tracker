'use client';

import { useHabits } from '@/hooks/useHabits';
import { motion } from 'framer-motion';
import { habitIcons, IconName } from '@/components/Icons';
import { Trash } from 'lucide-react';

export default function SettingsPage() {
    const { habits, isLoading, deleteHabit } = useHabits();

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 w-full max-w-3xl"
        >
            <header>
                <h1 className="text-4xl font-extrabold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your habits and preferences.</p>
            </header>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Your Habits</h2>
                <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
                    {habits.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No habits found. Head back to the dashboard to create one!
                        </div>
                    ) : (
                        <div className="divide-y">
                            {habits.map((habit) => {
                                const IconComponent = habitIcons[habit.icon as IconName] || habitIcons.star;
                                return (
                                    <div key={habit.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl bg-${habit.color}-500/10 text-${habit.color}-500`}>
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{habit.name}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Created {new Date(habit.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this habit and all its data?')) {
                                                    deleteHabit(habit.id);
                                                }
                                            }}
                                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <Trash className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Appearance</h2>
                <div className="bg-card rounded-3xl border shadow-sm p-6 space-y-4 text-muted-foreground">
                    <p>HabitForge uses your system preferences for dark/light mode.</p>
                    <div className="p-4 bg-secondary rounded-xl text-sm border">
                        Coming Soon: Custom themes, manual dark mode toggle, and notification settings.
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
