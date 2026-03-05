'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    className?: string;
}

const strokeColors: Record<string, string> = {
    violet: 'stroke-violet-500',
    blue: 'stroke-blue-500',
    emerald: 'stroke-emerald-500',
    rose: 'stroke-rose-500',
    amber: 'stroke-amber-500',
    indigo: 'stroke-indigo-500',
};

export function ProgressRing({
    progress,
    size = 40,
    strokeWidth = 4,
    color = 'violet',
    className,
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    const activeColorClass = strokeColors[color] || strokeColors.violet;

    return (
        <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    className="stroke-secondary dark:stroke-zinc-800 fill-none"
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, type: "spring", bounce: 0 }}
                    className={cn("fill-none stroke-linecap-round", activeColorClass)}
                />
            </svg>
            <div className="absolute flex items-center justify-center text-xs font-semibold">
                {Math.round(progress)}%
            </div>
        </div>
    );
}
