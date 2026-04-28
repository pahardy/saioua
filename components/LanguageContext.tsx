'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import en from '@/messages/en.json'
import th from '@/messages/th.json'
import lo from '@/messages/lo.json'

export type Language = 'en' | 'th' | 'lo'

const messages: Record<Language, Record<string, unknown>> = { en, th, lo }

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

function resolve(obj: Record<string, unknown>, path: string): string {
  const val = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
    return undefined
  }, obj)
  return typeof val === 'string' ? val : path
}

export function LanguageProvider({ children, initialLang }: { children: ReactNode; initialLang?: Language }) {
  const [language, setLang] = useState<Language>(initialLang ?? 'en')

  useEffect(() => {
    if (initialLang) return
    const stored = localStorage.getItem('language') as Language | null
    if (stored && stored in messages) setLang(stored)
  }, [initialLang])

  const setLanguage = (lang: Language) => {
    setLang(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string) => resolve(messages[language], key)

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
