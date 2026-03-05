import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clear existing data
    await prisma.habitEntry.deleteMany()
    await prisma.habit.deleteMany()

    // Create demo habits
    const workout = await prisma.habit.create({
        data: {
            name: 'Morning Workout',
            icon: 'dumbbell',
            color: 'blue',
        },
    })

    const reading = await prisma.habit.create({
        data: {
            name: 'Read 20 pages',
            icon: 'book',
            color: 'violet',
        },
    })

    const meditation = await prisma.habit.create({
        data: {
            name: 'Meditation',
            icon: 'moon',
            color: 'indigo',
        },
    })

    // Create entries for the past few days to show progress
    const today = new Date()

    for (let i = 0; i < 7; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]

        // Workout completed randomly
        if (Math.random() > 0.3) {
            await prisma.habitEntry.create({
                data: { habitId: workout.id, date: dateStr, completed: true }
            })
        }

        // Reading mostly completed
        if (Math.random() > 0.1) {
            await prisma.habitEntry.create({
                data: { habitId: reading.id, date: dateStr, completed: true }
            })
        }

        // Meditation rarely missed
        if (Math.random() > 0.2) {
            await prisma.habitEntry.create({
                data: { habitId: meditation.id, date: dateStr, completed: true }
            })
        }
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
