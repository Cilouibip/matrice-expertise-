import { motion } from 'motion/react';
import HeaderBlock from './components/HeaderBlock';
import MatrixBlock from './components/MatrixBlock';
import ScoreBlock from './components/ScoreBlock';
import DiagnosticBlock from './components/DiagnosticBlock';
import MovesBlock from './components/MovesBlock';
import MoatBlock from './components/MoatBlock';
import CtaBlock from './components/CtaBlock';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 font-sans selection:bg-red-500/30">
      {/* Background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-900/10 blur-[120px] rounded-full opacity-50" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-24 space-y-32">
        <HeaderBlock />
        <MatrixBlock />
        <ScoreBlock />
        <DiagnosticBlock />
        <MovesBlock />
        <MoatBlock />
        <CtaBlock />
      </main>
    </div>
  );
}
