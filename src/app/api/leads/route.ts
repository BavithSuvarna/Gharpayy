import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, source } = body;

        if (!name || !phone || !source) {
            return NextResponse.json({ error: 'Missing required fields: name, phone, source' }, { status: 400 });
        }

        // 1. Get all agents to perform simple workload balancing (assign to agent with fewest leads)
        const agents = await prisma.agent.findMany({
            include: {
                _count: {
                    select: { leads: true }
                }
            }
        });

        if (agents.length === 0) {
            return NextResponse.json({ error: 'No agents available in the system' }, { status: 500 });
        }

        // Sort agents by lead count ascending
        agents.sort((a, b) => a._count.leads - b._count.leads);
        const assignedAgent = agents[0];

        // 2. Create the Lead
        const newLead = await prisma.lead.create({
            data: {
                name,
                phone,
                source,
                status: 'NEW',
                agentId: assignedAgent.id,
            },
        });

        // 3. Log the creation as a conversation system event
        await prisma.conversation.create({
            data: {
                leadId: newLead.id,
                type: 'SYSTEM_EVENT',
                body: `Lead captured from ${source} and automatically assigned to ${assignedAgent.name}.`,
            }
        });

        return NextResponse.json({
            success: true,
            data: newLead,
            message: `Lead assigned to ${assignedAgent.name}`
        }, { status: 201 });

    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'A lead with this phone number already exists' }, { status: 409 });
        }
        console.error('Error creating lead:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                agent: true
            }
        });
        return NextResponse.json({ success: true, data: leads }, { status: 200 });
    } catch (error) {
        console.error('Error fetching leads:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
