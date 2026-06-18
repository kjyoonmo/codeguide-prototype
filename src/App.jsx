import { useState } from 'react';
import { generateSupport } from './services/assistantService';

function Panel({ title, subtitle, children }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button className={active ? 'tab active' : 'tab'} onClick={onClick}>
      {children}
    </button>
  );
}

const initialResult = {
  summary: {
    taskOverview: 'Generate guidance to see a beginner-friendly summary of the assignment.',
    keyRequirements: ['Key requirements will appear here.'],
    watchOuts: ['Important watch-outs will appear here.'],
  },
  debug: {
    likelyIssue: 'The likely issue will appear here after analysis.',
    possibleCauses: ['Possible causes will appear here.'],
    checksFirst: ['Suggested checks will appear here.'],
    formattingCheck: 'Formatting guidance will appear here.',
  },
  hints: {
    nextStep: 'Your next step will appear here.',
    whyThisStep: 'The reason for that step will appear here.',
    tinyTestCase: 'A tiny test case will appear here.',
    conceptHint: 'A short concept hint will appear here.',
  },
  meta: {
    mode: 'fallback',
    usedFallback: false,
  },
};

export default function App() {
  const [studentName, setStudentName] = useState('Minjun');
  const [assignment, setAssignment] = useState(
    'Implement a stack using a linked list. Your implementation must support push, pop, top, and isEmpty in O(1) time. Follow the exact input and output format described in the assignment sheet.'
  );
  const [code, setCode] = useState(
    'typedef struct Node {\n  int value;\n  struct Node* next;\n} Node;\n\nint pop(Node* top) {\n  return top->value;\n}'
  );
  const [error, setError] = useState('Segmentation fault when calling pop() on an empty stack.');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi! I’m CodeGuide. Paste your assignment, code, or error message, and I’ll explain the task in simpler language and suggest debugging steps.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  const [mode, setMode] = useState('llm');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [result, setResult] = useState(initialResult);

  async function handleGenerate() {
    setIsLoading(true);
    setApiError('');

    try {
      const output = await generateSupport({ assignment, code, error, mode });
      setResult(output);
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: 'Can you help me understand this assignment and debug my issue?' },
        { role: 'assistant', text: output.summary.taskOverview || 'I generated a new analysis for your input.' },
      ]);
    } catch (err) {
      setApiError('Failed to generate support.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleChat() {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    const lower = userMessage.toLowerCase();
    let reply = 'Try the next step shown in the Next Step Hints tab first.';

    if (lower.includes('what') && lower.includes('assignment')) {
      reply = result.summary.taskOverview;
    } else if (lower.includes('error') || lower.includes('bug') || lower.includes('fault')) {
      reply = result.debug.likelyIssue;
    } else if (lower.includes('hint') || lower.includes('check first')) {
      reply = `${result.hints.nextStep} Why: ${result.hints.whyThisStep}`;
    } else if (lower.includes('requirements')) {
      reply = `Key requirements: ${result.summary.keyRequirements.join(' ')}`;
    }

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: userMessage },
      { role: 'assistant', text: reply },
    ]);
    setChatInput('');
  }

  function clearInputs() {
    setAssignment('');
    setCode('');
    setError('');
    setApiError('');
    setResult(initialResult);
  }

  return (
    <div className="app-shell">
      <header className="hero panel">
        <div>
          <span className="badge">Upgraded Prototype</span>
          <h1>CodeGuide</h1>
          <p>
            An LLM-enhanced assignment understanding assistant for beginner computer science students.
          </p>
        </div>
        <div className="hero-controls">
          <div className="name-box">
            <label>Student name</label>
            <input value={studentName} onChange={(e) => setStudentName(e.target.value)} />
          </div>
          <div className="name-box">
            <label>Analysis Mode</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="llm">LLM-enhanced</option>
              <option value="fallback">Rule-based</option>
            </select>
          </div>
        </div>
      </header>

      <main className="layout">
        <div className="left-column">
          <Panel title="Input Workspace" subtitle="Paste an assignment description, code snippet, and error message.">
            <div className="form-grid">
              <label>
                <span>Assignment Description</span>
                <textarea value={assignment} onChange={(e) => setAssignment(e.target.value)} rows={7} />
              </label>
              <label>
                <span>Code Snippet</span>
                <textarea value={code} onChange={(e) => setCode(e.target.value)} rows={9} className="mono" />
              </label>
              <label>
                <span>Error Message</span>
                <textarea value={error} onChange={(e) => setError(e.target.value)} rows={5} />
              </label>
              <div className="button-row">
                <button className="primary" onClick={handleGenerate} disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Generate Guidance'}
                </button>
                <button className="secondary" onClick={clearInputs}>Clear Inputs</button>
              </div>
              {apiError ? <p className="error-text">{apiError}</p> : null}
              {result.meta.usedFallback ? (
                <p className="status-text">LLM request failed or was unavailable. Showing fallback analysis.</p>
              ) : null}
            </div>
          </Panel>

          <Panel title="Assistant Chat" subtitle="A simple chat-style interface for follow-up questions.">
            <div className="chat-box">
              {messages.map((message, index) => (
                <div key={index} className={message.role === 'assistant' ? 'bubble assistant' : 'bubble user'}>
                  {message.text}
                </div>
              ))}
            </div>
            <div className="chat-row">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask something like: What should I check first?"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleChat();
                }}
              />
              <button className="primary" onClick={handleChat}>Send</button>
            </div>
          </Panel>
        </div>

        <div className="right-column">
          <Panel title="Guidance Output" subtitle="Structured educational support based on the student's current input.">
            <div className="tabs">
              <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')}>Summary</TabButton>
              <TabButton active={activeTab === 'debug'} onClick={() => setActiveTab('debug')}>Debug</TabButton>
              <TabButton active={activeTab === 'hints'} onClick={() => setActiveTab('hints')}>Next Step Hints</TabButton>
            </div>

            {activeTab === 'summary' && (
              <div className="tab-content">
                <div className="info-box">
                  <strong>Task Overview</strong>
                  <p>{result.summary.taskOverview}</p>
                </div>
                <h3>Key Requirements</h3>
                <ul className="card-list">
                  {result.summary.keyRequirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <h3>Watch-outs</h3>
                <ul className="card-list warning">
                  {result.summary.watchOuts.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'debug' && (
              <div className="tab-content">
                <div className="info-box">
                  <strong>Likely Issue</strong>
                  <p>{result.debug.likelyIssue}</p>
                </div>
                <div className="info-box plain">
                  <strong>Possible Causes</strong>
                  <ul className="inner-list">
                    {result.debug.possibleCauses.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <h3>What to Check First</h3>
                <ul className="card-list">
                  {result.debug.checksFirst.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <div className="info-box plain">
                  <strong>Formatting Check</strong>
                  <p>{result.debug.formattingCheck}</p>
                </div>
              </div>
            )}

            {activeTab === 'hints' && (
              <div className="tab-content">
                <div className="hint-card">
                  <strong>Next Step</strong>
                  <p>{result.hints.nextStep}</p>
                </div>
                <div className="hint-card">
                  <strong>Why This Step</strong>
                  <p>{result.hints.whyThisStep}</p>
                </div>
                <div className="hint-card">
                  <strong>Tiny Test Case</strong>
                  <p>{result.hints.tinyTestCase}</p>
                </div>
                <div className="hint-card">
                  <strong>Concept Hint</strong>
                  <p>{result.hints.conceptHint}</p>
                </div>
              </div>
            )}
          </Panel>

          <Panel title="Prototype Scope" subtitle="What this upgraded demo is designed to show.">
            <div className="scope-boxes">
              <div className="info-box"><strong>Goal:</strong> Show how a beginner-friendly assistant can explain assignments, interpret common errors, and suggest structured next-step hints.</div>
              <div className="info-box"><strong>Current limitation:</strong> LLM outputs can still be imperfect, so the system uses cautious wording and fallback analysis.</div>
              <div className="info-box"><strong>Upgrade:</strong> This version supports both rule-based and LLM-enhanced analysis for comparison.</div>
            </div>
          </Panel>
        </div>
      </main>
    </div>
  );
}
