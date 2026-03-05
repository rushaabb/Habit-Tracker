'use client';

import { useState, useEffect } from 'react';
import { Habit } from '@/types';

export function useHabits() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHabits = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/habits');
            if (!res.ok) throw new Error('Failed to fetch habits');
            const data = await res.json();
            setHabits(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const toggleEntry = async (habitId: string, date: string, completed: boolean) => {
        // Optimistic update
        setHabits(prev => prev.map(habit => {
            if (habit.id === habitId) {
                const existingEntryIndex = habit.entries.findIndex(e => e.date === date);
                const entries = [...habit.entries];

                if (existingEntryIndex >= 0) {
                    if (completed) {
                        entries[existingEntryIndex].completed = true;
                    } else {
                        entries.splice(existingEntryIndex, 1);
                    }
                } else if (completed) {
                    entries.push({ id: `temp-${Date.now()}`, habitId, date, completed: true });
                }

                return { ...habit, entries };
            }
            return habit;
        }));

        // Server request
        try {
            const res = await fetch(`/api/habits/${habitId}/entries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, completed }),
            });
            if (!res.ok) throw new Error('Failed to update entry');
        } catch (err) {
            console.error(err);
            fetchHabits(); // Revert on error
        }
    };

    const createHabit = async (data: { name: string; icon: string; color: string }) => {
        try {
            const res = await fetch('/api/habits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create habit');
            const newHabit = await res.json();
            setHabits(prev => [...prev, { ...newHabit, entries: [] }]);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const deleteHabit = async (habitId: string) => {
        // Optimistic
        const prevHabits = [...habits];
        setHabits(prev => prev.filter(h => h.id !== habitId));

        try {
            const res = await fetch(`/api/habits/${habitId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete habit');
        } catch (err) {
            console.error(err);
            setHabits(prevHabits); // Revert
        }
    };

    return {
        habits,
        isLoading,
        error,
        toggleEntry,
        createHabit,
        deleteHabit,
        refresh: fetchHabits
    };
}
