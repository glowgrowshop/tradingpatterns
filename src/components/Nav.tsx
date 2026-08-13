import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/patterns', label: 'Pattern Quiz' },
  { to: '/support-resistance', label: 'Draw S/R' },
  { to: '/ema', label: 'EMA Quiz' },
  { to: '/indicators', label: 'Indicators' },
  { to: '/fibonacci', label: 'Fib & Waves' },
  { to: '/signal', label: 'Signal Tool' },
  { to: '/order-flow', label: 'Flow & Gamma' },
  { to: '/psychology', label: 'Psychology' },
  { to: '/earnings-news', label: 'Earnings & News' },
  { to: '/ai-copilot', label: 'AI Copilot' },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--color-accent)] font-bold text-[#04150c]">C</span>
          <span className="font-semibold text-[var(--color-heading)] hidden sm:inline">ChartSchool</span>
        </NavLink>
        <nav className="flex flex-1 flex-wrap gap-1 overflow-x-auto text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                clsx(
                  'whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--color-panel-2)] text-[var(--color-accent)]'
                    : 'text-[var(--color-text-dim)] hover:text-[var(--color-heading)]',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
