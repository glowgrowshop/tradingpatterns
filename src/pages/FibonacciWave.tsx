import { useMemo, useState } from 'react';
import clsx from 'clsx';
import CandleChart, { type HorizontalLine, type MarkerPoint } from '../components/CandleChart';
import { PageHeader, Section, ChoiceButton, Callout, StatChip, Badge } from '../components/ui';
import { synthesizeBars, type ControlPoint } from '../lib/chartData';
import { fibRetracement } from '../lib/indicators';
import { WAVE_SCENARIOS, FULL_WAVE_PATH, WAVE_LABEL_POINTS } from '../data/waveScenarios';
import { recordAnswer, getStats } from '../lib/progress';

type Tab = 'fib' | 'wave';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const FIB_COLORS: Record<string, string> = {
  '0.0%': '#7c8797', '23.6%': '#4da3ff', '38.2%': '#35d68a', '50.0%': '#f5b642', '61.8%': '#ff9d4d', '78.6%': '#ff5d5d', '100.0%': '#7c8797',
};

export default function FibonacciWave() {
  const [tab, setTab] = useState<Tab>('fib');
  return (
    <div>
      <PageHeader
        eyebrow="Fibonacci & Elliott Wave"
        title="Measure the Trend, Count the Waves"
        blurb="Fibonacci retracements estimate where a pullback is statistically likely to find support/resistance. Elliott Wave gives that pullback a structural context — which leg of the cycle you're probably in."
      />
      <div className="mb-4 flex gap-2">
        <button className={clsx('btn', tab === 'fib' && 'btn-primary')} onClick={() => setTab('fib')}>Fibonacci Retracement</button>
        <button className={clsx('btn', tab === 'wave' && 'btn-primary')} onClick={() => setTab('wave')}>Elliott Wave Count</button>
      </div>
      {tab === 'fib' ? <FibPractice /> : <WavePractice />}
    </div>
  );
}

function useFibQuestion() {
  return useMemo(() => {
    const uptrend = Math.random() > 0.5;
    const nonce = Math.random().toString(36).slice(2);
    const points: ControlPoint[] = uptrend
      ? [{ x: 0, y: 0.1 }, { x: 0.5, y: 0.35 }, { x: 1, y: 0.92 }]
      : [{ x: 0, y: 0.92 }, { x: 0.5, y: 0.65 }, { x: 1, y: 0.08 }];
    const basePrice = 60 + Math.random() * 140;
    const amplitude = 30 + Math.random() * 20;
    const bars = synthesizeBars(points, { seed: `fib-${nonce}`, totalBars: 70, basePrice, amplitude, noise: 0.3, driftNoise: 0.15 });
    const low = uptrend ? bars[0].low : bars[bars.length - 1].low;
    const high = uptrend ? bars[bars.length - 1].high : bars[0].high;
    const fib = fibRetracement(low, high, uptrend);
    const goldenPocket = fib.levels.find((l) => l.ratio === 0.618)!;
    const shallow = fib.levels.find((l) => l.ratio === 0.236)!;
    const deep = fib.levels.find((l) => l.ratio === 0.786)!;
    const noRetrace = uptrend ? high * 1.02 : low * 0.98;
    const options = shuffle([
      { label: `Around ${goldenPocket.price.toFixed(2)} (the 61.8% "golden pocket")`, correct: true, price: goldenPocket.price },
      { label: `Around ${shallow.price.toFixed(2)} (the shallow 23.6% level)`, correct: false, price: shallow.price },
      { label: `Around ${deep.price.toFixed(2)} (a deep 78.6% retracement)`, correct: false, price: deep.price },
      { label: `Around ${noRetrace.toFixed(2)} (essentially no pullback at all)`, correct: false, price: noRetrace },
    ]);
    return { bars, uptrend, fib, options, low, high };
  }, []);
}

function FibPractice() {
  const [tick, setTick] = useState(0);
  const stats = getStats('fibonacci');
  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <StatChip label="Attempted" value={stats.attempted} />
        <StatChip label="Correct" value={stats.correct} tone="good" />
        <StatChip label="Best Streak" value={stats.best_streak} />
      </div>
      <FibQuestion key={tick} onNext={() => setTick((t) => t + 1)} />
      <div className="mt-4">
        <Section title="How Top Traders Use Fibonacci">
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <ul className="space-y-1.5">
              <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Anchor the tool on a clear, obvious swing low-to-high (or high-to-low) — garbage swings give garbage levels</li>
              <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>The 50%-61.8% zone ("golden pocket") is the most commonly watched reaction area</li>
              <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Fib levels are strongest when they line up ("confluence") with an EMA, prior support/resistance, or a round number</li>
            </ul>
            <ul className="space-y-1.5">
              <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Use Fibonacci <em>extensions</em> (127.2%, 161.8%) to set realistic profit targets once a trend resumes</li>
              <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>A retracement past 78.6%-100% often signals the swing has failed, not just a "deeper pullback"</li>
              <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Fibonacci is a probability tool, not a precise price — always trade the zone, and always define a stop</li>
            </ul>
          </div>
        </Section>
      </div>
    </div>
  );
}

function FibQuestion({ onNext }: { onNext: () => void }) {
  const { bars, uptrend, fib, options, low, high } = useFibQuestion();
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  const markers: MarkerPoint[] = [
    { time: uptrend ? bars[0].time : bars[bars.length - 1].time, position: uptrend ? 'belowBar' : 'aboveBar', color: '#7c8797', shape: 'circle', text: 'Swing Low' },
    { time: uptrend ? bars[bars.length - 1].time : bars[0].time, position: uptrend ? 'aboveBar' : 'belowBar', color: '#7c8797', shape: 'circle', text: 'Swing High' },
  ];

  const lines: HorizontalLine[] = answered
    ? fib.levels.map((l) => ({ price: l.price, color: FIB_COLORS[l.label] ?? '#7c8797', title: l.label, lineStyle: 2 as const }))
    : [];

  const handle = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    recordAnswer('fibonacci', options[idx].correct);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
      <Section>
        <CandleChart bars={bars} height={400} showVolume={false} markers={markers} horizontalLines={lines} />
      </Section>
      <Section title={`This ${uptrend ? 'up' : 'down'}swing just completed. Where's the highest-probability pullback zone?`}>
        <p className="mb-3 text-xs text-[var(--color-text-dim)]">Swing: {low.toFixed(2)} → {high.toFixed(2)}</p>
        <div className="space-y-2">
          {options.map((o, idx) => {
            let state: 'idle' | 'correct' | 'incorrect' = 'idle';
            if (answered) {
              if (o.correct) state = 'correct';
              else if (idx === selected) state = 'incorrect';
            }
            return <ChoiceButton key={o.label} label={o.label} state={state} disabled={answered} onClick={() => handle(idx)} />;
          })}
        </div>
        {answered && <button className="btn btn-primary mt-4 w-full" onClick={onNext}>Next Swing →</button>}
      </Section>
      {answered && (
        <div className="lg:col-span-2">
          <Callout tone={options[selected].correct ? 'accent' : 'danger'} title={options[selected].correct ? 'Correct' : 'Not the highest-probability zone'}>
            The 50%-61.8% "golden pocket" is the zone professionals watch most closely for a reaction — shallower pullbacks (23.6%) suggest a very strong trend, while deeper ones (78.6%+) start to suggest the swing may be failing rather than just pausing.
          </Callout>
        </div>
      )}
    </div>
  );
}

function useWaveQuestion() {
  return useMemo(() => {
    const scenario = WAVE_SCENARIOS[Math.floor(Math.random() * WAVE_SCENARIOS.length)];
    const nonce = Math.random().toString(36).slice(2);
    const totalBars = 130;
    const fullBars = synthesizeBars(FULL_WAVE_PATH, {
      seed: `wave-${scenario.id}-${nonce}`,
      totalBars,
      basePrice: 60 + Math.random() * 140,
      amplitude: 26 + Math.random() * 16,
      noise: 0.3,
      driftNoise: 0.15,
    });
    const cutIndex = Math.max(4, Math.round(scenario.cutAt * (totalBars - 1)));
    const bars = fullBars.slice(0, cutIndex + 1);
    const markers: MarkerPoint[] = WAVE_LABEL_POINTS.filter((p) => scenario.labelsVisible.includes(p.label)).map((p) => {
      const idx = Math.min(bars.length - 1, Math.round(p.x * (totalBars - 1)));
      const bar = bars[idx];
      const isLow = ['2', '4', 'A', 'C'].includes(p.label);
      return { time: bar.time, position: isLow ? 'belowBar' : 'aboveBar', color: '#f5b642', shape: 'circle', text: p.label };
    });
    const options = shuffle(scenario.options);
    return { scenario, bars, markers, options };
  }, []);
}

function WavePractice() {
  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const stats = getStats('fibonacci');
  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <StatChip label="Attempted" value={stats.attempted} />
        <StatChip label="Correct" value={stats.correct} tone="good" />
        <StatChip label="Best Streak" value={stats.best_streak} />
      </div>
      <WaveQuestion key={tick} selected={selected} setSelected={setSelected} onNext={() => { setSelected(null); setTick((t) => t + 1); }} />
      <div className="mt-4">
        <Section title="Elliott Wave Basics">
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-dim)]">The 5-3 Structure</h3>
              <p>Trends unfold in 5 waves (1-2-3-4-5, with the trend), followed by a 3-wave correction (A-B-C, against the trend). Each of those waves subdivides into smaller 5s and 3s at a lower degree — the pattern is fractal.</p>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-dim)]">Three Hard Rules</h3>
              <ul className="space-y-1.5">
                <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Wave 2 never retraces more than 100% of Wave 1</li>
                <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Wave 3 is never the shortest of waves 1, 3, and 5</li>
                <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Wave 4 doesn't overlap Wave 1's price territory (in most impulses)</li>
              </ul>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function WaveQuestion({ selected, setSelected, onNext }: { selected: number | null; setSelected: (i: number | null) => void; onNext: () => void }) {
  const { scenario, bars, markers, options } = useWaveQuestion();
  const answered = selected !== null;

  const handle = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    recordAnswer('fibonacci', options[idx].correct);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <Section>
        <div className="mb-2 flex items-center gap-2">
          <Badge>{scenario.title}</Badge>
        </div>
        <CandleChart bars={bars} height={400} showVolume={false} markers={markers} />
        <p className="mt-3 text-sm text-[var(--color-text-dim)]">{scenario.setupNote}</p>
      </Section>
      <Section title={scenario.question}>
        <div className="space-y-2">
          {options.map((o, idx) => {
            let state: 'idle' | 'correct' | 'incorrect' = 'idle';
            if (answered) {
              if (o.correct) state = 'correct';
              else if (idx === selected) state = 'incorrect';
            }
            return <ChoiceButton key={o.label} label={o.label} state={state} disabled={answered} onClick={() => handle(idx)} />;
          })}
        </div>
        {answered && <button className="btn btn-primary mt-4 w-full" onClick={onNext}>Next Scenario →</button>}
      </Section>
      {answered && (
        <div className="lg:col-span-2">
          <Callout tone={options[selected].correct ? 'accent' : 'danger'} title={options[selected].correct ? 'Correct' : 'Not the highest-probability read'}>
            {options.find((o) => o.correct)?.rationale}
          </Callout>
          <div className="mt-3">
            <Callout tone="info" title="Rule to remember">{scenario.rule}</Callout>
          </div>
        </div>
      )}
    </div>
  );
}
