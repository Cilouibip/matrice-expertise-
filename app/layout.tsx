import { Outfit, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

const outfit = Outfit({ 
  subsets: ['latin'], 
  variable: '--font-display', 
  weight: ['300','400','500','600','700'] 
})

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans', 
  weight: ['300','400','500','600','700'] 
})

const jetbrains = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono', 
  weight: ['400','500'] 
})

export const metadata: Metadata = {
  title: 'Matrice de l\'Expertise 2026',
  description: 'Ton business d\'expertise survit en 2026 ? 7 questions. 2 minutes. Diagnostic chirurgical de ta position sur la Matrice.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${outfit.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-[#050505] text-neutral-200 antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
