import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-neutral-200 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Glow central */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-violet-500/5 via-violet-500/2 to-transparent blur-[150px] opacity-[0.06]" />
        
        {/* Texture grain */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      <div className="relative z-10 max-w-4xl space-y-12 w-full">
        
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight leading-[1.1]">
            Ton business d'expertise <span className="text-violet-400">survit en 2026</span> ?
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 font-light max-w-2xl mx-auto">
            7 questions. 2 minutes. Un diagnostic chirurgical de ta position sur la Matrice.
          </p>
        </div>

        <div className="pt-4 flex flex-col items-center gap-6">
          <Link 
            href="/quiz"
            className="group relative inline-flex items-center justify-center px-10 py-5 font-semibold text-white text-lg rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-violet-500/10 bg-neutral-900 border border-violet-500/40 hover:bg-violet-600/20 hover:border-violet-500/60"
          >
            <span className="relative z-10 flex items-center gap-2">
              Passer le diagnostic 
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </Link>
          
          <Link 
            href="/retrouver"
            className="text-neutral-500 hover:text-violet-400 text-sm font-medium transition-colors"
          >
            J'ai déjà passé le test, retrouver mon résultat →
          </Link>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent my-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1 */}
          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-violet-500/30 hover:bg-white/8 overflow-hidden">
            <div className="absolute -inset-2 bg-violet-500/0 group-hover:bg-violet-500/5 blur-xl transition-colors duration-500 pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center border border-violet-500/20">
                <svg className="w-5 h-5 text-violet-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-display font-medium text-white text-lg">Ta position sur la Matrice</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Information, Transformation ou Certitude — tu vois exactement où tu es.</p>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-violet-500/30 hover:bg-white/8 overflow-hidden">
            <div className="absolute -inset-2 bg-violet-500/0 group-hover:bg-violet-500/5 blur-xl transition-colors duration-500 pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center border border-violet-500/20">
                <svg className="w-5 h-5 text-violet-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-display font-medium text-white text-lg">Score de Certitude</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Proximité au revenu, vitesse, fiabilité — tes 3 variables passées au scanner.</p>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-violet-500/30 hover:bg-white/8 overflow-hidden">
            <div className="absolute -inset-2 bg-violet-500/0 group-hover:bg-violet-500/5 blur-xl transition-colors duration-500 pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center border border-violet-500/20">
                <svg className="w-5 h-5 text-violet-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-display font-medium text-white text-lg">Tes 2 Moves</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Un Move Commando pour cette semaine. Un Move Builder pour ce mois. Générés par l'IA.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
