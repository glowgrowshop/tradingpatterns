import type { ControlPoint } from '../lib/chartData';

export type PatternBias = 'bullish' | 'bearish' | 'neutral';

export interface PatternDef {
  id: string;
  name: string;
  bias: PatternBias;
  kind: 'reversal' | 'continuation';
  points: ControlPoint[];
  description: string;
  keyTells: string[];
  howToTrade: string[];
}

export const CHART_PATTERNS: PatternDef[] = [
  {
    id: 'head-shoulders-top',
    name: 'Head and Shoulders (Top)',
    bias: 'bearish',
    kind: 'reversal',
    points: [
      { x: 0, y: 0.28 }, { x: 0.15, y: 0.62 }, { x: 0.3, y: 0.42 },
      { x: 0.45, y: 0.88 }, { x: 0.6, y: 0.42 }, { x: 0.75, y: 0.62 },
      { x: 0.87, y: 0.4 }, { x: 1, y: 0.1 },
    ],
    description: 'Three peaks — a left shoulder, a higher head, and a right shoulder of similar height to the left shoulder — with a "neckline" connecting the two swing lows. It shows demand failing to push price to new highs a third time.',
    keyTells: [
      'Middle peak (head) is the highest of the three',
      'Two shoulders form at roughly similar price levels',
      'Volume often fades on the head and right shoulder vs. the left',
      'Confirmation comes on a close below the neckline',
    ],
    howToTrade: [
      'Wait for a confirmed close below the neckline — don’t front-run the break',
      'Measure the height from head to neckline and project that distance down for a target',
      'Place a stop above the right shoulder high',
      'Watch for a throwback retest of the neckline (now resistance) before continuation',
    ],
  },
  {
    id: 'head-shoulders-bottom',
    name: 'Inverse Head and Shoulders',
    bias: 'bullish',
    kind: 'reversal',
    points: [
      { x: 0, y: 0.72 }, { x: 0.15, y: 0.38 }, { x: 0.3, y: 0.58 },
      { x: 0.45, y: 0.12 }, { x: 0.6, y: 0.58 }, { x: 0.75, y: 0.38 },
      { x: 0.87, y: 0.6 }, { x: 1, y: 0.9 },
    ],
    description: 'The mirror image of a head and shoulders top, found at the bottom of a downtrend. A deeper middle low (the head) sits between two shallower lows (the shoulders), signaling sellers are losing control.',
    keyTells: [
      'Middle trough (head) is the deepest of the three',
      'Shoulders form at similar, shallower price levels',
      'Volume tends to expand on the breakout above the neckline',
      'Confirmation is a close above the neckline',
    ],
    howToTrade: [
      'Enter on a confirmed close above the neckline, or on a retest of it as support',
      'Target = neckline + (neckline − head depth), the mirrored measured move',
      'Stop below the right shoulder low',
      'Higher-probability when it forms after an extended downtrend, not a shallow pullback',
    ],
  },
  {
    id: 'double-top',
    name: 'Double Top',
    bias: 'bearish',
    kind: 'reversal',
    points: [
      { x: 0, y: 0.2 }, { x: 0.25, y: 0.85 }, { x: 0.42, y: 0.48 },
      { x: 0.58, y: 0.84 }, { x: 0.78, y: 0.42 }, { x: 1, y: 0.12 },
    ],
    description: 'Price rallies to a resistance level, pulls back, then rallies again but fails at roughly the same level — forming an "M" shape. It reflects a second failed attempt by buyers to break through.',
    keyTells: [
      'Two peaks at nearly the same price',
      'A moderate pullback between the peaks (the "valley")',
      'Second peak often forms on lower volume than the first (weakening momentum)',
      'Break below the valley low confirms the pattern',
    ],
    howToTrade: [
      'Confirm with a close below the valley/support line between the two tops',
      'Target = valley price − (peak − valley) measured move',
      'Stop just above the second peak',
      'Avoid trading it in a strong uptrend context without other confirmation (RSI divergence helps a lot here)',
    ],
  },
  {
    id: 'double-bottom',
    name: 'Double Bottom',
    bias: 'bullish',
    kind: 'reversal',
    points: [
      { x: 0, y: 0.8 }, { x: 0.25, y: 0.15 }, { x: 0.42, y: 0.52 },
      { x: 0.58, y: 0.16 }, { x: 0.78, y: 0.58 }, { x: 1, y: 0.88 },
    ],
    description: 'The inverse of a double top — a "W" shape where price finds support twice at a similar level before breaking higher through the intervening peak.',
    keyTells: [
      'Two troughs at nearly the same price',
      'A moderate bounce between the troughs',
      'Second trough often shows less selling volume / bullish RSI divergence',
      'Break above the middle peak confirms the pattern',
    ],
    howToTrade: [
      'Enter on a confirmed close above the middle peak (the "neckline")',
      'Target = neckline + (neckline − trough) measured move',
      'Stop below the second trough',
      'Strongest at the end of an extended downtrend, especially with rising volume on the second leg up',
    ],
  },
  {
    id: 'ascending-triangle',
    name: 'Ascending Triangle',
    bias: 'bullish',
    kind: 'continuation',
    points: [
      { x: 0, y: 0.3 }, { x: 0.15, y: 0.68 }, { x: 0.3, y: 0.42 },
      { x: 0.45, y: 0.68 }, { x: 0.6, y: 0.5 }, { x: 0.75, y: 0.67 },
      { x: 0.87, y: 0.58 }, { x: 1, y: 0.96 },
    ],
    description: 'A flat horizontal resistance line caps price while the swing lows keep rising, squeezing price into a tightening range. Buyers are becoming more aggressive on each dip.',
    keyTells: [
      'Flat top (resistance tested multiple times at the same level)',
      'Rising trendline connecting higher lows',
      'Volume typically contracts through the pattern, then expands on breakout',
    ],
    howToTrade: [
      'Enter on a volume-backed breakout above the flat resistance',
      'Target = height of the triangle added to the breakout point',
      'Stop below the most recent higher low',
      'Considered a continuation pattern — highest odds when it forms within an existing uptrend',
    ],
  },
  {
    id: 'descending-triangle',
    name: 'Descending Triangle',
    bias: 'bearish',
    kind: 'continuation',
    points: [
      { x: 0, y: 0.7 }, { x: 0.15, y: 0.32 }, { x: 0.3, y: 0.58 },
      { x: 0.45, y: 0.32 }, { x: 0.6, y: 0.5 }, { x: 0.75, y: 0.33 },
      { x: 0.87, y: 0.42 }, { x: 1, y: 0.04 },
    ],
    description: 'The mirror image of an ascending triangle — a flat horizontal support line while swing highs keep falling, showing sellers stepping in more aggressively on each rally.',
    keyTells: [
      'Flat bottom (support tested multiple times)',
      'Descending trendline connecting lower highs',
      'Breakdown usually comes with a volume surge',
    ],
    howToTrade: [
      'Enter short on a confirmed close below the flat support',
      'Target = triangle height subtracted from the breakdown point',
      'Stop above the most recent lower high',
      'Highest odds as a continuation of an existing downtrend',
    ],
  },
  {
    id: 'symmetrical-triangle',
    name: 'Symmetrical Triangle',
    bias: 'neutral',
    kind: 'continuation',
    points: [
      { x: 0, y: 0.32 }, { x: 0.15, y: 0.78 }, { x: 0.3, y: 0.38 },
      { x: 0.45, y: 0.68 }, { x: 0.6, y: 0.44 }, { x: 0.75, y: 0.6 },
      { x: 0.87, y: 0.5 }, { x: 1, y: 0.88 },
    ],
    description: 'Converging trendlines — lower highs meeting higher lows — squeeze volatility out of the market before an explosive move. Direction is not implied by the shape itself; it usually resolves in the direction of the prior trend.',
    keyTells: [
      'Series of lower highs and higher lows converging to a point (the apex)',
      'Volume contracts steadily through the pattern',
      'Breakout typically occurs 2/3 to 3/4 of the way to the apex',
    ],
    howToTrade: [
      'Wait for a decisive, volume-backed close outside either trendline — don’t guess direction early',
      'Target = the widest part (height) of the triangle projected from the breakout',
      'Stop on the opposite side of the breakout trendline',
      'Bias the trade with the higher-timeframe trend and EMA slope',
    ],
  },
  {
    id: 'bull-flag',
    name: 'Bull Flag',
    bias: 'bullish',
    kind: 'continuation',
    points: [
      { x: 0, y: 0.15 }, { x: 0.28, y: 0.82 }, { x: 0.4, y: 0.72 },
      { x: 0.5, y: 0.78 }, { x: 0.62, y: 0.68 }, { x: 0.74, y: 0.74 },
      { x: 1, y: 1.0 },
    ],
    description: 'A sharp, near-vertical rally (the "flagpole") followed by a tight, slightly downward-drifting consolidation (the "flag") before the trend resumes. Represents a brief, healthy pause after an aggressive move.',
    keyTells: [
      'Steep, high-volume flagpole move',
      'Flag channel drifts gently against the trend on lighter volume',
      'Breakout resumes in the original trend direction',
    ],
    howToTrade: [
      'Enter on a break above the flag’s upper trendline, ideally with a volume pickup',
      'Target = length of the flagpole projected from the breakout point',
      'Stop below the flag’s low',
      'Best when the flag stays shallow (under ~38% retracement of the pole) and forms quickly',
    ],
  },
  {
    id: 'bear-flag',
    name: 'Bear Flag',
    bias: 'bearish',
    kind: 'continuation',
    points: [
      { x: 0, y: 0.85 }, { x: 0.28, y: 0.18 }, { x: 0.4, y: 0.28 },
      { x: 0.5, y: 0.22 }, { x: 0.62, y: 0.32 }, { x: 0.74, y: 0.26 },
      { x: 1, y: 0.0 },
    ],
    description: 'The bearish mirror of a bull flag — a sharp decline followed by a tight, slightly upward-drifting consolidation before the downtrend resumes.',
    keyTells: [
      'Steep, high-volume decline (flagpole)',
      'Flag channel drifts up gently on lighter volume',
      'Breakdown resumes the original downtrend',
    ],
    howToTrade: [
      'Enter short on a break below the flag’s lower trendline',
      'Target = length of the flagpole projected down from the breakdown',
      'Stop above the flag’s high',
      'Watch for volume expansion on the breakdown to confirm continuation vs. a failed flag',
    ],
  },
  {
    id: 'rising-wedge',
    name: 'Rising Wedge',
    bias: 'bearish',
    kind: 'reversal',
    points: [
      { x: 0, y: 0.18 }, { x: 0.2, y: 0.48 }, { x: 0.35, y: 0.38 },
      { x: 0.5, y: 0.6 }, { x: 0.65, y: 0.53 }, { x: 0.8, y: 0.66 },
      { x: 0.9, y: 0.6 }, { x: 1, y: 0.22 },
    ],
    description: 'Both trendlines slope upward but converge, with the lower line rising faster than the upper — price keeps making higher highs and higher lows, but momentum and volume typically fade, warning of an exhausted rally.',
    keyTells: [
      'Both boundary lines slope up and converge toward an apex',
      'Volume tends to decline as the wedge tightens',
      'Momentum indicators (RSI/MACD) often diverge lower even as price grinds higher',
    ],
    howToTrade: [
      'Enter short on a confirmed break below the lower rising trendline',
      'Target = the widest part of the wedge subtracted from the breakdown',
      'Stop above the most recent swing high',
      'Can appear as a reversal after an uptrend or as a continuation pattern within a downtrend — context matters',
    ],
  },
  {
    id: 'falling-wedge',
    name: 'Falling Wedge',
    bias: 'bullish',
    kind: 'reversal',
    points: [
      { x: 0, y: 0.82 }, { x: 0.2, y: 0.52 }, { x: 0.35, y: 0.62 },
      { x: 0.5, y: 0.4 }, { x: 0.65, y: 0.47 }, { x: 0.8, y: 0.34 },
      { x: 0.9, y: 0.4 }, { x: 1, y: 0.78 },
    ],
    description: 'The bullish mirror of a rising wedge — both trendlines slope down and converge, with the upper line falling faster. It signals selling pressure is exhausting even as price ekes out lower lows.',
    keyTells: [
      'Both boundary lines slope down and converge',
      'Volume typically dries up as the wedge narrows',
      'Bullish RSI/MACD divergence is common near the end of the wedge',
    ],
    howToTrade: [
      'Enter on a confirmed break above the upper falling trendline',
      'Target = widest part of the wedge added to the breakout point',
      'Stop below the most recent swing low',
      'One of the more reliable reversal patterns when volume expands on the breakout',
    ],
  },
  {
    id: 'cup-and-handle',
    name: 'Cup and Handle',
    bias: 'bullish',
    kind: 'continuation',
    points: [
      { x: 0, y: 0.72 }, { x: 0.16, y: 0.32 }, { x: 0.32, y: 0.12 },
      { x: 0.5, y: 0.14 }, { x: 0.66, y: 0.36 }, { x: 0.78, y: 0.68 },
      { x: 0.85, y: 0.58 }, { x: 0.94, y: 0.64 }, { x: 1, y: 0.95 },
    ],
    description: 'A rounded "U" shaped base (the cup) followed by a small downward-drifting consolidation near the prior high (the handle) before a breakout to new highs.',
    keyTells: [
      'Smooth, rounded cup bottom — not a sharp V',
      'Handle is shallow (commonly under ~1/3 of the cup’s depth) and short compared to the cup',
      'Volume often dries up in the handle, then surges on breakout',
    ],
    howToTrade: [
      'Enter on a breakout above the handle’s resistance (the prior high)',
      'Target = depth of the cup projected up from the breakout',
      'Stop below the handle’s low',
      'A deep, sharp "V" bottom or an overly deep handle both lower the pattern’s reliability',
    ],
  },
  {
    id: 'rounding-bottom',
    name: 'Rounding Bottom (Saucer)',
    bias: 'bullish',
    kind: 'reversal',
    points: [
      { x: 0, y: 0.75 }, { x: 0.25, y: 0.3 }, { x: 0.5, y: 0.16 },
      { x: 0.75, y: 0.32 }, { x: 1, y: 0.78 },
    ],
    description: 'A slow, gradual "U" shaped reversal with no handle, reflecting a long, quiet transition from distribution/selling to accumulation/buying. Often seen on longer timeframes (weekly/monthly).',
    keyTells: [
      'Smooth, symmetric bowl shape over an extended period',
      'Volume often forms its own U shape — high at the start, low at the middle, rising at the end',
      'No sharp spikes; the move is gradual by definition',
    ],
    howToTrade: [
      'Enter as price breaks back above the level where the decline began',
      'Because it develops slowly, scaling in as higher lows confirm is often better than waiting for one breakout candle',
      'Stop below the most recent higher low inside the bowl',
      'Best suited to swing/position trades given the pattern’s longer duration',
    ],
  },
];

export function randomDistractors(correctId: string, count: number, seedRand: () => number): PatternDef[] {
  const pool = CHART_PATTERNS.filter((p) => p.id !== correctId);
  const shuffled = [...pool].sort(() => seedRand() - 0.5);
  return shuffled.slice(0, count);
}
