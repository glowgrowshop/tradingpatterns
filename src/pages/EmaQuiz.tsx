import { useMemo, useState } from 'react';
import CandleChart from '../components/CandleChart';
import { PageHeader, Section, ChoiceButton, Callout, StatChip } from '../components/ui';
import { EMA_SCENARIOS, type EmaOption } from '../data/emaScenarios';
import { synthesizeBars } from '../lib/chartData';
import { ema } from '../lib/indicators';
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
    const scenario = EMA_SCENARIOS[Math.floor(Math.random() * EMA_SCENARIOS.length)];
    const nonce = Math.random().toString(36).slice(2);
    const bars = synthesizeBars(scenario.points, {
      seed: scenario.id + nonce,
      totalBars: 140,
      basePrice: 60 + Math.random() * 140,
      amplitude: 22 + Math.random() * 18,
    });
    const closes = bars.map((b) => b.close);
    const overlays = [
      { data: ema(closes, 9), color: '#4da3ff', title: 'EMA 9' },
      { data: ema(closes, 21), color: '#f5b642', title: 'EMA 21' },
      { data: ema(closes, 50), color: '#a78bfa', title: 'EMA 50' },
    ];
    const options = shuffle(scenario.options);
    return { scenario, bars, overlays, options };
  }, []);
}

export default function EmaQuiz() {
  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const stats = getStats('ema');
  return (
    <div>
      <PageHeader
        eyebrow="EMA Decision Training"
        title="What's the Highest-Probability Move?"
        blurb="Every scenario shows the 9/21/50 EMA stack at a real decision point. Pick the move with the best risk/reward given the trend — not just the one that sounds exciting."
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
  const { scenario, bars, overlays, options } = useQuestion();
  const answered = selected !== null;

  const handle = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    recordAnswer('ema', options[idx].correct);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <Section title={scenario.title}>
        <CandleChart bars={bars} height={400} overlays={overlays} showVolume={false} />
        <div className="mt-2 flex gap-4 text-xs">
          <span className="flex items-center gap-1"><span className="h-0.5 w-3 bg-[#4da3ff]" />EMA 9</span>
          <span className="flex items-center gap-1"><span className="h-0.5 w-3 bg-[#f5b642]" />EMA 21</span>
          <span className="flex items-center gap-1"><span className="h-0.5 w-3 bg-[#a78bfa]" />EMA 50</span>
        </div>
        <p className="mt-3 text-sm text-[var(--color-text-dim)]">{scenario.setupNote}</p>
      </Section>
      <Section title={scenario.question}>
        <div className="space-y-2">
          {options.map((o: EmaOption, idx: number) => {
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
            <Callout tone="accent" title="The higher-probability move">
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
