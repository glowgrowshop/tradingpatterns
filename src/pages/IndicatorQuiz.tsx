import { useMemo, useState } from 'react';
import CandleChart from '../components/CandleChart';
import IndicatorPane from '../components/IndicatorPane';
import { PageHeader, Section, ChoiceButton, Callout, StatChip, Badge } from '../components/ui';
import { INDICATOR_SCENARIOS, type IndicatorOption, type IndicatorScenario } from '../data/indicatorScenarios';
import { synthesizeBars } from '../lib/chartData';
import { rsi, macd, bollingerBands } from '../lib/indicators';
import { recordAnswer, getStats } from '../lib/progress';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function useQuestion() {
  return useMemo(() => {
    const scenario = INDICATOR_SCENARIOS[Math.floor(Math.random() * INDICATOR_SCENARIOS.length)];
    const nonce = Math.random().toString(36).slice(2);
    const bars = synthesizeBars(scenario.points, {
      seed: scenario.id + nonce,
      totalBars: 90,
      basePrice: 60 + Math.random() * 140,
      amplitude: 20 + Math.random() * 16,
    });
    const closes = bars.map((b) => b.close);
    const options = shuffle(scenario.options);
    return { scenario, bars, closes, options };
  }, []);
}

const badgeTone = (indicator: IndicatorScenario['indicator']) =>
  indicator === 'rsi' ? 'neutral' : indicator === 'macd' ? 'bullish' : 'bearish';

export default function IndicatorQuiz() {
  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const stats = getStats('indicators');
  return (
    <div>
      <PageHeader
        eyebrow="Indicator Interpretation"
        title="RSI, MACD & Bollinger Bands"
        blurb="Indicators don't hand you answers — they shift probabilities. Practice reading them the way experienced traders do: as context, not commands."
      />
      <div className="mb-4 flex justify-end gap-2">
        <StatChip label="Attempted" value={stats.attempted} />
        <StatChip label="Correct" value={stats.correct} tone="good" />
        <StatChip label="Best Streak" value={stats.best_streak} />
      </div>
      <Question key={tick} selected={selected} setSelected={setSelected} onNext={() => { setSelected(null); setTick((t) => t + 1); }} />
    </div>
  );
}

function Question({ selected, setSelected, onNext }: { selected: number | null; setSelected: (i: number | null) => void; onNext: () => void }) {
  const { scenario, bars, closes, options } = useQuestion();
  const answered = selected !== null;

  const handle = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    recordAnswer('indicators', options[idx].correct);
  };

  const rsiVals = scenario.indicator === 'rsi' ? rsi(closes, 14) : null;
  const macdRes = scenario.indicator === 'macd' ? macd(closes, 12, 26, 9) : null;
  const bb = scenario.indicator === 'bollinger' ? bollingerBands(closes, 20, 2) : null;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <Section>
        <div className="mb-2 flex items-center gap-2">
          <Badge tone={badgeTone(scenario.indicator)}>{scenario.indicator.toUpperCase()}</Badge>
          <h2 className="text-lg font-semibold text-[var(--color-heading)]">{scenario.title}</h2>
        </div>
        {scenario.indicator === 'bollinger' && bb ? (
          <CandleChart
            bars={bars}
            height={380}
            showVolume={false}
            overlays={[
              { data: bb.upper, color: '#4da3ff', title: 'Upper' },
              { data: bb.middle, color: '#7c8797', title: 'Mid (20 SMA)' },
              { data: bb.lower, color: '#4da3ff', title: 'Lower' },
            ]}
          />
        ) : (
          <CandleChart bars={bars} height={300} showVolume={false} />
        )}
        {scenario.indicator === 'rsi' && rsiVals && <IndicatorPane kind="rsi" bars={bars} values={rsiVals} height={140} />}
        {scenario.indicator === 'macd' && macdRes && (
          <IndicatorPane kind="macd" bars={bars} macdLine={macdRes.macd} signalLine={macdRes.signal} histogram={macdRes.histogram} height={140} />
        )}
        <p className="mt-3 text-sm text-[var(--color-text-dim)]">{scenario.setupNote}</p>
      </Section>
      <Section title={scenario.question}>
        <div className="space-y-2">
          {options.map((o: IndicatorOption, idx: number) => {
            let state: 'idle' | 'correct' | 'incorrect' = 'idle';
            if (answered) {
              if (o.correct) state = 'correct';
              else if (idx === selected) state = 'incorrect';
            }
            return <ChoiceButton key={o.label} label={o.label} state={state} disabled={answered} onClick={() => handle(idx)} />;
          })}
        </div>
        {answered && (
          <button className="btn btn-primary mt-4 w-full" onClick={onNext}>Next Scenario →</button>
        )}
      </Section>
      {answered && (
        <div className="lg:col-span-2 space-y-3">
          <Callout tone={options[selected].correct ? 'accent' : 'danger'} title={options[selected].correct ? 'Correct read' : 'Lower-probability choice'}>
            {options[selected].rationale}
          </Callout>
          {!options[selected].correct && (
            <Callout tone="accent" title="The higher-probability read">
              {options.find((o) => o.correct)?.rationale}
            </Callout>
          )}
          <Section title="Takeaway">
            <p className="text-sm">{scenario.takeaway}</p>
          </Section>
        </div>
      )}
    </div>
  );
}
