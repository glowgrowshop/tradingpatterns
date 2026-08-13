import { useState } from 'react';
import { PageHeader, Section, ChoiceButton, Callout, StatChip } from '../components/ui';
import { PSYCH_SCENARIOS } from '../data/psychologyScenarios';
import { recordAnswer, getStats } from '../lib/progress';

const CYCLE_STAGES: { label: string; x: number; y: number; tone: 'up' | 'down' | 'mid' }[] = [
  { label: 'Optimism', x: 20, y: 55, tone: 'up' },
  { label: 'Excitement', x: 90, y: 40, tone: 'up' },
  { label: 'Thrill', x: 160, y: 25, tone: 'up' },
  { label: 'Euphoria\n(max risk)', x: 230, y: 10, tone: 'up' },
  { label: 'Anxiety', x: 300, y: 30, tone: 'down' },
  { label: 'Denial', x: 370, y: 45, tone: 'down' },
  { label: 'Panic', x: 440, y: 65, tone: 'down' },
  { label: 'Capitulation', x: 510, y: 85, tone: 'down' },
  { label: 'Despondency\n(max opportunity)', x: 580, y: 95, tone: 'down' },
  { label: 'Depression', x: 650, y: 88, tone: 'mid' },
  { label: 'Hope', x: 720, y: 65, tone: 'up' },
  { label: 'Relief', x: 780, y: 50, tone: 'up' },
];

export default function Psychology() {
  const stats = getStats('psychology');
  return (
    <div>
      <PageHeader
        eyebrow="Trading Psychology"
        title="The Mental Game"
        blurb="Every trader with a long track record says some version of the same thing: strategy gets you to break-even, psychology and risk management get you paid. This is the part most beginners skip."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="What Elite Traders Actually Optimize For">
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span><span><strong className="text-[var(--color-heading)]">Process over outcome.</strong> A well-executed trade that loses is a good trade; a reckless trade that wins is still a bad decision. Grade yourself on adherence to your rules, not on any single P&L.</span></li>
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span><span><strong className="text-[var(--color-heading)]">Fixed, small risk per trade.</strong> Most professionals risk roughly 0.5%-2% of capital per trade — small enough that no single loss (or losing streak) can knock them out of the game.</span></li>
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span><span><strong className="text-[var(--color-heading)]">A written trading plan.</strong> Entry criteria, position size, stop, and target are decided <em>before</em> the trade — not improvised while a position is open and emotions are live.</span></li>
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span><span><strong className="text-[var(--color-heading)]">A trading journal.</strong> Logging every trade with the reasoning, screenshot, and outcome is one of the most consistently cited habits among traders who improve fastest — it turns emotion into data.</span></li>
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span><span><strong className="text-[var(--color-heading)]">Boring consistency.</strong> The traders who compound capital for decades tend to describe their process as repetitive and unglamorous — chasing excitement is usually a tell that ego, not edge, is driving the trade.</span></li>
          </ul>
        </Section>

        <Section title="Managing Your Physiological State ('Energy Psychology')">
          <p className="mb-3 text-sm text-[var(--color-text-dim)]">Trading is a high-stress, high-stimulation activity, and your body's stress response (elevated heart rate, cortisol, tunnel vision) directly degrades decision quality. Many traders borrow simple nervous-system regulation techniques to reset between trades:</p>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span><span><strong className="text-[var(--color-heading)]">Box breathing.</strong> Inhale 4s, hold 4s, exhale 4s, hold 4s. A few rounds after a loss measurably lowers physiological arousal before your next decision.</span></li>
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span><span><strong className="text-[var(--color-heading)]">A physical reset.</strong> Standing up, stepping away from the screen, or a short walk breaks the feedback loop between a red P&L number and your next click.</span></li>
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span><span><strong className="text-[var(--color-heading)]">Tapping / EFT and body-scan techniques.</strong> Some traders use these "energy psychology" style techniques to interrupt a tilt spiral. Evidence for them is mixed and they're not a substitute for risk management — treat them as an optional calming ritual, not a strategy.</span></li>
            <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span><span><strong className="text-[var(--color-heading)]">Pre-defined "stop trading" triggers.</strong> A daily loss limit or a "3 losses = done for the day" rule removes the decision from a moment when you're least equipped to make it well.</span></li>
          </ul>
        </Section>
      </div>

      <div className="mt-4">
        <Section title="The Market Cycle of Emotions">
          <p className="mb-3 text-sm text-[var(--color-text-dim)]">This classic sentiment cycle shows why the crowd is typically most excited near tops and most fearful near bottoms — and why disciplined, contrarian-leaning risk-takers try to buy despondency and trim euphoria rather than the reverse.</p>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 820 120" className="w-full min-w-[700px]" style={{ height: 180 }}>
              <polyline
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="2"
                points={CYCLE_STAGES.map((s) => `${s.x},${s.y}`).join(' ')}
              />
              {CYCLE_STAGES.map((s) => (
                <g key={s.label}>
                  <circle cx={s.x} cy={s.y} r={5} fill={s.tone === 'up' ? '#35d68a' : s.tone === 'down' ? '#ff5d5d' : '#f5b642'} />
                  {s.label.split('\n').map((line, i) => (
                    <text key={line} x={s.x} y={s.y - 12 - i * 12} textAnchor="middle" fontSize="10" fill="var(--color-text-dim)">
                      {line}
                    </text>
                  ))}
                </g>
              ))}
            </svg>
          </div>
        </Section>
      </div>

      <div className="mt-4 mb-4 flex justify-end gap-2">
        <StatChip label="Attempted" value={stats.attempted} />
        <StatChip label="Correct" value={stats.correct} tone="good" />
        <StatChip label="Best Streak" value={stats.best_streak} />
      </div>
      <ScenarioQuiz />
    </div>
  );
}

function ScenarioQuiz() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * PSYCH_SCENARIOS.length));
  const [selected, setSelected] = useState<number | null>(null);
  const scenario = PSYCH_SCENARIOS[index];
  const answered = selected !== null;

  const handle = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    recordAnswer('psychology', scenario.options[idx].correct);
  };

  const next = () => {
    setSelected(null);
    setIndex((i) => (i + 1 + Math.floor(Math.random() * (PSYCH_SCENARIOS.length - 1))) % PSYCH_SCENARIOS.length);
  };

  return (
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
          <Callout tone={scenario.options[selected].correct ? 'accent' : 'danger'} title={scenario.options[selected].correct ? 'Correct' : 'Higher-risk choice'}>
            {scenario.options[selected].rationale}
          </Callout>
          {!scenario.options[selected].correct && (
            <Callout tone="accent" title="The highest-EV response">
              {scenario.options.find((o) => o.correct)?.rationale}
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
