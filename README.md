# CodeGuide

CodeGuide is a beginner-focused programming assistant designed to help computer science students better understand assignment instructions and debug basic coding problems. The system accepts an assignment description, a code snippet, and an error message, and then provides structured support through task summarization, debugging guidance, and next-step hints.

## Project Overview

Many beginner programming students struggle not only with implementation, but also with understanding what an assignment is asking and what an error message actually means. CodeGuide was developed to address this problem through an educational support interface.

The project began as a rule-based frontend prototype and was later upgraded into an **LLM-ready architecture** with:

* frontend-backend separation
* structured output schema
* mode switching between rule-based and LLM-enhanced analysis
* fallback support when live API requests fail
* redesigned next-step hints for beginner learners

## Main Features

* **Assignment Summary**

  * explains the task in beginner-friendly language
  * highlights key requirements
  * warns about possible edge cases or constraints

* **Debug Guidance**

  * identifies a likely issue
  * lists possible causes
  * suggests what to check first
  * includes formatting-related checks when relevant

* **Next Step Hints**

  * one concrete next step
  * one reason why that step matters
  * one tiny test case
  * one short concept hint

* **Two Analysis Modes**

  * `Rule-based`
  * `LLM-enhanced`

* **Fallback Mechanism**

  * if the live LLM request fails, the system automatically falls back to rule-based analysis

## Upgrade Highlights

Compared with the baseline prototype, the upgraded version includes:

* a backend server for secure API-based LLM integration
* a structured JSON response schema
* conservative feedback design inspired by prior research
* a redesigned hint system focused on next-step learning support
* improved robustness through fallback behavior

## Tech Stack

### Frontend

* React
* Vite
* CSS

### Backend

* Node.js
* Express

### LLM Integration

* OpenAI API (LLM-enhanced mode)
* fallback rule-based analysis when API access fails

## Project Structure

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
├── package.json
├── package-lock.json
├── vite.config.js
├── index.html
├── .env.example
├── .gitignore
└── README.md
```

## How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Create a `.env` file in the project root

Use the following format:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4.1-mini
PORT=3001
```

### 3. Start the frontend and backend together

```bash
npm run full
```

### 4. Open the local development server

Usually:

```text
http://localhost:5173
```

## Example Use Cases

### Case 1: Stack + Segmentation Fault

* assignment: linked-list stack implementation
* issue: calling `pop()` on an empty stack
* expected support: summary of task requirements, likely cause explanation, next debugging step

### Case 2: Queue + Output Formatting

* assignment: queue implementation with exact output format
* issue: wrong answer caused by formatting mismatch
* expected support: formatting check, actionable debugging steps, next-step hints

### Case 3: Index Out of Range

* assignment: list processing
* issue: invalid index access due to loop condition
* expected support: explanation of likely cause, boundary check, tiny test case

## Current Limitations

* Live LLM evaluation may be limited by API quota or billing constraints.
* When the live API request fails, the system switches to fallback analysis.
* The current evaluation is based on representative demonstration cases rather than a full user study.

## Future Work

* fully evaluate the live LLM-enhanced mode
* expand support to more programming tasks and languages
* improve formatting-related error detection
* conduct user studies with beginner CS students
* compare learning effectiveness between baseline and upgraded versions
