'use client'

import Image from 'next/image'
import { useLanguage } from './LanguageContext'

export default function Process() {
  const { t } = useLanguage()

  return (
    <section id="process" className="py-28 bg-[#1A0A05]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="block text-[#C96A1E] text-xs uppercase tracking-[0.3em] mb-4">
            How It's Made
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
            {t('process.heading')}
          </h2>
          <div className="w-16 h-px bg-[#C96A1E] mx-auto mt-8" />
        </div>

        {/* Ingredients row */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
          <div>
            <h3 className="font-display text-2xl font-bold text-[#E8C27A] mb-6">
              {t('process.ingredients_heading')}
            </h3>
            <p className="text-stone-400 leading-relaxed">{t('process.ingredients')}</p>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {[
                'Lemongrass', 'Galangal', 'Kaffir Lime', 'Shallots',
                'Garlic', 'Dried Chilies', 'Turmeric', 'Fish Sauce',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-stone-400 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C96A1E] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Mortar & pestle image */}
          <div className="relative aspect-square rounded-sm overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1492552085122-36706c238263?w=900&q=85&fit=crop"
              alt="Grinding spices in a mortar and pestle"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#1A0A05]/20" />
          </div>
        </div>

        {/* Process row — reversed */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Grill image */}
          <div className="relative aspect-square rounded-sm overflow-hidden order-2 md:order-1">
            <Image
              src="https://images.unsplash.com/photo-1591989330748-777649e84466?w=900&q=85&fit=crop"
              alt="Sausages grilling on a charcoal grill"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#1A0A05]/20" />
          </div>

          <div className="order-1 md:order-2">
            <h3 className="font-display text-2xl font-bold text-[#E8C27A] mb-6">
              {t('process.process_heading')}
            </h3>
            <p className="text-stone-400 leading-relaxed">{t('process.process_body')}</p>
            <ol className="mt-8 flex flex-col gap-4">
              {[
                'Pound aromatics in a stone mortar',
                'Mix with ground pork and fish sauce',
                'Fill natural casings tightly',
                'Hang to air-dry briefly',
                'Grill low and slow over charcoal',
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-4 text-sm text-stone-400">
                  <span className="text-[#C96A1E] font-display font-bold text-lg leading-none mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
