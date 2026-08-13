export type ModuleId =
  | 'patterns'
  | 'support-resistance'
  | 'ema'
  | 'indicators'
  | 'psychology'
  | 'fibonacci'
  | 'order-flow'
  | 'gamma';

interface ModuleStats {
  correct: number;
  attempted: number;
  best_streak: number;
  cur_streak: number;
}

interface ProgressState {
  modules: Record<string, ModuleStats>;
}

const KEY = 'chartschool_progress_v1';

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { modules: {} };
}

function save(state: ProgressState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function recordAnswer(moduleId: ModuleId, correct: boolean) {
  const state = load();
  const m = state.modules[moduleId] ?? { correct: 0, attempted: 0, best_streak: 0, cur_streak: 0 };
  m.attempted += 1;
  if (correct) {
    m.correct += 1;
    m.cur_streak += 1;
    m.best_streak = Math.max(m.best_streak, m.cur_streak);
  } else {
    m.cur_streak = 0;
  }
  state.modules[moduleId] = m;
  save(state);
  return m;
}

export function getStats(moduleId: ModuleId): ModuleStats {
  const state = load();
  return state.modules[moduleId] ?? { correct: 0, attempted: 0, best_streak: 0, cur_streak: 0 };
}

export function getAllStats(): Record<string, ModuleStats> {
  return load().modules;
}

export function resetProgress() {
  save({ modules: {} });
}
