import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
    try {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const inactiveLeads = await prisma.lead.findMany({
            where: {
                lastActivityAt: {
                    lt: oneDayAgo,
                },
                status: {
                    notIn: ['BOOKED', 'LOST']
                }
            },
            include: {
                reminders: true
            }
        });

        let createdRemindersCount = 0;

        for (const lead of inactiveLeads) {
            const daysInactive = (now.getTime() - lead.lastActivityAt.getTime()) / (1000 * 3600 * 24);

            let reminderType = null;
            if (daysInactive >= 7 && !lead.reminders.find(r => r.type === 'DAY_7')) {
                reminderType = 'DAY_7';
            } else if (daysInactive >= 3 && !lead.reminders.find(r => r.type === 'DAY_3')) {
                reminderType = 'DAY_3';
            } else if (daysInactive >= 1 && !lead.reminders.find(r => r.type === 'DAY_1')) {
                reminderType = 'DAY_1';
            }

            if (reminderType) {
                await prisma.reminder.create({
                    data: {
                        leadId: lead.id,
                        type: reminderType,
                        status: 'PENDING'
                    }
                });

                await prisma.conversation.create({
                    data: {
                        leadId: lead.id,
                        type: 'SYSTEM_EVENT',
                        body: `System triggered follow-up reminder: ${reminderType}`
                    }
                });

                createdRemindersCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Generated ${createdRemindersCount} new reminders.`
        }, { status: 200 });

    } catch (error) {
        console.error('Error in reminders cron:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
