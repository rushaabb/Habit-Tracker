'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface DayCellProps {
    date: string;
    isCompleted: boolean;
    color: string;
    onToggle: (date: string, completed: boolean) => Promise<void>;
    isToday?: boolean;
}

const colorVariants: Record<string, string> = {
    violet: 'bg-violet-500 border-violet-500 text-white',
    blue: 'bg-blue-500 border-blue-500 text-white',
    emerald: 'bg-emerald-500 border-emerald-500 text-white',
    rose: 'bg-rose-500 border-rose-500 text-white',
    amber: 'bg-amber-500 border-amber-500 text-white',
    indigo: 'bg-indigo-500 border-indigo-500 text-white',
};

const shadowVariants: Record<string, string> = {
    violet: 'shadow-violet-500/30',
    blue: 'shadow-blue-500/30',
    emerald: 'shadow-emerald-500/30',
    rose: 'shadow-rose-500/30',
    amber: 'shadow-amber-500/30',
    indigo: 'shadow-indigo-500/30',
};

export function DayCell({ date, isCompleted, color, onToggle, isToday }: DayCellProps) {
    const [optimisticCompleted, setOptimisticCompleted] = useState(isCompleted);
    const [isLoading, setIsLoading] = useState(false);

    // Sync with prop changes
    if (isCompleted !== optimisticCompleted && !isLoading) {
        setOptimisticCompleted(isCompleted);
    }

    const handleToggle = async () => {
        if (isLoading) return;
        setIsLoading(true);
        const newValue = !optimisticCompleted;
        setOptimisticCompleted(newValue);

        try {
            await onToggle(date, newValue);
        } catch (e) {
            // Revert optimism on failure
            setOptimisticCompleted(!newValue);
        } finally {
            setIsLoading(false);
        }
    };

    const activeColorClass = colorVariants[color] || colorVariants.violet;
    const activeShadowClass = shadowVariants[color] || shadowVariants.violet;

    return (
        <div className="relative flex items-center justify-center p-1 w-10 h-10">
            <button
                onClick={handleToggle}
                disabled={isLoading}
                className={cn(
                    "w-8 h-8 rounded-md transition-all duration-200 flex items-center justify-center border-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    optimisticCompleted
                        ? cn(activeColorClass, "shadow-md", activeShadowClass)
                        : "bg-secondary border-border hover:bg-muted dark:bg-zinc-800 dark:border-zinc-700",
                    isToday && !optimisticCompleted && "border-primary/50" // Highligh today if uncompleted
                )}
                title={date}
            >
                <motion.div
                    initial={false}
                    animate={{ scale: optimisticCompleted ? 1 : 0, opacity: optimisticCompleted ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                    {optimisticCompleted && <Check className="w-4 h-4" strokeWidth={3} />}
                </motion.div>
            </button>
            {isToday && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary" />
            )}
        </div>
    );
}
