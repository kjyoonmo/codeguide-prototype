# CodeGuide Prototype (Upgraded)

CodeGuide is a React-based web prototype for an **LLM-enhanced assignment understanding assistant** for beginner computer science students.

## What this upgraded version does
- Accepts an assignment description, code snippet, and error message
- Generates a structured summary with task overview, key requirements, and watch-outs
- Produces conservative debugging feedback using likely issues and first checks
- Replaces the original hint list with **Next Step Hints**
- Supports two modes:
  - **LLM-enhanced** mode via a backend API
  - **Rule-based** fallback mode for comparison and reliability

## Tech stack
- React + Vite
- Express backend
- OpenAI API
- Plain CSS

## New project structure
```text
codeguide-prototype/
├── server/
│   └── index.js
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   ├── services/
│   │   ├── assistantService.js
│   │   └── fallbackAnalysis.js
│   └── prompts/
│       └── assistantPrompts.js
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## How to run locally
1. Create a `.env` file based on `.env.example`
2. Install dependencies:

```bash
npm install
```

3. Run frontend and backend together:

```bash
npm run full
```

4. Open the local Vite URL shown in the terminal

## Notes
- The backend keeps the OpenAI API key off the frontend.
- If the API request fails, the app automatically falls back to the rule-based baseline.
