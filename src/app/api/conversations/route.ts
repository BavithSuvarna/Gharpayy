import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { leadId, type, body: messageBody } = body;

        if (!leadId || !type || !messageBody) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const conversation = await prisma.conversation.create({
            data: {
                leadId,
                type,
                body: messageBody,
            },
        });

        // If it's the first agent message, track SLA (firstRespondedAt)
        if (type === 'MESSAGE') {
            const lead = await prisma.lead.findUnique({ where: { id: leadId } });
            if (lead && !lead.firstRespondedAt) {
                await prisma.lead.update({
                    where: { id: leadId },
                    data: {
                        firstRespondedAt: new Date(),
                        lastActivityAt: new Date()
                    }
                });
            } else {
                await prisma.lead.update({
                    where: { id: leadId },
                    data: { lastActivityAt: new Date() }
                });
            }
        }

        return NextResponse.json({ success: true, data: conversation }, { status: 201 });
    } catch (error) {
        console.error('Error logging conversation:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
