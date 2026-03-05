export interface HabitEntry {
    id: string;
    habitId: string;
    date: string;
    completed: boolean;
}

export interface Habit {
    id: string;
    name: string;
    icon: string;
    color: string;
    createdAt: string;
    entries: HabitEntry[];
}
