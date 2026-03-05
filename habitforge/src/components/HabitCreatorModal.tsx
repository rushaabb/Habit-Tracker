'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { habitIcons, habitColors, IconName } from './Icons';
import { cn } from '@/lib/utils';

interface HabitCreatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (habit: { name: string; icon: string; color: string }) => Promise<boolean>;
}

export function HabitCreatorModal({ isOpen, onClose, onCreate }: HabitCreatorModalProps) {
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState<IconName>('star');
    const [selectedColor, setSelectedColor] = useState('violet');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        await onCreate({ name: name.trim(), icon: selectedIcon, color: selectedColor });
        setIsSubmitting(false);

        // Reset form
        setName('');
        setSelectedIcon('star');
        setSelectedColor('violet');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border bg-card p-6 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">New Habit</h2>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 text-muted-foreground hover:bg-secondary transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Morning Run"
                                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-foreground">Icon</label>
                                <div className="grid grid-cols-6 gap-2">
                                    {Object.entries(habitIcons).map(([key, Icon]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setSelectedIcon(key as IconName)}
                                            className={cn(
                                                "flex h-12 w-full items-center justify-center rounded-xl border transition-all hover:bg-secondary",
                                                selectedIcon === key
                                                    ? `border-${selectedColor}-500 bg-${selectedColor}-500/10 text-${selectedColor}-500 ring-2 ring-${selectedColor}-500/20`
                                                    : "border-border text-muted-foreground"
                                            )}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-foreground">Color</label>
                                <div className="flex gap-3">
                                    {habitColors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setSelectedColor(color)}
                                            className={cn(
                                                "h-8 w-8 rounded-full transition-all hover:scale-110",
                                                `bg-${color}-500`,
                                                selectedColor === color && "ring-2 ring-offset-2 ring-offset-card ring-foreground scale-110"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!name.trim() || isSubmitting}
                                className={cn(
                                    "w-full rounded-xl py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2",
                                    "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]",
                                    "disabled:opacity-50 disabled:pointer-events-none mt-4"
                                )}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Habit'}
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
