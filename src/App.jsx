import { useMemo, useState } from 'react';
import { analyzeAssignment, analyzeError, hintGenerator } from './utils/analysis';

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

  const assignmentAnalysis = useMemo(() => analyzeAssignment(assignment), [assignment]);
  const errorAnalysis = useMemo(() => analyzeError(error, code), [error, code]);
  const hints = useMemo(() => hintGenerator(assignment, code, error), [assignment, code, error]);

  function handleGenerate() {
    const assistantReply =
      'Here’s a beginner-friendly explanation: This assignment mainly asks you to build the required data structure correctly, follow the input/output format, and handle edge cases safely. Based on your error, I would first check empty cases and pointer safety before changing the overall design.';

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: 'Can you help me understand this assignment and debug my issue?' },
      { role: 'assistant', text: assistantReply },
    ]);
  }

  function handleChat() {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    const lower = userMessage.toLowerCase();
    let reply =
      'Try narrowing the problem to one very small test case and compare each step of your code against the assignment requirements.';

    if (lower.includes('what') && lower.includes('assignment')) {
      reply = assignmentAnalysis.summary;
    } else if (lower.includes('error') || lower.includes('bug') || lower.includes('fault')) {
      reply = `${errorAnalysis.errorType}: ${errorAnalysis.explanation}`;
    } else if (lower.includes('hint') || lower.includes('check first')) {
      reply = `First things to check: ${hints.slice(0, 2).join(' ')}`;
    } else if (lower.includes('requirements')) {
      reply = `Key requirements: ${assignmentAnalysis.requirements.join(' ')}`;
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
  }

  return (
    <div className="app-shell">
      <header className="hero panel">
        <div>
          <span className="badge">Prototype</span>
          <h1>CodeGuide</h1>
          <p>
            An LLM-inspired assignment understanding assistant for beginner computer science students.
          </p>
        </div>
        <div className="name-box">
          <label>Student name</label>
          <input value={studentName} onChange={(e) => setStudentName(e.target.value)} />
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
                <button className="primary" onClick={handleGenerate}>Generate Guidance</button>
                <button className="secondary" onClick={clearInputs}>Clear Inputs</button>
              </div>
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
          <Panel title="Guidance Output" subtitle="Simple explanations based on the student's current input.">
            <div className="tabs">
              <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')}>Summary</TabButton>
              <TabButton active={activeTab === 'debug'} onClick={() => setActiveTab('debug')}>Debug</TabButton>
              <TabButton active={activeTab === 'hints'} onClick={() => setActiveTab('hints')}>Hints</TabButton>
            </div>

            {activeTab === 'summary' && (
              <div className="tab-content">
                <div className="info-box">
                  <p>{assignmentAnalysis.summary}</p>
                </div>
                <h3>Key Requirements</h3>
                <ul className="card-list">
                  {assignmentAnalysis.requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <h3>Things to Watch</h3>
                <ul className="card-list warning">
                  {assignmentAnalysis.warnings.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'debug' && (
              <div className="tab-content">
                <div className="info-box">
                  <strong>Detected Issue</strong>
                  <p>{errorAnalysis.errorType}</p>
                </div>
                <div className="info-box plain">
                  <strong>Beginner-Friendly Explanation</strong>
                  <p>{errorAnalysis.explanation}</p>
                </div>
                <h3>Suggested Debugging Steps</h3>
                <ol className="card-list numbered">
                  {errorAnalysis.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {activeTab === 'hints' && (
              <div className="tab-content">
                <ul className="card-list">
                  {hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </Panel>

          <Panel title="Prototype Scope" subtitle="What this demo is designed to show.">
            <div className="scope-boxes">
              <div className="info-box"><strong>Goal:</strong> Show how a beginner-friendly assistant can explain assignments, interpret common errors, and suggest debugging hints.</div>
              <div className="info-box"><strong>Current limitation:</strong> This is a front-end prototype with rule-based responses that simulate an LLM workflow.</div>
              <div className="info-box"><strong>Next step:</strong> Connect this interface to a real LLM API and evaluate user satisfaction with beginner students.</div>
            </div>
          </Panel>
        </div>
      </main>
    </div>
  );
}
