import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: habitId } = await params;
        const body = await request.json();
        const { date, completed } = body;

        if (!date) {
            return NextResponse.json({ error: 'Date is required' }, { status: 400 });
        }

        if (completed) {
            // Upsert entry to true
            const entry = await prisma.habitEntry.upsert({
                where: {
                    habitId_date: {
                        habitId,
                        date,
                    },
                },
                update: {
                    completed,
                },
                create: {
                    habitId,
                    date,
                    completed,
                },
            });
            return NextResponse.json(entry);
        } else {
            // Delete entry if false to save space
            try {
                await prisma.habitEntry.delete({
                    where: {
                        habitId_date: {
                            habitId,
                            date,
                        },
                    },
                });
            } catch {
                // Ignore if it doesn't exist
            }
            return NextResponse.json({ success: true, deleted: true });
        }
    } catch (error) {
        console.error('Failed to update habit entry:', error);
        return NextResponse.json({ error: 'Failed to update habit entry' }, { status: 500 });
    }
}
