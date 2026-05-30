import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Luma',
  description: "Découvre les écoles d'Afrique",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <div className="luma-container">
          {children}
        </div>
      </body>
    </html>
  )
}