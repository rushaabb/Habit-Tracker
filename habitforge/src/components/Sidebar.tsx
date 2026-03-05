'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BarChart3, Settings, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r flex flex-col hidden md:flex">
            <div className="h-20 flex items-center px-8 border-b">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-xl text-white shadow-lg shadow-violet-500/30">
                        <Flame className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight gradient-text">HabitForge</span>
                </div>
            </div>

            <div className="flex-1 py-6 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href} className="relative block">
                            <span className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors z-10 relative",
                                isActive ? "text-primary dark:text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                            )}>
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 bg-primary/10 dark:bg-primary border border-primary/20 rounded-xl z-0"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="p-6 border-t font-medium text-xs text-muted-foreground flex items-center gap-2">
                <p>© 2026 HabitForge.</p>
            </div>
        </aside>
    );
}
