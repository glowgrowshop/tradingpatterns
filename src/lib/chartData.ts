import type { Bar } from './indicators';
import { mulberry32, hashSeed, gaussian } from './random';

export interface ControlPoint {
  x: number; // fraction along the series, 0..1
  y: number; // fraction of amplitude, 0..1 (0 = low of range, 1 = high of range)
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function interpolatePath(points: ControlPoint[], totalBars: number): number[] {
  const idxPoints = points
    .map((p) => ({ i: Math.round(p.x * (totalBars - 1)), y: p.y }))
    .sort((a, b) => a.i - b.i);
  const path: number[] = new Array(totalBars).fill(0);
  for (let seg = 0; seg < idxPoints.length - 1; seg++) {
    const a = idxPoints[seg];
    const b = idxPoints[seg + 1];
    const span = Math.max(1, b.i - a.i);
    for (let i = a.i; i <= b.i; i++) {
      const t = smoothstep((i - a.i) / span);
      path[i] = a.y + (b.y - a.y) * t;
    }
  }
  return path;
}

export interface SynthOptions {
  seed: string;
  totalBars?: number;
  basePrice?: number;
  amplitude?: number;
  noise?: number;
  driftNoise?: number;
  startTime?: number;
  intervalSec?: number;
  volumeBase?: number;
}

export function synthesizeBars(points: ControlPoint[], opts: SynthOptions): Bar[] {
  const {
    seed,
    totalBars = 90,
    basePrice = 100,
    amplitude = 20,
    noise = 0.55,
    driftNoise = 0.35,
    startTime = Math.floor(Date.now() / 1000) - 90 * 86400,
    intervalSec = 86400,
    volumeBase = 1_000_000,
  } = opts;

  const rand = mulberry32(hashSeed(seed));
  const path = interpolatePath(points, totalBars);

  const closes: number[] = [];
  let wander = 0;
  for (let i = 0; i < totalBars; i++) {
    wander = wander * 0.7 + gaussian(rand) * driftNoise;
    const target = basePrice + path[i] * amplitude;
    const noisy = target + wander * (amplitude * 0.015) + gaussian(rand) * noise * (amplitude * 0.01);
    closes.push(noisy);
  }

  const bars: Bar[] = [];
  let prevClose = closes[0];
  for (let i = 0; i < totalBars; i++) {
    const close = closes[i];
    const gap = gaussian(rand) * (amplitude * 0.003);
    const open = i === 0 ? close - gap : prevClose + gap;
    const bodyHigh = Math.max(open, close);
    const bodyLow = Math.min(open, close);
    const wickUp = Math.abs(gaussian(rand)) * (amplitude * 0.012);
    const wickDown = Math.abs(gaussian(rand)) * (amplitude * 0.012);
    const high = bodyHigh + wickUp;
    const low = Math.max(0.01, bodyLow - wickDown);
    const volatility = Math.abs(close - prevClose) / Math.max(1, prevClose);
    const volume = Math.max(1000, volumeBase * (0.55 + volatility * 18 + rand() * 0.5));
    bars.push({
      time: startTime + i * intervalSec,
      open: round2(open),
      high: round2(high),
      low: round2(low),
      close: round2(close),
      volume: Math.round(volume),
    });
    prevClose = close;
  }
  return bars;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export interface RelCandle {
  open: number;
  high: number;
  low: number;
  close: number;
}

export function appendRelativeCandles(context: Bar[], relCandles: RelCandle[], intervalSec = 86400): Bar[] {
  const recent = context.slice(-10);
  const avgRange = recent.reduce((sum, b) => sum + (b.high - b.low), 0) / recent.length;
  const lastClose = context[context.length - 1].close;
  const localRange = Math.max(avgRange * 1.8, lastClose * 0.01);
  const lo = lastClose - localRange;
  const hi = lastClose + localRange;
  const toPrice = (rel: number) => lo + rel * (hi - lo);
  const avgVolume = recent.reduce((sum, b) => sum + b.volume, 0) / recent.length;

  const out: Bar[] = [...context];
  let time = context[context.length - 1].time;
  for (const c of relCandles) {
    time += intervalSec;
    out.push({
      time,
      open: round2(toPrice(c.open)),
      high: round2(toPrice(c.high)),
      low: round2(toPrice(c.low)),
      close: round2(toPrice(c.close)),
      volume: Math.round(avgVolume * (0.9 + Math.random() * 0.6)),
    });
  }
  return out;
}

export function trendContextBars(seed: string, trend: 'uptrend' | 'downtrend', totalBars = 26, opts: Partial<SynthOptions> = {}): Bar[] {
  const points: ControlPoint[] =
    trend === 'uptrend'
      ? [{ x: 0, y: 0.15 }, { x: 0.4, y: 0.35 }, { x: 0.7, y: 0.55 }, { x: 1, y: 0.78 }]
      : [{ x: 0, y: 0.85 }, { x: 0.4, y: 0.65 }, { x: 0.7, y: 0.45 }, { x: 1, y: 0.22 }];
  return synthesizeBars(points, { seed, totalBars, noise: 0.35, driftNoise: 0.2, ...opts });
}

export function randomWalkBars(seed: string, totalBars = 90, opts: Partial<SynthOptions> = {}): Bar[] {
  const rand = mulberry32(hashSeed(seed));
  const points: ControlPoint[] = [{ x: 0, y: 0.5 }];
  let last = 0.5;
  for (let i = 1; i <= 6; i++) {
    last = Math.min(0.95, Math.max(0.05, last + (rand() - 0.5) * 0.6));
    points.push({ x: i / 6, y: last });
  }
  return synthesizeBars(points, { seed, totalBars, ...opts });
}
