import { useMemo, useState } from 'react';
import clsx from 'clsx';
import CandleChart, { type MarkerPoint } from '../components/CandleChart';
import { PageHeader, Section, Callout, Badge } from '../components/ui';
import { randomWalkBars } from '../lib/chartData';
import { ema } from '../lib/indicators';
import { computeConfluenceSignal, type SignalResult } from '../lib/signalEngine';

function verdictTone(v: SignalResult['verdict']) {
  if (v === 'Strong Buy' || v === 'Buy') return 'bullish' as const;
  if (v === 'Strong Sell' || v === 'Sell') return 'bearish' as const;
  return 'neutral' as const;
}

export default function SignalTool() {
  const [round, setRound] = useState(0);
  const bars = useMemo(
    () => randomWalkBars(`signal-${round}`, 200, { basePrice: 60 + Math.random() * 140, amplitude: 24 + Math.random() * 20 }),
    [round],
  );

  const closes = bars.map((b) => b.close);
  const overlays = [
    { data: ema(closes, 9), color: '#4da3ff', title: 'EMA 9' },
    { data: ema(closes, 21), color: '#f5b642', title: 'EMA 21' },
    { data: ema(closes, 50), color: '#a78bfa', title: 'EMA 50' },
  ];

  const { markers, current } = useMemo(() => {
    const results: SignalResult[] = [];
    for (let i = 0; i < bars.length; i++) {
      if (i < 55) {
        results.push({ score: 0, verdict: 'Hold', factors: [] });
        continue;
      }
      results.push(computeConfluenceSignal(bars.slice(0, i + 1)));
    }
    const markers: MarkerPoint[] = [];
    let lastState: 'buy' | 'sell' | 'none' = 'none';
    for (let i = 55; i < results.length; i++) {
      const v = results[i].verdict;
      const isBuy = v === 'Buy' || v === 'Strong Buy';
      const isSell = v === 'Sell' || v === 'Strong Sell';
      if (isBuy && lastState !== 'buy') {
        markers.push({ time: bars[i].time, position: 'belowBar', color: '#35d68a', shape: 'arrowUp', text: 'BUY' });
        lastState = 'buy';
      } else if (isSell && lastState !== 'sell') {
        markers.push({ time: bars[i].time, position: 'aboveBar', color: '#ff5d5d', shape: 'arrowDown', text: 'SELL' });
        lastState = 'sell';
      } else if (!isBuy && !isSell) {
        lastState = 'none';
      }
    }
    return { markers, current: results[results.length - 1] };
  }, [bars]);

  return (
    <div>
      <PageHeader
        eyebrow="Custom Indicator"
        title="ChartSchool Confluence Signal"
        blurb="A transparent, educational buy/sell indicator: it blends EMA trend alignment, RSI momentum, MACD crossovers, Bollinger Band positioning, and volume confirmation into one score — and shows you exactly why it fired."
      />
      <Callout tone="warn" title="This is a teaching tool, not financial advice">
        No indicator predicts the future. The goal here is to make you fluent in *why* a signal fires — trend + momentum + volatility + volume agreeing — so you can build and evaluate your own rules, on any platform, with real skepticism.
      </Callout>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <Section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--color-heading)]">Signal History on This Chart</h2>
            <button className="btn" onClick={() => setRound((r) => r + 1)}>New Chart</button>
          </div>
          <CandleChart bars={bars} height={440} overlays={overlays} markers={markers} showVolume />
        </Section>
        <Section title="Current Reading">
          <SignalGauge result={current} />
        </Section>
      </div>

      <div className="mt-4">
        <Section title="How the Score Is Built">
          <p className="mb-3 text-sm text-[var(--color-text-dim)]">Each factor contributes points toward a -100 to +100 confluence score. Nothing here is a black box — every point is traceable to a rule.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <FactorExplainer title="Trend (±25)" body="Full EMA 9 > 21 > 50 stack (or reverse) scores the max. Partial alignment scores half. Tangled EMAs score zero — no trend, no edge." />
            <FactorExplainer title="RSI (±15)" body="Oversold (<30) or overbought (>70) scores toward mean-reversion. A healthy 50-65 / 35-50 momentum zone scores a smaller trend-following bonus." />
            <FactorExplainer title="MACD (±20)" body="A fresh zero-line histogram crossover scores the max — a new momentum shift. An established MACD-over-signal state scores half." />
            <FactorExplainer title="Bollinger Bands (±8)" body="Price pressing a band scores a small mean-reversion tilt. A volatility squeeze scores zero (direction unconfirmed) but flags 'get ready'." />
            <FactorExplainer title="Volume (±10)" body="A move on 1.3x+ average volume confirms conviction behind that move; unremarkable volume scores zero either way." />
            <FactorExplainer title="Verdict bands" body="+45 Strong Buy · +15 Buy · -14 to 14 Hold · -15 Sell · -45 Strong Sell. Bands are wide on purpose — mild scores should feel like 'Hold'." />
          </div>
        </Section>
      </div>
    </div>
  );
}

function FactorExplainer({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-2)] p-3">
      <div className="mb-1 text-sm font-bold text-[var(--color-heading)]">{title}</div>
      <p className="text-xs text-[var(--color-text-dim)]">{body}</p>
    </div>
  );
}

function SignalGauge({ result }: { result: SignalResult }) {
  const pct = (result.score + 100) / 200;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <Badge tone={verdictTone(result.verdict)}>{result.verdict}</Badge>
        <span className="font-mono text-lg font-bold">{result.score > 0 ? '+' : ''}{result.score}</span>
      </div>
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-[var(--color-panel-2)]">
        <div
          className={clsx('h-full rounded-full', result.score >= 0 ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-danger)]')}
          style={{ width: `${Math.abs(pct - 0.5) * 200}%`, marginLeft: result.score >= 0 ? '50%' : `${pct * 100}%` }}
        />
      </div>
      <div className="space-y-2">
        {result.factors.map((f) => (
          <div key={f.label} className="rounded-lg border border-[var(--color-border)] px-3 py-2">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--color-heading)]">{f.label}</span>
              <span className={clsx('font-mono', f.tone === 'bullish' ? 'text-[var(--color-accent)]' : f.tone === 'bearish' ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-dim)]')}>
                {f.points > 0 ? '+' : ''}{f.points}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-dim)]">{f.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
