import './App.css'
import { useMemo, useState } from 'react'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'
import Home from './Home/Home'
import ProductsPage from './Products/ProductsPage'
import QuoteRequestModal from './Home/QuoteRequestModal'
import { getQuoteProductOptions } from './Home/Section 3'
import { usePremiumReveal } from './hooks/usePremiumReveal'
import { useSiteSeo } from './seo/useSiteSeo'
import { useLanguage } from './i18n/language'

const removeLanguagePrefix = (pathname: string) => {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  const segments = normalizedPath.split('/').filter(Boolean)

  if (segments.length === 0) return '/'
  if (segments[0] !== 'en' && segments[0] !== 'ar') return normalizedPath

  const remainingSegments = segments.slice(1)
  if (remainingSegments.length === 0) return '/'
  return `/${remainingSegments.join('/')}`
}

function App() {
  const { language } = useLanguage()
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [initialProductId, setInitialProductId] = useState<string | null>(null)
  const currentPathWithoutLanguage = removeLanguagePrefix(window.location.pathname)
  const isProductsPage = currentPathWithoutLanguage === '/products'
  const quoteProductOptions = useMemo(
    () => getQuoteProductOptions(language),
    [language],
  )

  useSiteSeo()
  usePremiumReveal(language)

  const openQuoteModal = (productId?: string) => {
    setInitialProductId(productId ?? null)
    setIsQuoteModalOpen(true)
  }

  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#07090D] text-white">
      <Navbar />
      <main className="min-h-[35vh]">
        {isProductsPage ? (
          <ProductsPage onRequestQuote={(productId) => openQuoteModal(productId)} />
        ) : (
          <Home onRequestQuote={(productId) => openQuoteModal(productId)} />
        )}
      </main>
      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        initialProductId={initialProductId}
        productOptions={quoteProductOptions}
        onClose={closeQuoteModal}
      />
      <Footer />
    </div>
  )
}

export default App
