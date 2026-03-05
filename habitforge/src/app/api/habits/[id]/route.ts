import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { id } = await params;

        // Only extract allowed fields
        const { name, icon, color } = body;
        const updateData: Record<string, string> = {};
        if (name !== undefined) updateData.name = name;
        if (icon !== undefined) updateData.icon = icon;
        if (color !== undefined) updateData.color = color;

        const habit = await prisma.habit.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(habit);
    } catch (error) {
        console.error('Failed to update habit:', error);
        return NextResponse.json({ error: 'Failed to update habit' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.habit.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete habit:', error);
        return NextResponse.json({ error: 'Failed to delete habit' }, { status: 500 });
    }
}
