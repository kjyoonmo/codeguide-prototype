import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { buildSupportPrompt } from '../src/prompts/assistantPrompts.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { assignment = '', code = '', error = '' } = req.body ?? {};

    if (!assignment && !code && !error) {
      return res.status(400).json({ error: 'At least one input field is required.' });
    }

    const prompt = buildSupportPrompt({ assignment, code, error });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      input: prompt,
    });

    const text = response.output_text?.trim();
    if (!text) {
      return res.status(500).json({ error: 'The model returned an empty response.' });
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      return res.status(500).json({
        error: 'Failed to parse model response as JSON.',
        raw: text,
      });
    }

    return res.json(parsed);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'Server error while generating support.',
      details: error?.message || 'Unknown error',
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
