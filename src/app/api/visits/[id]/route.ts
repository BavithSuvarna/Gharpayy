import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();
        const { outcome } = body;

        if (!outcome) {
            return NextResponse.json({ error: 'Outcome is required' }, { status: 400 });
        }

        const updatedVisit = await prisma.visit.update({
            where: { id },
            data: { outcome },
            include: { lead: true }
        });

        await prisma.conversation.create({
            data: {
                leadId: updatedVisit.leadId,
                type: 'SYSTEM_EVENT',
                body: `Visit outcome updated to: ${outcome}`,
            }
        });

        return NextResponse.json({ success: true, data: updatedVisit }, { status: 200 });
    } catch (error) {
        console.error('Error updating visit outcome:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
