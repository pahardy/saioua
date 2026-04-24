'use client'

import { useLanguage } from './LanguageContext'

export default function Contact() {
  const { t } = useLanguage()

  return (
    <section id="contact" className="py-28 bg-[#FDF8F2]">
      <div className="max-w-xl mx-auto px-6 text-center">
        <span className="block text-[#C96A1E] text-xs uppercase tracking-[0.3em] mb-4">
          Contact
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-[#2D1E14] mb-6 leading-tight">
          {t('contact.heading')}
        </h2>
        <div className="w-16 h-px bg-[#C96A1E] mx-auto mb-8" />
        <p className="text-[#7A5C48] text-lg leading-relaxed mb-10">
          {t('contact.body')}
        </p>
        <a
          href="mailto:fake@fake.com"
          className="inline-block px-8 py-4 bg-[#C96A1E] text-white text-sm uppercase tracking-widest hover:bg-[#E07A2E] transition-colors duration-300 rounded-sm"
        >
          {t('contact.link_text')}
        </a>
      </div>
    </section>
  )
}
