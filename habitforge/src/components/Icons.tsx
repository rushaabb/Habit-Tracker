import {
    Star, Dumbbell, Book, Moon, Coffee, Heart,
    Droplets, Sun, Briefcase, Code, Music, Gamepad2
} from 'lucide-react';

export const habitIcons = {
    star: Star,
    dumbbell: Dumbbell,
    book: Book,
    moon: Moon,
    coffee: Coffee,
    heart: Heart,
    droplets: Droplets,
    sun: Sun,
    briefcase: Briefcase,
    code: Code,
    music: Music,
    gamepad2: Gamepad2,
};

export type IconName = keyof typeof habitIcons;

export const habitColors = [
    'violet', 'blue', 'emerald', 'rose', 'amber', 'indigo'
];
