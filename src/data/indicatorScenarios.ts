import type { ControlPoint } from '../lib/chartData';

export interface IndicatorOption {
  label: string;
  correct: boolean;
  rationale: string;
}

export interface IndicatorScenario {
  id: string;
  indicator: 'rsi' | 'macd' | 'bollinger';
  title: string;
  points: ControlPoint[];
  setupNote: string;
  question: string;
  options: IndicatorOption[];
  takeaway: string;
}

export const INDICATOR_SCENARIOS: IndicatorScenario[] = [
  {
    id: 'rsi-oversold-bounce',
    indicator: 'rsi',
    title: 'RSI Drops Into Oversold at Support',
    points: [
      { x: 0, y: 0.7 }, { x: 0.3, y: 0.55 }, { x: 0.55, y: 0.4 },
      { x: 0.75, y: 0.2 }, { x: 0.9, y: 0.12 }, { x: 1, y: 0.14 },
    ],
    setupNote: 'A sharp decline has pushed RSI(14) below 30, and price is stalling near a prior support level.',
    question: 'What does this RSI reading tell you, and what\'s the highest-probability response?',
    options: [
      { label: 'RSI is stretched to the downside; watch for a bullish trigger (like a reversal candle) before buying rather than buying blind', correct: true, rationale: 'Oversold RSI means selling momentum is statistically extended, raising bounce odds — but it can stay oversold in a strong downtrend. The edge comes from combining it with a price trigger (a reversal candle, a higher low) and a support level, not just the RSI number alone.' },
      { label: 'RSI below 30 is an automatic, high-confidence buy signal by itself', correct: false, rationale: 'RSI can stay oversold for a long time in strong downtrends ("pinned" readings) — treating 30 as an automatic buy button leads to catching falling knives.' },
      { label: 'Oversold RSI means you should short more aggressively', correct: false, rationale: 'That reads the indicator backwards — oversold historically favors mean-reversion higher, not an acceleration lower.' },
      { label: 'RSI is a lagging nonsense indicator and should be ignored completely', correct: false, rationale: 'RSI is a momentum oscillator with real, well-documented statistical edge around extremes — dismissing it outright throws away useful information.' },
    ],
    takeaway: 'RSI extremes describe momentum, not timing — pair them with price structure (support, candle triggers) instead of trading the number in isolation.',
  },
  {
    id: 'rsi-overbought-strong-trend',
    indicator: 'rsi',
    title: 'RSI Overbought Inside a Strong Uptrend',
    points: [
      { x: 0, y: 0.15 }, { x: 0.25, y: 0.32 }, { x: 0.5, y: 0.5 },
      { x: 0.7, y: 0.68 }, { x: 0.85, y: 0.82 }, { x: 1, y: 0.9 },
    ],
    setupNote: 'Price has been in a strong, steady uptrend and RSI has been reading above 70 for several sessions in a row.',
    question: 'What\'s the highest-probability read on this overbought RSI?',
    options: [
      { label: 'In a strong trend, RSI can stay overbought for a long stretch — treat it as a "the trend is strong" signal, not an automatic short', correct: true, rationale: 'This is one of the most common RSI mistakes: shorting purely because RSI > 70. In strong trends, momentum oscillators frequently "pin" at extremes for many bars while price keeps climbing. Overbought is a caution flag on chasing new longs, not a reversal trigger by itself.' },
      { label: 'Short immediately — RSI above 70 always means a top is in', correct: false, rationale: 'This is a classic beginner mistake. Overbought does not equal "about to reverse," especially in a strong trend — many traders lose money fading strength this way.' },
      { label: 'Buy far more aggressively because overbought RSI guarantees more upside', correct: false, rationale: 'Overbought doesn\'t guarantee continuation either — it just means momentum is currently strong, which cuts both ways for what comes next.' },
      { label: 'Overbought RSI has no meaning in a trending market', correct: false, rationale: 'It still has meaning — it tells you momentum is hot and chasing here has worse risk/reward than waiting for a pullback — just not a "sell now" signal.' },
    ],
    takeaway: 'Context changes what an RSI reading means — "overbought in a range" and "overbought in a strong trend" call for very different responses.',
  },
  {
    id: 'rsi-bullish-divergence',
    indicator: 'rsi',
    title: 'Bullish RSI Divergence',
    points: [
      { x: 0, y: 0.75 }, { x: 0.2, y: 0.45 }, { x: 0.35, y: 0.55 },
      { x: 0.5, y: 0.3 }, { x: 0.65, y: 0.4 }, { x: 0.82, y: 0.18 }, { x: 1, y: 0.28 },
    ],
    setupNote: 'Price just made a lower low than its prior swing low, but RSI made a higher low compared to where it was on that prior swing — a classic bullish divergence.',
    question: 'What is the highest-probability interpretation of this divergence?',
    options: [
      { label: 'Selling momentum is weakening even though price made a new low — a warning that the downtrend may be losing steam, worth watching for a confirming reversal signal', correct: true, rationale: 'Divergence shows price and momentum disagreeing — price pushed lower but the "force" behind that move (per RSI) was weaker than the prior leg down. That\'s an early warning of exhaustion, not proof of an immediate reversal — wait for price to confirm (e.g., breaking a short-term downtrend line or a higher low).' },
      { label: 'Divergence means you should short more aggressively into the new low', correct: false, rationale: 'That misreads the signal — divergence here is bullish (warning sellers are losing strength), not a green light to add to shorts.' },
      { label: 'Divergence is a guaranteed, precisely-timed reversal signal', correct: false, rationale: 'Divergences can persist or fail — treating any divergence as a guaranteed, precise entry ignores that price can keep grinding lower for a while before actually turning.' },
      { label: 'Divergence should be ignored since RSI is only useful at extremes', correct: false, rationale: 'Divergence is one of RSI\'s most useful applications beyond the simple overbought/oversold reading — dismissing it throws away real signal.' },
    ],
    takeaway: 'Divergence measures fading momentum, which is genuinely useful — just remember it\'s a probability tilt and an early warning, not a precise timing tool on its own.',
  },
  {
    id: 'macd-bullish-cross-below-zero',
    indicator: 'macd',
    title: 'MACD Bullish Cross Below the Zero Line',
    points: [
      { x: 0, y: 0.75 }, { x: 0.3, y: 0.45 }, { x: 0.55, y: 0.25 },
      { x: 0.72, y: 0.2 }, { x: 0.86, y: 0.3 }, { x: 1, y: 0.38 },
    ],
    setupNote: 'After an extended decline, the MACD line just crossed above its signal line while both lines are still below the zero line.',
    question: 'What does a MACD cross below the zero line typically suggest?',
    options: [
      { label: 'An early momentum shift within a downtrend — potentially the first leg of a bottoming process, but weaker confirmation than a cross above zero', correct: true, rationale: 'Crosses below the zero line happen while the longer-term trend (per the underlying EMAs) is technically still down. It\'s a real early signal that short-term momentum is turning up, but it\'s considered lower-conviction than a cross that also happens above the zero line, which confirms both short and longer-term momentum agree.' },
      { label: 'It\'s meaningless because it happened below the zero line', correct: false, rationale: 'It\'s not meaningless — it\'s simply a lower-conviction, earlier-stage signal than a cross above zero, not a signal to be ignored outright.' },
      { label: 'It confirms a powerful new uptrend has already started, buy maximum size', correct: false, rationale: 'A below-zero cross is an early, lower-confidence read — treating it with maximum conviction/size overstates what the signal is actually telling you.' },
      { label: 'It\'s a sell signal because the lines are still below zero', correct: false, rationale: 'The direction of the cross (bullish, MACD over signal) is what matters for the signal\'s bias — the below-zero position affects confidence level, not direction.' },
    ],
    takeaway: 'MACD crosses above the zero line carry more conviction than crosses below it — zero-line position is a built-in confidence gauge.',
  },
  {
    id: 'macd-bearish-cross-above-zero',
    indicator: 'macd',
    title: 'MACD Bearish Cross Above the Zero Line',
    points: [
      { x: 0, y: 0.25 }, { x: 0.3, y: 0.55 }, { x: 0.55, y: 0.75 },
      { x: 0.72, y: 0.8 }, { x: 0.86, y: 0.68 }, { x: 1, y: 0.6 },
    ],
    setupNote: 'After an extended rally, the MACD line just crossed below its signal line while both lines remain above the zero line.',
    question: 'What does this MACD cross typically suggest?',
    options: [
      { label: 'A momentum shift within an uptrend — short-term momentum is fading even though the broader trend is still technically up; worth trimming or tightening stops on longs', correct: true, rationale: 'A bearish cross above the zero line is common at the start of a pullback or, sometimes, a bigger top. It\'s a real signal that short-term momentum has turned down, actionable for managing existing longs — but not necessarily proof the whole uptrend is over.' },
      { label: 'It means the uptrend is 100% finished forever', correct: false, rationale: 'A single MACD cross doesn\'t confirm a full trend reversal — it\'s one data point, often just marking a pullback within a larger uptrend.' },
      { label: 'It\'s bullish because the lines are above zero', correct: false, rationale: 'Zero-line position affects conviction, but the cross direction (MACD below signal) is bearish momentum — don\'t let the zero-line position flip the actual signal.' },
      { label: 'Ignore it completely since price is still in an uptrend', correct: false, rationale: 'Ignoring a real momentum shift means missing a chance to manage risk on existing longs (like tightening a stop) before a deeper pullback.' },
    ],
    takeaway: 'MACD is best used to manage and time entries/exits within a trend you\'ve already identified with price structure or EMAs — not as a standalone trend-reversal oracle.',
  },
  {
    id: 'macd-bearish-divergence',
    indicator: 'macd',
    title: 'MACD Histogram Shrinks While Price Makes New Highs',
    points: [
      { x: 0, y: 0.15 }, { x: 0.18, y: 0.55 }, { x: 0.28, y: 0.44 },
      { x: 0.42, y: 0.68 }, { x: 0.52, y: 0.58 }, { x: 0.66, y: 0.78 },
      { x: 0.76, y: 0.7 }, { x: 0.88, y: 0.86 }, { x: 1, y: 0.8 },
    ],
    setupNote: 'Price is grinding to new swing highs, but each successive MACD histogram peak is smaller than the last — a bearish momentum divergence.',
    question: 'What\'s the highest-probability read here?',
    options: [
      { label: 'Buying momentum is fading even as price grinds higher — a caution flag for chasing new longs and a cue to tighten risk management, not necessarily an immediate short', correct: true, rationale: 'Shrinking histogram peaks against rising price is a classic early-warning sign that the rally is running on fumes. It doesn\'t time an exact top, but it argues against adding aggressive new long exposure and for protecting existing gains.' },
      { label: 'It confirms the uptrend is accelerating — add maximum size', correct: false, rationale: 'That\'s the opposite read — shrinking histogram peaks indicate decelerating, not accelerating, momentum.' },
      { label: 'Short with full size immediately, the top is confirmed', correct: false, rationale: 'Divergence is a probability tilt and warning sign, not a precisely timed, guaranteed reversal — full-size conviction isn\'t warranted from this alone.' },
      { label: 'The histogram shrinking is irrelevant if price is still rising', correct: false, rationale: 'That\'s exactly the disagreement (price vs. momentum) that makes divergence useful information in the first place.' },
    ],
    takeaway: 'Momentum divergence is about the *rate* of buying/selling pressure, which often changes before price does — use it to manage risk, not to call exact tops.',
  },
  {
    id: 'bollinger-squeeze',
    indicator: 'bollinger',
    title: 'Bollinger Band Squeeze',
    points: [
      { x: 0, y: 0.4 }, { x: 0.25, y: 0.48 }, { x: 0.5, y: 0.44 },
      { x: 0.7, y: 0.5 }, { x: 0.85, y: 0.46 }, { x: 1, y: 0.5 },
    ],
    setupNote: 'The upper and lower Bollinger Bands have contracted to their tightest width in months while price chops in a very narrow range.',
    question: 'What does a tight Bollinger Band squeeze typically signal?',
    options: [
      { label: 'Volatility is unusually compressed and historically tends to expand — prepare for a breakout, but wait for price to actually break a band before choosing a direction', correct: true, rationale: 'Bollinger Bands measure volatility (standard deviation), not direction. A squeeze means volatility is coiled, which often precedes a sharp expansion — but the bands themselves don\'t tell you which way it\'ll break. The disciplined play is to wait for confirmation.' },
      { label: 'A squeeze means price is guaranteed to break out to the upside', correct: false, rationale: 'Bollinger Bands are direction-agnostic — a squeeze says nothing about which way the eventual move goes.' },
      { label: 'A squeeze means you should buy immediately, regardless of direction', correct: false, rationale: 'Buying blind ahead of an unconfirmed breakout risks getting caught on the wrong side when it resolves the other way.' },
      { label: 'Tight bands mean the stock has become permanently less volatile', correct: false, rationale: 'Volatility is cyclical — periods of contraction are typically followed by periods of expansion, not permanent calm.' },
    ],
    takeaway: 'Bollinger Band width (volatility) and price direction are two separate questions — use the squeeze to get ready, and price action to decide direction.',
  },
  {
    id: 'bollinger-band-walk',
    indicator: 'bollinger',
    title: 'Price "Walking" the Upper Band',
    points: [
      { x: 0, y: 0.2 }, { x: 0.25, y: 0.4 }, { x: 0.45, y: 0.62 },
      { x: 0.62, y: 0.78 }, { x: 0.8, y: 0.88 }, { x: 1, y: 0.95 },
    ],
    setupNote: 'In a strong uptrend, price closes have been hugging or touching the upper Bollinger Band for several bars in a row.',
    question: 'What\'s the highest-probability interpretation of price "walking the band" like this?',
    options: [
      { label: 'This reflects strong trending momentum, not an automatic sell signal — in strong trends, price can ride the upper band for a long stretch', correct: true, rationale: 'A common misread is treating "touching the upper band" as automatically overbought/sell. In strong trends, price frequently rides (walks) the band for many bars. Fading every touch fights a strong trend; better to wait for a close back inside the bands or another confirming signal before assuming a reversal.' },
      { label: 'Touching the upper band is always an automatic sell/short signal', correct: false, rationale: 'This is one of the most common Bollinger Band mistakes — band touches in strong trends are normal and don\'t reliably predict reversals.' },
      { label: 'It means volatility has permanently expanded and will never contract', correct: false, rationale: 'Volatility is cyclical — expansions are eventually followed by contraction, this isn\'t a permanent state change.' },
      { label: 'The bands become useless once price touches them', correct: false, rationale: 'The bands remain useful — you\'d instead watch for a candle close back inside the bands, or the middle band (20 SMA) being lost, as more reliable trend-change tells.' },
    ],
    takeaway: 'The signal isn\'t "price touched a band" — it\'s "price closed back inside the bands" or "the middle band was lost." Band touches alone are noise in a strong trend.',
  },
  {
    id: 'bollinger-lower-band-rsi-confluence',
    indicator: 'bollinger',
    title: 'Lower Band Tag + RSI Oversold Confluence',
    points: [
      { x: 0, y: 0.65 }, { x: 0.3, y: 0.5 }, { x: 0.55, y: 0.32 },
      { x: 0.75, y: 0.15 }, { x: 0.9, y: 0.1 }, { x: 1, y: 0.14 },
    ],
    setupNote: 'Price just tagged the lower Bollinger Band at the same time RSI(14) dropped below 30 — two separate tools flashing the same message.',
    question: 'How should you weigh this multi-indicator confluence?',
    options: [
      { label: 'Confluence between independent tools (volatility extreme + momentum extreme) raises the odds of a bounce more than either signal alone — still wait for a price trigger to confirm before entering', correct: true, rationale: 'This is the core idea behind "confluence" trading: when unrelated tools (a volatility band and a momentum oscillator) agree, the signal is more meaningful than any single indicator in isolation. It still isn\'t a certainty — combine it with a price trigger (reversal candle, reclaiming a short-term level) rather than buying purely on the indicator alignment.' },
      { label: 'Using two indicators together is redundant and adds no value over using just one', correct: false, rationale: 'Independent confirmation is exactly what separates a higher-probability setup from a coin flip — dismissing confluence ignores a genuinely useful concept.' },
      { label: 'This combination guarantees a profitable bounce trade', correct: false, rationale: 'No indicator combination guarantees an outcome — confluence improves the odds and the trader\'s conviction, it doesn\'t eliminate risk.' },
      { label: 'You should size the trade at maximum risk since two signals agree', correct: false, rationale: 'Higher-probability doesn\'t mean risk-free — position sizing should still be governed by your normal risk rules and a real stop-loss.' },
    ],
    takeaway: 'Confluence — stacking independent signals that agree — is one of the most reliable ways to raise a setup\'s odds without needing any single indicator to be perfect.',
  },
];
