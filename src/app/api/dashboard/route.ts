import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const totalLeads = await prisma.lead.count();

        // Aggregate leads by status
        const statusGroups = await prisma.lead.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        });

        // Visits metrics
        const totalVisits = await prisma.visit.count();
        const completedVisits = await prisma.visit.count({ where: { outcome: 'COMPLETED' } });
        const bookedLeads = await prisma.lead.count({ where: { status: 'BOOKED' } });

        // Calculate SLA breaches (leads with no firstRespondedAt and older than 5 minutes)
        const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
        const slaBreaches = await prisma.lead.count({
            where: {
                firstRespondedAt: null,
                createdAt: {
                    lt: fiveMinsAgo
                }
            }
        });

        const pipelineCounts = statusGroups.reduce((acc, curr) => {
            acc[curr.status] = curr._count.status;
            return acc;
        }, {} as Record<string, number>);

        return NextResponse.json({
            success: true,
            data: {
                totalLeads,
                pipelineCounts,
                visits: {
                    total: totalVisits,
                    completed: completedVisits
                },
                bookings: bookedLeads,
                slaBreaches
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
