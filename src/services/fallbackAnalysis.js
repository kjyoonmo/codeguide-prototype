export function generateFallbackSupport({ assignment, code, error }) {
  const lowered = `${assignment}\n${code}\n${error}`.toLowerCase();

  const keyRequirements = [];
  const watchOuts = [];
  const possibleCauses = [];
  const checksFirst = [];

  if (lowered.includes('stack')) {
    keyRequirements.push('Implement the required stack operations correctly.');
    watchOuts.push('Check empty-stack handling before reading the top value.');
  }
  if (lowered.includes('queue')) {
    keyRequirements.push('Preserve FIFO order for enqueue and dequeue operations.');
  }
  if (lowered.includes('linked list')) {
    keyRequirements.push('Use a linked-list-based implementation if the assignment requires it.');
  }
  if (lowered.includes('o(1)') || lowered.includes('o (1)')) {
    watchOuts.push('Verify that the required operations satisfy the stated time complexity.');
  }
  if (lowered.includes('input') || lowered.includes('output') || lowered.includes('format')) {
    watchOuts.push('Compare the exact input and output format with the assignment sheet.');
  }

  if (lowered.includes('segmentation fault') || lowered.includes('segfault')) {
    possibleCauses.push('A likely cause is invalid memory access.');
    possibleCauses.push('The code may dereference a null or uninitialized pointer.');
    checksFirst.push('Check whether the pointer is valid before dereferencing it.');
    checksFirst.push('Test the same code path with the smallest possible input.');
  } else if (lowered.includes('index out of range') || lowered.includes('out of bounds')) {
    possibleCauses.push('A likely cause is accessing an invalid index.');
    possibleCauses.push('The loop may run one step too far.');
    checksFirst.push('Print the list or array size before the failing line.');
    checksFirst.push('Check whether the loop uses <= instead of <.');
  } else if (lowered.includes('wrong answer') || lowered.includes('format')) {
    possibleCauses.push('A likely cause is an output-format mismatch.');
    possibleCauses.push('The printed text may differ from the expected format even if the logic is close.');
    checksFirst.push('Compare your output line by line with the sample output.');
    checksFirst.push('Check spaces, punctuation, and line breaks.');
  } else {
    possibleCauses.push('A likely cause is a logic or formatting issue.');
    possibleCauses.push('There may also be an edge case that is not handled correctly.');
    checksFirst.push('Trace the code with a very small test case.');
    checksFirst.push('Compare your output and assumptions with the assignment requirements.');
  }

  return {
    summary: {
      taskOverview:
        assignment?.trim()
          ? 'This assignment asks the student to implement the required task while following the given rules and constraints.'
          : 'Paste an assignment description to generate a beginner-friendly summary.',
      keyRequirements:
        keyRequirements.length > 0
          ? keyRequirements
          : ['Identify the main functionality, the required input, and the expected output behavior.'],
      watchOuts:
        watchOuts.length > 0
          ? watchOuts
          : ['Watch for edge cases, hidden constraints, and formatting mistakes.'],
    },
    debug: {
      likelyIssue:
        possibleCauses[0] || 'A likely issue is a mismatch between the intended logic and the current implementation.',
      possibleCauses,
      checksFirst,
      formattingCheck:
        'Also compare spaces, line breaks, labels, and extra printed text with the required output format.',
    },
    hints: {
      nextStep: checksFirst[0] || 'Run the code with the smallest possible test input.',
      whyThisStep:
        'This helps isolate the problem in a simple case before changing the overall design.',
      tinyTestCase:
        lowered.includes('stack')
          ? 'Initialize an empty stack and call pop() once.'
          : lowered.includes('queue')
          ? 'Run enqueue(10), dequeue(), and compare the printed output.'
          : 'Use an input with 0 or 1 element.',
      conceptHint:
        'Focus on verifying one small part of the program before rewriting the whole solution.',
    },
    meta: {
      mode: 'fallback',
      usedFallback: true,
    },
  };
}
