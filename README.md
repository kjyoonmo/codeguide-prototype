# CodeGuide Prototype

CodeGuide is a simple React-based web prototype for an **LLM-inspired assignment understanding assistant** for beginner computer science students.

## What this prototype does
- Accepts an assignment description, code snippet, and error message
- Generates a simple assignment summary
- Highlights likely requirements and warning points
- Explains common beginner error types
- Suggests debugging steps and hint-based guidance
- Includes a lightweight chat-style interface for follow-up questions

## Important note
This version is a **front-end prototype with rule-based logic**. It simulates the user experience of an LLM assistant, but it is **not yet connected to a real LLM API**.

## Tech stack
- React
- Vite
- Plain CSS

## Project structure
```text
codeguide-prototype/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── public/
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── styles.css
    └── utils/
        └── analysis.js
```

## How to run locally
1. Install Node.js (version 18 or later recommended)
2. Open the project folder in a terminal
3. Run:

```bash
npm install
npm run dev
```

4. Open the local URL shown in the terminal

## Future improvements
- Connect the UI to a real LLM API
- Add file upload support for PDF assignment sheets
- Improve code-aware debugging logic
- Store chat history and user evaluation results

## Suggested GitHub repository title
`codeguide-prototype`
