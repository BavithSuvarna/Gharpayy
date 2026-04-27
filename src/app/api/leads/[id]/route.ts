import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const lead = await prisma.lead.findUnique({
            where: { id },
            include: {
                agent: true,
                conversations: {
                    orderBy: { createdAt: 'desc' }
                },
                visits: {
                    orderBy: { visitDate: 'desc' }
                },
                reminders: true
            }
        });

        if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: lead }, { status: 200 });
    } catch (error) {
        console.error('Error fetching lead:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
