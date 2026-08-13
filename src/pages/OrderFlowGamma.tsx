import { useMemo, useState } from 'react';
import clsx from 'clsx';
import CandleChart from '../components/CandleChart';
import IndicatorPane from '../components/IndicatorPane';
import GammaChart from '../components/GammaChart';
import RulerChart, { TIMEFRAMES, type Timeframe } from '../components/RulerChart';
import { PageHeader, Section, Callout, ChoiceButton, Badge, StatChip } from '../components/ui';
import { randomWalkBars } from '../lib/chartData';
import { computeOrderFlow } from '../lib/orderFlow';
import { generateGammaProfile } from '../lib/gammaProfile';
import { ORDER_FLOW_SCENARIOS, GAMMA_SCENARIOS, type SimpleScenario } from '../data/orderFlowGammaScenarios';
import { recordAnswer, getStats } from '../lib/progress';

type Tab = 'flow' | 'gamma' | 'ruler';

export default function OrderFlowGamma() {
  const [tab, setTab] = useState<Tab>('flow');
  return (
    <div>
      <PageHeader
        eyebrow="Advanced Market Structure"
        title="Order Flow, Gamma & Forecasting Rulers"
        blurb="These are simulated teaching tools, not a live market data feed — this app has no connection to a real-time exchange, brokerage, or options-chain provider. They're built to teach exactly how professionals reason about tape, dealer positioning, and measured moves, using the same math on synthetic data."
      />
      <Callout tone="warn" title="Not real-time, not real data">
        Nothing on this page is connected to live prices, a real options chain, or an actual order book. Order flow is approximated from candle structure, gamma exposure is a randomized simulated profile, and every "timeframe" just changes how the synthetic bars are generated. Treat this as a flight simulator for the concepts.
      </Callout>

      <div className="mt-4 mb-4 flex gap-2">
        <button className={clsx('btn', tab === 'flow' && 'btn-primary')} onClick={() => setTab('flow')}>Order Flow (CVD)</button>
        <button className={clsx('btn', tab === 'gamma' && 'btn-primary')} onClick={() => setTab('gamma')}>Gamma Exposure</button>
        <button className={clsx('btn', tab === 'ruler' && 'btn-primary')} onClick={() => setTab('ruler')}>Forecast Ruler</button>
      </div>

      {tab === 'flow' && <OrderFlowTab />}
      {tab === 'gamma' && <GammaTab />}
      {tab === 'ruler' && <RulerTab />}
    </div>
  );
}

function OrderFlowTab() {
  const [round, setRound] = useState(0);
  const bars = useMemo(
    () => randomWalkBars(`flow-${round}`, 120, { basePrice: 60 + Math.random() * 140, amplitude: 20 + Math.random() * 16 }),
    [round],
  );
  const flow = useMemo(() => computeOrderFlow(bars), [bars]);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button className="btn" onClick={() => setRound((r) => r + 1)}>New Chart</button>
      </div>
      <Section>
        <CandleChart bars={bars} height={320} showVolume={false} />
        <IndicatorPane kind="delta" bars={bars} delta={flow.map((f) => f.delta)} cumulativeDelta={flow.map((f) => f.cumulativeDelta)} height={160} />
        <div className="mt-2 flex gap-4 text-xs">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-[rgba(53,214,138,0.7)]" />Positive delta (bar)</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-[rgba(255,93,93,0.7)]" />Negative delta (bar)</span>
          <span className="flex items-center gap-1"><span className="h-0.5 w-3 bg-[#4da3ff]" />Cumulative delta (line)</span>
        </div>
      </Section>

      <div className="mt-4">
        <Section title="What Order Flow Actually Measures">
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-dim)]">The Idea</h3>
              <p className="mb-2">Order flow (or "tape reading") studies the actual trades happening at the bid vs. the ask — real aggressive buying vs. real aggressive selling — rather than just the resulting candle. Cumulative Volume Delta (CVD) sums that buy/sell imbalance over time into a single running line.</p>
              <p>This app approximates it from candle structure (where price closed within its high/low range) since true tick-by-tick bid/ask data requires a live Level 2 / time & sales feed this app doesn't have.</p>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-dim)]">What To Watch For</h3>
              <ul className="space-y-1.5">
                <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span><strong className="text-[var(--color-heading)]">Confirmation:</strong> price and CVD making highs/lows together</li>
                <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span><strong className="text-[var(--color-heading)]">Divergence:</strong> price makes a new high/low but CVD doesn't — a caution flag</li>
                <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span><strong className="text-[var(--color-heading)]">Absorption:</strong> heavy delta in one direction with little resulting price movement</li>
                <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span><strong className="text-[var(--color-heading)]">Exhaustion:</strong> a climactic delta spike right before a stall or reversal</li>
              </ul>
            </div>
          </div>
        </Section>
      </div>

      <div className="mt-4">
        <ScenarioQuiz scenarios={ORDER_FLOW_SCENARIOS} moduleId="order-flow" />
      </div>
    </div>
  );
}

function GammaTab() {
  const [round, setRound] = useState(0);
  const spot = useMemo(() => 60 + Math.random() * 140, [round]);
  const profile = useMemo(() => generateGammaProfile(`gamma-${round}`, spot), [round, spot]);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button className="btn" onClick={() => setRound((r) => r + 1)}>New Simulated Chain</button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Section title="Simulated Dealer Gamma Exposure by Strike">
          <GammaChart profile={profile} height={460} />
        </Section>
        <Section title="Reading This Profile">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-2">
              <span className="text-[var(--color-text-dim)]">Regime</span>
              <Badge tone={profile.regime === 'positive' ? 'bullish' : 'bearish'}>{profile.regime === 'positive' ? 'Positive Gamma' : 'Negative Gamma'}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-2">
              <span className="text-[var(--color-text-dim)]">Call Wall</span>
              <span className="font-mono font-bold text-[var(--color-accent)]">{profile.callWall.strike.toFixed(0)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-2">
              <span className="text-[var(--color-text-dim)]">Put Wall</span>
              <span className="font-mono font-bold text-[var(--color-danger)]">{profile.putWall.strike.toFixed(0)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-2">
              <span className="text-[var(--color-text-dim)]">Zero-Gamma Flip</span>
              <span className="font-mono font-bold text-[var(--color-warn)]">{profile.zeroGammaLevel.toFixed(0)}</span>
            </div>
            <p className="text-xs text-[var(--color-text-dim)]">Spot is currently ≈ {profile.spot.toFixed(0)}, placing it in a {profile.regime}-gamma regime on this simulated chain.</p>
          </div>
        </Section>
      </div>

      <div className="mt-4">
        <Section title="Dealer Gamma, Explained">
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-dim)]">The Core Idea</h3>
              <p className="mb-2">When traders buy options, the dealers/market-makers on the other side typically hedge their resulting exposure by trading the underlying stock. As price moves, that hedge has to be adjusted — and the direction of that adjustment depends on whether dealers are net long or short gamma.</p>
              <p><strong className="text-[var(--color-heading)]">Positive gamma:</strong> dealers buy dips and sell rallies to stay hedged → dampens volatility, favors chop/mean-reversion.</p>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-dim)]">Practical Takeaways</h3>
              <p className="mb-2"><strong className="text-[var(--color-heading)]">Negative gamma:</strong> dealers sell dips and buy rallies to stay hedged → amplifies volatility, favors trending/accelerating moves.</p>
              <p><strong className="text-[var(--color-heading)]">0DTE effect:</strong> same-day-expiry options concentrate gamma into a single session, which is why some indices show sharp intraday pinning or acceleration near large 0DTE strikes.</p>
            </div>
          </div>
        </Section>
      </div>

      <div className="mt-4">
        <ScenarioQuiz scenarios={GAMMA_SCENARIOS} moduleId="gamma" />
      </div>
    </div>
  );
}

function RulerTab() {
  const [tf, setTf] = useState<Timeframe>(TIMEFRAMES[3]);
  const [round, setRound] = useState(0);
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {TIMEFRAMES.map((t) => (
            <button key={t.id} className={clsx('btn', tf.id === t.id && 'btn-primary')} onClick={() => setTf(t)}>{t.label}</button>
          ))}
        </div>
        <button className="btn" onClick={() => setRound((r) => r + 1)}>New Chart</button>
      </div>
      <RulerChart timeframe={tf} round={round} />
      <div className="mt-4">
        <Section title="Measured Moves Across Timeframes">
          <p className="text-sm text-[var(--color-text-dim)]">The math behind a measured-move projection doesn't change across timeframes — only what a "bar" represents does. A 5-bar move on a 1-minute chart plays out in 5 minutes; the same 5-bar shape on a weekly chart plays out over 5 weeks. Professionals often check whether a setup lines up across multiple timeframes (multi-timeframe confluence) before trusting a projected target.</p>
        </Section>
      </div>
    </div>
  );
}

function ScenarioQuiz({ scenarios, moduleId }: { scenarios: SimpleScenario[]; moduleId: 'order-flow' | 'gamma' }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * scenarios.length));
  const [selected, setSelected] = useState<number | null>(null);
  const stats = getStats(moduleId);
  const scenario = scenarios[index];
  const answered = selected !== null;

  const handle = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    recordAnswer(moduleId, scenario.options[idx].correct);
  };
  const next = () => {
    setSelected(null);
    setIndex((i) => (i + 1 + Math.floor(Math.random() * Math.max(1, scenarios.length - 1))) % scenarios.length);
  };

  return (
    <div>
      <div className="mb-3 flex justify-end gap-2">
        <StatChip label="Attempted" value={stats.attempted} />
        <StatChip label="Correct" value={stats.correct} tone="good" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Section title={scenario.title}>
          <p className="text-sm leading-relaxed">{scenario.setup}</p>
        </Section>
        <Section title={scenario.question}>
          <div className="space-y-2">
            {scenario.options.map((o, idx) => {
              let state: 'idle' | 'correct' | 'incorrect' = 'idle';
              if (answered) {
                if (o.correct) state = 'correct';
                else if (idx === selected) state = 'incorrect';
              }
              return <ChoiceButton key={o.label} label={o.label} state={state} disabled={answered} onClick={() => handle(idx)} />;
            })}
          </div>
          {answered && <button className="btn btn-primary mt-4 w-full" onClick={next}>Next Scenario →</button>}
        </Section>
        {answered && (
          <div className="lg:col-span-2 space-y-3">
            <Callout tone={scenario.options[selected].correct ? 'accent' : 'danger'} title={scenario.options[selected].correct ? 'Correct' : 'Not the strongest read'}>
              {scenario.options[selected].rationale}
            </Callout>
            <Section title="Takeaway">
              <p className="text-sm">{scenario.takeaway}</p>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
