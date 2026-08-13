import { useEffect, useRef } from 'react';
import {
  createChart,
  createSeriesMarkers,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts';
import type { Bar } from '../lib/indicators';

export interface LineOverlay {
  data: (number | null)[];
  color: string;
  lineWidth?: 1 | 2 | 3 | 4;
  title?: string;
}

export interface MarkerPoint {
  time: number;
  position: 'aboveBar' | 'belowBar' | 'inBar';
  color: string;
  shape: 'arrowUp' | 'arrowDown' | 'circle' | 'square';
  text?: string;
}

export interface HorizontalLine {
  price: number;
  color: string;
  title?: string;
  lineStyle?: 0 | 1 | 2 | 3;
}

interface CandleChartProps {
  bars: Bar[];
  height?: number;
  overlays?: LineOverlay[];
  showVolume?: boolean;
  horizontalLines?: HorizontalLine[];
  markers?: MarkerPoint[];
  className?: string;
  onReady?: (chart: IChartApi, series: ISeriesApi<'Candlestick'>) => void;
}

export default function CandleChart({
  bars,
  height = 360,
  overlays = [],
  showVolume = true,
  horizontalLines = [],
  markers = [],
  className,
  onReady,
}: CandleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#7c8797',
        fontFamily: 'Inter, system-ui, sans-serif',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: '#1a2030' },
        horzLines: { color: '#1a2030' },
      },
      rightPriceScale: { borderColor: '#232939' },
      timeScale: { borderColor: '#232939', timeVisible: false },
      crosshair: { mode: 0 },
      autoSize: true,
    });
    chartRef.current = chart;

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#35d68a',
      downColor: '#ff5d5d',
      borderVisible: false,
      wickUpColor: '#35d68a',
      wickDownColor: '#ff5d5d',
    });
    candleSeries.setData(
      bars.map((b) => ({
        time: b.time as UTCTimestamp,
        open: b.open,
        high: b.high,
        low: b.low,
        close: b.close,
      })),
    );

    if (showVolume) {
      const volSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: 'vol',
        color: '#2a3244',
      });
      volSeries.priceScale().applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });
      volSeries.setData(
        bars.map((b, i) => ({
          time: b.time as UTCTimestamp,
          value: b.volume,
          color: b.close >= (bars[i - 1]?.close ?? b.open) ? 'rgba(53,214,138,0.5)' : 'rgba(255,93,93,0.5)',
        })),
      );
    }

    overlays.forEach((ov) => {
      const line = chart.addSeries(LineSeries, {
        color: ov.color,
        lineWidth: ov.lineWidth ?? 2,
        title: ov.title,
        lastValueVisible: false,
        priceLineVisible: false,
      });
      line.setData(
        bars
          .map((b, i) => ({ time: b.time as UTCTimestamp, value: ov.data[i] }))
          .filter((d): d is { time: UTCTimestamp; value: number } => d.value !== null && d.value !== undefined),
      );
    });

    horizontalLines.forEach((hl) => {
      candleSeries.createPriceLine({
        price: hl.price,
        color: hl.color,
        lineWidth: 2,
        lineStyle: hl.lineStyle ?? 2,
        axisLabelVisible: true,
        title: hl.title ?? '',
      });
    });

    if (markers.length) {
      createSeriesMarkers(
        candleSeries,
        markers.map((m) => ({ time: m.time as UTCTimestamp, position: m.position, color: m.color, shape: m.shape, text: m.text })),
      );
    }

    chart.timeScale().fitContent();
    onReady?.(chart, candleSeries);

    return () => {
      chart.remove();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bars]);

  return <div ref={containerRef} className={className} style={{ width: '100%', height }} />;
}
