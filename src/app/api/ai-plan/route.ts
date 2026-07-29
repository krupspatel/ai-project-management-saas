import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { idea } = await request.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert software project manager. Create structured project plans.',
        },
        {
          role: 'user',
          content: idea,
        },
      ],
    });

    return NextResponse.json({
      plan: response.choices[0].message.content,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to generate plan',
      },
      {
        status: 500,
      },
    );
  }
}
