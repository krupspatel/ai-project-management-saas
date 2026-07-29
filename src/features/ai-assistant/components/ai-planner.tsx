'use client';

import { useState } from 'react';

export function AIPlanner() {
  const [idea, setIdea] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function generatePlan() {
    setLoading(true);

    const response = await fetch('/api/ai-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea,
      }),
    });

    const data = await response.json();

    setResult(data.plan);
    setLoading(false);
  }

  return (
    <div className="space-y-4 rounded-xl border p-6">
      <h2 className="text-xl font-semibold">AI Project Planner 🤖</h2>

      <textarea
        className="min-h-32 w-full rounded-lg border p-3"
        placeholder="Describe your project..."
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
      />

      <button
        onClick={generatePlan}
        disabled={loading}
        className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
      >
        {loading ? 'Generating...' : 'Generate Project Plan'}
      </button>

      {result && (
        <div className="rounded-lg border bg-muted p-4 whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}
