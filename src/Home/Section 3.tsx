import { useEffect, useMemo, useState } from 'react'
import type { IconType } from 'react-icons'
import {
  FiArrowLeft,
  FiArrowRight,
  FiAward,
  FiBox,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDroplet,
  FiFeather,
  FiFileText,
  FiGrid,
  FiPackage,
  FiShield,
  FiSun,
  FiTruck,
  FiWind,
  FiZap,
} from 'react-icons/fi'
import coalImage from '../assets/Coal.webp'
import coalPackageImage from '../assets/Coal Package.webp'
import packagingImage from '../assets/Packaging.webp'
import exportingImage from '../assets/Exporting.webp'
import { useLanguage, type Language } from '../i18n/language'

type ProductSpec = {
  id: string
  icon: IconType
  title: string
  description: string
}

export type ProductCard = {
  id: string
  title: string
  description: string
  image: string
  category: string
  sizes: string[]
  specs: ProductSpec[]
  suitableFor: string[]
}

export type QuoteProductOption = {
  id: string
  title: string
}

type SlideDirection = 'next' | 'previous'

const sectionTitleGradient = 'bg-gradient-to-t from-[#FBEF9D] to-[#A96522] bg-clip-text text-transparent'
const apiBaseUrl = ((import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? '').replace(/\/$/, '')
const displayedProductsApiUrl = `${apiBaseUrl}/api/products/displayed`

type ProductApiItem = {
  id: number
  name_ar: string
  name_en: string
  description_ar: string
  description_en: string
  specifications_ar: string[]
  specifications_en: string[]
  suitable_for_ar: string[]
  suitable_for_en: string[]
  size: string[]
  product_image: string
  product_image_url: string
  category?: {
    name_ar?: string
    name_en?: string
  } | null
}

type ProductsApiResponse = {
  data?: unknown
  message?: string
  errors?: Record<string, unknown>
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const toStringArray = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item) => item.length > 0)
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim()
    if (!trimmedValue) {
      return []
    }

    try {
      const parsedValue = JSON.parse(trimmedValue)
      if (Array.isArray(parsedValue)) {
        return parsedValue
          .map((item) => (typeof item === 'string' ? item.trim() : ''))
          .filter((item) => item.length > 0)
      }
    } catch {
      return [trimmedValue]
    }
  }

  return []
}

const getApiMessage = (payload: unknown) => {
  if (!isRecord(payload)) {
    return null
  }

  const { message, errors } = payload as ProductsApiResponse
  if (typeof message === 'string' && message.trim()) {
    return message.trim()
  }

  if (!errors || typeof errors !== 'object') {
    return null
  }

  const firstError = Object.values(errors).find(
    (fieldErrors) =>
      Array.isArray(fieldErrors) &&
      fieldErrors.some(
        (fieldError) => typeof fieldError === 'string' && fieldError.trim().length > 0,
      ),
  )

  if (!Array.isArray(firstError)) {
    return null
  }

  const firstMessage = firstError.find(
    (fieldError) => typeof fieldError === 'string' && fieldError.trim().length > 0,
  )

  return typeof firstMessage === 'string' ? firstMessage.trim() : null
}

const toProductApiItem = (value: unknown): ProductApiItem | null => {
  if (!isRecord(value)) {
    return null
  }

  const numericId = Number(value.id)
  const nameAr = typeof value.name_ar === 'string' ? value.name_ar.trim() : ''
  const nameEn = typeof value.name_en === 'string' ? value.name_en.trim() : ''
  const descriptionAr = typeof value.description_ar === 'string' ? value.description_ar.trim() : ''
  const descriptionEn = typeof value.description_en === 'string' ? value.description_en.trim() : ''
  const productImage = typeof value.product_image === 'string' ? value.product_image.trim() : ''
  const productImageUrl =
    typeof value.product_image_url === 'string' ? value.product_image_url.trim() : ''

  if (!Number.isInteger(numericId) || numericId < 1 || !nameAr || !nameEn) {
    return null
  }

  const rawCategory = isRecord(value.category) ? value.category : null
  const category =
    rawCategory && (typeof rawCategory.name_ar === 'string' || typeof rawCategory.name_en === 'string')
      ? {
          name_ar: typeof rawCategory.name_ar === 'string' ? rawCategory.name_ar.trim() : '',
          name_en: typeof rawCategory.name_en === 'string' ? rawCategory.name_en.trim() : '',
        }
      : null

  return {
    id: numericId,
    name_ar: nameAr,
    name_en: nameEn,
    description_ar: descriptionAr,
    description_en: descriptionEn,
    specifications_ar: toStringArray(value.specifications_ar),
    specifications_en: toStringArray(value.specifications_en),
    suitable_for_ar: toStringArray(value.suitable_for_ar),
    suitable_for_en: toStringArray(value.suitable_for_en),
    size: toStringArray(value.size),
    product_image: productImage,
    product_image_url: productImageUrl,
    category,
  }
}

const parseProductsFromResponse = (payload: unknown): ProductApiItem[] => {
  let rawProducts: unknown[] = []

  if (Array.isArray(payload)) {
    rawProducts = payload
  } else if (isRecord(payload) && Array.isArray((payload as ProductsApiResponse).data)) {
    rawProducts = (payload as ProductsApiResponse).data as unknown[]
  }

  return rawProducts
    .map(toProductApiItem)
    .filter((product): product is ProductApiItem => product !== null)
}

const sizeHasWeightUnit = (size: string) => /(kg|kilogram|kilo|كجم|كيلو)/i.test(size)
const sizeContainsDigits = (size: string) => /\d/.test(size)

const formatSizeLabel = (size: string, language: Language) => {
  const normalizedSize = size.trim()
  if (!normalizedSize || !sizeContainsDigits(normalizedSize) || sizeHasWeightUnit(normalizedSize)) {
    return normalizedSize
  }

  return language === 'ar' ? `${normalizedSize} كجم` : `${normalizedSize} KG`
}

const mapProductToCard = (product: ProductApiItem, language: Language): ProductCard => {
  const title = language === 'ar' ? product.name_ar : product.name_en
  const description = language === 'ar' ? product.description_ar : product.description_en
  const categoryNameFromApi =
    language === 'ar' ? product.category?.name_ar : product.category?.name_en
  const category = categoryNameFromApi && categoryNameFromApi.trim() ? categoryNameFromApi.trim() : '-'
  const specifications = language === 'ar' ? product.specifications_ar : product.specifications_en
  const suitableFor = language === 'ar' ? product.suitable_for_ar : product.suitable_for_en
  const image = product.product_image_url || product.product_image || coalImage

  return {
    id: `${product.id}`,
    title,
    description,
    image,
    category,
    sizes: product.size.map((size) => formatSizeLabel(size, language)),
    suitableFor,
    specs: specifications.map((specification, index) => ({
      id: `${product.id}-spec-${index + 1}`,
      icon: FiCheckCircle,
      title: specification,
      description: '',
    })),
  }
}

const productsByLanguage: Record<Language, ReadonlyArray<ProductCard>> = {
  en: [
    {
      id: 'premium-lump-charcoal',
      title: 'Premium Lump Charcoal for Grilling',
      description:
        'Natural high-density charcoal with steady heat and a long burn time, ideal for restaurants and commercial use.',
      image: coalImage,
      category: 'Charcoal',
      sizes: ['5 kg', '10 kg', '20 kg'],
      specs: [
        { id: 'heat', icon: FiSun, title: 'High Heat', description: 'Delivers strong and stable heat output.' },
        { id: 'burn', icon: FiClock, title: 'Long Burn', description: 'Lasts longer for extended use.' },
        { id: 'smoke', icon: FiWind, title: 'Low Smoke', description: 'Cleaner combustion with natural aroma.' },
        { id: 'natural', icon: FiShield, title: '100% Natural', description: 'No chemical additives included.' },
      ],
      suitableFor: ['Grilling', 'Restaurants', 'Commercial Use'],
    },
    {
      id: 'hookah-charcoal',
      title: 'Export-Grade Hookah Charcoal',
      description:
        'Professional quality with low ash and balanced ignition, manufactured to match international market requirements.',
      image: coalPackageImage,
      category: 'Hookah Charcoal',
      sizes: ['1 kg', '5 kg', '10 kg'],
      specs: [
        { id: 'ignite', icon: FiZap, title: 'Balanced Ignition', description: 'Starts quickly and stays stable.' },
        { id: 'session', icon: FiClock, title: 'Longer Session', description: 'Maintains embers for longer use.' },
        { id: 'ash', icon: FiDroplet, title: 'Low Ash', description: 'Leaves less residue after use.' },
        { id: 'smooth', icon: FiFeather, title: 'Higher Purity', description: 'No unwanted odors during use.' },
      ],
      suitableFor: ['Hookah', 'Cafes', 'Hospitality Lounges'],
    },
    {
      id: 'retail-packing',
      title: 'Retail Packaging Solutions',
      description:
        'Multiple packaging options in different sizes with custom designs that reinforce your brand identity.',
      image: packagingImage,
      category: 'Packaging',
      sizes: ['Custom Sizes'],
      specs: [
        { id: 'sizes', icon: FiPackage, title: 'Flexible Sizes', description: 'Full flexibility in package sizing.' },
        { id: 'display', icon: FiGrid, title: 'Retail Display', description: 'Designs optimized for shelf presence.' },
        { id: 'safe', icon: FiShield, title: 'Transport Protection', description: 'Packaging that preserves quality.' },
        { id: 'brand', icon: FiAward, title: 'Brand Identity', description: 'Custom print with your branding.' },
      ],
      suitableFor: ['Retail Stores', 'Private Labels', 'Gift Orders'],
    },
    {
      id: 'bulk-export-orders',
      title: 'Bulk Export Orders',
      description:
        'Large-volume shipments with precise scheduling and full supply-chain follow-up until final delivery.',
      image: exportingImage,
      category: 'Export',
      sizes: ['Sea Freight', 'Air Freight'],
      specs: [
        { id: 'bulk', icon: FiBox, title: 'Large Volumes', description: 'Steady supply based on your plan.' },
        { id: 'shipping', icon: FiTruck, title: 'Shipping Options', description: 'Flexible sea and air solutions.' },
        { id: 'docs', icon: FiFileText, title: 'Complete Docs', description: 'Compliance with export standards.' },
        { id: 'schedule', icon: FiCalendar, title: 'Precise Timing', description: 'Delivery on the agreed schedule.' },
      ],
      suitableFor: ['Importers', 'Distributors', 'Restaurant Chains'],
    },
  ],
  ar: [
    {
      id: 'premium-lump-charcoal',
      title: 'فحم نباتي فاخر للشوايات',
      description:
        'فحم طبيعي عالي الكثافة بحرارة ثابتة ومدة احتراق طويلة، مناسب للمطاعم والاستخدام التجاري.',
      image: coalImage,
      category: 'الفحم النباتي',
      sizes: ['5 كجم', '10 كجم', '20 كجم'],
      specs: [
        { id: 'heat', icon: FiSun, title: 'حرارة عالية', description: 'يوفر حرارة قوية وثابتة.' },
        { id: 'burn', icon: FiClock, title: 'احتراق طويل', description: 'يدوم لفترة استخدام أطول.' },
        { id: 'smoke', icon: FiWind, title: 'دخان قليل', description: 'احتراق أنظف برائحة طبيعية.' },
        { id: 'natural', icon: FiShield, title: 'طبيعي 100%', description: 'بدون إضافات كيميائية.' },
      ],
      suitableFor: ['الشواء', 'المطاعم', 'الاستخدام التجاري'],
    },
    {
      id: 'hookah-charcoal',
      title: 'فحم شيشة للتصدير',
      description:
        'جودة احترافية برماد منخفض واشتعال متوازن، يتم إنتاجه وفق متطلبات الأسواق العالمية.',
      image: coalPackageImage,
      category: 'فحم الشيشة',
      sizes: ['1 كجم', '5 كجم', '10 كجم'],
      specs: [
        { id: 'ignite', icon: FiZap, title: 'اشتعال متوازن', description: 'يبدأ بسرعة ويحافظ على الثبات.' },
        { id: 'session', icon: FiClock, title: 'جلسة أطول', description: 'ثبات الجمر خلال وقت الاستخدام.' },
        { id: 'ash', icon: FiDroplet, title: 'رماد منخفض', description: 'أثر أقل بعد الاستهلاك.' },
        { id: 'smooth', icon: FiFeather, title: 'نقاء أعلى', description: 'بدون روائح غير مرغوبة.' },
      ],
      suitableFor: ['الشيشة', 'الكافيهات', 'صالات الضيافة'],
    },
    {
      id: 'retail-packing',
      title: 'عبوات تجزئة متنوعة',
      description:
        'خيارات تغليف متعددة بأحجام مختلفة مع تصميمات مخصصة تدعم الهوية التجارية لعملائنا.',
      image: packagingImage,
      category: 'التعبئة',
      sizes: ['حسب الطلب'],
      specs: [
        { id: 'sizes', icon: FiPackage, title: 'أحجام متعددة', description: 'مرونة كاملة في الأحجام.' },
        { id: 'display', icon: FiGrid, title: 'عرض احترافي', description: 'تصميم مناسب للرفوف.' },
        { id: 'safe', icon: FiShield, title: 'حماية أثناء النقل', description: 'تغليف يحافظ على الجودة.' },
        { id: 'brand', icon: FiAward, title: 'هوية مميزة', description: 'طباعة مخصصة باسم علامتك.' },
      ],
      suitableFor: ['متاجر التجزئة', 'العلامات الخاصة', 'طلبات الهدايا'],
    },
    {
      id: 'bulk-export-orders',
      title: 'طلبيات جملة للتصدير',
      description:
        'نوفر شحنات كبيرة بجدولة دقيقة ومتابعة كاملة لسلسلة التوريد حتى التسليم في بلد الوصول.',
      image: exportingImage,
      category: 'التصدير',
      sizes: ['شحن بحري', 'شحن جوي'],
      specs: [
        { id: 'bulk', icon: FiBox, title: 'كميات كبيرة', description: 'توريد ثابت حسب الخطة.' },
        { id: 'shipping', icon: FiTruck, title: 'حلول شحن', description: 'خيارات بحرية وجوية مرنة.' },
        { id: 'docs', icon: FiFileText, title: 'مستندات كاملة', description: 'التزام بمعايير التصدير.' },
        { id: 'schedule', icon: FiCalendar, title: 'جدولة دقيقة', description: 'التسليم في الوقت المتفق.' },
      ],
      suitableFor: ['المستوردين', 'الموزعين', 'سلاسل المطاعم'],
    },
  ],
}

export const getQuoteProductOptions = (language: Language): QuoteProductOption[] =>
  productsByLanguage[language].map(({ id, title }) => ({ id, title }))

export const getProductsCatalog = (language: Language): ReadonlyArray<ProductCard> =>
  productsByLanguage[language]

const sectionCopyByLanguage: Record<Language, {
  title: string
  viewAllProducts: string
  specifications: string
  suitableFor: string
  sizesAndShipping: string
  requestQuote: string
  previousProduct: string
  nextProduct: string
  showProductPrefix: string
  loadingProducts: string
  productsLoadError: string
  noProducts: string
}> = {
  en: {
    title: 'Products',
    viewAllProducts: 'View All Products',
    specifications: 'Specifications',
    suitableFor: 'Suitable For',
    sizesAndShipping: 'Sizes / Shipping Options',
    requestQuote: 'Request a Quote',
    previousProduct: 'Previous product',
    nextProduct: 'Next product',
    showProductPrefix: 'Show',
    loadingProducts: 'Loading products...',
    productsLoadError: 'Unable to load products right now.',
    noProducts: 'No products available at the moment.',
  },
  ar: {
    title: 'المنتجات',
    viewAllProducts: 'عرض جميع المنتجات',
    specifications: 'المواصفات',
    suitableFor: 'مناسب لـ',
    sizesAndShipping: 'الأحجام / خيارات الشحن',
    requestQuote: 'اطلب عرض سعر',
    previousProduct: 'المنتج السابق',
    nextProduct: 'المنتج التالي',
    showProductPrefix: 'عرض',
    loadingProducts: 'جاري تحميل المنتجات...',
    productsLoadError: 'تعذر تحميل المنتجات حاليًا.',
    noProducts: 'لا توجد منتجات متاحة حاليًا.',
  },
}

type Section3Props = {
  onRequestQuote?: (productId: string) => void
}

function Section3({ onRequestQuote }: Section3Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState<SlideDirection>('next')
  const [apiProducts, setApiProducts] = useState<ProductApiItem[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [productsLoadError, setProductsLoadError] = useState<string | null>(null)
  const { language, isArabic } = useLanguage()

  const productsPageHref = `/${language}/products`
  const copy = sectionCopyByLanguage[language]
  const products = useMemo(
    () => apiProducts.map((product) => mapProductToCard(product, language)),
    [apiProducts, language],
  )
  const activeProduct = products[activeIndex]
  const isEvenCard = activeIndex % 2 === 0

  useEffect(() => {
    const abortController = new AbortController()

    const fetchDisplayedProducts = async () => {
      setIsLoadingProducts(true)
      setProductsLoadError(null)

      try {
        const response = await fetch(displayedProductsApiUrl, { signal: abortController.signal })

        let responsePayload: unknown = null
        try {
          responsePayload = await response.json()
        } catch {
          responsePayload = null
        }

        if (!response.ok) {
          throw new Error(getApiMessage(responsePayload) ?? copy.productsLoadError)
        }

        const parsedProducts = parseProductsFromResponse(responsePayload)
        setApiProducts(parsedProducts)
      } catch (error) {
        if (abortController.signal.aborted) {
          return
        }

        const fallbackMessage =
          error instanceof Error && error.message.trim() ? error.message : copy.productsLoadError
        setProductsLoadError(fallbackMessage)
        setApiProducts([])
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingProducts(false)
        }
      }
    }

    void fetchDisplayedProducts()

    return () => {
      abortController.abort()
    }
  }, [copy.productsLoadError])

  useEffect(() => {
    if (activeIndex > products.length - 1) {
      setActiveIndex(0)
    }
  }, [activeIndex, products.length])

  const gridClassName = isEvenCard
    ? 'md:grid-cols-[minmax(230px,0.95fr)_minmax(0,1.15fr)] lg:grid-cols-[minmax(260px,0.95fr)_minmax(0,1.35fr)]'
    : 'md:grid-cols-[minmax(0,1.15fr)_minmax(230px,0.95fr)] lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.95fr)]'
  const cardAnimationClass =
    slideDirection === 'next'
      ? 'motion-safe:animate-[section3-card-next_460ms_cubic-bezier(0.22,1,0.36,1)]'
      : 'motion-safe:animate-[section3-card-prev_460ms_cubic-bezier(0.22,1,0.36,1)]'

  const showPrevious = () => {
    if (products.length === 0) return

    setSlideDirection('previous')
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1))
  }

  const showNext = () => {
    if (products.length === 0) return

    setSlideDirection('next')
    setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1))
  }

  const showProductByIndex = (index: number) => {
    if (products.length === 0 || index === activeIndex) return

    setSlideDirection(index > activeIndex ? 'next' : 'previous')
    setActiveIndex(index)
  }

  const handleRequestQuote = () => {
    if (!activeProduct) return

    onRequestQuote?.(activeProduct.id)
  }

  return (
    <section
      className="relative overflow-visible bg-[#07090D] py-7 sm:py-9 md:py-10 lg:py-14 xl:py-16"
      dir={isArabic ? 'rtl' : 'ltr'}
      aria-labelledby="products-heading"
      id="products-section"
    >
      <div className="mx-auto w-full max-w-[1440px] px-[25px] md:px-[50px] lg:px-[100px]">
        <div data-reveal="up" className="relative mb-5 flex items-center justify-center sm:mb-7 md:mb-8 lg:mb-10">
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 md:gap-6">
            <span className="premium-shimmer-line h-[3px] w-[44px] bg-gradient-to-l from-[#FBEF9D] to-[#A96522] sm:w-[88px] md:w-[120px]" />
            <h2
              id="products-heading"
              className={`${sectionTitleGradient} text-center text-[28px] font-extrabold leading-[1.1] sm:text-[32px] md:text-[36px] lg:text-[40px]`}
            >
              {copy.title}
            </h2>
            <span className="premium-shimmer-line h-[3px] w-[44px] bg-gradient-to-r from-[#FBEF9D] to-[#A96522] sm:w-[88px] md:w-[120px]" />
          </div>

          <a
            href={productsPageHref}
            data-reveal={isArabic ? 'left' : 'right'}
            className={`absolute hidden items-center justify-center rounded-full border border-[#D39B52] bg-[#0A0D13] px-5 py-2.5 text-[13px] font-semibold text-[#F6F7F9] transition-all duration-300 hover:bg-gradient-to-l hover:from-[#FBEF9D] hover:to-[#A96522] hover:text-white lg:inline-flex ${isArabic ? 'left-0' : 'right-0'}`}
          >
            {copy.viewAllProducts}
          </a>
        </div>

        <div data-reveal="up" className="mb-5 flex justify-center lg:hidden">
          <a
            href={productsPageHref}
            className="inline-flex items-center justify-center rounded-full border border-[#D39B52] bg-[#0A0D13] px-4 py-2 text-[11px] font-semibold text-[#F6F7F9] transition-all duration-300 hover:bg-gradient-to-l hover:from-[#FBEF9D] hover:to-[#A96522] hover:text-white sm:px-5 sm:py-2.5 sm:text-[13px] md:px-6 md:py-2.5 md:text-[13px]"
          >
            {copy.viewAllProducts}
          </a>
        </div>

        {isLoadingProducts ? (
          <div className="rounded-[16px] border border-white/10 bg-[#0B1017]/88 p-5 text-center text-sm text-[#D8E0EC] sm:text-[15px]">
            {copy.loadingProducts}
          </div>
        ) : productsLoadError ? (
          <div className="rounded-[16px] border border-[#FFB4B45C] bg-[#201014]/65 p-5 text-center text-sm text-[#FFD3D3] sm:text-[15px]">
            {productsLoadError}
          </div>
        ) : !activeProduct ? (
          <div className="rounded-[16px] border border-white/10 bg-[#0B1017]/88 p-5 text-center text-sm text-[#D8E0EC] sm:text-[15px]">
            {copy.noProducts}
          </div>
        ) : (
          <>
            <article
              key={activeProduct.id}
              data-reveal="zoom"
              className={`premium-card-hover relative z-30 group mx-auto w-full max-w-[1440px] overflow-hidden rounded-[14px] border border-[#B9782F66] bg-[#080B10] shadow-[0_14px_34px_rgba(0,0,0,0.34)] sm:rounded-[18px] ${cardAnimationClass}`}
            >
              <div className="relative p-2.5 sm:p-3.5 md:p-4 lg:p-5">
                <span
                  className={`pointer-events-none absolute top-0 h-12 w-12 bg-[#D39B522E] sm:h-16 sm:w-16 ${
                    isArabic
                      ? 'left-0 rounded-br-[30px] sm:rounded-br-[40px]'
                      : 'right-0 rounded-bl-[30px] sm:rounded-bl-[40px]'
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`pointer-events-none absolute bottom-0 h-12 w-12 bg-[#D39B522E] sm:h-16 sm:w-16 ${
                    isArabic
                      ? 'right-0 rounded-tl-[30px] sm:rounded-tl-[40px]'
                      : 'left-0 rounded-tr-[30px] sm:rounded-tr-[40px]'
                  }`}
                  aria-hidden="true"
                />

                <div className={`grid gap-2.5 ${gridClassName} sm:gap-3 md:gap-3.5 lg:gap-4`}>
                  <div
                    className={`relative min-h-[200px] overflow-hidden rounded-[14px] border border-[#D39B523D] sm:min-h-[245px] md:min-h-[265px] lg:min-h-0 lg:aspect-auto ${
                      isEvenCard ? 'md:order-1' : 'md:order-2'
                    }`}
                  >
                    <img
                      src={activeProduct.image}
                      alt={activeProduct.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      loading="lazy"
                      decoding="async"
                    />
                    <span
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
                      aria-hidden="true"
                    />
                    <span className={`absolute top-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#FBEF9D70] bg-[#040506C7] px-2.5 py-1 text-[11px] text-[#FBEF9D] sm:top-3 sm:text-[12px] ${isArabic ? 'right-2.5 sm:right-3' : 'left-2.5 sm:left-3'}`}>
                      <FiCheckCircle className="text-xs" />
                      {activeProduct.category}
                    </span>
                  </div>

                  <div className={`z-10 space-y-2.5 sm:space-y-3 md:space-y-3.5 lg:space-y-4 ${isEvenCard ? 'md:order-2' : 'md:order-1'}`}>
                    <div className="rounded-[14px] border border-[#FFFFFF1B] bg-[#0A0F15] p-3 sm:p-3.5 md:p-4 lg:p-5">
                      <h3 className="mt-1 text-[18px] font-extrabold leading-[1.35] text-white sm:mt-1.5 sm:text-[22px] md:text-[24px] lg:text-[25px]">
                        {activeProduct.title}
                      </h3>
                      {activeProduct.description ? (
                        <p className="mt-2.5 text-[13px] leading-[1.75] text-[#DCE2EA] sm:mt-3 sm:text-[14px] md:text-[14px] lg:text-[14px]">
                          {activeProduct.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="grid gap-2.5 sm:gap-3 lg:grid-cols-[1.15fr_0.85fr]">
                      <div className="rounded-[14px] border border-[#FFFFFF1B] bg-[#0B1017] p-3 sm:p-3.5 md:p-4 lg:p-4">
                        <div className="mb-2.5 flex items-center gap-2 sm:mb-3">
                          <h4 className="text-[17px] font-extrabold text-[#F0CB77] sm:text-[18px] lg:text-[17px]">{copy.specifications}</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-2 md:gap-2.5">
                          {activeProduct.specs.map(({ id, icon: Icon, title, description }) => (
                            <div key={id} className="premium-card-hover rounded-[10px] border border-[#FFFFFF18] bg-[#FFFFFF08] p-2.5 sm:p-2.5 md:p-3 lg:p-3">
                              <div className="mb-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#E0B46824] text-[#EAC170] sm:h-7 sm:w-7 lg:h-6 lg:w-6">
                                <Icon className="text-[13px] sm:text-[14px] lg:text-[13px]" />
                              </div>
                              <p className="text-[12px] font-semibold leading-[1.45] text-[#F2F5F8] sm:text-[13px] md:text-[14px] lg:text-[13px]">{title}</p>
                              {description ? (
                                <p className="mt-0.5 text-[11px] leading-[1.65] text-[#BAC4D0] sm:text-[12px] lg:text-[11px]">{description}</p>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex h-full flex-col justify-between rounded-[14px] border border-[#FFFFFF1B] bg-[#0B1017] p-3 sm:p-3.5 md:hidden md:p-4 lg:flex lg:p-4">
                        <div>
                          <p className="text-[13px] font-semibold text-[#F0CB77] sm:text-[14px] lg:text-[13px]">{copy.suitableFor}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                            {activeProduct.suitableFor.map((item) => (
                              <span
                                key={`${activeProduct.id}-${item}`}
                                className="rounded-full border border-[#FFFFFF2A] bg-[#0A0D13] px-2.5 py-1 text-[11px] text-[#EAF0F6] sm:px-3 sm:text-[12px] lg:px-2.5 lg:text-[11px]"
                              >
                                {item}
                              </span>
                            ))}
                          </div>

                          <p className="mt-2.5 text-[13px] font-semibold text-[#F0CB77] sm:mt-3.5 sm:text-[14px] lg:mt-3 lg:text-[13px]">{copy.sizesAndShipping}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                            {activeProduct.sizes.map((size) => (
                              <span
                                key={`${activeProduct.id}-${size}`}
                                className="rounded-full border border-[#FFFFFF2A] bg-[#0A0D13] px-2.5 py-1 text-[11px] text-[#EAF0F6] sm:px-3 sm:text-[12px] lg:px-2.5 lg:text-[11px]"
                              >
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRequestQuote}
                          className="group mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D39B52] bg-[#0A0D13] px-4 py-2.5 text-[12px] font-semibold text-[#F6F7F9] transition-all duration-300 hover:bg-gradient-to-l hover:from-[#FBEF9D] hover:to-[#A96522] hover:text-white sm:mt-4 sm:w-fit sm:px-5 sm:text-[13px] md:text-[14px] lg:mt-4 lg:text-[13px]"
                        >
                          {copy.requestQuote}
                          {isArabic ? (
                            <FiArrowLeft className="text-sm transition-transform duration-300 group-hover:-translate-x-1" />
                          ) : (
                            <FiArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="z-10 hidden md:order-3 md:col-span-2 md:block lg:hidden">
                    <div className="flex h-full flex-col justify-between rounded-[14px] border border-[#FFFFFF1B] bg-[#0B1017] p-3 sm:p-3.5 md:p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[13px] font-semibold text-[#F0CB77] sm:text-[14px]">{copy.suitableFor}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                            {activeProduct.suitableFor.map((item) => (
                              <span
                                key={`${activeProduct.id}-tablet-${item}`}
                                className="rounded-full border border-[#FFFFFF2A] bg-[#0A0D13] px-2.5 py-1 text-[11px] text-[#EAF0F6] sm:px-3 sm:text-[12px]"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-[13px] font-semibold text-[#F0CB77] sm:text-[14px]">{copy.sizesAndShipping}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                            {activeProduct.sizes.map((size) => (
                              <span
                                key={`${activeProduct.id}-tablet-${size}`}
                                className="rounded-full border border-[#FFFFFF2A] bg-[#0A0D13] px-2.5 py-1 text-[11px] text-[#EAF0F6] sm:px-3 sm:text-[12px]"
                              >
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRequestQuote}
                        className="group mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D39B52] bg-[#0A0D13] px-4 py-2.5 text-[12px] font-semibold text-[#F6F7F9] transition-all duration-300 hover:bg-gradient-to-l hover:from-[#FBEF9D] hover:to-[#A96522] hover:text-white sm:mt-4 sm:w-fit sm:px-5 sm:text-[13px] md:text-[14px]"
                      >
                        {copy.requestQuote}
                        {isArabic ? (
                          <FiArrowLeft className="text-sm transition-transform duration-300 group-hover:-translate-x-1" />
                        ) : (
                          <FiArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <div data-reveal="up" className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:mt-6 sm:gap-3 md:mt-6 lg:mt-5">
              <button
                type="button"
                onClick={showPrevious}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#D39B52] bg-[#0A0D13] text-[#F6F7F9] transition-all duration-300 hover:bg-gradient-to-l hover:from-[#FBEF9D] hover:to-[#A96522] hover:text-white sm:h-10 sm:w-10"
                aria-label={copy.previousProduct}
              >
                {isArabic ? <FiArrowRight /> : <FiArrowLeft />}
              </button>

              <div className="flex items-center gap-2">
                {products.map((product, index) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => showProductByIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? 'w-6 bg-gradient-to-r from-[#FBEF9D] to-[#A96522] sm:w-7'
                        : 'w-2.5 bg-[#8A8F97]'
                    }`}
                    aria-label={
                      isArabic
                        ? `${product.title} ${copy.showProductPrefix}`
                        : `${copy.showProductPrefix} ${product.title}`
                    }
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={showNext}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#D39B52] bg-[#0A0D13] text-[#F6F7F9] transition-all duration-300 hover:bg-gradient-to-l hover:from-[#FBEF9D] hover:to-[#A96522] hover:text-white sm:h-10 sm:w-10"
                aria-label={copy.nextProduct}
              >
                {isArabic ? <FiArrowLeft /> : <FiArrowRight />}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Section3
