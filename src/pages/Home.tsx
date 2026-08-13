import { Link } from 'react-router-dom';
import { Section, StatChip } from '../components/ui';
import { getAllStats } from '../lib/progress';

interface ModuleCard {
  to: string;
  title: string;
  tag: string;
  blurb: string;
  moduleId?: string;
}

const MODULES: ModuleCard[] = [
  { to: '/patterns', title: 'Pattern Recognition Quiz', tag: 'Charts', blurb: 'Head & shoulders, triangles, flags, wedges, and candlestick signals — freshly generated every question.', moduleId: 'patterns' },
  { to: '/support-resistance', title: 'Draw Support & Resistance', tag: 'Drawing Practice', blurb: 'Click to place your own lines, then score them against algorithmically detected zones.', moduleId: 'support-resistance' },
  { to: '/ema', title: 'EMA Decision Training', tag: 'Trend', blurb: 'Read the 9/21/50 EMA stack and choose the highest-probability move at real decision points.', moduleId: 'ema' },
  { to: '/indicators', title: 'RSI, MACD & Bollinger Quiz', tag: 'Indicators', blurb: 'Practice interpreting momentum and volatility tools the way experienced traders actually use them.', moduleId: 'indicators' },
  { to: '/fibonacci', title: 'Fibonacci & Elliott Wave', tag: 'Structure', blurb: 'Find high-probability retracement zones and practice counting 5-3 wave structures.', moduleId: 'fibonacci' },
  { to: '/signal', title: 'Confluence Signal Tool', tag: 'Custom Indicator', blurb: 'A transparent buy/sell composite indicator you can inspect, factor by factor, on any chart.' },
  { to: '/order-flow', title: 'Order Flow, Gamma & Rulers', tag: 'Advanced', blurb: 'Simulated cumulative delta, dealer gamma exposure by strike, and a multi-timeframe measured-move ruler.', moduleId: 'order-flow' },
  { to: '/psychology', title: 'Trading Psychology', tag: 'Mindset', blurb: 'Risk management, discipline, and physiological state control — modeled on habits of elite traders.', moduleId: 'psychology' },
  { to: '/earnings-news', title: 'Earnings & News Playbook', tag: 'Real-World', blurb: 'IV crush, expected move, defined-risk earnings strategies, and how to trade around news safely.' },
  { to: '/ai-copilot', title: 'AI Copilot Guide', tag: 'Modern Tools', blurb: 'Where AI genuinely helps your trading process — and where it can seriously hurt you.' },
];

export default function Home() {
  const stats = getAllStats();
  const totalAttempted = Object.values(stats).reduce((s, m) => s + m.attempted, 0);
  const totalCorrect = Object.values(stats).reduce((s, m) => s + m.correct, 0);
  const accuracy = totalAttempted ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  return (
    <div>
      <div className="mb-8 rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-panel)] to-[var(--color-panel-2)] p-8">
        <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">Options & Futures Education</div>
        <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)] sm:text-4xl">Learn to Read the Market Like a Professional</h1>
        <p className="mt-3 max-w-2xl text-[var(--color-text-dim)]">
          Interactive, visual practice built around the habits that separate consistently profitable traders from everyone else: disciplined pattern recognition, structured risk management, and probability-based decision-making — not predictions or hot tips.
        </p>
        <div className="mt-5 grid max-w-md grid-cols-3 gap-2">
          <StatChip label="Questions Answered" value={totalAttempted} />
          <StatChip label="Correct" value={totalCorrect} tone="good" />
          <StatChip label="Accuracy" value={`${accuracy}%`} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MODULES.map((m) => {
          const s = m.moduleId ? stats[m.moduleId] : undefined;
          return (
            <Link key={m.to} to={m.to} className="card group flex flex-col p-5 transition-colors hover:border-[var(--color-accent-dim)]">
              <span className="tag mb-3 w-fit border border-[var(--color-border)] bg-[var(--color-panel-2)] text-[var(--color-text-dim)]">{m.tag}</span>
              <h2 className="mb-1.5 text-lg font-semibold text-[var(--color-heading)] group-hover:text-[var(--color-accent)]">{m.title}</h2>
              <p className="flex-1 text-sm text-[var(--color-text-dim)]">{m.blurb}</p>
              {s && s.attempted > 0 && (
                <div className="mt-3 text-xs text-[var(--color-text-dim)]">
                  {s.correct}/{s.attempted} correct · best streak {s.best_streak}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <Section title="How This Curriculum Is Built">
          <p className="text-sm leading-relaxed text-[var(--color-text-dim)]">
            The habits taught throughout this app — small, consistent risk per trade; trading with the trend; treating indicators as probability tools, not commands; obsessive review of your own decisions — are the same principles repeatedly cited by traders who've built and kept significant, multi-generational wealth in the markets. None of it depends on prediction or a secret formula. It's disciplined process, applied consistently, for a long time. Every chart in this app is synthetically generated to teach the shapes and logic behind these ideas — treat it as flight-simulator practice before flying with real capital.
          </p>
        </Section>
      </div>
    </div>
  );
}
