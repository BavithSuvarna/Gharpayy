import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { leadId, property, visitDate } = body;

        if (!leadId || !property || !visitDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const parsedDate = new Date(visitDate);
        if (isNaN(parsedDate.getTime())) {
            return NextResponse.json({ error: 'Invalid datetime format string supplied' }, { status: 400 });
        }

        const newVisit = await prisma.visit.create({
            data: {
                leadId,
                property,
                visitDate: new Date(visitDate),
                outcome: 'PENDING',
            },
        });

        // Update lead status and activity
        await prisma.lead.update({
            where: { id: leadId },
            data: {
                status: 'VISIT_SCHEDULED',
                lastActivityAt: new Date()
            }
        });

        await prisma.conversation.create({
            data: {
                leadId,
                type: 'SYSTEM_EVENT',
                body: `Visit scheduled for property ${property} on ${new Date(visitDate).toLocaleString()}`,
            }
        });

        return NextResponse.json({ success: true, data: newVisit }, { status: 201 });
    } catch (error) {
        console.error('Error scheduling visit:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
