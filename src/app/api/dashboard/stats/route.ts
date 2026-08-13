import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalProjects, activeTasks, teamMembers] = await Promise.all([
      prisma.project.count(),

      prisma.task.count({
        where: {
          status: 'IN_PROGRESS',
        },
      }),

      prisma.user.count(),
    ]);

    return NextResponse.json({
      totalProjects,
      activeTasks,
      teamMembers,
    });
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);

    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 },
    );
  }
}
