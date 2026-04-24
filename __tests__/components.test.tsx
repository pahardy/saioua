/**
 * Smoke tests — verify every page component renders without throwing.
 * next/image is mocked to avoid network calls in the test environment.
 */
import { render, screen } from '@testing-library/react'
import { LanguageProvider } from '@/components/LanguageContext'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import MakerIntro from '@/components/MakerIntro'
import ProductInfo from '@/components/ProductInfo'
import Process from '@/components/Process'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

function wrap(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>)
}

describe('Component smoke tests', () => {
  it('Header renders site name and nav links', () => {
    wrap(<Header />)
    expect(screen.getByText('Sai Oua')).toBeInTheDocument()
    expect(screen.getAllByText('About').length).toBeGreaterThan(0)
  })

  it('Hero renders headline and CTA', () => {
    wrap(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sai Oua')
    expect(screen.getByText('Discover the Story')).toBeInTheDocument()
  })

  it('MakerIntro renders placeholder heading', () => {
    wrap(<MakerIntro />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Meet the Makers')
  })

  it('ProductInfo renders section heading', () => {
    wrap(<ProductInfo />)
    expect(screen.getByText('What is Sai Oua?')).toBeInTheDocument()
  })

  it('Process renders both sub-headings', () => {
    wrap(<Process />)
    expect(screen.getByText('The Ingredients')).toBeInTheDocument()
    expect(screen.getByText('The Process')).toBeInTheDocument()
  })

  it('Contact renders email link', () => {
    wrap(<Contact />)
    const link = screen.getByRole('link', { name: /send us an email/i })
    expect(link).toHaveAttribute('href', 'mailto:fake@fake.com')
  })

  it('Footer renders copyright text', () => {
    wrap(<Footer />)
    expect(screen.getByText(/2026 Sai Oua/i)).toBeInTheDocument()
  })
})
