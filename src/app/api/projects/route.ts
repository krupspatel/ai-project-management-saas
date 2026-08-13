import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    const projectsWithProgress = projects.map((project) => {
      const totalTasks = project.tasks.length;

      const completedTasks = project.tasks.filter(
        (task) => task.status === 'COMPLETED',
      ).length;

      const progress =
        totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        progress,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        ownerId: project.ownerId,
      };
    });

    return NextResponse.json(projectsWithProgress);
  } catch (error) {
    console.error('Failed to fetch projects:', error);

    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.ownerId) {
      return NextResponse.json(
        { error: 'name and ownerId are required' },
        { status: 400 },
      );
    }

    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description,
        status: body.status ?? 'ACTIVE',
        ownerId: body.ownerId,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);

    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 },
    );
  }
}
