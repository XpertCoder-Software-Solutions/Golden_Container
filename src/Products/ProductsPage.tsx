import { useEffect, useMemo, useState } from 'react'
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import type { IconType } from 'react-icons'
import { useLanguage, type Language } from '../i18n/language'

const sectionTitleGradient = 'bg-gradient-to-t from-[#FBEF9D] to-[#A96522] bg-clip-text text-transparent'
const productsPerPage = 12
const apiBaseUrl = ((import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? '').replace(/\/$/, '')
const productsApiUrl = `${apiBaseUrl}/api/products`

type ProductSpec = {
  id: string
  icon: IconType
  title: string
  description: string
}

type ProductCard = {
  id: string
  title: string
  description: string
  image: string
  category: string
  sizes: string[]
  specs: ProductSpec[]
  suitableFor: string[]
}

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

const pageCopyByLanguage: Record<Language, {
  title: string
  subtitle: string
  categoryLabel: string
  specifications: string
  suitableFor: string
  sizesAndShipping: string
  backHome: string
  requestQuote: string
  previousPage: string
  nextPage: string
  pageLabel: string
  loadingProducts: string
  productsLoadError: string
  noProducts: string
}> = {
  en: {
    title: 'All Products',
    subtitle: 'Browse our complete charcoal and export product lineup.',
    categoryLabel: 'Category',
    specifications: 'Specifications',
    suitableFor: 'Suitable For',
    sizesAndShipping: 'Sizes / Shipping Options',
    backHome: 'Back to Home',
    requestQuote: 'Request a Quote',
    previousPage: 'Previous',
    nextPage: 'Next',
    pageLabel: 'Page',
    loadingProducts: 'Loading products...',
    productsLoadError: 'Unable to load products right now.',
    noProducts: 'No products available at the moment.',
  },
  ar: {
    title: 'جميع المنتجات',
    subtitle: 'تصفح القائمة الكاملة لمنتجات الفحم وحلول التصدير.',
    categoryLabel: 'الفئة',
    specifications: 'المواصفات',
    suitableFor: 'مناسب لـ',
    sizesAndShipping: 'الأحجام / خيارات الشحن',
    backHome: 'العودة للرئيسية',
    requestQuote: 'اطلب عرض سعر',
    previousPage: 'السابق',
    nextPage: 'التالي',
    pageLabel: 'الصفحة',
    loadingProducts: 'جاري تحميل المنتجات...',
    productsLoadError: 'تعذر تحميل المنتجات حاليًا.',
    noProducts: 'لا توجد منتجات متاحة حاليًا.',
  },
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
  const image = product.product_image_url || product.product_image || ''

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

type ProductsPageProps = {
  onRequestQuote?: (productId: string) => void
}

function ProductsPage({ onRequestQuote }: ProductsPageProps) {
  const { language, isArabic } = useLanguage()
  const copy = pageCopyByLanguage[language]
  const ArrowIcon = isArabic ? FiArrowLeft : FiArrowRight
  const bottomGlowPositionClass = isArabic
    ? '-bottom-36 -left-24 sm:-bottom-44 sm:-left-32'
    : '-bottom-36 -right-24 sm:-bottom-44 sm:-right-32'
  const topGlowPositionClass = isArabic
    ? '-top-28 -right-24 sm:-top-36 sm:-right-32'
    : '-top-28 -left-24 sm:-top-36 sm:-left-32'
  const [currentPage, setCurrentPage] = useState(1)
  const [apiProducts, setApiProducts] = useState<ProductApiItem[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [productsLoadError, setProductsLoadError] = useState<string | null>(null)
  const sectionPanelClassName = 'rounded-[12px] border border-white/12 bg-[#0C1017]/92 p-2.5 sm:rounded-[13px] sm:p-3'
  const products = useMemo(
    () => apiProducts.map((product) => mapProductToCard(product, language)),
    [apiProducts, language],
  )
  const totalPages = Math.max(1, Math.ceil(products.length / productsPerPage))

  useEffect(() => {
    const abortController = new AbortController()

    const fetchProducts = async () => {
      setIsLoadingProducts(true)
      setProductsLoadError(null)

      try {
        const response = await fetch(productsApiUrl, { signal: abortController.signal })

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

    void fetchProducts()

    return () => {
      abortController.abort()
    }
  }, [copy.productsLoadError])

  useEffect(() => {
    setCurrentPage(1)
  }, [language])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage
    return products.slice(startIndex, startIndex + productsPerPage)
  }, [currentPage, products])

  const pageNumbers = useMemo(() => {
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    startPage = Math.max(1, endPage - maxVisiblePages + 1)

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)
  }, [currentPage, totalPages])

  return (
    <section className="relative overflow-x-clip overflow-y-visible bg-[#07090D] pb-12 pt-[132px] sm:pb-14 sm:pt-[148px] md:pb-16 md:pt-[164px]" dir={isArabic ? 'rtl' : 'ltr'}>
      <span
        className={`pointer-events-none absolute z-0 h-[360px] w-[360px] premium-glow-breathe rounded-full bg-[radial-gradient(circle_at_center,rgba(251,239,157,0.34)_0%,rgba(211,155,82,0.24)_38%,rgba(169,101,34,0.12)_62%,transparent_80%)] blur-[100px] sm:h-[460px] sm:w-[460px] ${bottomGlowPositionClass}`}
        aria-hidden="true"
      />
      <span
        className={`pointer-events-none absolute z-0 h-[340px] w-[340px] premium-glow-breathe rounded-full bg-[radial-gradient(circle_at_center,rgba(251,239,157,0.28)_0%,rgba(211,155,82,0.2)_38%,rgba(169,101,34,0.1)_62%,transparent_80%)] blur-[95px] sm:h-[430px] sm:w-[430px] ${topGlowPositionClass}`}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-[25px] md:px-[50px] lg:px-[100px]">
        <div className="mb-7 sm:mb-9 md:mb-10">
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 md:gap-6">
            <span className="premium-shimmer-line h-[3px] w-[44px] bg-gradient-to-l from-[#FBEF9D] to-[#A96522] sm:w-[88px] md:w-[120px]" />
            <h1 className={`${sectionTitleGradient} text-center text-[30px] font-extrabold leading-[1.2] sm:text-[36px] md:text-[42px]`}>
              {copy.title}
            </h1>
            <span className="premium-shimmer-line h-[3px] w-[44px] bg-gradient-to-r from-[#FBEF9D] to-[#A96522] sm:w-[88px] md:w-[120px]" />
          </div>
          <p className="mx-auto mt-2 max-w-[720px] text-center text-sm text-[#D3DAE6] sm:text-[15px]">{copy.subtitle}</p>
        </div>

        {isLoadingProducts ? (
          <div className="rounded-[16px] border border-white/10 bg-[#0B1017]/88 p-5 text-center text-sm text-[#D8E0EC] sm:text-[15px]">
            {copy.loadingProducts}
          </div>
        ) : productsLoadError ? (
          <div className="rounded-[16px] border border-[#FFB4B45C] bg-[#201014]/65 p-5 text-center text-sm text-[#FFD3D3] sm:text-[15px]">
            {productsLoadError}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[16px] border border-white/10 bg-[#0B1017]/88 p-5 text-center text-sm text-[#D8E0EC] sm:text-[15px]">
            {copy.noProducts}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
            {paginatedProducts.map((product) => (
              <article
                key={product.id}
                className="premium-card-hover group relative isolate overflow-hidden rounded-[22px] border border-[#D39B525C] bg-[linear-gradient(158deg,rgba(16,21,30,0.98),rgba(7,10,15,0.99))] shadow-[0_22px_42px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.06)]"
              >
                <span
                  className="pointer-events-none absolute -top-20 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,239,157,0.22),rgba(169,101,34,0.08)_52%,transparent_75%)] blur-2xl"
                  aria-hidden="true"
                />
                <span
                  className={`pointer-events-none absolute -bottom-16 h-36 w-36 rounded-full bg-[radial-gradient(circle_at_center,rgba(211,155,82,0.2),rgba(169,101,34,0.08)_55%,transparent_75%)] blur-2xl ${isArabic ? '-left-8' : '-right-8'}`}
                  aria-hidden="true"
                />

                <div className="relative z-10 grid gap-3 border-b border-white/10 p-3 sm:gap-3.5 sm:p-4 lg:grid-cols-[minmax(165px,0.78fr)_minmax(0,1.22fr)]">
                  <div className="relative overflow-hidden rounded-[13px] border border-[#D39B5238] bg-[#06080D]">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-[176px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.045] sm:h-[188px] lg:h-full"
                      loading="lazy"
                      decoding="async"
                    />
                    <span
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
                      aria-hidden="true"
                    />
                    <span className={`absolute top-3 inline-flex items-center gap-1.5 rounded-full border border-[#FBEF9D70] bg-[#040506C7] px-2.5 py-1 text-[11px] text-[#FBEF9D] ${isArabic ? 'right-3' : 'left-3'}`}>
                      <FiCheckCircle className="text-xs" />
                      {product.category}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center rounded-[13px] border border-white/10 bg-[#0B1017]/88 p-3 sm:p-3.5">
                    <h2 className="mt-1.5 text-[18px] font-extrabold leading-[1.35] text-white sm:text-[20px]">
                      {product.title}
                    </h2>
                    {product.description ? (
                      <p className="mt-1.5 text-[12px] leading-[1.72] text-[#D8E0EC] sm:text-[13px]">
                        {product.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="relative z-10 grid gap-2.5 p-3 sm:gap-3 sm:p-3.5 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
                  <div className={sectionPanelClassName}>
                    <p className="text-[12px] font-semibold text-[#F0CB77] sm:text-[13px]">{copy.specifications}</p>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {product.specs.map(({ id, icon: Icon, title, description }) => (
                        <article
                          key={`${product.id}-${id}`}
                          className="rounded-[9px] border border-[#FFFFFF18] bg-[#FFFFFF08] p-2.5"
                        >
                          <div className="mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E0B46824] text-[#EAC170]">
                            <Icon className="text-[12px]" />
                          </div>
                          <p className="text-[11px] font-semibold leading-[1.45] text-[#F2F5F8] sm:text-[12px]">{title}</p>
                          {description ? (
                            <p className="mt-0.5 text-[10px] leading-[1.6] text-[#BAC4D0] sm:text-[11px]">{description}</p>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className={`${sectionPanelClassName} flex flex-col`}>
                    <div>
                      <p className="text-[12px] font-semibold text-[#F0CB77] sm:text-[13px]">{copy.suitableFor}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {product.suitableFor.map((item) => (
                          <span
                            key={`${product.id}-${item}`}
                            className="rounded-full border border-[#FFFFFF2A] bg-[#0A0D13] px-2 py-1 text-[10px] text-[#EAF0F6] sm:px-2.5 sm:text-[11px]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-[12px] font-semibold text-[#F0CB77] sm:text-[13px]">{copy.sizesAndShipping}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {product.sizes.map((size) => (
                          <span
                            key={`${product.id}-${size}`}
                            className="rounded-full border border-[#FFFFFF2A] bg-[#0A0D13] px-2 py-1 text-[10px] text-[#EAF0F6] sm:px-2.5 sm:text-[11px]"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRequestQuote?.(product.id)}
                      className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-[#D39B52] bg-[#0A0D13] px-4 py-2 text-[11px] font-semibold text-[#F6F7F9] transition-all duration-300 hover:bg-gradient-to-l hover:from-[#FBEF9D] hover:to-[#A96522] hover:text-white sm:text-[12px]"
                    >
                      {copy.requestQuote}
                      <ArrowIcon className="text-sm" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="mt-7 flex flex-col items-center gap-3 sm:mt-8">
            <p className="text-xs font-semibold text-[#E1B56E] sm:text-sm">
              {copy.pageLabel} {currentPage} / {totalPages}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((previousPage) => Math.max(1, previousPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#D39B52] bg-[#0A0D13] px-3 py-1.5 text-[11px] font-semibold text-[#F6F7F9] transition-all duration-300 hover:bg-gradient-to-l hover:from-[#FBEF9D] hover:to-[#A96522] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-[12px]"
              >
                {isArabic ? <FiArrowRight className="text-sm" /> : <FiArrowLeft className="text-sm" />}
                {copy.previousPage}
              </button>

              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full border px-2.5 text-[11px] font-semibold transition-all duration-300 sm:text-[12px] ${
                    currentPage === pageNumber
                      ? 'border-[#FBEF9D] bg-gradient-to-l from-[#FBEF9D] to-[#A96522] text-white'
                      : 'border-[#FFFFFF2E] bg-[#0A0D13] text-[#F6F7F9] hover:border-[#D39B52] hover:text-[#FFE6B7]'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((previousPage) => Math.min(totalPages, previousPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#D39B52] bg-[#0A0D13] px-3 py-1.5 text-[11px] font-semibold text-[#F6F7F9] transition-all duration-300 hover:bg-gradient-to-l hover:from-[#FBEF9D] hover:to-[#A96522] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-[12px]"
              >
                {copy.nextPage}
                {isArabic ? <FiArrowLeft className="text-sm" /> : <FiArrowRight className="text-sm" />}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default ProductsPage
