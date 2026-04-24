import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageProvider, useLanguage } from '@/components/LanguageContext'

function Consumer({ path }: { path: string }) {
  const { t, language, setLanguage } = useLanguage()
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="text">{t(path)}</span>
      <button onClick={() => setLanguage('th')}>Thai</button>
      <button onClick={() => setLanguage('lo')}>Lao</button>
    </div>
  )
}

function renderWithProvider(path: string) {
  return render(
    <LanguageProvider>
      <Consumer path={path} />
    </LanguageProvider>
  )
}

describe('LanguageContext', () => {
  beforeEach(() => localStorage.clear())

  it('defaults to English', () => {
    renderWithProvider('hero.headline')
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
  })

  it('resolves a top-level nested key in English', () => {
    renderWithProvider('hero.headline')
    expect(screen.getByTestId('text')).toHaveTextContent('Sai Oua')
  })

  it('resolves a deeply nested key', () => {
    renderWithProvider('product.history_heading')
    expect(screen.getByTestId('text')).toHaveTextContent('A Heritage of Flavor')
  })

  it('returns the key path for a missing key', () => {
    renderWithProvider('nonexistent.key')
    expect(screen.getByTestId('text')).toHaveTextContent('nonexistent.key')
  })

  it('switches to Thai and returns translated text', async () => {
    const user = userEvent.setup()
    renderWithProvider('nav.about')
    await act(async () => {
      await user.click(screen.getByText('Thai'))
    })
    expect(screen.getByTestId('lang')).toHaveTextContent('th')
    // Thai translation should not be the same as the English source
    expect(screen.getByTestId('text')).not.toHaveTextContent('About')
  })

  it('switches to Lao and returns translated text', async () => {
    const user = userEvent.setup()
    renderWithProvider('nav.about')
    await act(async () => {
      await user.click(screen.getByText('Lao'))
    })
    expect(screen.getByTestId('lang')).toHaveTextContent('lo')
    expect(screen.getByTestId('text')).not.toHaveTextContent('About')
  })

  it('persists language choice to localStorage', async () => {
    const user = userEvent.setup()
    renderWithProvider('nav.about')
    await act(async () => {
      await user.click(screen.getByText('Thai'))
    })
    expect(localStorage.getItem('language')).toBe('th')
  })

  it('restores language from localStorage on mount', () => {
    localStorage.setItem('language', 'th')
    renderWithProvider('nav.about')
    expect(screen.getByTestId('lang')).toHaveTextContent('th')
  })
})
