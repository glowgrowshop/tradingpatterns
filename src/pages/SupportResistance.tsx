import { useEffect, useMemo, useRef, useState } from 'react';
import { createChart, CandlestickSeries, type IChartApi, type ISeriesApi, type IPriceLine, type UTCTimestamp } from 'lightweight-charts';
import { PageHeader, Section, Callout, StatChip, Badge } from '../components/ui';
import { randomWalkBars } from '../lib/chartData';
import { findPivots, clusterZones, type SrZone } from '../lib/indicators';
import { recordAnswer, getStats } from '../lib/progress';

interface UserLine {
  id: number;
  price: number;
}

export default function SupportResistance() {
  const [round, setRound] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const userPriceLinesRef = useRef<Map<number, IPriceLine>>(new Map());
  const zonePriceLinesRef = useRef<IPriceLine[]>([]);
  const nextIdRef = useRef(1);

  const [userLines, setUserLines] = useState<UserLine[]>([]);
  const [checked, setChecked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [result, setResult] = useState<{ hits: SrZone[]; misses: SrZone[]; precision: number } | null>(null);
  const stats = getStats('support-resistance');

  const bars = useMemo(() => randomWalkBars(`sr-round-${round}`, 150, { basePrice: 90 + Math.random() * 100, amplitude: 26 + Math.random() * 14 }), [round]);
  const trueZones = useMemo(() => {
    const pivots = findPivots(bars, 4);
    return clusterZones(pivots, 0.008).slice(0, 6);
  }, [bars]);

  useEffect(() => {
    setUserLines([]);
    setChecked(false);
    setShowAnswer(false);
    setResult(null);
  }, [round]);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      height: 460,
      layout: { background: { color: 'transparent' }, textColor: '#7c8797', fontFamily: 'Inter, system-ui, sans-serif', attributionLogo: false },
      grid: { vertLines: { color: '#1a2030' }, horzLines: { color: '#1a2030' } },
      rightPriceScale: { borderColor: '#232939' },
      timeScale: { borderColor: '#232939' },
      autoSize: true,
    });
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#35d68a', downColor: '#ff5d5d', borderVisible: false, wickUpColor: '#35d68a', wickDownColor: '#ff5d5d',
    });
    series.setData(bars.map((b) => ({ time: b.time as UTCTimestamp, open: b.open, high: b.high, low: b.low, close: b.close })));
    chart.timeScale().fitContent();
    chartRef.current = chart;
    seriesRef.current = series;

    const clickHandler = (param: { point?: { x: number; y: number } }) => {
      if (!param.point || !seriesRef.current) return;
      const price = seriesRef.current.coordinateToPrice(param.point.y);
      if (price === null) return;
      setUserLines((prev) => {
        if (prev.length >= 6) return prev;
        return [...prev, { id: nextIdRef.current++, price: Math.round(price * 100) / 100 }];
      });
    };
    chart.subscribeClick(clickHandler);

    return () => {
      chart.unsubscribeClick(clickHandler);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      userPriceLinesRef.current.clear();
      zonePriceLinesRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bars]);

  // sync user lines to chart
  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    userPriceLinesRef.current.forEach((line) => series.removePriceLine(line));
    userPriceLinesRef.current.clear();
    userLines.forEach((ul) => {
      const color = checked && result
        ? (result.hits.some((z) => Math.abs(z.price - ul.price) / ul.price < 0.012) ? '#35d68a' : '#ff5d5d')
        : '#4da3ff';
      const line = series.createPriceLine({ price: ul.price, color, lineWidth: 2, lineStyle: 0, axisLabelVisible: true, title: `You: ${ul.price.toFixed(2)}` });
      userPriceLinesRef.current.set(ul.id, line);
    });
  }, [userLines, checked, result]);

  // sync answer-key zone lines
  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    zonePriceLinesRef.current.forEach((l) => series.removePriceLine(l));
    zonePriceLinesRef.current = [];
    if (showAnswer) {
      trueZones.forEach((z) => {
        const line = series.createPriceLine({
          price: z.price,
          color: z.type === 'support' ? 'rgba(53,214,138,0.55)' : 'rgba(255,93,93,0.55)',
          lineWidth: 1,
          lineStyle: 2,
          axisLabelVisible: true,
          title: `${z.type === 'support' ? 'S' : 'R'} x${z.strength}`,
        });
        zonePriceLinesRef.current.push(line);
      });
    }
  }, [showAnswer, trueZones]);

  const checkAnswers = () => {
    const tolerance = 0.012;
    const hits: SrZone[] = [];
    const misses: SrZone[] = [];
    trueZones.forEach((z) => {
      const matched = userLines.some((ul) => Math.abs(ul.price - z.price) / z.price < tolerance);
      if (matched) hits.push(z);
      else misses.push(z);
    });
    const correctUserLines = userLines.filter((ul) => trueZones.some((z) => Math.abs(ul.price - z.price) / z.price < tolerance)).length;
    const precision = userLines.length ? correctUserLines / userLines.length : 0;
    setResult({ hits, misses, precision });
    setChecked(true);
    setShowAnswer(true);
    const passed = trueZones.length > 0 && hits.length / trueZones.length >= 0.5;
    recordAnswer('support-resistance', passed);
  };

  const removeLine = (id: number) => setUserLines((prev) => prev.filter((l) => l.id !== id));
  const clearLines = () => setUserLines([]);

  return (
    <div>
      <PageHeader
        eyebrow="Drawing Practice"
        title="Draw Support & Resistance"
        blurb="Click directly on the chart to drop a horizontal line where you think price will react. Place up to 6 lines, then check them against the algorithmically detected zones (price levels tested at least twice)."
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button className="btn" onClick={() => setRound((r) => r + 1)}>New Chart</button>
          <button className="btn" onClick={clearLines} disabled={userLines.length === 0}>Clear Lines</button>
          <button className="btn btn-primary" onClick={checkAnswers} disabled={userLines.length === 0 || checked}>Check My Lines</button>
          <button className="btn" onClick={() => setShowAnswer((s) => !s)}>{showAnswer ? 'Hide' : 'Show'} Answer Key</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <StatChip label="Attempted" value={stats.attempted} />
          <StatChip label="Passed" value={stats.correct} tone="good" />
          <StatChip label="Best Streak" value={stats.best_streak} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <Section>
          <div ref={containerRef} style={{ width: '100%', height: 460 }} />
          <p className="mt-2 text-xs text-[var(--color-text-dim)]">Click anywhere on the chart to place a line at that price. {userLines.length}/6 placed.</p>
        </Section>
        <Section title="Your Lines">
          {userLines.length === 0 && <p className="text-sm text-[var(--color-text-dim)]">No lines yet — click the chart.</p>}
          <ul className="space-y-2">
            {userLines.map((l) => (
              <li key={l.id} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm">
                <span className="font-mono">{l.price.toFixed(2)}</span>
                <button className="text-xs text-[var(--color-text-dim)] hover:text-[var(--color-danger)]" onClick={() => removeLine(l.id)}>remove</button>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {checked && result && (
        <div className="mt-4 grid gap-4">
          <Callout tone={result.hits.length / Math.max(1, trueZones.length) >= 0.5 ? 'accent' : 'warn'} title={`You found ${result.hits.length} of ${trueZones.length} key zones`}>
            Precision (of your lines that mattered): {(result.precision * 100).toFixed(0)}%. Zones are ranked by how many times price actually reversed near that level — real support/resistance is about repeated reaction, not a single touch.
          </Callout>
          <Section title="How Support & Resistance Zones Are Actually Found">
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-dim)]">What to look for</h3>
                <ul className="space-y-1.5">
                  <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Swing highs/lows where price reversed <strong>more than once</strong> at a similar level</li>
                  <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Round numbers and prior gap levels often cluster with technical zones</li>
                  <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>A broken resistance level frequently becomes new support (and vice versa) — a "polarity flip"</li>
                  <li className="flex gap-2"><span className="text-[var(--color-accent)]">•</span>Treat levels as <strong>zones</strong>, not exact prices — give them room</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-dim)]">Zones on this chart</h3>
                <ul className="space-y-1.5">
                  {trueZones.map((z) => (
                    <li key={z.price} className="flex items-center gap-2">
                      <Badge tone={z.type === 'support' ? 'bullish' : 'bearish'}>{z.type}</Badge>
                      <span className="font-mono">{z.price.toFixed(2)}</span>
                      <span className="text-[var(--color-text-dim)]">touched {z.strength}x</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
