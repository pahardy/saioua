'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from './LanguageContext'

interface Props {
  isOpen: boolean
  onClose: () => void
}

type State = 'idle' | 'submitting' | 'success' | 'error'

interface FormData {
  quantity: string
  name: string
  address: string
  city: string
  province: string
  postal: string
  country: string
  email: string
  phone: string
}

const EMPTY: FormData = {
  quantity: '1',
  name: '',
  address: '',
  city: '',
  province: '',
  postal: '',
  country: '',
  email: '',
  phone: '',
}

export default function OrderModal({ isOpen, onClose }: Props) {
  const { t } = useLanguage()
  const [state, setState] = useState<State>('idle')
  const [form, setForm] = useState<FormData>(EMPTY)
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    if (isOpen) {
      setState('idle')
      setForm(EMPTY)
      setOrderNumber('')
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const required: (keyof FormData)[] = ['name', 'address', 'city', 'province', 'postal', 'country', 'email', 'phone']
    if (required.some((k) => !form[k].trim())) return
    setState('submitting')
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, quantity: Number(form.quantity) }),
      })
      if (!res.ok) throw new Error('bad response')
      const data = await res.json()
      setOrderNumber(data.orderNumber)
      setState('success')
    } catch {
      setState('error')
    }
  }

  const inputClass =
    'w-full px-3 py-2 bg-[#2A1505] border border-[#C96A1E]/40 rounded text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#C96A1E] transition-colors text-sm'
  const labelClass = 'block text-xs text-stone-400 mb-1'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg bg-[#1A0A05] border border-[#C96A1E]/30 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 pt-6 pb-2 flex items-center justify-between">
          <h2 className="font-display text-xl text-[#E8C27A]">{t('order.modal_title')}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-stone-400 hover:text-white transition-colors text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {state === 'success' ? (
          <div className="px-6 py-8 text-center">
            <p className="text-[#E8C27A] font-display text-lg mb-2">{t('order.success_title')}</p>
            <p className="text-stone-300 text-sm">
              {t('order.success_body')
                .replace('{orderNumber}', orderNumber)
                .replace('{email}', form.email)}
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-[#C96A1E] text-white text-sm rounded-full hover:bg-[#E8C27A] hover:text-[#1A0A05] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-4">
            <div>
              <label htmlFor="order-quantity" className={labelClass}>{t('order.quantity_label')}</label>
              <select
                id="order-quantity"
                value={form.quantity}
                onChange={set('quantity')}
                required
                className={inputClass}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="order-name" className={labelClass}>{t('order.name_label')}</label>
              <input id="order-name" type="text" value={form.name} onChange={set('name')} required className={inputClass} />
            </div>

            <div>
              <label htmlFor="order-address" className={labelClass}>{t('order.address_label')}</label>
              <input id="order-address" type="text" value={form.address} onChange={set('address')} required className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="order-city" className={labelClass}>{t('order.city_label')}</label>
                <input id="order-city" type="text" value={form.city} onChange={set('city')} required className={inputClass} />
              </div>
              <div>
                <label htmlFor="order-province" className={labelClass}>{t('order.province_label')}</label>
                <input id="order-province" type="text" value={form.province} onChange={set('province')} required className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="order-postal" className={labelClass}>{t('order.postal_label')}</label>
                <input id="order-postal" type="text" value={form.postal} onChange={set('postal')} required className={inputClass} />
              </div>
              <div>
                <label htmlFor="order-country" className={labelClass}>{t('order.country_label')}</label>
                <input id="order-country" type="text" value={form.country} onChange={set('country')} required className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="order-email" className={labelClass}>{t('order.email_label')}</label>
              <input id="order-email" type="email" value={form.email} onChange={set('email')} required className={inputClass} />
            </div>

            <div>
              <label htmlFor="order-phone" className={labelClass}>{t('order.phone_label')}</label>
              <input id="order-phone" type="tel" value={form.phone} onChange={set('phone')} required className={inputClass} />
            </div>

            {state === 'error' && (
              <p className="text-red-400 text-sm">{t('order.error_generic')}</p>
            )}

            <button
              type="submit"
              disabled={state === 'submitting'}
              className="w-full py-3 bg-[#C96A1E] text-white font-medium rounded-full hover:bg-[#E8C27A] hover:text-[#1A0A05] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {state === 'submitting' ? t('order.submitting') : t('order.submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
