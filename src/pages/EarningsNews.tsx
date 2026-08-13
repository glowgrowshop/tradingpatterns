import { PageHeader, Section, Callout } from '../components/ui';

interface StrategyRow {
  name: string;
  when: string;
  risk: string;
}

const EARNINGS_STRATEGIES: StrategyRow[] = [
  { name: 'Iron Condor (sell premium)', when: 'You expect the stock to move less than what IV is pricing in (the "expected move")', risk: 'Defined max loss; loses if the stock moves beyond your short strikes' },
  { name: 'Short Strangle', when: 'High conviction the move will be small; more premium, more risk than a condor', risk: 'Undefined risk unless you cap it — sizing must be conservative' },
  { name: 'Calendar / Diagonal Spread', when: 'You want defined-risk directional exposure while benefiting from front-month IV crush', risk: 'Capped risk (long the spread); max loss is the debit paid' },
  { name: 'Credit Spread (vertical)', when: 'Moderate directional bias, want to collect elevated IV without naked risk', risk: 'Defined max loss = spread width minus credit received' },
  { name: 'Long Straddle/Strangle (rare, high-conviction only)', when: 'You expect a move meaningfully larger than what IV is pricing in', risk: 'IV crush works against you hard — needs a big move just to break even' },
  { name: 'Post-Earnings Drift (wait and follow)', when: 'A large earnings surprise (beat/miss) with strong initial reaction and volume', risk: 'Lower binary risk than pre-earnings bets; still needs a stop and thesis' },
];

export default function EarningsNews() {
  return (
    <div>
      <PageHeader
        eyebrow="Real-World Playbook"
        title="Trading Earnings & News"
        blurb="Earnings and news are where most beginner options traders lose money fastest — implied volatility and gap risk punish naive directional bets. Here's how professionals think about it."
      />

      <Section title="Why Earnings Are Different: Implied Volatility (IV) Crush">
        <p className="mb-3 text-sm leading-relaxed">
          Options premiums price in the expected size of a move. Heading into an earnings report, implied volatility (IV) inflates because the market knows a big move is coming — but the direction is unknown. The instant the report is out and uncertainty resolves, IV collapses ("crushes"), even if you were right on direction. Beginners frequently buy calls or puts right before earnings, get the direction right, and still lose money because IV crush erased more value than the directional move added.
        </p>
        <Callout tone="warn" title="The core lesson">
          Before trading an earnings event, always ask: "Is the options market already pricing in a bigger move than I actually expect — or a smaller one?" That comparison, not just your directional opinion, is what a defined-risk earnings strategy is built around.
        </Callout>
      </Section>

      <div className="mt-4">
        <Section title="Finding the Market's 'Expected Move'">
          <ol className="space-y-2 text-sm list-decimal pl-5">
            <li>Find the at-the-money (ATM) straddle price (call + put at the strike closest to the current stock price, same expiration — usually the first expiration after earnings).</li>
            <li>The straddle's total price is roughly the dollar move the options market is pricing in through that expiration.</li>
            <li>Compare that expected move to the stock's actual average earnings-day move over the last 4-8 quarters (many broker platforms show this directly).</li>
            <li>If the market is pricing in a <em>much bigger</em> move than the stock typically makes, premium-selling strategies (condors, credit spreads) become more attractive. If it's pricing in a <em>smaller</em> move than usual, premium-buying becomes more interesting — but stay small.</li>
          </ol>
        </Section>
      </div>

      <div className="mt-4">
        <Section title="Earnings Strategy Comparison">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-text-dim)]">
                  <th className="py-2 pr-4">Strategy</th>
                  <th className="py-2 pr-4">When to Consider It</th>
                  <th className="py-2">Risk Profile</th>
                </tr>
              </thead>
              <tbody>
                {EARNINGS_STRATEGIES.map((s) => (
                  <tr key={s.name} className="border-b border-[var(--color-border)]/60 align-top">
                    <td className="py-2 pr-4 font-semibold text-[var(--color-heading)]">{s.name}</td>
                    <td className="py-2 pr-4 text-[var(--color-text-dim)]">{s.when}</td>
                    <td className="py-2 text-[var(--color-text-dim)]">{s.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Section title="Earnings Rules of Thumb">
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Size every earnings trade smaller than a normal trade — it's closer to a binary bet than a technical setup.</li>
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Know your max loss before entering, always, on every leg.</li>
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Check the historical average earnings move vs. what IV is pricing in before picking a strategy.</li>
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Decide in advance whether you're holding through the announcement or exiting beforehand — don't decide in the moment.</li>
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Watch liquidity — earnings names often have wide bid/ask spreads right after the report; use limit orders.</li>
          </ul>
        </Section>
        <Section title="Trading News & Economic Events">
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Know the economic calendar (CPI, FOMC rate decisions, jobs reports) — these move the whole market's volatility, not just single stocks.</li>
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>The first sharp reaction to breaking news is frequently overdone or wrong in detail — many experienced traders wait for a "second move" (a retest or consolidation) rather than chasing the initial spike.</li>
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Spreads widen and slippage increases dramatically during high-impact news — market orders can fill far from where you expected.</li>
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Verify news through multiple credible sources before acting — headlines get corrected, retracted, or are simply wrong more often than beginners expect.</li>
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Be aware of overnight/weekend gap risk on any position held through a scheduled news event.</li>
          </ul>
        </Section>
      </div>

    </div>
  );
}
