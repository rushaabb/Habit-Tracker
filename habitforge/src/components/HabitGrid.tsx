'use client';

import { format, subDays, eachDayOfInterval } from 'date-fns';
import { Habit } from '@/types';
import { HabitRow } from './HabitRow';
import { AnimatePresence } from 'framer-motion';

interface HabitGridProps {
    habits: Habit[];
    onToggleEntry: (habitId: string, date: string, completed: boolean) => Promise<void>;
    onDeleteHabit: (habitId: string) => Promise<void>;
    daysToShow?: number;
}

export function HabitGrid({ habits, onToggleEntry, onDeleteHabit, daysToShow = 14 }: HabitGridProps) {
    const today = new Date();
    const startDate = subDays(today, daysToShow - 1);
    const dates = eachDayOfInterval({ start: startDate, end: today });

    return (
        <div className="w-full flex justify-center py-6">
            <div className="w-full max-w-5xl overflow-x-auto pb-4">
                {/* Header Row */}
                <div className="flex items-center gap-4 px-3 mb-2 min-w-max">
                    <div className="w-48 shrink-0 text-sm font-semibold text-muted-foreground pl-2 uppercase tracking-wider">
                        Habit
                    </div>

                    <div className="flex items-center gap-1 flex-1">
                        {dates.map((date) => (
                            <div
                                key={date.toISOString()}
                                className="w-10 h-6 flex flex-col items-center justify-end text-xs font-medium text-muted-foreground opacity-70"
                            >
                                <span>{format(date, 'EE').charAt(0)}</span>
                                <span className="text-[10px]">{format(date, 'dd')}</span>
                            </div>
                        ))}
                    </div>

                    <div className="w-20 shrink-0 text-sm font-semibold text-muted-foreground text-center uppercase tracking-wider border-l border-border/50 pl-4">
                        Total
                    </div>

                    <div className="w-8 shrink-0" /> {/* Spacer for options menu */}
                </div>

                {/* Habits List */}
                <div className="flex flex-col gap-3 min-w-max">
                    <AnimatePresence>
                        {habits.length === 0 ? (
                            <div className="py-20 text-center text-muted-foreground bg-card/50 rounded-3xl border border-dashed">
                                <p className="text-lg mb-2">No habits yet</p>
                                <p className="text-sm opacity-80">Create your first habit to get started!</p>
                            </div>
                        ) : (
                            habits.map((habit) => (
                                <HabitRow
                                    key={habit.id}
                                    habit={habit}
                                    dates={dates}
                                    onToggleEntry={onToggleEntry}
                                    onDeleteHabit={onDeleteHabit}
                                />
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
