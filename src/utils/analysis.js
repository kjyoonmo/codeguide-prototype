export function analyzeAssignment(text) {
  const lowered = text.toLowerCase();
  const requirements = [];
  const warnings = [];

  if (lowered.includes('stack')) requirements.push('Implement core stack operations such as push, pop, and top.');
  if (lowered.includes('queue')) requirements.push('Implement queue behavior and preserve FIFO order.');
  if (lowered.includes('linked list')) requirements.push('Use a linked-list-based design rather than an array-based implementation.');
  if (lowered.includes('input')) requirements.push('Carefully follow the required input format.');
  if (lowered.includes('output')) requirements.push('Make sure the output format matches the specification exactly.');
  if (lowered.includes('o(1)') || lowered.includes('o (1)')) requirements.push('Check whether each required operation satisfies O(1) time complexity.');
  if (lowered.includes('exception') || lowered.includes('empty')) warnings.push('Edge cases may matter, especially empty structure handling.');
  if (lowered.includes('memory') || lowered.includes('free')) warnings.push('Memory management may be important in this assignment.');

  const summary = text
    ? 'This assignment asks the student to implement a programming task while following specific data structure, input/output, and performance requirements.'
    : 'Paste an assignment description to generate a simple summary.';

  return {
    summary,
    requirements: requirements.length
      ? requirements
      : [
          'Identify the main task to implement.',
          'Check the exact input and output format.',
          'Look for constraints such as required data structures or time complexity.',
        ],
    warnings: warnings.length
      ? warnings
      : ['Watch for edge cases, hidden constraints, and formatting mistakes.'],
  };
}

export function analyzeError(errorText, codeText) {
  const lowered = `${errorText}\n${codeText}`.toLowerCase();

  if (lowered.includes('segmentation fault') || lowered.includes('segfault')) {
    return {
      errorType: 'Segmentation Fault',
      explanation:
        'Your program is likely accessing invalid memory. This often happens with uninitialized pointers, invalid array indexes, or dereferencing NULL.',
      steps: [
        'Check every pointer before dereferencing it.',
        'Verify array or vector indexes stay within bounds.',
        'Add print statements around the suspected line to narrow down where the crash happens.',
        'Test with a very small input first.',
      ],
    };
  }

  if (lowered.includes('index out of range') || lowered.includes('out of bounds')) {
    return {
      errorType: 'Index Error',
      explanation: 'Your code is trying to access a position that does not exist in the array, list, or vector.',
      steps: [
        'Print the container size before the failing line.',
        'Check loop conditions such as i < n instead of i <= n.',
        'Verify the input size matches your assumptions.',
        'Test with the smallest possible case, like 0 or 1 element.',
      ],
    };
  }

  if (lowered.includes('null') || lowered.includes('none type') || lowered.includes('nullpointerexception')) {
    return {
      errorType: 'Null Reference',
      explanation:
        'A variable may not have been initialized before use, or the object you expected does not exist.',
      steps: [
        'Check where the variable is assigned its value.',
        'Add a null or None check before accessing fields or methods.',
        'Trace the code path that leads to the failing line.',
      ],
    };
  }

  return {
    errorType: 'General Debugging Issue',
    explanation:
      'The issue may come from logic, formatting, initialization, or hidden edge cases. Start by isolating the smallest reproducible example.',
    steps: [
      'Compare your output to the required format exactly.',
      'Test one small input case and trace variables step by step.',
      'Check initialization, loop conditions, and return values.',
      'Review edge cases such as empty input, one element, or duplicates.',
    ],
  };
}

export function hintGenerator(assignment, code, error) {
  const hints = [];
  const lowered = `${assignment}\n${code}\n${error}`.toLowerCase();

  if (lowered.includes('linked list')) hints.push('If the assignment requires a linked list, make sure you are not solving it with an array or built-in stack type.');
  if (lowered.includes('o(1)') || lowered.includes('o (1)')) hints.push('Double-check whether your current approach really satisfies the required time complexity.');
  if (lowered.includes('while') || lowered.includes('for')) hints.push('Review your loop condition carefully. Many beginner bugs come from one extra or missing iteration.');
  if (lowered.includes('pointer') || lowered.includes('node') || lowered.includes('next')) hints.push('Trace pointer updates on paper with a 2-node or 3-node example before testing bigger inputs.');
  if (lowered.includes('stack')) hints.push('Write down what the top element should be after each operation. This makes logic bugs easier to spot.');

  return hints.length
    ? hints
    : [
        'Start with the simplest possible test case.',
        'Check whether your code matches every requirement in the assignment, not just the main functionality.',
        'Try to explain your code line by line. The place you cannot explain clearly is often the bug source.',
      ];
}
