import type { ControlPoint } from '../lib/chartData';

export const FULL_WAVE_PATH: ControlPoint[] = [
  { x: 0, y: 0.3 },
  { x: 0.12, y: 0.55 }, // end wave 1
  { x: 0.2, y: 0.42 }, // end wave 2
  { x: 0.45, y: 0.85 }, // end wave 3
  { x: 0.55, y: 0.72 }, // end wave 4
  { x: 0.72, y: 0.95 }, // end wave 5
  { x: 0.8, y: 0.75 }, // end wave A
  { x: 0.88, y: 0.85 }, // end wave B
  { x: 1, y: 0.55 }, // end wave C
];

export const WAVE_LABEL_POINTS: { x: number; y: number; label: string }[] = [
  { x: 0.12, y: 0.55, label: '1' },
  { x: 0.2, y: 0.42, label: '2' },
  { x: 0.45, y: 0.85, label: '3' },
  { x: 0.55, y: 0.72, label: '4' },
  { x: 0.72, y: 0.95, label: '5' },
  { x: 0.8, y: 0.75, label: 'A' },
  { x: 0.88, y: 0.85, label: 'B' },
  { x: 1, y: 0.55, label: 'C' },
];

export interface WaveOption {
  label: string;
  correct: boolean;
  rationale: string;
}

export interface WaveScenario {
  id: string;
  title: string;
  cutAt: number; // fraction of full path visible
  labelsVisible: string[];
  setupNote: string;
  question: string;
  options: WaveOption[];
  rule: string;
}

export const WAVE_SCENARIOS: WaveScenario[] = [
  {
    id: 'end-wave-2',
    title: 'End of Wave 2',
    cutAt: 0.2,
    labelsVisible: ['1', '2'],
    setupNote: 'An initial 5-wave-looking move up (wave 1) has been followed by a pullback (wave 2) that has NOT broken below the start of wave 1.',
    question: 'If this is a valid Elliott wave count, what should you expect next?',
    options: [
      { label: 'Wave 3 — typically the longest and strongest wave in the sequence, often extending well beyond wave 1', correct: true, rationale: 'Wave 2 pullbacks almost never retrace beyond 100% of wave 1 (that would invalidate the count). Once wave 2 holds, wave 3 is statistically the most powerful wave — the one trend-followers most want to be positioned for, often extending to 1.618x wave 1 or more.' },
      { label: 'The uptrend is over; expect a full reversal', correct: false, rationale: 'A wave 2 pullback holding above the wave 1 start is normal corrective behavior, not evidence of a full trend reversal.' },
      { label: 'Wave 5, since the pattern is nearly finished', correct: false, rationale: 'Only 2 of 5 impulse waves have formed — jumping to wave 5 skips waves 3 and 4 entirely.' },
      { label: 'This must be a corrective ABC pattern, not an impulse', correct: false, rationale: 'A wave 2 that holds above the origin of wave 1 is exactly what a valid impulse wave 2 looks like — no rule has been broken.' },
    ],
    rule: 'Elliott Wave Rule: Wave 2 can never retrace more than 100% of Wave 1.',
  },
  {
    id: 'end-wave-3',
    title: 'End of Wave 3',
    cutAt: 0.45,
    labelsVisible: ['1', '2', '3'],
    setupNote: 'A powerful wave 3 has extended well past the top of wave 1 and appears to be stalling — momentum indicators are likely diverging here.',
    question: 'What is the highest-probability expectation for the next leg?',
    options: [
      { label: 'Wave 4 — a corrective pullback that should stay shallow and, critically, should NOT drop into wave 1\'s price territory', correct: true, rationale: 'After the powerful wave 3, a wave 4 correction is expected. The key rule to watch: in a standard impulse, wave 4 should not overlap the price territory of wave 1. If price violates that, the count is likely wrong.' },
      { label: 'Wave 5 begins immediately with no pullback at all', correct: false, rationale: 'A corrective wave 4 almost always separates wave 3 from wave 5 — jumping straight to 5 skips a normal, expected structural step.' },
      { label: 'The trend has fully reversed since wave 3 was so strong', correct: false, rationale: 'A strong wave 3 stalling is a normal transition point (into wave 4), not evidence of a full trend change by itself.' },
      { label: 'Wave 4 should retrace more than 100% of wave 3', correct: false, rationale: 'That would be an unusually deep and rule-breaking retracement — wave 4 corrections are typically much shallower (often 23.6%-38.2% of wave 3).' },
    ],
    rule: 'Elliott Wave Rule: Wave 4 should not enter the price territory of Wave 1 (in most markets/impulses).',
  },
  {
    id: 'end-wave-4',
    title: 'End of Wave 4',
    cutAt: 0.55,
    labelsVisible: ['1', '2', '3', '4'],
    setupNote: 'Wave 4 has pulled back shallowly without overlapping wave 1\'s high, and price is turning back up.',
    question: 'What is the highest-probability expectation for the next leg?',
    options: [
      { label: 'Wave 5 — the final leg of the impulse; often shows weaker momentum (RSI/MACD divergence) than wave 3 even if price makes a new high', correct: true, rationale: 'This is the setup for the final impulse wave. A well-known nuance: wave 5 frequently makes a marginal new price high but with noticeably weaker momentum than wave 3 — a textbook bearish divergence — which is itself a clue the whole 5-wave move (and trend) may be nearing exhaustion.' },
      { label: 'Wave 2 repeats since the pattern resets', correct: false, rationale: 'Elliott wave counts move forward sequentially — after a valid wave 4, the next impulse leg is wave 5, not a reset back to wave 2.' },
      { label: 'This is now guaranteed to be the top with no further upside possible', correct: false, rationale: 'Wave 5 still needs to complete — assuming the top is already in skips the final, often tradeable leg of the move.' },
      { label: 'Momentum divergence on the eventual wave 5 high should be ignored', correct: false, rationale: 'That divergence is one of the most useful practical tells in Elliott wave analysis — ignoring it discards real information about trend exhaustion.' },
    ],
    rule: 'Practical tell: Wave 5 often shows momentum divergence vs. Wave 3 even while price makes a marginal new high — a common early warning the impulse is ending.',
  },
  {
    id: 'end-wave-5',
    title: 'End of Wave 5 (Impulse Complete)',
    cutAt: 0.72,
    labelsVisible: ['1', '2', '3', '4', '5'],
    setupNote: 'The 5-wave impulse looks complete, with wave 5 showing weaker momentum than wave 3. Price is now turning down.',
    question: 'What is the highest-probability expectation now?',
    options: [
      { label: 'A corrective A-B-C pullback (a 3-wave counter-trend move) — not necessarily a full trend reversal', correct: true, rationale: 'After a complete 5-wave impulse, Elliott wave theory expects a 3-wave (A-B-C) correction against the trend. This correction can be sharp, but it\'s structurally different from — and often smaller/shorter than — the impulse that preceded it, and frequently sets up the next impulse in the original direction once complete.' },
      { label: 'Another 5-wave impulse continues immediately with no correction', correct: false, rationale: 'A complete impulse is normally followed by a corrective structure (ABC), not an immediate continuation straight into a new 5-wave move.' },
      { label: 'Price must retrace 100% of the entire 5-wave move', correct: false, rationale: 'Corrections often retrace to common Fibonacci levels (38.2%-61.8% of the whole impulse) rather than the full move — assuming 100% overstates the typical correction.' },
      { label: 'This confirms a permanent trend reversal with certainty', correct: false, rationale: 'A correction can look similar to a reversal in real time — Elliott wave counts describe probabilities and structure, not certainties, and the C-wave low is often where the next impulse begins.' },
    ],
    rule: 'Structure Rule: Impulses (5 waves, with-trend) are followed by corrections (3 waves, against-trend), and the cycle repeats at increasingly larger degrees.',
  },
  {
    id: 'end-wave-c',
    title: 'End of Wave C (Correction Complete)',
    cutAt: 1,
    labelsVisible: ['1', '2', '3', '4', '5', 'A', 'B', 'C'],
    setupNote: 'The A-B-C correction looks complete — wave C has moved into a common Fibonacci retracement zone of the entire prior 5-wave impulse, and downside momentum is fading.',
    question: 'What is the highest-probability expectation now?',
    options: [
      { label: 'A new impulse wave 1 (of the next larger sequence) may be starting — watch for confirmation like a break of the wave B high or a bullish momentum shift', correct: true, rationale: 'Once a corrective ABC completes at a reasonable Fibonacci retracement zone (commonly 38.2%-61.8%), the market often begins a new impulse sequence in the original trend direction. This is a place to start watching closely for confirmation — not to assume it automatically, since corrections can also extend into more complex patterns.' },
      { label: 'Wave C endings are always exact and can be traded with no confirmation needed', correct: false, rationale: 'Corrections can extend, flatten, or turn into more complex structures — treating every apparent wave C low as an automatic entry ignores that real uncertainty.' },
      { label: 'The entire prior uptrend is now guaranteed to be over', correct: false, rationale: 'A completed ABC correction within a larger uptrend is a normal, expected part of that trend\'s structure — not proof the larger trend has ended.' },
      { label: 'Ignore Fibonacci retracement zones when evaluating where a correction might end', correct: false, rationale: 'Fib retracement zones (especially 50%-61.8%) are one of the most common tools Elliott wave practitioners use alongside wave counts to judge where a correction is likely to complete.' },
    ],
    rule: 'Practical tell: Corrections frequently end near common Fibonacci retracement levels of the prior impulse — a useful confluence check on your wave count.',
  },
];
