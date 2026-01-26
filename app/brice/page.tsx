import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Résumé - Brice × Mehdi',
  robots: {
    index: false,
    follow: false,
  },
}

export default function BricePage() {
  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
          background-color: #FAF9F6;
          color: #2D2A26;
          line-height: 1.6;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        body::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.03;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
          z-index: -1;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.4;
          z-index: 0;
        }

        .blob-1 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #EDE9FE 0%, #FDEBD0 100%);
          top: -100px;
          right: -50px;
        }

        .blob-2 {
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, #D1FAE5 0%, #DBEAFE 100%);
          bottom: 100px;
          left: -80px;
        }

        .blob-3 {
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #FEF3C7 0%, #FDEBD0 100%);
          top: 40%;
          right: -60px;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 60px 40px;
          position: relative;
          z-index: 1;
        }

        .header {
          margin-bottom: 48px;
        }

        .eyebrow {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #9B8F85;
          margin-bottom: 12px;
        }

        h1 {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 42px;
          font-weight: 400;
          letter-spacing: -0.5px;
          line-height: 1.1;
          color: #2D2A26;
          margin-bottom: 16px;
        }

        .subtitle {
          font-size: 16px;
          color: #6B6560;
        }

        .section {
          margin-bottom: 40px;
        }

        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #9B8F85;
          margin-bottom: 16px;
        }

        .section-label::before {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .section-label.situation::before { background: #E8E4DF; }
        .section-label.objectif::before { background: #D1FAE5; }
        .section-label.leviers::before { background: #EDE9FE; }
        .section-label.next::before { background: #FEF3C7; }

        h2 {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 28px;
          font-weight: 400;
          line-height: 1.2;
          margin-bottom: 20px;
          color: #2D2A26;
        }

        .card {
          background: white;
          border-radius: 20px;
          padding: 28px 32px;
          box-shadow: 0 4px 40px rgba(45, 42, 38, 0.05);
          margin-bottom: 16px;
        }

        .funnels-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .funnel-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 40px rgba(45, 42, 38, 0.05);
        }

        .funnel-header {
          padding: 14px 20px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .funnel-header.ads {
          background: #DBEAFE;
          color: #2D2A26;
        }

        .funnel-header.organic {
          background: #D1FAE5;
          color: #2D2A26;
        }

        .funnel-content {
          padding: 20px;
        }

        .funnel-flow {
          font-size: 14px;
          color: #2D2A26;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .funnel-metric {
          font-size: 13px;
          color: #6B6560;
        }

        .facts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 32px;
        }

        .fact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .fact-icon {
          font-size: 20px;
          line-height: 1;
        }

        .fact-item > div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .fact-label {
          color: #9B8F85;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .fact-value {
          font-weight: 500;
          color: #2D2A26;
          font-size: 14px;
        }

        .leviers-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .levier-item {
          background: white;
          border-radius: 16px;
          padding: 24px 28px;
          box-shadow: 0 4px 40px rgba(45, 42, 38, 0.05);
          display: flex;
          align-items: flex-start;
          gap: 20px;
        }

        .levier-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .levier-icon.qual { background: #DBEAFE; }
        .levier-icon.setting { background: #D1FAE5; }
        .levier-icon.tracking { background: #EDE9FE; }
        .levier-icon.youtube { background: #FDEBD0; }
        .levier-icon.ltv { background: #FEF3C7; }

        .levier-content h3 {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: #2D2A26;
          margin-bottom: 6px;
        }

        .levier-content p {
          font-size: 14px;
          color: #6B6560;
          line-height: 1.5;
        }

        .card p {
          color: #6B6560;
          font-size: 15px;
          line-height: 1.7;
        }

        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 24px;
        }

        .signature {
          font-size: 14px;
          color: #9B8F85;
        }

        .signature strong {
          color: #2D2A26;
          font-weight: 500;
        }

        @media (max-width: 600px) {
          .funnels-grid, .facts-grid {
            grid-template-columns: 1fr;
          }
          h1 {
            font-size: 32px;
          }
          .container {
            padding: 40px 24px;
          }
        }
      `}</style>

      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="container">
        <header className="header">
          <p className="eyebrow">Brice × Mehdi</p>
          <h1>Résumé de notre échange</h1>
          <p className="subtitle">Voici ce que j&apos;ai compris de notre discussion.</p>
        </header>

        <section className="section">
          <p className="section-label situation">Ta situation</p>
          
          <div className="funnels-grid">
            <div className="funnel-card">
              <div className="funnel-header ads">📢 Funnel Ads</div>
              <div className="funnel-content">
                <p className="funnel-flow">Pub → VSL → R1 → R2 → Close</p>
                <p className="funnel-metric">CAC ~1200€</p>
              </div>
            </div>
            <div className="funnel-card">
              <div className="funnel-header organic">💬 Funnel Organique</div>
              <div className="funnel-content">
                <p className="funnel-flow">LinkedIn/MP → Lead magnet → R1 → R2 → Close</p>
                <p className="funnel-metric">300 leads non triés (Folk CRM)</p>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="facts-grid">
              <div className="fact-item">
                <span className="fact-icon">💰</span>
                <div>
                  <span className="fact-label">CA actuel</span>
                  <span className="fact-value">10-15k€/mois</span>
                </div>
              </div>
              <div className="fact-item">
                <span className="fact-icon">🎁</span>
                <div>
                  <span className="fact-label">Offre</span>
                  <span className="fact-value">3 500€ / 6 mois + 1 200€/mois après</span>
                </div>
              </div>
              <div className="fact-item">
                <span className="fact-icon">👥</span>
                <div>
                  <span className="fact-label">Capacité</span>
                  <span className="fact-value">10 nouveaux clients/mois max</span>
                </div>
              </div>
              <div className="fact-item">
                <span className="fact-icon">📈</span>
                <div>
                  <span className="fact-label">Ratios</span>
                  <span className="fact-value">70% R1→R2 · 35% close R2</span>
                </div>
              </div>
              <div className="fact-item">
                <span className="fact-icon">🔄</span>
                <div>
                  <span className="fact-label">Continuité</span>
                  <span className="fact-value">70% take rate</span>
                </div>
              </div>
              <div className="fact-item">
                <span className="fact-icon">🎯</span>
                <div>
                  <span className="fact-label">Orga</span>
                  <span className="fact-value">Brice fait tout (R1, R2, accompagnement)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ marginTop: '32px' }}>
          <p className="section-label objectif">Ton objectif</p>
          <div className="card">
            <p style={{ fontSize: '18px', fontWeight: 500, color: '#2D2A26', marginBottom: '12px' }}>30-35k€/mois d&apos;ici 6 mois.</p>
            <p>Pour y arriver : plus de monde en R1, mais qualifié. Structurer l&apos;acquisition. Puis créer un écosystème qui peut scaler sans que tout repose sur toi.</p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: '40px' }}>
          <p className="section-label leviers">Les leviers que je vois</p>
          <div className="leviers-grid">
            <div className="levier-item">
              <div className="levier-icon qual">🎯</div>
              <div className="levier-content">
                <h3>Qualification des R1</h3>
                <p>Améliorer la qualité des leads sur les 2 funnels. Optimiser qui voit la VSL. Mettre les bonnes personnes en R1.</p>
              </div>
            </div>
            <div className="levier-item">
              <div className="levier-icon setting">⚙️</div>
              <div className="levier-content">
                <h3>Structuration du setting</h3>
                <p>Pour que le setter fonctionne vraiment. Sinon c&apos;est de l&apos;argent brûlé.</p>
              </div>
            </div>
            <div className="levier-item">
              <div className="levier-icon tracking">📊</div>
              <div className="levier-content">
                <h3>Tracking & RevOps</h3>
                <p>Dashboard centralisé et automatisé. Tracking contenu organique + funnel ads. Voir d&apos;un coup d&apos;œil ce qui convertit le mieux.</p>
              </div>
            </div>
            <div className="levier-item">
              <div className="levier-icon youtube">▶️</div>
              <div className="levier-content">
                <h3>Stratégie YouTube</h3>
                <p>Du contenu rapide qui qualifie. Pas chronophage. Style Mathis Clouet.</p>
              </div>
            </div>
            <div className="levier-item">
              <div className="levier-icon ltv">🔒</div>
              <div className="levier-content">
                <h3>LTV & rétention (phase 2)</h3>
                <p>Des idées pour locker les clients plus longtemps. Mini-outils, SaaS léger.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ marginTop: '40px' }}>
          <p className="section-label next">Next step</p>
          <div className="card">
            <p style={{ textAlign: 'center', fontSize: '16px', color: '#2D2A26' }}>Un audit de 60 min pour creuser et prioriser ensemble.</p>
          </div>
        </section>

        <footer className="footer">
          <p className="signature">— <strong>Mehdi</strong></p>
        </footer>
      </div>
    </>
  )
}
