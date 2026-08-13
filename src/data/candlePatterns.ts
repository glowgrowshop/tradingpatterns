export interface RelCandle {
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandlePatternDef {
  id: string;
  name: string;
  bias: 'bullish' | 'bearish' | 'neutral';
  context: 'downtrend' | 'uptrend';
  candles: RelCandle[]; // relative units, will be scaled & anchored to chart context
  description: string;
  keyTells: string[];
  howToTrade: string[];
}

export const CANDLE_PATTERNS: CandlePatternDef[] = [
  {
    id: 'hammer',
    name: 'Hammer',
    bias: 'bullish',
    context: 'downtrend',
    candles: [{ open: 0.62, high: 0.66, low: 0, close: 0.68 }],
    description: 'A small body near the top of the range with a long lower wick at least twice the body — appearing after a downtrend. Sellers pushed price sharply lower intrabar, but buyers stepped in and drove it back up.',
    keyTells: ['Long lower wick ≥ 2x the body', 'Little to no upper wick', 'Forms after a decline', 'Small real body near the high of the candle'],
    howToTrade: ['Wait for the next candle to close higher to confirm', 'Stop below the hammer’s low', 'More reliable at a known support level or Fibonacci zone'],
  },
  {
    id: 'shooting-star',
    name: 'Shooting Star',
    bias: 'bearish',
    context: 'uptrend',
    candles: [{ open: 0.34, high: 1, low: 0.3, close: 0.32 }],
    description: 'The bearish mirror of a hammer — a small body near the bottom of the range with a long upper wick, appearing after an uptrend. Buyers pushed price sharply higher, but sellers overwhelmed them by the close.',
    keyTells: ['Long upper wick ≥ 2x the body', 'Little to no lower wick', 'Forms after an advance', 'Small real body near the low of the candle'],
    howToTrade: ['Wait for the next candle to close lower to confirm', 'Stop above the shooting star’s high', 'More reliable at known resistance or a Fib confluence zone'],
  },
  {
    id: 'bullish-engulfing',
    name: 'Bullish Engulfing',
    bias: 'bullish',
    context: 'downtrend',
    candles: [
      { open: 0.62, high: 0.66, low: 0.42, close: 0.46 },
      { open: 0.4, high: 0.72, low: 0.38, close: 0.7 },
    ],
    description: 'A two-candle pattern: a small red (down) candle followed by a larger green (up) candle whose body fully engulfs the prior candle’s body. Shows a decisive shift from selling to buying pressure.',
    keyTells: ['Second candle’s body fully covers the first candle’s body', 'Second candle opens at/below prior close and closes above prior open', 'More significant after an extended decline'],
    howToTrade: ['Enter on the close of the engulfing candle or on a pullback the next session', 'Stop below the pattern’s low', 'Higher odds when it forms at support or with rising volume'],
  },
  {
    id: 'bearish-engulfing',
    name: 'Bearish Engulfing',
    bias: 'bearish',
    context: 'uptrend',
    candles: [
      { open: 0.38, high: 0.58, low: 0.34, close: 0.54 },
      { open: 0.6, high: 0.62, low: 0.28, close: 0.3 },
    ],
    description: 'The bearish mirror of a bullish engulfing pattern — a small green candle followed by a larger red candle that fully engulfs it, showing sellers overwhelming buyers.',
    keyTells: ['Second candle’s red body fully covers the first candle’s green body', 'Second candle opens at/above prior close and closes below prior open', 'More significant after an extended advance'],
    howToTrade: ['Enter short on the close of the engulfing candle or a bounce the next session', 'Stop above the pattern’s high', 'Higher odds at resistance or with rising volume'],
  },
  {
    id: 'doji',
    name: 'Doji',
    bias: 'neutral',
    context: 'uptrend',
    candles: [{ open: 0.5, high: 0.85, low: 0.15, close: 0.51 }],
    description: 'Open and close are nearly identical, producing a cross-like shape with wicks on both sides. Represents indecision — neither buyers nor sellers won control during that period.',
    keyTells: ['Open ≈ close (very small or no real body)', 'Wick length can vary; long-legged, dragonfly, and gravestone are variants', 'Meaning depends heavily on where it appears in the trend'],
    howToTrade: ['A doji alone is not a signal — treat it as a caution flag on trend continuation', 'After a strong trend, watch the next 1-2 candles for confirmation of a reversal', 'Combine with support/resistance or RSI extremes for higher-probability reads'],
  },
  {
    id: 'morning-star',
    name: 'Morning Star',
    bias: 'bullish',
    context: 'downtrend',
    candles: [
      { open: 0.7, high: 0.74, low: 0.42, close: 0.46 },
      { open: 0.38, high: 0.42, low: 0.32, close: 0.36 },
      { open: 0.4, high: 0.72, low: 0.38, close: 0.68 },
    ],
    description: 'A three-candle bullish reversal: a long red candle, a small-bodied candle that gaps or drifts lower (indecision), then a strong green candle closing well into the first candle’s body.',
    keyTells: ['Middle candle has a small body, showing selling pressure stalling', 'Third candle closes above the midpoint of the first candle', 'Forms after a sustained downtrend'],
    howToTrade: ['Enter on the close of the third candle or a retest the next day', 'Stop below the low of the middle candle', 'One of the higher-reliability three-candle reversal patterns, especially at support'],
  },
];
