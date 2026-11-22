// Source: CLAUDE.md section 2, "Counterbalancing (four conditions, assigned in rotation)".
// Do not change any value here. The first block's prototype is "Design 1", the second "Design 2".
// The prototype letter is never shown to participants (CLAUDE.md section 2).

export const CONDITIONS = {
  C1: [
    { block: 1, design: 'Design 1', prototype: 'A', set: 'set1' },
    { block: 2, design: 'Design 2', prototype: 'B', set: 'set2' },
  ],
  C2: [
    { block: 1, design: 'Design 1', prototype: 'A', set: 'set2' },
    { block: 2, design: 'Design 2', prototype: 'B', set: 'set1' },
  ],
  C3: [
    { block: 1, design: 'Design 1', prototype: 'B', set: 'set1' },
    { block: 2, design: 'Design 2', prototype: 'A', set: 'set2' },
  ],
  C4: [
    { block: 1, design: 'Design 1', prototype: 'B', set: 'set2' },
    { block: 2, design: 'Design 2', prototype: 'A', set: 'set1' },
  ],
}

export const CONDITION_IDS = ['C1', 'C2', 'C3', 'C4']
