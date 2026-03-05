import { format, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { Habit } from '@/types';
import { DayCell } from './DayCell';
import { ProgressRing } from './ProgressRing';
import { habitIcons, IconName } from './Icons';
import { MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';

interface HabitRowProps {
    habit: Habit;
    dates: Date[];
    onToggleEntry: (habitId: string, date: string, completed: boolean) => Promise<void>;
    onDeleteHabit: (habitId: string) => Promise<void>;
}

export function HabitRow({ habit, dates, onToggleEntry, onDeleteHabit }: HabitRowProps) {
    const [showOptions, setShowOptions] = useState(false);
    const IconComponent = habitIcons[habit.icon as IconName] || habitIcons.star;

    // Calculate completion for this period
    const entriesMap = new Map<string, boolean>();
    habit.entries.forEach((entry) => {
        entriesMap.set(entry.date, entry.completed);
    });

    let completedCount = 0;
    dates.forEach((date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        if (entriesMap.get(dateStr)) {
            completedCount++;
        }
    });

    const progress = dates.length > 0 ? (completedCount / dates.length) * 100 : 0;
    const today = new Date();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.005 }}
            className="flex items-center gap-4 p-3 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all group"
        >
            <div className="flex items-center gap-3 w-48 shrink-0">
                <div className={`p-2 rounded-xl bg-${habit.color}-500/10 text-${habit.color}-500`}>
                    <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 truncate font-medium">{habit.name}</div>
            </div>

            <div className="flex items-center gap-1 flex-1 overflow-x-auto pb-1 scrollbar-hide">
                {dates.map((date) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const isCompleted = entriesMap.get(dateStr) || false;
                    const isItToday = isSameDay(date, today);

                    return (
                        <DayCell
                            key={dateStr}
                            date={dateStr}
                            isCompleted={isCompleted}
                            color={habit.color}
                            isToday={isItToday}
                            onToggle={(date, completed) => onToggleEntry(habit.id, date, completed)}
                        />
                    );
                })}
            </div>

            <div className="flex justify-end w-20 shrink-0 border-l border-border/50 pl-4">
                <ProgressRing progress={progress} color={habit.color} size={36} strokeWidth={4} />
            </div>

            <div className="relative w-8 shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="p-1 rounded-md text-muted-foreground hover:bg-secondary transition-colors"
                >
                    <MoreHorizontal className="w-4 h-4" />
                </button>

                {showOptions && (
                    <div className="absolute right-0 top-full mt-1 z-10 w-32 bg-popover rounded-xl shadow-lg border p-1 text-sm">
                        <button
                            onClick={() => {
                                setShowOptions(false);
                                onDeleteHabit(habit.id);
                            }}
                            className="flex items-center gap-2 w-full p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <Trash className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
