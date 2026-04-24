'use client'

import Image from 'next/image'
import { useLanguage } from './LanguageContext'

export default function MakerIntro() {
  const { t } = useLanguage()

  return (
    <section id="about" className="py-28 bg-[#FDF8F2]">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <div className="relative aspect-[4/5] rounded-sm overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1750086719017-66bc73579956?w=900&q=85&fit=crop"
            alt="Street food vendor at a market stall"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#1A0A05]/10" />
        </div>

        {/* Text */}
        <div>
          <span className="block text-[#C96A1E] text-xs uppercase tracking-[0.3em] mb-4">
            Our Story
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#2D1E14] mb-6 leading-tight">
            {t('maker.heading')}
          </h2>
          <div className="w-16 h-px bg-[#C96A1E] mb-8" />
          <p className="text-[#7A5C48] text-lg leading-relaxed italic">
            {t('maker.body')}
          </p>
        </div>
      </div>
    </section>
  )
}
