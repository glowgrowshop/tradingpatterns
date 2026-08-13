import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createChart,
  createSeriesMarkers,
  CandlestickSeries,
  type IChartApi,
  type ISeriesApi,
  type ISeriesMarkersPluginApi,
  type IPriceLine,
  type UTCTimestamp,
  type Time,
} from 'lightweight-charts';
import { randomWalkBars } from '../lib/chartData';
import { Section, Callout } from './ui';

export interface Timeframe {
  id: string;
  label: string;
  intervalSec: number;
  totalBars: number;
  timeVisible: boolean;
  secondsVisible: boolean;
}

export const TIMEFRAMES: Timeframe[] = [
  { id: '1m', label: '1m', intervalSec: 60, totalBars: 180, timeVisible: true, secondsVisible: true },
  { id: '5m', label: '5m', intervalSec: 300, totalBars: 160, timeVisible: true, secondsVisible: false },
  { id: '15m', label: '15m', intervalSec: 900, totalBars: 150, timeVisible: true, secondsVisible: false },
  { id: '1H', label: '1H', intervalSec: 3600, totalBars: 140, timeVisible: true, secondsVisible: false },
  { id: '4H', label: '4H', intervalSec: 14400, totalBars: 130, timeVisible: true, secondsVisible: false },
  { id: '1D', label: '1D', intervalSec: 86400, totalBars: 140, timeVisible: false, secondsVisible: false },
  { id: '1W', label: '1W', intervalSec: 604800, totalBars: 104, timeVisible: false, secondsVisible: false },
];

function humanizeDuration(seconds: number): string {
  const abs = Math.abs(seconds);
  const units: [string, number][] = [
    ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60],
  ];
  for (const [name, secs] of units) {
    if (abs >= secs) {
      const n = abs / secs;
      const rounded = Math.round(n * 10) / 10;
      return `${rounded} ${name}${rounded === 1 ? '' : 's'}`;
    }
  }
  return `${Math.round(abs)}s`;
}

interface ClickPoint {
  index: number;
  time: number;
  price: number;
}

export default function RulerChart({ timeframe, round }: { timeframe: Timeframe; round: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const markersRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);
  const priceLinesRef = useRef<IPriceLine[]>([]);
  const [points, setPoints] = useState<ClickPoint[]>([]);

  const bars = useMemo(
    () => randomWalkBars(`ruler-${timeframe.id}-${round}`, timeframe.totalBars, {
      basePrice: 60 + Math.random() * 140,
      amplitude: 18 + Math.random() * 16,
      intervalSec: timeframe.intervalSec,
    }),
    [timeframe, round],
  );

  useEffect(() => {
    setPoints([]);
  }, [bars]);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      height: 440,
      layout: { background: { color: 'transparent' }, textColor: '#7c8797', fontFamily: 'Inter, system-ui, sans-serif', attributionLogo: false },
      grid: { vertLines: { color: '#1a2030' }, horzLines: { color: '#1a2030' } },
      rightPriceScale: { borderColor: '#232939' },
      timeScale: { borderColor: '#232939', timeVisible: timeframe.timeVisible, secondsVisible: timeframe.secondsVisible },
      autoSize: true,
    });
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#35d68a', downColor: '#ff5d5d', borderVisible: false, wickUpColor: '#35d68a', wickDownColor: '#ff5d5d',
    });
    series.setData(bars.map((b) => ({ time: b.time as UTCTimestamp, open: b.open, high: b.high, low: b.low, close: b.close })));
    chart.timeScale().fitContent();
    chartRef.current = chart;
    seriesRef.current = series;
    markersRef.current = createSeriesMarkers(series, []);

    const clickHandler = (param: { point?: { x: number; y: number }; time?: Time; logical?: number }) => {
      if (!param.point || param.time === undefined || param.logical === undefined || !seriesRef.current) return;
      const price = seriesRef.current.coordinateToPrice(param.point.y);
      if (price === null) return;
      setPoints((prev) => {
        if (prev.length >= 3) return [{ index: param.logical as number, time: param.time as number, price }];
        return [...prev, { index: param.logical as number, time: param.time as number, price }];
      });
    };
    chart.subscribeClick(clickHandler);

    return () => {
      chart.unsubscribeClick(clickHandler);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      markersRef.current = null;
      priceLinesRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bars]);

  useEffect(() => {
    const series = seriesRef.current;
    const markers = markersRef.current;
    if (!series || !markers) return;
    priceLinesRef.current.forEach((l) => series.removePriceLine(l));
    priceLinesRef.current = [];

    const labels = ['A', 'B', 'C'];
    markers.setMarkers(
      points.map((p, i) => ({
        time: p.time as UTCTimestamp,
        position: 'inBar' as const,
        color: '#f5b642',
        shape: 'circle' as const,
        text: labels[i],
      })),
    );

    if (points.length >= 1) {
      priceLinesRef.current.push(series.createPriceLine({ price: points[0].price, color: '#7c8797', lineWidth: 1, lineStyle: 3, axisLabelVisible: true, title: 'A' }));
    }
    if (points.length >= 2) {
      priceLinesRef.current.push(series.createPriceLine({ price: points[1].price, color: '#7c8797', lineWidth: 1, lineStyle: 3, axisLabelVisible: true, title: 'B' }));
    }
    if (points.length >= 3) {
      const priceDelta = points[1].price - points[0].price;
      const target = points[2].price + priceDelta;
      priceLinesRef.current.push(series.createPriceLine({ price: target, color: '#4da3ff', lineWidth: 2, lineStyle: 0, axisLabelVisible: true, title: 'Forecast Target' }));
    }
  }, [points]);

  const measurement = useMemo(() => {
    if (points.length < 2) return null;
    const [a, b] = points;
    const priceDelta = b.price - a.price;
    const pct = (priceDelta / a.price) * 100;
    const barDelta = b.index - a.index;
    const timeDelta = b.time - a.time;
    const c = points[2];
    const target = c ? c.price + priceDelta : null;
    return { priceDelta, pct, barDelta, timeDelta, target, c };
  }, [points]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <Section>
        <div ref={containerRef} style={{ width: '100%', height: 440 }} />
        <p className="mt-2 text-xs text-[var(--color-text-dim)]">
          Click 3 points: <strong>A</strong> (start of a move), <strong>B</strong> (end of that move), <strong>C</strong> (where to project the same move from). A 4th click starts a new measurement.
        </p>
      </Section>
      <Section title={`Ruler — ${timeframe.label} timeframe`}>
        {!measurement && <p className="text-sm text-[var(--color-text-dim)]">Click point A, then B, on the chart to measure a move.</p>}
        {measurement && (
          <div className="space-y-3 text-sm">
            <Row label="Measured move" value={`${measurement.priceDelta >= 0 ? '+' : ''}${measurement.priceDelta.toFixed(2)} (${measurement.pct >= 0 ? '+' : ''}${measurement.pct.toFixed(2)}%)`} />
            <Row label="Bars elapsed (A→B)" value={`${Math.abs(measurement.barDelta)}`} />
            <Row label="Time elapsed (A→B)" value={humanizeDuration(measurement.timeDelta)} />
            {measurement.target !== null ? (
              <Row label="Forecast target from C" value={measurement.target.toFixed(2)} accent />
            ) : (
              <p className="text-xs text-[var(--color-text-dim)]">Click a third point (C) on the chart to project this move forward from a new anchor.</p>
            )}
          </div>
        )}
        <div className="mt-4">
          <Callout tone="warn" title="Educational tool">
            This ruler projects a <em>measured move</em> — a classic technique (also behind flag-pole and Fibonacci-extension targets) that assumes a prior swing repeats in magnitude. It is a planning heuristic, not a prediction — always confirm with price action before treating a projected level as a real target.
          </Callout>
        </div>
      </Section>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] px-3 py-2">
      <span className="text-[var(--color-text-dim)]">{label}</span>
      <span className={`font-mono font-bold ${accent ? 'text-[var(--color-accent)]' : 'text-[var(--color-heading)]'}`}>{value}</span>
    </div>
  );
}
