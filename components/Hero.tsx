'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLanguage } from './LanguageContext'
import OrderButton from './OrderButton'
import OrderModal from './OrderModal'

export default function Hero() {
  const { t } = useLanguage()
  const [orderOpen, setOrderOpen] = useState(false)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-bleed photo */}
      <Image
        src="https://images.unsplash.com/photo-1495988840227-a5986a3be9fc?w=1920&q=85&fit=crop"
        alt="Sausages grilling over charcoal"
        fill
        className="object-cover"
        priority
      />

      {/* Dark overlay for legibility */}
      <div className="absolute inset-0 bg-[#0E0502]/70" />

      {/* Warm radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 70%, #C96A1E22 0%, transparent 70%)',
        }}
      />

      {/* Decorative rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-[#C96A1E]/15" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p className="text-[#C96A1E] text-sm uppercase tracking-[0.3em] mb-6 font-light">
          {t('hero.subheadline')}
        </p>
        <h1 className="font-display text-8xl md:text-[10rem] font-bold text-white leading-none mb-8 tracking-tight">
          {t('hero.headline')}
        </h1>
        <p className="text-stone-300 text-lg md:text-xl leading-relaxed mb-12 max-w-xl mx-auto">
          {t('hero.tagline')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#about"
            className="inline-block px-8 py-4 bg-[#C96A1E] text-white text-sm uppercase tracking-widest hover:bg-[#E07A2E] transition-colors duration-300 rounded-sm"
          >
            {t('hero.cta')}
          </a>
          <OrderButton
            onOpen={() => setOrderOpen(true)}
            className="inline-block px-8 py-4 border border-[#E8C27A] text-[#E8C27A] text-sm uppercase tracking-widest hover:bg-[#E8C27A] hover:text-[#1A0A05] transition-colors duration-300 rounded-sm"
          />
        </div>
      </div>
      <OrderModal isOpen={orderOpen} onClose={() => setOrderOpen(false)} />

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-stone-400 to-transparent" />
      </div>
    </section>
  )
}
