import { useMemo, useState } from 'react';
import clsx from 'clsx';
import CandleChart from '../components/CandleChart';
import { PageHeader, Section, ChoiceButton, Callout, StatChip, Badge } from '../components/ui';
import { CHART_PATTERNS, type PatternDef } from '../data/patterns';
import { CANDLE_PATTERNS, type CandlePatternDef } from '../data/candlePatterns';
import { synthesizeBars, trendContextBars, appendRelativeCandles } from '../lib/chartData';
import { recordAnswer, getStats } from '../lib/progress';

type Mode = 'chart' | 'candle';

function shuffle<T>(arr: T[], rand = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function useChartQuestion() {
  return useMemo(() => {
    const pattern = CHART_PATTERNS[Math.floor(Math.random() * CHART_PATTERNS.length)];
    const nonce = Math.random().toString(36).slice(2);
    const bars = synthesizeBars(pattern.points, {
      seed: pattern.id + nonce,
      totalBars: 100,
      basePrice: 80 + Math.random() * 120,
      amplitude: 18 + Math.random() * 16,
    });
    const choices = shuffle([pattern, ...shuffle(CHART_PATTERNS.filter((p) => p.id !== pattern.id)).slice(0, 3)]);
    return { pattern, bars, choices };
  }, []);
}

function useCandleQuestion() {
  return useMemo(() => {
    const pattern = CANDLE_PATTERNS[Math.floor(Math.random() * CANDLE_PATTERNS.length)];
    const nonce = Math.random().toString(36).slice(2);
    const context = trendContextBars(pattern.id + nonce, pattern.context, 26, {
      basePrice: 80 + Math.random() * 120,
      amplitude: 16 + Math.random() * 14,
    });
    const bars = appendRelativeCandles(context, pattern.candles);
    const choices = shuffle([pattern, ...shuffle(CANDLE_PATTERNS.filter((p) => p.id !== pattern.id)).slice(0, 3)]);
    return { pattern, bars, choices };
  }, []);
}

export default function PatternQuiz() {
  const [mode, setMode] = useState<Mode>('chart');
  const [seedTick, setSeedTick] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const stats = getStats('patterns');

  return (
    <div>
      <PageHeader
        eyebrow="Pattern Recognition"
        title="Spot the Pattern"
        blurb="Every question generates a fresh, randomized chart — memorize the shape, the volume tell, and the trade plan, not a picture."
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => { setMode('chart'); setSelected(null); setSeedTick((t) => t + 1); }}
            className={clsx('btn', mode === 'chart' && 'btn-primary')}
          >
            Chart Patterns
          </button>
          <button
            onClick={() => { setMode('candle'); setSelected(null); setSeedTick((t) => t + 1); }}
            className={clsx('btn', mode === 'candle' && 'btn-primary')}
          >
            Candlestick Signals
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <StatChip label="Attempted" value={stats.attempted} />
          <StatChip label="Correct" value={stats.correct} tone="good" />
          <StatChip label="Best Streak" value={stats.best_streak} />
        </div>
      </div>
      {mode === 'chart' ? (
        <ChartQuestion key={`chart-${seedTick}`} selected={selected} setSelected={setSelected} onNext={() => setSeedTick((t) => t + 1)} />
      ) : (
        <CandleQuestion key={`candle-${seedTick}`} selected={selected} setSelected={setSelected} onNext={() => setSeedTick((t) => t + 1)} />
      )}
    </div>
  );
}

function ExplanationCard({ pattern }: { pattern: PatternDef | CandlePatternDef }) {
  return (
    <Section title={pattern.name}>
      <div className="mb-3 flex gap-2">
        <Badge tone={pattern.bias === 'bullish' ? 'bullish' : pattern.bias === 'bearish' ? 'bearish' : 'neutral'}>{pattern.bias}</Badge>
        {'kind' in pattern && <Badge>{pattern.kind}</Badge>}
      </div>
      <p className="mb-4 text-sm leading-relaxed text-[var(--color-text)]">{pattern.description}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-dim)]">Key Tells</h3>
          <ul className="space-y-1.5 text-sm">
            {pattern.keyTells.map((t) => (
              <li key={t} className="flex gap-2"><span className="text-[var(--color-accent)]">•</span><span>{t}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-dim)]">How to Trade It</h3>
          <ul className="space-y-1.5 text-sm">
            {pattern.howToTrade.map((t) => (
              <li key={t} className="flex gap-2"><span className="text-[var(--color-accent)]">•</span><span>{t}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function ChartQuestion({ selected, setSelected, onNext }: { selected: string | null; setSelected: (s: string | null) => void; onNext: () => void }) {
  const { pattern, bars, choices } = useChartQuestion();
  const answered = selected !== null;

  const handle = (choiceId: string) => {
    if (answered) return;
    setSelected(choiceId);
    recordAnswer('patterns', choiceId === pattern.id);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <Section>
        <CandleChart bars={bars} height={380} showVolume />
      </Section>
      <Section title="Which pattern is forming?">
        <div className="space-y-2">
          {choices.map((c) => {
            let state: 'idle' | 'correct' | 'incorrect' | 'reveal-correct' = 'idle';
            if (answered) {
              if (c.id === pattern.id) state = 'correct';
              else if (c.id === selected) state = 'incorrect';
            }
            return <ChoiceButton key={c.id} label={c.name} state={state} disabled={answered} onClick={() => handle(c.id)} />;
          })}
        </div>
        {answered && (
          <button className="btn btn-primary mt-4 w-full" onClick={onNext}>
            Next Question →
          </button>
        )}
      </Section>
      {answered && (
        <div className="lg:col-span-2">
          {selected === pattern.id ? (
            <Callout tone="accent" title="Correct">You identified it — details below to lock it in.</Callout>
          ) : (
            <Callout tone="danger" title={`Not quite — this is a ${pattern.name}`}>Review the tells below, then try the next one.</Callout>
          )}
          <div className="mt-3">
            <ExplanationCard pattern={pattern} />
          </div>
        </div>
      )}
    </div>
  );
}

function CandleQuestion({ selected, setSelected, onNext }: { selected: string | null; setSelected: (s: string | null) => void; onNext: () => void }) {
  const { pattern, bars, choices } = useCandleQuestion();
  const answered = selected !== null;
  const visibleBars = bars.slice(-20);

  const handle = (choiceId: string) => {
    if (answered) return;
    setSelected(choiceId);
    recordAnswer('patterns', choiceId === pattern.id);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <Section>
        <CandleChart bars={visibleBars} height={380} showVolume />
      </Section>
      <Section title="Which candlestick signal is this?">
        <div className="space-y-2">
          {choices.map((c) => {
            let state: 'idle' | 'correct' | 'incorrect' | 'reveal-correct' = 'idle';
            if (answered) {
              if (c.id === pattern.id) state = 'correct';
              else if (c.id === selected) state = 'incorrect';
            }
            return <ChoiceButton key={c.id} label={c.name} state={state} disabled={answered} onClick={() => handle(c.id)} />;
          })}
        </div>
        {answered && (
          <button className="btn btn-primary mt-4 w-full" onClick={onNext}>
            Next Question →
          </button>
        )}
      </Section>
      {answered && (
        <div className="lg:col-span-2">
          {selected === pattern.id ? (
            <Callout tone="accent" title="Correct">Nice read — details below to lock it in.</Callout>
          ) : (
            <Callout tone="danger" title={`Not quite — this is a ${pattern.name}`}>Review the tells below, then try the next one.</Callout>
          )}
          <div className="mt-3">
            <ExplanationCard pattern={pattern} />
          </div>
        </div>
      )}
    </div>
  );
}
