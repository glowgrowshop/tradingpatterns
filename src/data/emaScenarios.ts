import type { ControlPoint } from '../lib/chartData';

export interface EmaOption {
  label: string;
  correct: boolean;
  rationale: string;
}

export interface EmaScenario {
  id: string;
  title: string;
  points: ControlPoint[];
  setupNote: string;
  question: string;
  options: EmaOption[];
  takeaway: string;
}

export const EMA_SCENARIOS: EmaScenario[] = [
  {
    id: 'pullback-rising-21',
    title: 'Pullback to a Rising 21 EMA',
    points: [
      { x: 0, y: 0.15 }, { x: 0.25, y: 0.35 }, { x: 0.45, y: 0.55 },
      { x: 0.6, y: 0.72 }, { x: 0.78, y: 0.6 }, { x: 1, y: 0.58 },
    ],
    setupNote: 'Price has been in a steady uptrend, the 9 and 21 EMA are both sloping up, and price just pulled back to tag the rising 21 EMA.',
    question: 'What is the highest-probability next move?',
    options: [
      { label: 'Buy the pullback near the rising 21 EMA, stop below it', correct: true, rationale: 'In a healthy uptrend, pullbacks to a rising short/medium EMA are one of the most repeatable entries — you\'re buying at a discount within an established trend, with a tight, logical stop just below the EMA.' },
      { label: 'Short the pullback, expecting a full reversal', correct: false, rationale: 'Shorting into a rising EMA in an intact uptrend fights the dominant trend with no confirmation of a reversal — low probability.' },
      { label: 'Do nothing until price makes a new all-time high', correct: false, rationale: 'Waiting for a new high means paying a worse price and gives up the best risk/reward of the setup, which is right here at the EMA.' },
      { label: 'Buy regardless of where the EMA is, size doesn\'t matter', correct: false, rationale: 'Ignoring the EMA level and risk sizing turns a structured setup into a gamble — the EMA is exactly what defines your stop and risk.' },
    ],
    takeaway: 'Trend-followers describe this as "buying the dip, not the top" — the EMA gives you an objective, repeatable zone to size risk against instead of guessing.',
  },
  {
    id: 'rally-falling-21',
    title: 'Rally into a Falling 21 EMA',
    points: [
      { x: 0, y: 0.85 }, { x: 0.25, y: 0.65 }, { x: 0.45, y: 0.45 },
      { x: 0.6, y: 0.28 }, { x: 0.78, y: 0.4 }, { x: 1, y: 0.42 },
    ],
    setupNote: 'Price is in a clear downtrend, the 9 and 21 EMA are both sloping down, and a relief rally just pushed price back up into the falling 21 EMA.',
    question: 'What is the highest-probability next move?',
    options: [
      { label: 'Sell/short the rally near the falling 21 EMA, stop above it', correct: true, rationale: 'Symmetric to the uptrend case: in a downtrend, rallies into a falling EMA are classic short entries, with the EMA defining a tight stop.' },
      { label: 'Buy the rally, expecting a full reversal', correct: false, rationale: 'Buying into a falling EMA in an intact downtrend fights the dominant trend without confirmation the trend has actually turned.' },
      { label: 'Wait for price to fall 50% before doing anything', correct: false, rationale: 'That target is arbitrary — it ignores the actual structure (the EMA rejection) that\'s happening right now.' },
      { label: 'Buy because the price looks "cheap" after falling', correct: false, rationale: '"Cheap" is not a technical signal — in a downtrend, price can keep getting cheaper. React to structure, not a gut feeling about value.' },
    ],
    takeaway: 'The same logic that makes EMA pullbacks great longs in uptrends makes EMA rallies great shorts in downtrends — trade the EMA in the direction of the trend, not against it.',
  },
  {
    id: 'golden-cross',
    title: 'EMA Golden Cross Off a Base',
    points: [
      { x: 0, y: 0.5 }, { x: 0.2, y: 0.42 }, { x: 0.4, y: 0.48 },
      { x: 0.55, y: 0.4 }, { x: 0.7, y: 0.5 }, { x: 0.85, y: 0.62 }, { x: 1, y: 0.72 },
    ],
    setupNote: 'Price chopped sideways for a while (EMAs flat and tangled), then the fast 9 EMA just crossed above the 21 EMA as price breaks out of the base.',
    question: 'What is the highest-probability next move?',
    options: [
      { label: 'Consider a long entry on the cross, confirmed by a breakout above the base and rising volume', correct: true, rationale: 'A 9/21 cross emerging from a flat base — especially with a volume pickup — is a classic early-trend signal. It\'s not a guarantee, but it\'s a genuine change in short-term momentum worth acting on with a defined stop.' },
      { label: 'Ignore it — EMA crosses are always late and useless', correct: false, rationale: 'Crosses lag by nature, but dismissing them outright ignores that a 9/21 cross off a multi-week base is one of the more reliable early-trend tells, especially combined with a breakout.' },
      { label: 'Short it because the price already "moved too much" today', correct: false, rationale: 'Fading a fresh trend signal on a single day\'s move, with no other bearish evidence, is a low-probability, emotion-driven trade.' },
      { label: 'Buy the biggest possible size immediately, no stop needed', correct: false, rationale: 'Even a good signal needs risk control — oversizing with no stop turns a solid setup into an account-risking gamble.' },
    ],
    takeaway: 'EMA crosses work best as a trigger combined with context — a base, a level breaking, or a volume surge — not used alone in isolation.',
  },
  {
    id: 'death-cross',
    title: 'EMA Death Cross Off a Top',
    points: [
      { x: 0, y: 0.5 }, { x: 0.2, y: 0.58 }, { x: 0.4, y: 0.52 },
      { x: 0.55, y: 0.6 }, { x: 0.7, y: 0.5 }, { x: 0.85, y: 0.38 }, { x: 1, y: 0.28 },
    ],
    setupNote: 'Price churned sideways near recent highs, and the fast 9 EMA just crossed below the 21 EMA as price breaks down out of the range.',
    question: 'What is the highest-probability next move?',
    options: [
      { label: 'Consider a short entry on the cross, confirmed by the breakdown and rising volume', correct: true, rationale: 'The mirror image of a golden cross — a 9/21 death cross off a topping range, with a level breaking and volume expanding, is a legitimate early signal that momentum has flipped.' },
      { label: 'Buy the dip immediately — it\'s just noise', correct: false, rationale: 'Calling a fresh breakdown "noise" with no supporting evidence is wishful thinking, not analysis.' },
      { label: 'Do nothing regardless of what happens next', correct: false, rationale: 'A tradeable, structured signal is forming — sitting out isn\'t wrong, but it means having no plan at all rather than an informed one.' },
      { label: 'Short with no stop since it "has to keep falling"', correct: false, rationale: 'No trend is guaranteed to continue — trading without a stop on the assumption is exactly how large, avoidable losses happen.' },
    ],
    takeaway: 'Cross signals are symmetric — apply the same discipline to shorts as longs: context, confirmation, and a defined stop.',
  },
  {
    id: 'overextended-parabolic',
    title: 'Price Stretched Far Above Rising EMAs',
    points: [
      { x: 0, y: 0.2 }, { x: 0.3, y: 0.32 }, { x: 0.55, y: 0.42 },
      { x: 0.72, y: 0.55 }, { x: 0.85, y: 0.75 }, { x: 0.93, y: 0.9 }, { x: 1, y: 1.0 },
    ],
    setupNote: 'Price has accelerated sharply away from the 9, 21, and 50 EMA, which are now far below and spreading apart — a parabolic, overextended move.',
    question: 'What is the highest-probability next move?',
    options: [
      { label: 'Avoid chasing; wait for a pullback toward the 9/21 EMA or take partial profits if already long', correct: true, rationale: 'The further price stretches from its EMAs, the higher the odds of a sharp mean-reversion snapback. Chasing here has poor risk/reward even though the trend is technically still "up" — the edge is in waiting for price to come back to the trend, not paying up for it.' },
      { label: 'Buy aggressively — the trend is strong, so it will keep accelerating', correct: false, rationale: 'Extrapolating a parabolic move forever is how late buyers get caught in the sharp reversal that almost always follows overextension.' },
      { label: 'Short the very next candle expecting an immediate crash', correct: false, rationale: 'Extended trends can extend further before reverting — shorting into raw strength with no trigger is just as risky as chasing longs.' },
      { label: 'The EMAs are irrelevant once price is this extended', correct: false, rationale: 'The distance between price and the EMAs is precisely the useful information here — it\'s telling you the move is statistically stretched.' },
    ],
    takeaway: 'Distance-from-EMA is itself a signal: professionals often measure extension (e.g., % above the 21 EMA vs. its own history) to avoid chasing exhausted moves.',
  },
  {
    id: 'choppy-tangled',
    title: 'Tangled, Flat EMAs (No Trend)',
    points: [
      { x: 0, y: 0.5 }, { x: 0.15, y: 0.62 }, { x: 0.3, y: 0.4 },
      { x: 0.45, y: 0.6 }, { x: 0.6, y: 0.42 }, { x: 0.75, y: 0.58 }, { x: 0.9, y: 0.44 }, { x: 1, y: 0.52 },
    ],
    setupNote: 'The 9, 21, and 50 EMA are flat and repeatedly crossing through each other while price whipsaws sideways.',
    question: 'What is the highest-probability next move?',
    options: [
      { label: 'Stay out, or size down drastically — EMA signals are unreliable in a chop regime', correct: true, rationale: 'Trend tools like EMAs are built for trending conditions. When they\'re flat and tangled, every cross is a likely whipsaw. The highest-EV decision is often patience — wait for the range to resolve into a real trend.' },
      { label: 'Trade every single EMA cross aggressively — more signals, more profit', correct: false, rationale: 'In chop, frequent crosses generate frequent false signals — this is the exact environment where trend-following tools underperform and get "chopped up".' },
      { label: 'Pick a direction and hold no matter what happens', correct: false, rationale: 'Committing to a directional bias in a rangebound, non-trending market with no edge is a coin flip dressed up as a strategy.' },
      { label: 'Switch to the longest possible timeframe and ignore this entirely', correct: false, rationale: 'You don\'t need to ignore it — recognizing "no trend" is itself decision-useful information for sizing and entry timing on this timeframe.' },
    ],
    takeaway: 'Knowing when *not* to trade an EMA signal is as important as knowing when to trade one — flat, tangled EMAs are a market telling you it\'s undecided.',
  },
  {
    id: 'failed-pullback-breakdown',
    title: 'Pullback That Breaks the Rising EMA',
    points: [
      { x: 0, y: 0.2 }, { x: 0.3, y: 0.45 }, { x: 0.5, y: 0.65 },
      { x: 0.65, y: 0.55 }, { x: 0.8, y: 0.4 }, { x: 0.9, y: 0.3 }, { x: 1, y: 0.22 },
    ],
    setupNote: 'What looked like a normal pullback in an uptrend instead closed decisively below the 21 EMA and kept falling toward the 50 EMA.',
    question: 'What is the highest-probability next move?',
    options: [
      { label: 'Stand aside on new longs until price reclaims the 21 EMA; treat this as a caution flag, not an automatic dip-buy', correct: true, rationale: 'A clean close below a previously-respected rising EMA is a warning that trend character may be changing. Buying it blindly "because it worked before" ignores that the structure just failed — wait for price to prove itself again (a reclaim) before treating it as a normal pullback.' },
      { label: 'Buy immediately — every pullback in an uptrend is a buying opportunity', correct: false, rationale: 'Treating every dip as automatically buyable ignores that this dip behaved differently (a clean break, not a bounce) — that distinction matters.' },
      { label: 'Assume the uptrend is permanently over and short aggressively', correct: false, rationale: 'One broken EMA doesn\'t confirm a full trend reversal by itself — that\'s an overreaction without more evidence (like a broken higher-low or the 50 EMA also rolling over).' },
      { label: 'The EMA break doesn\'t matter as long as the news is good', correct: false, rationale: 'Price action and news can diverge for a while — dismissing a real structural break because of a narrative is a common way traders hold onto losing positions too long.' },
    ],
    takeaway: 'Not every EMA touch behaves the same — distinguishing a healthy pullback from an early trend-change signal is a skill worth practicing deliberately.',
  },
  {
    id: 'deep-pullback-50ema',
    title: 'Deep Pullback Testing the 50 EMA',
    points: [
      { x: 0, y: 0.12 }, { x: 0.2, y: 0.35 }, { x: 0.35, y: 0.55 },
      { x: 0.5, y: 0.72 }, { x: 0.62, y: 0.5 }, { x: 0.75, y: 0.34 }, { x: 0.88, y: 0.3 }, { x: 1, y: 0.33 },
    ],
    setupNote: 'After a strong, extended uptrend, price pulled back further than usual — all the way down to test the rising 50 EMA — and is now stabilizing there.',
    question: 'What is the highest-probability next move?',
    options: [
      { label: 'Treat the 50 EMA test as a higher-conviction, higher-timeframe support level and look for a bounce confirmation before buying', correct: true, rationale: 'The 50 EMA represents a longer-term trend base. A deep pullback that holds it — especially after an extended prior rally — is often a higher-quality (if less frequent) entry than a shallow 21 EMA touch, since it\'s testing a level with more institutional relevance.' },
      { label: 'A pullback to the 50 EMA always means the trend is broken', correct: false, rationale: 'A pullback to a rising 50 EMA that holds is normal, healthy trend behavior, not automatic proof of a reversal.' },
      { label: 'Buy without waiting for any confirmation the level is holding', correct: false, rationale: 'Deeper pullbacks carry more risk of a genuine breakdown — waiting for some sign of stabilization (like a reversal candle or a higher low) improves the odds versus buying blind.' },
      { label: 'Only ever trade the 9 EMA and ignore longer EMAs entirely', correct: false, rationale: 'Longer EMAs like the 50 give context the fast EMA can\'t — dismissing them throws away useful information about the larger trend.' },
    ],
    takeaway: 'Not all EMA tests are equal — a 9 EMA touch, a 21 EMA touch, and a 50 EMA touch represent progressively deeper, less frequent, and often higher-conviction pullback opportunities.',
  },
];
