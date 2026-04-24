import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { LanguageProvider } from '@/components/LanguageContext'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Sai Oua — Artisan Sausage of Northern Thailand & Laos',
  description:
    'Discover sai oua, the celebrated artisan sausage of northern Thailand and Laos — its heritage, ingredients, and the traditions behind every link.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} antialiased`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
