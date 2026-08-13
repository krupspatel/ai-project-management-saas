import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowedStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

    if (!allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          error: 'Invalid status. Use TODO, IN_PROGRESS, or COMPLETED.',
        },
        { status: 400 },
      );
    }

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Failed to update task:', error);

    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 },
    );
  }
}
