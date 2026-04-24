import Header from '@/components/Header'
import Hero from '@/components/Hero'
import MakerIntro from '@/components/MakerIntro'
import ProductInfo from '@/components/ProductInfo'
import Process from '@/components/Process'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MakerIntro />
        <ProductInfo />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
