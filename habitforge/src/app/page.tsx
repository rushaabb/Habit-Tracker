'use client';

import { useState } from 'react';
import { HabitGrid } from '@/components/HabitGrid';
import { HabitCreatorModal } from '@/components/HabitCreatorModal';
import { useHabits } from '@/hooks/useHabits';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { habits, isLoading, toggleEntry, createHabit, deleteHabit } = useHabits();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      className="space-y-10 w-full"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Your Dashboard</h1>
          <p className="text-muted-foreground mt-2">Track your daily progress and keep the streak alive.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-1 hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          New Habit
        </button>
      </header>

      <section className="bg-card w-full rounded-3xl border shadow-sm p-2 sm:p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <HabitGrid
          habits={habits}
          onToggleEntry={toggleEntry}
          onDeleteHabit={deleteHabit}
        />
      </section>

      <HabitCreatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={createHabit}
      />
    </motion.div>
  );
}
