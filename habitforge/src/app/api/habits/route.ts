import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const habits = await prisma.habit.findMany({
            orderBy: { createdAt: 'asc' },
            include: {
                entries: true
            }
        });
        return NextResponse.json(habits);
    } catch (error) {
        console.error('Failed to fetch habits:', error);
        return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, icon, color } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const newHabit = await prisma.habit.create({
            data: {
                name,
                icon: icon || 'star',
                color: color || 'violet'
            }
        });

        return NextResponse.json(newHabit, { status: 201 });
    } catch (error) {
        console.error('Failed to create habit:', error);
        return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 });
    }
}
