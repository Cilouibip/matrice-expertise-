'use client'

import styles from './brice.module.css'

export default function BricePage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={`${styles.blob} ${styles.blob1}`}></div>
      <div className={`${styles.blob} ${styles.blob2}`}></div>
      <div className={`${styles.blob} ${styles.blob3}`}></div>

      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Brice × Mehdi</p>
          <h1 className={styles.title}>Résumé de notre échange</h1>
          <p className={styles.subtitle}>Voici ce que j&apos;ai compris de notre discussion.</p>
        </header>

        <section className={styles.section}>
          <p className={`${styles.sectionLabel} ${styles.situation}`}>Ta situation</p>
          
          <div className={styles.funnelsGrid}>
            <div className={styles.funnelCard}>
              <div className={`${styles.funnelHeader} ${styles.ads}`}>📢 Funnel Ads</div>
              <div className={styles.funnelContent}>
                <p className={styles.funnelFlow}>Pub → VSL → R1 → R2 → Close</p>
                <p className={styles.funnelMetric}>CAC ~1200€</p>
              </div>
            </div>
            <div className={styles.funnelCard}>
              <div className={`${styles.funnelHeader} ${styles.organic}`}>💬 Funnel Organique</div>
              <div className={styles.funnelContent}>
                <p className={styles.funnelFlow}>LinkedIn/MP → Lead magnet → R1 → R2 → Close</p>
                <p className={styles.funnelMetric}>300 leads non triés (Folk CRM)</p>
              </div>
            </div>
          </div>

          <div className={styles.card} style={{ marginTop: '20px' }}>
            <div className={styles.factsGrid}>
              <div className={styles.factItem}>
                <span className={styles.factIcon}>💰</span>
                <div className={styles.factContent}>
                  <span className={styles.factLabel}>CA actuel</span>
                  <span className={styles.factValue}>10-15k€/mois</span>
                </div>
              </div>
              <div className={styles.factItem}>
                <span className={styles.factIcon}>🎁</span>
                <div className={styles.factContent}>
                  <span className={styles.factLabel}>Offre</span>
                  <span className={styles.factValue}>3 500€ / 6 mois + 1 200€/mois après</span>
                </div>
              </div>
              <div className={styles.factItem}>
                <span className={styles.factIcon}>👥</span>
                <div className={styles.factContent}>
                  <span className={styles.factLabel}>Capacité</span>
                  <span className={styles.factValue}>10 nouveaux clients/mois max</span>
                </div>
              </div>
              <div className={styles.factItem}>
                <span className={styles.factIcon}>📈</span>
                <div className={styles.factContent}>
                  <span className={styles.factLabel}>Ratios</span>
                  <span className={styles.factValue}>70% R1→R2 · 35% close R2</span>
                </div>
              </div>
              <div className={styles.factItem}>
                <span className={styles.factIcon}>🔄</span>
                <div className={styles.factContent}>
                  <span className={styles.factLabel}>Continuité</span>
                  <span className={styles.factValue}>70% take rate</span>
                </div>
              </div>
              <div className={styles.factItem}>
                <span className={styles.factIcon}>🎯</span>
                <div className={styles.factContent}>
                  <span className={styles.factLabel}>Orga</span>
                  <span className={styles.factValue}>Brice fait tout (R1, R2, accompagnement)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} style={{ marginTop: '32px' }}>
          <p className={`${styles.sectionLabel} ${styles.objectif}`}>Ton objectif</p>
          <div className={styles.card}>
            <p style={{ fontSize: '18px', fontWeight: 500, color: '#2D2A26', marginBottom: '12px' }}>30-35k€/mois d&apos;ici 6 mois.</p>
            <p>Pour y arriver : plus de monde en R1, mais qualifié. Structurer l&apos;acquisition. Puis créer un écosystème qui peut scaler sans que tout repose sur toi.</p>
          </div>
        </section>

        <section className={styles.section} style={{ paddingTop: '40px' }}>
          <p className={`${styles.sectionLabel} ${styles.leviers}`}>Les leviers que je vois</p>
          <div className={styles.leviersGrid}>
            <div className={styles.levierItem}>
              <div className={`${styles.levierIcon} ${styles.qual}`}>🎯</div>
              <div className={styles.levierContent}>
                <h3>Qualification des R1</h3>
                <p>Améliorer la qualité des leads sur les 2 funnels. Optimiser qui voit la VSL. Mettre les bonnes personnes en R1.</p>
              </div>
            </div>
            <div className={styles.levierItem}>
              <div className={`${styles.levierIcon} ${styles.setting}`}>⚙️</div>
              <div className={styles.levierContent}>
                <h3>Structuration du setting</h3>
                <p>Pour que le setter fonctionne vraiment. Sinon c&apos;est de l&apos;argent brûlé.</p>
              </div>
            </div>
            <div className={styles.levierItem}>
              <div className={`${styles.levierIcon} ${styles.tracking}`}>📊</div>
              <div className={styles.levierContent}>
                <h3>Tracking & RevOps</h3>
                <p>Dashboard centralisé et automatisé. Tracking contenu organique + funnel ads. Voir d&apos;un coup d&apos;œil ce qui convertit le mieux.</p>
              </div>
            </div>
            <div className={styles.levierItem}>
              <div className={`${styles.levierIcon} ${styles.youtube}`}>▶️</div>
              <div className={styles.levierContent}>
                <h3>Stratégie YouTube</h3>
                <p>Du contenu rapide qui qualifie. Pas chronophage. Style Mathis Clouet.</p>
              </div>
            </div>
            <div className={styles.levierItem}>
              <div className={`${styles.levierIcon} ${styles.ltv}`}>🔒</div>
              <div className={styles.levierContent}>
                <h3>LTV & rétention (phase 2)</h3>
                <p>Des idées pour locker les clients plus longtemps. Mini-outils, SaaS léger.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} style={{ marginTop: '40px' }}>
          <p className={`${styles.sectionLabel} ${styles.next}`}>Next step</p>
          <div className={styles.card}>
            <p style={{ textAlign: 'center', fontSize: '16px', color: '#2D2A26' }}>Un audit de 60 min pour creuser et prioriser ensemble.</p>
          </div>
        </section>

        <footer className={styles.footer}>
          <p className={styles.signature}>— <strong>Mehdi</strong></p>
        </footer>
      </div>
    </div>
  )
}
