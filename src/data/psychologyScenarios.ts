export interface PsychOption {
  label: string;
  correct: boolean;
  rationale: string;
}

export interface PsychScenario {
  id: string;
  title: string;
  setup: string;
  question: string;
  options: PsychOption[];
  takeaway: string;
}

export const PSYCH_SCENARIOS: PsychScenario[] = [
  {
    id: 'revenge-trade',
    title: 'Three Losses in a Row',
    setup: 'You\'ve taken three stopped-out losses in the last hour, each one a valid setup that just didn\'t work. You\'re down 2.5% for the day and you feel the urge to "make it back" right now.',
    question: 'What\'s the highest-EV response?',
    options: [
      { label: 'Step away from the screen for a defined period (or stop for the day), and only return once you\'re calm and can review the trades objectively', correct: true, rationale: 'Three valid, correctly-sized losses in a row is normal variance, not a broken strategy — but the urge to "make it back" is a physiological stress response (elevated cortisol/adrenaline), not a trading edge. Nearly every professional trading psychology framework treats a hard stop-loss on the *day* — not just the trade — as essential risk management.' },
      { label: 'Immediately take a bigger position to recover the loss faster', correct: false, rationale: 'This is the textbook definition of revenge trading — increasing size after losses, driven by emotion rather than edge, is one of the single most common ways traders blow up an account.' },
      { label: 'Keep trading the exact same size and setup, no adjustment needed', correct: false, rationale: 'While mechanically consistent, this ignores your current emotional/physiological state — most professionals build in a "cool-off" rule after a losing streak precisely because decision quality degrades under stress, even if size stays the same.' },
      { label: 'Switch to a completely different, unfamiliar strategy to change your luck', correct: false, rationale: '"Luck" isn\'t the variable — trading an untested strategy under emotional stress combines two risk factors instead of removing one.' },
    ],
    takeaway: 'Professional traders treat max daily loss limits and mandatory cool-off periods as non-negotiable rules decided in advance — not judgment calls made in the heat of the moment.',
  },
  {
    id: 'fomo-chase',
    title: 'Chasing a Big Green Candle',
    setup: 'A stock just ripped up 8% in 10 minutes on no news you can find. It wasn\'t on your watchlist this morning. Your finger is hovering over the buy button because "it might keep going."',
    question: 'What\'s the highest-EV response?',
    options: [
      { label: 'Let it go, or at minimum wait for a defined pullback/consolidation setup with a clear stop before considering an entry', correct: true, rationale: 'FOMO (fear of missing out) entries are, by definition, entries with no pre-planned risk level — you\'re buying because of the emotion of the move, not because you have an edge or a plan. If it\'s a genuinely strong stock, it will usually offer a lower-risk entry (a flag, a pullback to a rising EMA) shortly after.' },
      { label: 'Buy immediately at market price — the move is too good to miss', correct: false, rationale: 'Chasing an extended, unplanned move is one of the clearest examples of an emotion-driven (not process-driven) trade, and typically buys at the worst point in the move.' },
      { label: 'Short it immediately just because it moved fast', correct: false, rationale: 'Fading pure strength with no signal beyond "it moved a lot" is equally emotion-driven — a fast move alone isn\'t evidence of an imminent reversal.' },
      { label: 'Set a stop-loss after entering, once you see how it behaves', correct: false, rationale: 'Risk should be defined *before* you enter, not improvised afterward — entering first and figuring out risk later is backwards.' },
    ],
    takeaway: 'A rule many professionals live by: "If you didn\'t plan the trade, you don\'t take the trade." FOMO entries skip the planning step entirely.',
  },
  {
    id: 'overconfidence-win-streak',
    title: 'Five Wins in a Row',
    setup: 'You\'ve had five winning trades in a row this week, each sized at your normal 1% account risk. You\'re starting to feel like you\'ve "figured it out" and are considering doubling your position size on the next trade.',
    question: 'What\'s the highest-EV response?',
    options: [
      { label: 'Keep position sizing consistent with your plan — a win streak doesn\'t change your actual statistical edge', correct: true, rationale: 'Overconfidence after a win streak is a well-documented bias — a short run of wins (or losses) is often just normal variance around your real edge, not proof that edge just got bigger. Consistent, pre-defined position sizing is what protects you from giving back a win streak\'s gains on an oversized, overconfident bet.' },
      { label: 'Double your size since you\'re clearly "in the zone"', correct: false, rationale: 'Sizing up specifically because of a recent win streak is a classic setup for a large loss — it inverts the normal relationship between confidence and actual risk.' },
      { label: 'Abandon your stop-losses since your recent picks have been so good', correct: false, rationale: 'A short winning streak doesn\'t change the probability that any single future trade could go against you — dropping risk controls now is pure overconfidence.' },
      { label: 'Start trading more setups than usual, including lower-quality ones, to capitalize on the "hot hand"', correct: false, rationale: 'Loosening your setup criteria because of a streak dilutes your actual edge with lower-quality trades — the "hot hand" is a documented cognitive bias, not usually a real, persistent effect.' },
    ],
    takeaway: 'Elite traders are typically process-obsessed, not outcome-obsessed — the size and rules stay consistent regardless of the last few results, because a small sample of trades tells you very little about your real edge.',
  },
  {
    id: 'moving-stop-loss',
    title: 'The Trade Is Going Against You',
    setup: 'A trade has moved against you and is nearing your pre-planned stop-loss. You still believe in the original thesis and are tempted to move the stop further away to "give it more room."',
    question: 'What\'s the highest-EV response?',
    options: [
      { label: 'Honor the original stop — if it triggers, exit, and re-evaluate the setup fresh (including possibly re-entering later if it still makes sense)', correct: true, rationale: 'A stop-loss placed before emotion entered the picture reflects your risk tolerance and the point at which your original thesis is invalidated. Moving it after the fact is almost always driven by hope, not new information — it\'s one of the most common ways a small, planned loss becomes a large, unplanned one.' },
      { label: 'Move the stop further away since the setup "still looks good"', correct: false, rationale: 'This is a classic discipline failure — it converts a defined, acceptable risk into an undefined, larger one, based on hope rather than new evidence.' },
      { label: 'Add to the losing position to lower your average cost', correct: false, rationale: '"Averaging down" on a trade that\'s already breaking your stop level compounds the mistake — it increases risk on a thesis that current price action is actively disagreeing with.' },
      { label: 'Close half the position and move the stop on the rest to breakeven immediately', correct: false, rationale: 'This sounds disciplined but is really just a partial version of the same error — the position hasn\'t hit your pre-defined invalidation point yet being moved for comfort, not for a genuine change in the setup.' },
    ],
    takeaway: 'The stop-loss you set with a clear head, before entering, is almost always more trustworthy than any adjustment you want to make with a position open and emotions running.',
  },
  {
    id: 'hot-tip',
    title: 'A "Can\'t Miss" Tip',
    setup: 'A friend sends you a message claiming they have inside knowledge that a stock is about to move big. It\'s completely outside your normal strategy and watchlist.',
    question: 'What\'s the highest-EV response?',
    options: [
      { label: 'Decline, or at minimum subject it to the exact same process and risk rules as any other trade — no shortcuts because it feels exciting', correct: true, rationale: 'Every trade should go through the same evaluation and risk-sizing process, regardless of how it was sourced. "Hot tips" bypass your normal filters and often carry hidden risks (including potential legal risk if genuinely based on inside information) — professionals treat unvetted tips with extra skepticism, not extra excitement.' },
      { label: 'Go all-in since it\'s a rare, high-conviction opportunity', correct: false, rationale: 'Concentrating risk on an unverified tip outside your process is speculation, not trading with an edge — "high conviction" from a tip isn\'t the same as a verified statistical edge.' },
      { label: 'Trade it with your normal process but skip setting a stop-loss "just this once"', correct: false, rationale: 'Special-casing your risk rules for any single trade — however exciting — undermines the entire point of having rules in the first place.' },
      { label: 'Trade based on the tip and tell others about it immediately for social proof', correct: false, rationale: 'Beyond the trading-discipline issue, acting on and spreading unverified "inside" information can carry real legal risk depending on its actual source.' },
    ],
    takeaway: 'Consistency of process — applying the same risk rules to every single trade — is one of the most repeated traits among traders with long track records.',
  },
  {
    id: 'overtrading-boredom',
    title: 'A Slow, Quiet Market Day',
    setup: 'It\'s been a quiet, low-volatility session with no setups matching your criteria. You\'re bored and starting to consider trading something — anything — just to feel active.',
    question: 'What\'s the highest-EV response?',
    options: [
      { label: 'Do nothing — no trade is a valid, often correct decision, and boredom is not a trading signal', correct: true, rationale: 'Trading out of boredom rather than a genuine setup is a well-documented cause of underperformance — it adds cost (fees, slippage) and risk with no corresponding edge. Elite performers in any probabilistic field are comfortable sitting on their hands when the odds aren\'t there.' },
      { label: 'Lower your setup criteria temporarily so you have something to trade', correct: false, rationale: 'This directly dilutes your edge — the whole point of criteria is to filter for higher-probability setups, not to guarantee daily activity.' },
      { label: 'Trade a much smaller, unfamiliar timeframe just to generate some action', correct: false, rationale: 'Switching context specifically to manufacture activity, rather than because a real opportunity appeared, is boredom-trading with extra steps.' },
      { label: 'Increase size on a marginal setup to make it feel more worthwhile', correct: false, rationale: 'Sizing up a marginal (low-conviction) setup to compensate for a quiet day inverts the relationship between conviction and size that good risk management depends on.' },
    ],
    takeaway: '"Cash is a position" and "no trade" is itself a decision — patience during low-opportunity periods is a skill, not wasted time.',
  },
];
