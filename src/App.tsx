import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './pages/Home';
import PatternQuiz from './pages/PatternQuiz';
import SupportResistance from './pages/SupportResistance';
import EmaQuiz from './pages/EmaQuiz';
import IndicatorQuiz from './pages/IndicatorQuiz';
import FibonacciWave from './pages/FibonacciWave';
import SignalTool from './pages/SignalTool';
import OrderFlowGamma from './pages/OrderFlowGamma';
import Psychology from './pages/Psychology';
import EarningsNews from './pages/EarningsNews';
import AiCopilot from './pages/AiCopilot';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-bg)]">
        <Nav />
        <main className="mx-auto max-w-7xl px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patterns" element={<PatternQuiz />} />
            <Route path="/support-resistance" element={<SupportResistance />} />
            <Route path="/ema" element={<EmaQuiz />} />
            <Route path="/indicators" element={<IndicatorQuiz />} />
            <Route path="/fibonacci" element={<FibonacciWave />} />
            <Route path="/signal" element={<SignalTool />} />
            <Route path="/order-flow" element={<OrderFlowGamma />} />
            <Route path="/psychology" element={<Psychology />} />
            <Route path="/earnings-news" element={<EarningsNews />} />
            <Route path="/ai-copilot" element={<AiCopilot />} />
          </Routes>
        </main>
        <footer className="mx-auto max-w-7xl px-4 py-8 text-center text-xs text-[var(--color-text-dim)]">
          Educational content only — not financial advice. Practice charts are synthetically generated to illustrate patterns, not real market data.
        </footer>
      </div>
    </BrowserRouter>
  );
}
