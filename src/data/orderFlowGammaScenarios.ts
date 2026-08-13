export interface SimpleOption {
  label: string;
  correct: boolean;
  rationale: string;
}

export interface SimpleScenario {
  id: string;
  title: string;
  setup: string;
  question: string;
  options: SimpleOption[];
  takeaway: string;
}

export const ORDER_FLOW_SCENARIOS: SimpleScenario[] = [
  {
    id: 'delta-price-divergence',
    title: 'Price Rises While Cumulative Delta Falls',
    setup: 'Over the last 15 bars, price has drifted to a new short-term high — but cumulative volume delta (CVD) has been making lower highs the whole way up.',
    question: 'What does this order-flow divergence suggest?',
    options: [
      { label: 'The rally is increasingly being driven by weaker aggressive buying (or offset by hidden selling) than the price action alone suggests — a caution flag on chasing the move', correct: true, rationale: 'When price climbs but the net aggressive buying pressure (delta) is actually shrinking, it implies the advance is more fragile than it looks — often absorption by sellers into the rally. It is a warning sign, not a guaranteed reversal signal.' },
      { label: 'This confirms extremely strong, healthy buying pressure', correct: false, rationale: 'That would be the read if price AND delta were both making new highs together (confirmation). Here they disagree, which is the opposite of confirmation.' },
      { label: 'Order flow divergence is only relevant on the daily timeframe', correct: false, rationale: 'Order flow and delta divergence are used across timeframes, including short-term intraday charts — the underlying logic doesn\'t depend on a specific timeframe.' },
      { label: 'It guarantees an immediate reversal within the next bar', correct: false, rationale: 'Order flow gives you probability-shifting context, not a precisely timed prediction — the rally can continue for a while before the weaker buying pressure catches up with price.' },
    ],
    takeaway: 'Cumulative delta measures the aggressiveness behind a move — when it disagrees with price, treat it as reduced conviction, not an automatic trade signal.',
  },
  {
    id: 'absorption-at-level',
    title: 'Heavy Selling Absorbed at Support',
    setup: 'Price is testing a known support level. Sell-side volume delta on the last few bars is strongly negative (heavy aggressive selling) — but price is barely moving down at all.',
    question: 'What does this pattern ("absorption") typically suggest?',
    options: [
      { label: 'A large passive buyer is likely absorbing the selling at this level — often a bullish sign if the level holds, since sellers are failing to push price lower despite real effort', correct: true, rationale: 'Absorption is a classic order-flow concept: when aggressive selling hits a level and price fails to fall much, it implies resting buy orders are soaking up the supply. It doesn\'t guarantee a bounce, but it\'s a meaningfully different (more bullish) signal than the same selling volume causing price to collapse.' },
      { label: 'Heavy selling with flat price always means a breakdown is imminent', correct: false, rationale: 'That would be true if price were falling in proportion to the selling — here it isn\'t, which is exactly the anomaly that defines absorption.' },
      { label: 'Volume and price movement are unrelated and this pattern means nothing', correct: false, rationale: 'The relationship between volume/delta and the resulting price movement is precisely what order-flow analysis is built on — dismissing it discards real information.' },
      { label: 'This pattern can only be seen on a footprint chart, never estimated any other way', correct: false, rationale: 'True precision requires tick-level data, but the concept (effort vs. result) can be approximated with delta/volume tools and is useful even in simplified form.' },
    ],
    takeaway: '"Effort vs. result" — comparing how much aggressive volume hit a level against how much price actually moved — is one of the core ideas in reading order flow.',
  },
  {
    id: 'delta-exhaustion',
    title: 'A Delta Spike at the End of a Trend',
    setup: 'After a long uptrend, one bar shows an extreme, outsized positive delta spike (much larger than recent bars) — and then price stalls and starts to roll over on the next few bars.',
    question: 'What does an outsized delta spike followed by stalling often indicate?',
    options: [
      { label: 'Possible "buying exhaustion" — late, aggressive buyers (often chasers) piling in right as the move runs out of participants willing to buy even higher', correct: true, rationale: 'A climactic volume/delta spike followed by a stall is a well-known order-flow pattern often associated with exhaustion — the last wave of aggressive buyers absorbing the available supply, after which there may be no one left to push price higher.' },
      { label: 'It guarantees the trend will continue accelerating', correct: false, rationale: 'Exhaustion spikes are more often associated with a pause or reversal than an acceleration — treating them as pure continuation signals misreads the pattern.' },
      { label: 'Delta spikes have no relationship to trend continuation or exhaustion', correct: false, rationale: 'Climactic volume/delta action is one of the more commonly cited tells for potential exhaustion in order-flow and volume-based trading approaches.' },
      { label: 'You should immediately buy more aggressively into the spike', correct: false, rationale: 'Chasing into a climactic spike is often exactly the wrong side of an exhaustion move — this is a moment for caution, not aggression.' },
    ],
    takeaway: 'Not all volume is equal — a sudden, outsized spike relative to recent activity carries different implications (often exhaustion) than a steady, gradual increase.',
  },
];

export const GAMMA_SCENARIOS: SimpleScenario[] = [
  {
    id: 'approaching-call-wall',
    title: 'Price Approaching the Call Wall',
    setup: 'Price has been rallying and is now approaching a strike with the largest positive dealer gamma exposure on the chain (the "call wall").',
    question: 'What\'s the highest-probability expectation as price nears the call wall?',
    options: [
      { label: 'Rallies often slow down, stall, or get capped near a call wall — dealers hedging their short-call exposure tend to sell into strength as price approaches it', correct: true, rationale: 'A call wall marks where dealers are estimated to be most positively exposed to gamma from calls. As price approaches, dealer hedging (selling the underlying as it rises to stay hedged) can act as a magnet-then-resistance dynamic — commonly discussed as "pinning". It\'s a probability tilt, not a hard ceiling.' },
      { label: 'The call wall guarantees price can never trade above it', correct: false, rationale: 'Gamma walls are dynamic and shift as positioning changes (and vanish entirely after expiration) — treating any level as an absolute, unbreakable ceiling is incorrect.' },
      { label: 'Approaching a call wall means an explosive breakout is guaranteed', correct: false, rationale: 'The more common (though not universal) dynamic near large positive gamma is dampened movement / resistance, not acceleration — that\'s the opposite read.' },
      { label: 'Gamma walls are irrelevant to price behavior', correct: false, rationale: 'Dealer hedging flows are a real, if imperfect, source of supply/demand around large open-interest strikes — dismissing them ignores a genuine market structure effect.' },
    ],
    takeaway: 'Gamma walls are probabilistic magnets/resistance zones from estimated dealer hedging flow — useful context, never a guaranteed price ceiling or floor.',
  },
  {
    id: 'breaking-put-wall',
    title: 'Price Breaks Below the Put Wall',
    setup: 'Price has broken decisively below the strike with the largest negative dealer gamma exposure (the "put wall"), which had been acting as support.',
    question: 'What does breaking below the put wall often imply?',
    options: [
      { label: 'The support/dampening effect from dealer hedging is gone below that level, which can allow moves to accelerate faster than they did while the wall was intact ("air pocket")', correct: true, rationale: 'While price is above a put wall acting as support, dealer hedging flows can help cushion pullbacks. Once broken, that cushioning effect is no longer there at that level, and negative-gamma dynamics (dealers selling into weakness to stay hedged) can accelerate the decline — commonly described as an "air pocket" move.' },
      { label: 'Breaking the put wall means the decline is now guaranteed to reverse immediately', correct: false, rationale: 'The opposite dynamic is more commonly discussed — breaking a put wall tends to remove a support/dampening effect, not create an automatic bounce.' },
      { label: 'Put walls only matter for put option buyers, not for the underlying stock price', correct: false, rationale: 'Put walls are used specifically to describe expected effects on the underlying\'s price behavior via dealer hedging, not just implications for options positions themselves.' },
      { label: 'This concept applies identically regardless of how close the options are to expiration', correct: false, rationale: 'Gamma effects intensify sharply as expiration nears (especially 0DTE options) — time to expiration is a major factor in how strong these dynamics are.' },
    ],
    takeaway: 'Gamma walls aren\'t just static lines — they represent a hedging flow that provides cushioning while intact and can amplify moves once broken.',
  },
  {
    id: 'zero-gamma-flip',
    title: 'Price Crosses the Zero-Gamma Flip Level',
    setup: 'Price has just crossed below the estimated "zero gamma" level — the point separating a positive-gamma regime (above) from a negative-gamma regime (below) on this simulated profile.',
    question: 'What does crossing into a negative-gamma regime typically imply for expected volatility?',
    options: [
      { label: 'Realized volatility tends to expand — in a negative-gamma regime, dealer hedging flows are more likely to amplify moves (sell into weakness, buy into strength) rather than dampen them', correct: true, rationale: 'This is one of the most cited practical implications of gamma positioning: above the zero-gamma level, dealer hedging tends to be counter-trend (dampening, choppy conditions); below it, hedging tends to be trend-following (amplifying, more volatile conditions). It\'s a probabilistic tendency observed across many markets, not a law of physics.' },
      { label: 'Volatility should be expected to shrink and the market should get quieter', correct: false, rationale: 'That describes the positive-gamma regime (above the flip level), not the negative-gamma regime the market just entered — this is the reverse of the typical pattern.' },
      { label: 'The zero-gamma level has no relationship to volatility at all', correct: false, rationale: 'This is one of the more well-documented uses of dealer gamma positioning models — dismissing it discards a genuinely useful (if imperfect) volatility signal.' },
      { label: 'Once in a negative-gamma regime, the market can never return to a calmer, positive-gamma state', correct: false, rationale: 'Gamma regimes shift constantly as price moves and options expire/get added — this is a dynamic, ever-changing condition, not a permanent one.' },
    ],
    takeaway: 'The positive/negative gamma framework is primarily a lens on expected volatility character (dampened vs. amplified), not a precise directional price predictor.',
  },
];
