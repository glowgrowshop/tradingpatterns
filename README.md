# ChartSchool

An interactive options & futures trading education app: pattern-recognition quizzes, support/resistance drawing practice, EMA/RSI/MACD/Bollinger decision training, Fibonacci & Elliott Wave, a transparent custom "confluence" buy/sell indicator, simulated order flow & dealer gamma exposure, a multi-timeframe measured-move ruler, trading psychology, and guides for trading earnings/news and using AI responsibly.

All charts are generated from **synthetic, seeded data** — this app has no connection to a live market data feed, brokerage, or options chain. It's a flight simulator for the concepts, not a trading terminal.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- [lightweight-charts](https://tradingview.github.io/lightweight-charts/) for candlestick/indicator rendering
- No backend — progress is tracked client-side in `localStorage`

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # typecheck + production build
```

## Project layout

- `src/lib/` — indicator math (EMA/RSI/MACD/Bollinger/ATR/pivots/Fibonacci), synthetic OHLC generators, the composite signal engine, order flow & gamma-exposure simulators, progress tracking
- `src/data/` — quiz question banks (chart patterns, candlestick patterns, EMA/indicator/psychology/order-flow/gamma scenarios, Elliott Wave scenarios)
- `src/components/` — chart wrappers (`CandleChart`, `IndicatorPane`, `GammaChart`, `RulerChart`) and shared UI primitives
- `src/pages/` — one page per module, wired up in `src/App.tsx`

## Disclaimer

Educational content only — not financial advice. Nothing in this app predicts future prices.
