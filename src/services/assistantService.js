import { generateFallbackSupport } from './fallbackAnalysis';

const API_URL = 'http://localhost:3001/api/analyze';

export async function generateSupport({ assignment, code, error, mode = 'llm' }) {
  if (mode === 'fallback') {
    return generateFallbackSupport({ assignment, code, error });
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assignment, code, error }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      ...data,
      meta: {
        mode: 'llm',
        usedFallback: false,
      },
    };
  } catch (error) {
    const fallback = generateFallbackSupport({ assignment, code, error });
    return {
      ...fallback,
      meta: {
        mode: 'fallback',
        usedFallback: true,
      },
    };
  }
}
