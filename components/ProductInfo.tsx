'use client'

import Image from 'next/image'
import { useLanguage } from './LanguageContext'

const cards = [
  { keyHeading: 'product.history_heading', keyBody: 'product.history' },
  { keyHeading: 'product.where_heading', keyBody: 'product.where' },
  { keyHeading: 'product.culture_heading', keyBody: 'product.culture' },
]

export default function ProductInfo() {
  const { t } = useLanguage()

  return (
    <section id="product" className="bg-[#F5EDE0]">
      {/* Hero image banner */}
      <div className="relative h-72 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1575861158310-c7c6bec1c4cf?w=1920&q=85&fit=crop"
          alt="Grilled sausage close up"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1A0A05]/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="block text-[#C96A1E] text-xs uppercase tracking-[0.3em] mb-3">
            The Sausage
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
            {t('product.heading')}
          </h2>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map(({ keyHeading, keyBody }) => (
            <div
              key={keyHeading}
              className="bg-[#FDF8F2] rounded-sm p-8 hover:shadow-lg transition-shadow duration-300 border-t-2 border-[#C96A1E]"
            >
              <span className="text-[#C96A1E] text-xs mb-4 block">◆</span>
              <h3 className="font-display text-xl font-bold text-[#2D1E14] mb-4">
                {t(keyHeading)}
              </h3>
              <p className="text-[#7A5C48] leading-relaxed text-sm">{t(keyBody)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
