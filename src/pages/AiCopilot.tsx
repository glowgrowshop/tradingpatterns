import { PageHeader, Section, Callout, Badge } from '../components/ui';

interface UseCase {
  title: string;
  prompt: string;
  why: string;
}

const GOOD_USE_CASES: UseCase[] = [
  {
    title: 'Explain a concept you just saw',
    prompt: '"Explain what a bearish MACD divergence means, and show me what to look for on a real chart."',
    why: 'AI is excellent at turning jargon into plain-language, example-driven explanations on demand — faster than searching multiple articles.',
  },
  {
    title: 'Summarize dense documents',
    prompt: '"Summarize the key risk factors and guidance changes in this earnings call transcript / 10-Q."',
    why: 'Long-form filings and calls take real time to read. Summarization is one of the highest-value, lowest-risk uses — just verify any specific number that matters against the source.',
  },
  {
    title: 'Pressure-test your thesis',
    prompt: '"Here\'s my trade thesis and plan: [details]. What am I not considering? Where might I be rationalizing?"',
    why: 'Used this way, AI acts like a disciplined second opinion — it won\'t get emotionally attached to your position the way you might.',
  },
  {
    title: 'Review your trading journal for patterns',
    prompt: '"Here are my last 40 trades with entry reason, size, and outcome. What patterns do you see in my losers vs. winners?"',
    why: 'Finding your own recurring mistakes (overtrading Mondays, oversized earnings bets, cutting winners too early) is exactly the kind of pattern-recognition-over-data task AI is good at.',
  },
  {
    title: 'Build your own tools',
    prompt: '"Help me write a script that flags stocks where the 9 EMA just crossed above the 21 EMA with volume 1.5x average."',
    why: 'AI coding assistance lets beginner and intermediate traders build custom screeners, indicators, and backtests they couldn\'t easily build alone.',
  },
  {
    title: 'Organize a news sweep',
    prompt: '"Here are 20 headlines about this stock from today. Group them by theme and flag anything that looks market-moving."',
    why: 'AI can triage volume quickly — the key discipline is treating the output as a starting point for your own verification, not a final answer.',
  },
];

const BAD_USE_CASES: UseCase[] = [
  {
    title: 'Asking for a price prediction',
    prompt: '"What will [ticker] close at tomorrow?"',
    why: 'No model — AI or otherwise — can reliably predict short-term price. Treating a confident-sounding answer as a real forecast is one of the fastest ways to lose money to false precision.',
  },
  {
    title: 'Trusting unverified numbers',
    prompt: '"What was [company]\'s exact revenue last quarter?"',
    why: 'Language models can state incorrect figures with total confidence ("hallucination"). Any number that affects a real position size or entry should be checked against your broker or a live data source first.',
  },
  {
    title: 'Outsourcing the actual decision',
    prompt: '"Should I buy or sell right now?"',
    why: 'This hands your risk decision to a tool with no accountability, no knowledge of your account size, risk tolerance, or existing positions, and no skin in the game. Use AI to inform the decision, never to make it for you.',
  },
  {
    title: 'Sharing account credentials or live positions with untrusted tools',
    prompt: '"Here\'s my brokerage login, manage my account for me."',
    why: 'Never share credentials, API keys, or account numbers with a chat tool. Legitimate automation uses secure, purpose-built broker APIs — not copy-pasting secrets into a chat window.',
  },
  {
    title: 'Trusting a backtest without checking it',
    prompt: '"This strategy backtested at 85% win rate, I\'m going live with 50% of my account."',
    why: 'AI-assisted backtests are prone to subtle bugs — look-ahead bias, survivorship bias, unrealistic fills. Always inspect the logic yourself and paper-trade before risking real size.',
  },
];

export default function AiCopilot() {
  return (
    <div>
      <PageHeader
        eyebrow="AI-Assisted Trading"
        title="Using AI as a Copilot, Not an Autopilot"
        blurb="The traders getting real value from AI use it to move faster on research, education, and process discipline — while keeping every actual risk decision in their own hands."
      />

      <Callout tone="accent" title="The one rule that matters most">
        AI is a research and reasoning assistant, not a market oracle. It has no special knowledge of the future. Use it to think more clearly and act more consistently — never as a substitute for your own risk management.
      </Callout>

      <div className="mt-4">
        <Section title="A Simple Mental Model">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-2)] p-4">
              <div className="mb-1 text-xs font-bold uppercase tracking-wide text-[var(--color-info)]">1. Research</div>
              <p className="text-sm text-[var(--color-text-dim)]">AI gathers, summarizes, and explains — filings, news, indicators, concepts.</p>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-2)] p-4">
              <div className="mb-1 text-xs font-bold uppercase tracking-wide text-[var(--color-warn)]">2. You Verify</div>
              <p className="text-sm text-[var(--color-text-dim)]">You check any number or claim that matters against a live, authoritative source before it touches a decision.</p>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-2)] p-4">
              <div className="mb-1 text-xs font-bold uppercase tracking-wide text-[var(--color-accent)]">3. You Decide</div>
              <p className="text-sm text-[var(--color-text-dim)]">The entry, size, stop, and target are your call, made against your own written plan and risk rules.</p>
            </div>
          </div>
        </Section>
      </div>

      <div className="mt-4">
        <h2 className="mb-3 text-lg font-semibold text-[var(--color-heading)]">Where AI Genuinely Helps</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {GOOD_USE_CASES.map((u) => (
            <div key={u.title} className="card p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge tone="bullish">Use it for</Badge>
                <span className="font-semibold text-[var(--color-heading)]">{u.title}</span>
              </div>
              <p className="mb-2 rounded-lg bg-[var(--color-panel-2)] px-3 py-2 font-mono text-xs text-[var(--color-text)]">{u.prompt}</p>
              <p className="text-sm text-[var(--color-text-dim)]">{u.why}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-[var(--color-heading)]">Where It's Dangerous If Misused</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {BAD_USE_CASES.map((u) => (
            <div key={u.title} className="card p-4 border-[var(--color-danger)]/30">
              <div className="mb-2 flex items-center gap-2">
                <Badge tone="bearish">Avoid</Badge>
                <span className="font-semibold text-[var(--color-heading)]">{u.title}</span>
              </div>
              <p className="mb-2 rounded-lg bg-[var(--color-panel-2)] px-3 py-2 font-mono text-xs text-[var(--color-text)]">{u.prompt}</p>
              <p className="text-sm text-[var(--color-text-dim)]">{u.why}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Section title="A Pre-Trade Checklist Prompt You Can Reuse">
          <p className="mb-3 text-sm text-[var(--color-text-dim)]">Before entering any trade, walk through this with an AI assistant (or on your own):</p>
          <ol className="space-y-1.5 text-sm list-decimal pl-5">
            <li>What is my one-sentence thesis for this trade?</li>
            <li>What specific price or event proves that thesis wrong (my stop)?</li>
            <li>What's my max dollar risk if I'm wrong — and is that within my normal size (commonly 0.5%-2% of account)?</li>
            <li>What's my target, and does the reward justify the risk?</li>
            <li>Am I taking this because of my plan, or because of an emotion — FOMO, boredom, or trying to win back a loss?</li>
            <li>If this involves earnings or news — have I checked the market's expected move and sized down accordingly?</li>
          </ol>
          <p className="mt-3 text-sm text-[var(--color-text-dim)]">Answering these out loud (to a person, an AI assistant, or your journal) catches a surprising number of bad trades before they happen — the goal is friction against impulsive decisions, not more speed.</p>
        </Section>
      </div>
    </div>
  );
}
