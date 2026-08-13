import type { ReactNode } from 'react';
import clsx from 'clsx';

export function PageHeader({ eyebrow, title, blurb }: { eyebrow: string; title: string; blurb?: string }) {
  return (
    <div className="mb-6">
      <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">{eyebrow}</div>
      <h1 className="mt-1 text-2xl font-bold text-[var(--color-heading)] sm:text-3xl">{title}</h1>
      {blurb && <p className="mt-2 max-w-3xl text-[var(--color-text-dim)]">{blurb}</p>}
    </div>
  );
}

export function Callout({ tone = 'info', title, children }: { tone?: 'info' | 'warn' | 'danger' | 'accent'; title?: string; children: ReactNode }) {
  const toneMap = {
    info: 'border-[var(--color-info)]/40 bg-[var(--color-info)]/10 text-[var(--color-info)]',
    warn: 'border-[var(--color-warn)]/40 bg-[var(--color-warn)]/10 text-[var(--color-warn)]',
    danger: 'border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 text-[var(--color-danger)]',
    accent: 'border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)]',
  } as const;
  return (
    <div className={clsx('rounded-xl border px-4 py-3 text-sm', toneMap[tone])}>
      {title && <div className="mb-1 font-bold">{title}</div>}
      <div className="text-[var(--color-text)]">{children}</div>
    </div>
  );
}

export function ChoiceButton({
  label,
  onClick,
  state,
  disabled,
}: {
  label: string;
  onClick: () => void;
  state: 'idle' | 'correct' | 'incorrect' | 'reveal-correct';
  disabled?: boolean;
}) {
  const stateClasses = {
    idle: 'border-[var(--color-border)] hover:border-[var(--color-accent-dim)] bg-[var(--color-panel-2)]',
    correct: 'border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-[var(--color-accent)]',
    incorrect: 'border-[var(--color-danger)] bg-[var(--color-danger)]/15 text-[var(--color-danger)]',
    'reveal-correct': 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]',
  } as const;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors disabled:cursor-default',
        stateClasses[state],
      )}
    >
      {label}
    </button>
  );
}

export function StatChip({ label, value, tone = 'default' }: { label: string; value: string | number; tone?: 'default' | 'good' | 'bad' }) {
  const toneClass = tone === 'good' ? 'text-[var(--color-accent)]' : tone === 'bad' ? 'text-[var(--color-danger)]' : 'text-[var(--color-heading)]';
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] px-3 py-2 text-center">
      <div className={clsx('text-lg font-bold', toneClass)}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-[var(--color-text-dim)]">{label}</div>
    </div>
  );
}

export function Badge({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'bullish' | 'bearish' | 'neutral' }) {
  const toneClass = {
    default: 'bg-[var(--color-panel-2)] text-[var(--color-text-dim)] border-[var(--color-border)]',
    bullish: 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border-[var(--color-accent)]/40',
    bearish: 'bg-[var(--color-danger)]/15 text-[var(--color-danger)] border-[var(--color-danger)]/40',
    neutral: 'bg-[var(--color-warn)]/15 text-[var(--color-warn)] border-[var(--color-warn)]/40',
  }[tone];
  return <span className={clsx('tag border', toneClass)}>{children}</span>;
}

export function Section({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={clsx('card p-5', className)}>
      {title && <h2 className="mb-3 text-lg font-semibold text-[var(--color-heading)]">{title}</h2>}
      {children}
    </section>
  );
}
