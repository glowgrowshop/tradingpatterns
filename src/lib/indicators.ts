export interface Bar {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function sma(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    if (i >= period - 1) out[i] = sum / period;
  }
  return out;
}

export function ema(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  const k = 2 / (period + 1);
  let prev: number | null = null;
  for (let i = 0; i < values.length; i++) {
    if (i === period - 1) {
      const seed = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
      prev = seed;
      out[i] = seed;
    } else if (i >= period) {
      prev = values[i] * k + (prev as number) * (1 - k);
      out[i] = prev;
    }
  }
  return out;
}

export function rsi(values: number[], period = 14): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 1; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    const gain = Math.max(change, 0);
    const loss = Math.max(-change, 0);
    if (i <= period) {
      avgGain += gain;
      avgLoss += loss;
      if (i === period) {
        avgGain /= period;
        avgLoss /= period;
        out[i] = rsiFromAvg(avgGain, avgLoss);
      }
    } else {
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      out[i] = rsiFromAvg(avgGain, avgLoss);
    }
  }
  return out;
}

function rsiFromAvg(avgGain: number, avgLoss: number): number {
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

export interface MacdResult {
  macd: (number | null)[];
  signal: (number | null)[];
  histogram: (number | null)[];
}

export function macd(values: number[], fast = 12, slow = 26, signalPeriod = 9): MacdResult {
  const emaFast = ema(values, fast);
  const emaSlow = ema(values, slow);
  const macdLine: (number | null)[] = values.map((_, i) => {
    const f = emaFast[i];
    const s = emaSlow[i];
    return f !== null && s !== null ? f - s : null;
  });
  const macdValuesOnly: number[] = [];
  const macdIndexes: number[] = [];
  macdLine.forEach((v, i) => {
    if (v !== null) {
      macdValuesOnly.push(v);
      macdIndexes.push(i);
    }
  });
  const signalOnly = ema(macdValuesOnly, signalPeriod);
  const signalLine: (number | null)[] = new Array(values.length).fill(null);
  signalOnly.forEach((v, i) => {
    if (v !== null) signalLine[macdIndexes[i]] = v;
  });
  const histogram: (number | null)[] = values.map((_, i) => {
    const m = macdLine[i];
    const s = signalLine[i];
    return m !== null && s !== null ? m - s : null;
  });
  return { macd: macdLine, signal: signalLine, histogram };
}

export interface BollingerResult {
  middle: (number | null)[];
  upper: (number | null)[];
  lower: (number | null)[];
  bandwidth: (number | null)[];
}

export function bollingerBands(values: number[], period = 20, mult = 2): BollingerResult {
  const middle = sma(values, period);
  const upper: (number | null)[] = new Array(values.length).fill(null);
  const lower: (number | null)[] = new Array(values.length).fill(null);
  const bandwidth: (number | null)[] = new Array(values.length).fill(null);
  for (let i = 0; i < values.length; i++) {
    const m = middle[i];
    if (m === null) continue;
    let sumSq = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sumSq += (values[j] - m) ** 2;
    }
    const std = Math.sqrt(sumSq / period);
    upper[i] = m + mult * std;
    lower[i] = m - mult * std;
    bandwidth[i] = m !== 0 ? ((upper[i] as number) - (lower[i] as number)) / m : null;
  }
  return { middle, upper, lower, bandwidth };
}

export function atr(bars: Bar[], period = 14): (number | null)[] {
  const trs: number[] = bars.map((b, i) => {
    if (i === 0) return b.high - b.low;
    const prevClose = bars[i - 1].close;
    return Math.max(b.high - b.low, Math.abs(b.high - prevClose), Math.abs(b.low - prevClose));
  });
  const out: (number | null)[] = new Array(bars.length).fill(null);
  let prev: number | null = null;
  for (let i = 0; i < trs.length; i++) {
    if (i === period - 1) {
      prev = trs.slice(0, period).reduce((a, b) => a + b, 0) / period;
      out[i] = prev;
    } else if (i >= period) {
      prev = ((prev as number) * (period - 1) + trs[i]) / period;
      out[i] = prev;
    }
  }
  return out;
}

export interface Pivot {
  index: number;
  time: number;
  price: number;
  type: 'high' | 'low';
}

export function findPivots(bars: Bar[], lookback = 4): Pivot[] {
  const pivots: Pivot[] = [];
  for (let i = lookback; i < bars.length - lookback; i++) {
    const window = bars.slice(i - lookback, i + lookback + 1);
    const highs = window.map((b) => b.high);
    const lows = window.map((b) => b.low);
    if (bars[i].high === Math.max(...highs)) {
      pivots.push({ index: i, time: bars[i].time, price: bars[i].high, type: 'high' });
    } else if (bars[i].low === Math.min(...lows)) {
      pivots.push({ index: i, time: bars[i].time, price: bars[i].low, type: 'low' });
    }
  }
  return pivots;
}

export interface SrZone {
  price: number;
  type: 'support' | 'resistance';
  strength: number;
}

export function clusterZones(pivots: Pivot[], tolerancePct = 0.006): SrZone[] {
  const zones: SrZone[] = [];
  const sorted = [...pivots].sort((a, b) => a.price - b.price);
  for (const p of sorted) {
    const existing = zones.find((z) => Math.abs(z.price - p.price) / p.price < tolerancePct);
    if (existing) {
      existing.price = (existing.price * existing.strength + p.price) / (existing.strength + 1);
      existing.strength += 1;
    } else {
      zones.push({ price: p.price, type: p.type === 'high' ? 'resistance' : 'support', strength: 1 });
    }
  }
  return zones.filter((z) => z.strength >= 2).sort((a, b) => b.strength - a.strength);
}

export interface FibLevels {
  ratios: number[];
  levels: { ratio: number; price: number; label: string }[];
}

export function fibRetracement(low: number, high: number, uptrend: boolean): FibLevels {
  const ratios = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
  const range = high - low;
  const levels = ratios.map((ratio) => ({
    ratio,
    price: uptrend ? high - range * ratio : low + range * ratio,
    label: `${(ratio * 100).toFixed(1)}%`,
  }));
  return { ratios, levels };
}

export function fibExtension(low: number, high: number, retrace: number, uptrend: boolean): FibLevels {
  const ratios = [1, 1.272, 1.414, 1.618, 2, 2.618];
  const range = high - low;
  const levels = ratios.map((ratio) => ({
    ratio,
    price: uptrend ? retrace + range * ratio : retrace - range * ratio,
    label: `${(ratio * 100).toFixed(1)}%`,
  }));
  return { ratios, levels };
}

export function lastValid<T>(arr: (T | null)[]): T | null {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] !== null) return arr[i];
  }
  return null;
}
