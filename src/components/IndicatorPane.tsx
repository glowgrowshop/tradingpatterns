import { useEffect, useRef } from 'react';
import { createChart, LineSeries, HistogramSeries, type IChartApi, type UTCTimestamp } from 'lightweight-charts';
import type { Bar } from '../lib/indicators';

interface RsiPaneProps {
  kind: 'rsi';
  bars: Bar[];
  values: (number | null)[];
  height?: number;
}

interface MacdPaneProps {
  kind: 'macd';
  bars: Bar[];
  macdLine: (number | null)[];
  signalLine: (number | null)[];
  histogram: (number | null)[];
  height?: number;
}

interface DeltaPaneProps {
  kind: 'delta';
  bars: Bar[];
  delta: number[];
  cumulativeDelta: number[];
  height?: number;
}

type Props = RsiPaneProps | MacdPaneProps | DeltaPaneProps;

export default function IndicatorPane(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart: IChartApi = createChart(containerRef.current, {
      height: props.height ?? 150,
      layout: { background: { color: 'transparent' }, textColor: '#7c8797', fontFamily: 'Inter, system-ui, sans-serif', attributionLogo: false },
      grid: { vertLines: { color: '#1a2030' }, horzLines: { color: '#1a2030' } },
      rightPriceScale: { borderColor: '#232939' },
      timeScale: { borderColor: '#232939', visible: props.kind === 'macd' || props.kind === 'delta' },
      autoSize: true,
      handleScroll: false,
      handleScale: false,
    });

    if (props.kind === 'rsi') {
      const series = chart.addSeries(LineSeries, {
        color: '#a78bfa',
        lineWidth: 2,
        lastValueVisible: true,
        priceLineVisible: false,
        autoscaleInfoProvider: () => ({ priceRange: { minValue: 0, maxValue: 100 } }),
      });
      series.setData(
        props.bars
          .map((b, i) => ({ time: b.time as UTCTimestamp, value: props.values[i] }))
          .filter((d): d is { time: UTCTimestamp; value: number } => d.value !== null),
      );
      series.createPriceLine({ price: 70, color: '#ff5d5d', lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: 'Overbought 70' });
      series.createPriceLine({ price: 30, color: '#35d68a', lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: 'Oversold 30' });
      const rsiScale = chart.priceScale('right');
      rsiScale.applyOptions({ scaleMargins: { top: 0.05, bottom: 0.05 } });
      rsiScale.setAutoScale(false);
      rsiScale.setVisibleRange({ from: 0, to: 100 });
    } else if (props.kind === 'macd') {
      const histSeries = chart.addSeries(HistogramSeries, { priceLineVisible: false, lastValueVisible: false });
      histSeries.setData(
        props.bars.map((b, i) => ({
          time: b.time as UTCTimestamp,
          value: props.histogram[i] ?? 0,
          color: (props.histogram[i] ?? 0) >= 0 ? 'rgba(53,214,138,0.7)' : 'rgba(255,93,93,0.7)',
        })),
      );
      const macdSeries = chart.addSeries(LineSeries, { color: '#4da3ff', lineWidth: 2, lastValueVisible: false, priceLineVisible: false });
      macdSeries.setData(
        props.bars
          .map((b, i) => ({ time: b.time as UTCTimestamp, value: props.macdLine[i] }))
          .filter((d): d is { time: UTCTimestamp; value: number } => d.value !== null),
      );
      const signalSeries = chart.addSeries(LineSeries, { color: '#f5b642', lineWidth: 2, lastValueVisible: false, priceLineVisible: false });
      signalSeries.setData(
        props.bars
          .map((b, i) => ({ time: b.time as UTCTimestamp, value: props.signalLine[i] }))
          .filter((d): d is { time: UTCTimestamp; value: number } => d.value !== null),
      );
    } else if (props.kind === 'delta') {
      const deltaSeries = chart.addSeries(HistogramSeries, {
        priceLineVisible: false,
        lastValueVisible: false,
        priceScaleId: 'delta',
        priceFormat: { type: 'volume' },
      });
      deltaSeries.priceScale().applyOptions({ scaleMargins: { top: 0.1, bottom: 0.55 } });
      deltaSeries.setData(
        props.bars.map((b, i) => ({
          time: b.time as UTCTimestamp,
          value: props.delta[i],
          color: props.delta[i] >= 0 ? 'rgba(53,214,138,0.7)' : 'rgba(255,93,93,0.7)',
        })),
      );
      const cvdSeries = chart.addSeries(LineSeries, {
        color: '#4da3ff',
        lineWidth: 2,
        lastValueVisible: true,
        priceLineVisible: false,
        priceScaleId: 'cvd',
        priceFormat: { type: 'volume' },
      });
      cvdSeries.priceScale().applyOptions({ scaleMargins: { top: 0.55, bottom: 0.05 } });
      cvdSeries.setData(props.bars.map((b, i) => ({ time: b.time as UTCTimestamp, value: props.cumulativeDelta[i] })));
    }

    chart.timeScale().fitContent();
    return () => chart.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.bars]);

  return <div ref={containerRef} style={{ width: '100%', height: props.height ?? 150 }} />;
}
