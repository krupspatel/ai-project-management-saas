import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        milestone: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);

    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.projectId) {
      return NextResponse.json(
        { error: 'title and projectId are required' },
        { status: 400 },
      );
    }

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status ?? 'TODO',
        priority: body.priority ?? 'MEDIUM',
        projectId: body.projectId,
        milestoneId: body.milestoneId ?? null,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        milestone: true,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);

    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 },
    );
  }
}
