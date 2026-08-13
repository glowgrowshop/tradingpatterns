import type { Bar } from './indicators';

export interface OrderFlowBar {
  time: number;
  buyVolume: number;
  sellVolume: number;
  delta: number;
  cumulativeDelta: number;
}

/**
 * Approximates buy/sell (order flow) volume from OHLCV bars using the classic
 * "close-location value" technique: where a bar closes within its own high/low
 * range approximates the balance of aggressive buying vs. selling during that bar.
 * This is a widely used estimate when true tick-by-tick bid/ask (Level 2 / time & sales)
 * data isn't available — real order-flow tools use actual trade-by-trade prints.
 */
export function computeOrderFlow(bars: Bar[]): OrderFlowBar[] {
  let cumulative = 0;
  return bars.map((b) => {
    const range = b.high - b.low;
    const clv = range === 0 ? 0 : ((b.close - b.low) - (b.high - b.close)) / range;
    const buyVolume = b.volume * (clv + 1) / 2;
    const sellVolume = b.volume - buyVolume;
    const delta = buyVolume - sellVolume;
    cumulative += delta;
    return { time: b.time, buyVolume, sellVolume, delta, cumulativeDelta: cumulative };
  });
}
