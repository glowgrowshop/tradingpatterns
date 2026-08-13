import { mulberry32, hashSeed } from './random';

export interface StrikeGamma {
  strike: number;
  callGamma: number;
  putGamma: number;
  netGamma: number;
}

export interface GammaProfile {
  spot: number;
  strikes: StrikeGamma[];
  callWall: StrikeGamma;
  putWall: StrikeGamma;
  zeroGammaLevel: number;
  regime: 'positive' | 'negative';
}

function bell(x: number, sigma: number): number {
  return Math.exp(-(x * x) / (2 * sigma * sigma));
}

/**
 * Generates a synthetic dealer gamma-exposure-by-strike profile for teaching purposes.
 * Simplified convention (real positioning is more nuanced and desk-specific):
 * call open interest contributes positive dealer gamma, put open interest contributes
 * negative dealer gamma, both weighted heavier near the money.
 */
export function generateGammaProfile(seed: string, spot: number): GammaProfile {
  const rand = mulberry32(hashSeed(seed));
  const strikeStep = Math.max(1, Math.round((spot * 0.02) / 1) * 1);
  const count = 21;
  // >0 = call-heavy/bullish positioning (bigger call wall), <0 = put-heavy/bearish (bigger put wall)
  const skew = (rand() - 0.5) * 1.2;
  const sigma = spot * 0.1;
  // The zero-gamma flip doesn't always sit exactly at the current price — offset it a bit.
  const flipLevel = spot + (rand() - 0.5) * sigma * 1.4;

  const strikes: StrikeGamma[] = [];
  for (let i = -Math.floor(count / 2); i <= Math.floor(count / 2); i++) {
    const strike = Math.round((spot + i * strikeStep) / strikeStep) * strikeStep;
    const dist = strike - spot;
    const sign = strike >= flipLevel ? 1 : -1;
    const magnitude = bell(dist, sigma) * (0.8 + rand() * 0.4) * 100;
    // Skew amplifies the side it favors and dampens (but never eliminates) the other side.
    const skewFactor = Math.max(0.25, 1 + skew * sign);
    const netGamma = magnitude * sign * skewFactor;
    strikes.push({
      strike,
      callGamma: Math.max(0, netGamma),
      putGamma: Math.min(0, netGamma),
      netGamma,
    });
  }

  const callWall = strikes.reduce((a, b) => (b.netGamma > a.netGamma ? b : a));
  const putWall = strikes.reduce((a, b) => (b.netGamma < a.netGamma ? b : a));

  let zeroGammaLevel = spot;
  for (let i = 1; i < strikes.length; i++) {
    const prev = strikes[i - 1];
    const cur = strikes[i];
    if ((prev.netGamma <= 0 && cur.netGamma > 0) || (prev.netGamma >= 0 && cur.netGamma < 0)) {
      const t = prev.netGamma === cur.netGamma ? 0.5 : Math.abs(prev.netGamma) / (Math.abs(prev.netGamma) + Math.abs(cur.netGamma));
      zeroGammaLevel = prev.strike + (cur.strike - prev.strike) * t;
      break;
    }
  }

  const spotStrike = strikes.reduce((a, b) => (Math.abs(b.strike - spot) < Math.abs(a.strike - spot) ? b : a));
  const regime: 'positive' | 'negative' = spotStrike.netGamma >= 0 ? 'positive' : 'negative';

  return { spot, strikes, callWall, putWall, zeroGammaLevel, regime };
}
