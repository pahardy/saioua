'use client'

import { useLanguage } from './LanguageContext'

interface Props {
  onOpen: () => void
  className?: string
}

export default function OrderButton({ onOpen, className }: Props) {
  const { t } = useLanguage()
  return (
    <button
      onClick={onOpen}
      className={className}
    >
      {t('order.button')}
    </button>
  )
}
