'use client'

import { useLanguage, Language } from './LanguageContext'

const LANGS: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'th', label: 'ภาษาไทย' },
  { code: 'lo', label: 'ລາວ' },
]

export default function Footer() {
  const { t, language, setLanguage } = useLanguage()

  return (
    <footer className="bg-[#0E0502] py-12 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-stone-600 text-sm">{t('footer.copyright')}</p>

        <div className="flex items-center gap-1">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`px-3 py-1 text-xs rounded-full transition-all ${
                language === code
                  ? 'bg-[#C96A1E] text-white'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  )
}
