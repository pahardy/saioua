'use client'

import { useState, useEffect } from 'react'
import { useLanguage, Language } from './LanguageContext'

const LANGS: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'th', label: 'ภาษาไทย' },
  { code: 'lo', label: 'ລາວ' },
]

export default function Header() {
  const { t, language, setLanguage } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.product'), href: '#product' },
    { label: t('nav.process'), href: '#process' },
    { label: t('nav.contact'), href: '#contact' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#1A0A05]/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#"
          className="font-display text-2xl font-bold text-[#E8C27A] tracking-wide hover:text-white transition-colors"
        >
          Sai Oua
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-stone-300 hover:text-[#E8C27A] transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Language toggle */}
        <div className="hidden md:flex items-center gap-1 ml-8">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`px-3 py-1 text-xs rounded-full transition-all ${
                language === code
                  ? 'bg-[#C96A1E] text-white'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-stone-300 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-0.5 bg-current mb-1.5 transition-all" />
          <span className="block w-6 h-0.5 bg-current mb-1.5 transition-all" />
          <span className="block w-6 h-0.5 bg-current transition-all" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1A0A05]/98 px-6 pb-6 border-t border-white/10">
          <nav className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-stone-300 hover:text-[#E8C27A] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => { setLanguage(code); setMenuOpen(false) }}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  language === code
                    ? 'bg-[#C96A1E] text-white'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
