import { type Bar, ema, rsi, macd, bollingerBands, sma } from './indicators';

export interface SignalFactor {
  label: string;
  points: number; // -25..25 contribution
  detail: string;
  tone: 'bullish' | 'bearish' | 'neutral';
}

export interface SignalResult {
  score: number; // -100..100
  verdict: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  factors: SignalFactor[];
}

/**
 * ChartSchool Confluence Signal — an educational composite score, NOT financial advice.
 * Blends trend (EMA stack), momentum (RSI + MACD), volatility positioning (Bollinger Bands),
 * and a volume confirmation check into one -100..100 score. Built so learners can see *why*
 * a signal fired, not just the output — click into any factor to see the calculation.
 */
export function computeConfluenceSignal(bars: Bar[]): SignalResult {
  const closes = bars.map((b) => b.close);
  const volumes = bars.map((b) => b.volume);
  const i = bars.length - 1;

  const ema9 = ema(closes, 9);
  const ema21 = ema(closes, 21);
  const ema50 = ema(closes, 50);
  const rsiVals = rsi(closes, 14);
  const macdRes = macd(closes, 12, 26, 9);
  const bb = bollingerBands(closes, 20, 2);
  const volSma = sma(volumes, 20);

  const factors: SignalFactor[] = [];

  // 1. Trend: EMA stack alignment
  const e9 = ema9[i];
  const e21 = ema21[i];
  const e50 = ema50[i];
  if (e9 !== null && e21 !== null && e50 !== null) {
    const price = closes[i];
    if (price > e9 && e9 > e21 && e21 > e50) {
      factors.push({ label: 'Trend (EMA stack)', points: 25, detail: 'Price > 9 EMA > 21 EMA > 50 EMA — a clean, fully bullish stack.', tone: 'bullish' });
    } else if (price < e9 && e9 < e21 && e21 < e50) {
      factors.push({ label: 'Trend (EMA stack)', points: -25, detail: 'Price < 9 EMA < 21 EMA < 50 EMA — a clean, fully bearish stack.', tone: 'bearish' });
    } else if (price > e21 && e21 > e50) {
      factors.push({ label: 'Trend (EMA stack)', points: 12, detail: 'Price is above a rising 21/50 EMA base — uptrend intact, but the short-term EMA is not aligned.', tone: 'bullish' });
    } else if (price < e21 && e21 < e50) {
      factors.push({ label: 'Trend (EMA stack)', points: -12, detail: 'Price is below a falling 21/50 EMA base — downtrend intact, but the short-term EMA is not aligned.', tone: 'bearish' });
    } else {
      factors.push({ label: 'Trend (EMA stack)', points: 0, detail: 'EMAs are tangled / crossing — no clear trend. Treat this as chop, not a trend signal.', tone: 'neutral' });
    }
  }

  // 2. Momentum: RSI
  const r = rsiVals[i];
  if (r !== null) {
    if (r < 30) {
      factors.push({ label: 'RSI (14)', points: 15, detail: `RSI at ${r.toFixed(1)} is in oversold territory — momentum is stretched to the downside, raising odds of a bounce.`, tone: 'bullish' });
    } else if (r > 70) {
      factors.push({ label: 'RSI (14)', points: -15, detail: `RSI at ${r.toFixed(1)} is in overbought territory — momentum is stretched to the upside, raising odds of a pullback.`, tone: 'bearish' });
    } else if (r >= 50 && r <= 65) {
      factors.push({ label: 'RSI (14)', points: 8, detail: `RSI at ${r.toFixed(1)} sits in the healthy bullish momentum zone (50-65).`, tone: 'bullish' });
    } else if (r <= 50 && r >= 35) {
      factors.push({ label: 'RSI (14)', points: -8, detail: `RSI at ${r.toFixed(1)} sits in the soft bearish momentum zone (35-50).`, tone: 'bearish' });
    } else {
      factors.push({ label: 'RSI (14)', points: 0, detail: `RSI at ${r.toFixed(1)} is neutral.`, tone: 'neutral' });
    }
  }

  // 3. MACD
  const mLine = macdRes.macd[i];
  const sLine = macdRes.signal[i];
  const hist = macdRes.histogram[i];
  const prevHist = macdRes.histogram[i - 1];
  if (mLine !== null && sLine !== null && hist !== null) {
    const crossingUp = prevHist !== null && prevHist <= 0 && hist > 0;
    const crossingDown = prevHist !== null && prevHist >= 0 && hist < 0;
    if (crossingUp) {
      factors.push({ label: 'MACD', points: 20, detail: 'MACD histogram just crossed above zero — a fresh bullish momentum crossover.', tone: 'bullish' });
    } else if (crossingDown) {
      factors.push({ label: 'MACD', points: -20, detail: 'MACD histogram just crossed below zero — a fresh bearish momentum crossover.', tone: 'bearish' });
    } else if (mLine > sLine && hist > 0) {
      factors.push({ label: 'MACD', points: 10, detail: 'MACD line is above the signal line and the histogram is positive — momentum favors buyers.', tone: 'bullish' });
    } else if (mLine < sLine && hist < 0) {
      factors.push({ label: 'MACD', points: -10, detail: 'MACD line is below the signal line and the histogram is negative — momentum favors sellers.', tone: 'bearish' });
    } else {
      factors.push({ label: 'MACD', points: 0, detail: 'MACD is transitioning / near zero — no decisive momentum edge yet.', tone: 'neutral' });
    }
  }

  // 4. Bollinger Bands position + squeeze
  const upper = bb.upper[i];
  const lower = bb.lower[i];
  const mid = bb.middle[i];
  const bw = bb.bandwidth[i];
  const bwHistory = bb.bandwidth.slice(Math.max(0, i - 60), i + 1).filter((v): v is number => v !== null);
  if (upper !== null && lower !== null && mid !== null && bw !== null) {
    const price = closes[i];
    const pctB = (price - lower) / Math.max(1e-9, upper - lower);
    const bwPercentile = bwHistory.length ? bwHistory.filter((v) => v <= bw).length / bwHistory.length : 0.5;
    if (bwPercentile < 0.15) {
      factors.push({ label: 'Bollinger Bands', points: 0, detail: `Bandwidth is near its lowest in the lookback window (squeeze) — volatility is coiling. Direction is unconfirmed until price breaks a band; treat as a "get ready", not a signal.`, tone: 'neutral' });
    } else if (pctB > 0.95) {
      factors.push({ label: 'Bollinger Bands', points: -8, detail: 'Price is pressing the upper band — extended in the short term, though strong trends can "walk the band". Watch for a mean-reversion pullback.', tone: 'bearish' });
    } else if (pctB < 0.05) {
      factors.push({ label: 'Bollinger Bands', points: 8, detail: 'Price is pressing the lower band — stretched in the short term and a bounce candidate, though strong downtrends can also "walk the band" lower.', tone: 'bullish' });
    } else {
      factors.push({ label: 'Bollinger Bands', points: 0, detail: 'Price sits within the middle of the bands — no volatility extreme to trade against.', tone: 'neutral' });
    }
  }

  // 5. Volume confirmation
  const vAvg = volSma[i];
  if (vAvg !== null) {
    const v = volumes[i];
    const priceUp = closes[i] > closes[i - 1];
    if (v > vAvg * 1.3 && priceUp) {
      factors.push({ label: 'Volume', points: 10, detail: `Volume is ${(v / vAvg).toFixed(1)}x the 20-bar average on an up move — real participation behind the push.`, tone: 'bullish' });
    } else if (v > vAvg * 1.3 && !priceUp) {
      factors.push({ label: 'Volume', points: -10, detail: `Volume is ${(v / vAvg).toFixed(1)}x the 20-bar average on a down move — real participation behind the decline.`, tone: 'bearish' });
    } else {
      factors.push({ label: 'Volume', points: 0, detail: 'Volume is unremarkable — this move lacks strong conviction either way.', tone: 'neutral' });
    }
  }

  const score = Math.max(-100, Math.min(100, factors.reduce((sum, f) => sum + f.points, 0)));
  let verdict: SignalResult['verdict'] = 'Hold';
  if (score >= 45) verdict = 'Strong Buy';
  else if (score >= 15) verdict = 'Buy';
  else if (score <= -45) verdict = 'Strong Sell';
  else if (score <= -15) verdict = 'Sell';

  return { score, verdict, factors };
}
