import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idea = body.idea;

    if (!idea || !idea.trim()) {
      return Response.json(
        {
          success: false,
          error: 'Project idea is required',
        },
        { status: 400 },
      );
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `
You are an expert project manager and software architect.

Create a practical project plan for the following project:

${idea}

Include:

1. Project Overview
2. Main Features
3. Recommended Tech Stack
4. Project Milestones
5. Development Tasks
6. Suggested Timeline
7. Potential Challenges

Keep the plan clear, structured, and practical.
`,
    });

    return Response.json({
      success: true,
      plan: response.text,
    });
  } catch (error) {
    console.error('AI Error:', error);

    return Response.json(
      {
        success: false,
        error: 'AI generation failed',
      },
      { status: 500 },
    );
  }
}
