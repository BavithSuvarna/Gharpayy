import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const updatedLead = await prisma.lead.update({
            where: { id },
            data: {
                status,
                lastActivityAt: new Date(),
            },
        });

        await prisma.conversation.create({
            data: {
                leadId: id,
                type: 'SYSTEM_EVENT',
                body: `Lead moved to stage: ${status}`,
            }
        });

        return NextResponse.json({ success: true, data: updatedLead }, { status: 200 });

    } catch (error) {
        console.error('Error updating lead status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
