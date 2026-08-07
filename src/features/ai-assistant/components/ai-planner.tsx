'use client';

import { useState } from 'react';

export function AIPlanner() {
  const [idea, setIdea] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generatePlan() {
    if (!idea.trim()) {
      setError('Please describe your project first.');
      return;
    }

    setLoading(true);
    setResult('');
    setError('');

    try {
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

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate project plan');
      }

      setResult(data.plan);
    } catch (error) {
      console.error(error);

      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border p-6">
      <div>
        <h2 className="text-xl font-semibold">AI Project Planner 🤖</h2>

        <p className="text-sm text-muted-foreground">
          Describe your project and let AI create a development plan.
        </p>
      </div>

      <textarea
        className="min-h-32 w-full rounded-lg border p-3"
        placeholder="Describe your project..."
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
      />

      <button
        onClick={generatePlan}
        disabled={loading}
        className="rounded-lg bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Project Plan'}
      </button>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Generated Project Plan</h3>

          <div className="whitespace-pre-wrap">{result}</div>
        </div>
      )}
    </div>
  );
}
