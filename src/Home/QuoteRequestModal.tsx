import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { FiX } from 'react-icons/fi'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { useLanguage, type Language } from '../i18n/language'
import type { QuoteProductOption } from './Section 3'
import PhoneNumberInput from '../components/PhoneNumberInput'

type QuoteRequestModalProps = {
  isOpen: boolean
  initialProductId: string | null
  productOptions: readonly QuoteProductOption[]
  onClose: () => void
}

type MessagesApiResponse = {
  message?: string
  errors?: Record<string, unknown>
}

type ProductApiItem = {
  id: number
  name_ar: string
  name_en: string
}

type ProductsApiResponse = {
  data?: unknown
}

type CountryOption = {
  code: string
  label: string
}

const apiBaseUrl = ((import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? '').replace(/\/$/, '')
const productsApiUrl = `${apiBaseUrl}/api/products`
const priceRequestsApiUrl = `${apiBaseUrl}/api/price-requests`

const modalCopyByLanguage: Record<Language, {
  title: string
  subtitle: string
  productLabel: string
  productPlaceholder: string
  selectedProductLockedHint: string
  customerNameLabel: string
  phoneLabel: string
  emailLabel: string
  quantityLabel: string
  shippingCountryLabel: string
  shippingCountryPlaceholder: string
  additionalNotesLabel: string
  additionalNotesPlaceholder: string
  submit: string
  sending: string
  cancel: string
  requiredMessage: string
  successTitle: string
  successMessage: string
  errorTitle: string
  errorMessage: string
  productsLoadingMessage: string
  productsLoadErrorMessage: string
  closeLabel: string
}> = {
  en: {
    title: 'Request a Quote',
    subtitle: 'Share your order details and our team will contact you shortly.',
    productLabel: 'Product',
    productPlaceholder: 'Select product',
    selectedProductLockedHint: 'Product is preselected from your chosen item.',
    customerNameLabel: 'Customer Name',
    phoneLabel: 'Phone Number',
    emailLabel: 'Email',
    quantityLabel: 'Quantity',
    shippingCountryLabel: 'Shipping Country',
    shippingCountryPlaceholder: 'Select destination country',
    additionalNotesLabel: 'Additional Notes',
    additionalNotesPlaceholder: 'Any custom packing, specs, or shipment notes',
    submit: 'Send Quote Request',
    sending: 'Sending...',
    cancel: 'Cancel',
    requiredMessage: 'Please complete all required fields.',
    successTitle: 'Request Sent',
    successMessage: 'Your quote request has been sent successfully.',
    errorTitle: 'Unable to Send',
    errorMessage: 'Something went wrong. Please try again.',
    productsLoadingMessage: 'Loading products. Please wait a moment.',
    productsLoadErrorMessage: 'Unable to load products right now. Please try again shortly.',
    closeLabel: 'Close quote request modal',
  },
  ar: {
    title: 'اطلب عرض سعر',
    subtitle: 'شارك تفاصيل طلبك وسيتواصل معك فريقنا في أقرب وقت.',
    productLabel: 'المنتج',
    productPlaceholder: 'اختر المنتج',
    selectedProductLockedHint: 'تم اختيار المنتج من العنصر الذي ضغطت عليه.',
    customerNameLabel: 'اسم العميل',
    phoneLabel: 'رقم الهاتف',
    emailLabel: 'البريد الإلكتروني',
    quantityLabel: 'الكمية',
    shippingCountryLabel: 'الدولة المطلوبة للشحن',
    shippingCountryPlaceholder: 'اختر دولة الشحن',
    additionalNotesLabel: 'ملاحظات إضافية',
    additionalNotesPlaceholder: 'أي تفاصيل إضافية عن التعبئة أو المواصفات أو الشحن',
    submit: 'إرسال طلب عرض السعر',
    sending: 'جاري الإرسال...',
    cancel: 'إلغاء',
    requiredMessage: 'يرجى استكمال كل الحقول المطلوبة.',
    successTitle: 'تم الإرسال',
    successMessage: 'تم إرسال طلب عرض السعر بنجاح.',
    errorTitle: 'تعذر الإرسال',
    errorMessage: 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.',
    productsLoadingMessage: 'جاري تحميل المنتجات. يرجى الانتظار قليلًا.',
    productsLoadErrorMessage: 'تعذر تحميل المنتجات حاليًا. حاول مرة أخرى بعد قليل.',
    closeLabel: 'إغلاق نافذة طلب عرض السعر',
  },
}

const getApiMessage = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const { message, errors } = payload as MessagesApiResponse

  if (typeof message === 'string') {
    const normalizedMessage = message.trim()
    if (normalizedMessage.length > 0) {
      return normalizedMessage
    }
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const toProductApiItem = (value: unknown): ProductApiItem | null => {
  if (!isRecord(value)) {
    return null
  }

  const numericId = Number(value.id)
  const nameAr = typeof value.name_ar === 'string' ? value.name_ar.trim() : ''
  const nameEn = typeof value.name_en === 'string' ? value.name_en.trim() : ''

  if (!Number.isInteger(numericId) || numericId < 1 || !nameAr || !nameEn) {
    return null
  }

  return {
    id: numericId,
    name_ar: nameAr,
    name_en: nameEn,
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

const normalizeProductName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')

const mapInitialProductIdToApiProductId = (
  initialProductId: string | null,
  productOptions: readonly QuoteProductOption[],
  apiProducts: readonly ProductApiItem[],
) => {
  if (!initialProductId || apiProducts.length === 0) {
    return ''
  }

  const numericInitialProductId = Number(initialProductId)
  if (
    Number.isInteger(numericInitialProductId) &&
    numericInitialProductId > 0 &&
    apiProducts.some((apiProduct) => apiProduct.id === numericInitialProductId)
  ) {
    return `${numericInitialProductId}`
  }

  const localProductTitle = productOptions.find(
    (productOption) => productOption.id === initialProductId,
  )?.title

  if (!localProductTitle) {
    return ''
  }

  const normalizedLocalTitle = normalizeProductName(localProductTitle)
  if (!normalizedLocalTitle) {
    return ''
  }

  const matchedProduct = apiProducts.find((apiProduct) => {
    const normalizedArabicName = normalizeProductName(apiProduct.name_ar)
    const normalizedEnglishName = normalizeProductName(apiProduct.name_en)

    return (
      normalizedArabicName === normalizedLocalTitle ||
      normalizedEnglishName === normalizedLocalTitle
    )
  })

  return matchedProduct ? `${matchedProduct.id}` : ''
}

const getRegionCodes = () => {
  const allAlpha2Codes: string[] = []

  for (let firstLetterCode = 65; firstLetterCode <= 90; firstLetterCode += 1) {
    for (let secondLetterCode = 65; secondLetterCode <= 90; secondLetterCode += 1) {
      allAlpha2Codes.push(`${String.fromCharCode(firstLetterCode)}${String.fromCharCode(secondLetterCode)}`)
    }
  }

  return allAlpha2Codes
}

const buildCountriesOptions = (language: Language): CountryOption[] => {
  const regionCodes = getRegionCodes()

  if (regionCodes.length === 0) {
    return []
  }

  const locale = language === 'ar' ? 'ar' : 'en'
  const formatter = new Intl.DisplayNames([locale], { type: 'region' })

  const uniqueCountries = new Map<string, string>()
  for (const code of regionCodes) {
    const label = formatter.of(code)
    if (!label || label === code || code === 'EU' || code === 'UN') {
      continue
    }

    uniqueCountries.set(code, label)
  }

  return Array.from(uniqueCountries.entries())
    .map(([code, label]) => ({ code, label }))
    .sort((firstCountry, secondCountry) =>
      firstCountry.label.localeCompare(secondCountry.label, locale),
    )
}

function QuoteRequestModal({
  isOpen,
  initialProductId,
  productOptions,
  onClose,
}: QuoteRequestModalProps) {
  const { language, isArabic } = useLanguage()
  const copy = modalCopyByLanguage[language]
  const [selectedProductId, setSelectedProductId] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [quantity, setQuantity] = useState('')
  const [shippingCountry, setShippingCountry] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [apiProducts, setApiProducts] = useState<ProductApiItem[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [productsLoadError, setProductsLoadError] = useState(false)
  const [isProductPreselected, setIsProductPreselected] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const countriesOptions = useMemo(() => buildCountriesOptions(language), [language])
  const selectableProducts = useMemo(
    () =>
      apiProducts.map((apiProduct) => ({
        id: `${apiProduct.id}`,
        title: language === 'ar' ? apiProduct.name_ar : apiProduct.name_en,
      })),
    [apiProducts, language],
  )

  const showAlert = (type: 'success' | 'error', title: string, text: string) => {
    void Swal.fire({
      icon: type,
      title,
      text,
      confirmButtonText: isArabic ? 'حسنًا' : 'OK',
      customClass: {
        container: 'premium-swal-container',
        popup: 'premium-swal-popup',
        icon: 'premium-swal-icon',
        title: 'premium-swal-title',
        htmlContainer: 'premium-swal-text',
        confirmButton: 'premium-swal-confirm',
      },
      buttonsStyling: false,
      showClass: {
        popup: 'premium-swal-show',
      },
      hideClass: {
        popup: 'premium-swal-hide',
      },
      backdrop: 'rgba(6, 10, 16, 0.76)',
      background: '#0B0F16',
      color: '#F8F9FC',
      iconColor: type === 'success' ? '#F0CE96' : '#FFB4B4',
      didOpen: () => {
        const popup = Swal.getPopup()
        if (popup) {
          popup.setAttribute('dir', isArabic ? 'rtl' : 'ltr')
        }
      },
    })
  }

  const closeAndReset = () => {
    setSelectedProductId('')
    setCustomerName('')
    setPhoneNumber('')
    setEmail('')
    setQuantity('')
    setShippingCountry('')
    setAdditionalNotes('')
    setIsProductPreselected(false)
    setIsSubmitting(false)
    onClose()
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setSelectedProductId('')
    setCustomerName('')
    setPhoneNumber('')
    setEmail('')
    setQuantity('')
    setShippingCountry('')
    setAdditionalNotes('')
    setIsProductPreselected(false)
    setIsSubmitting(false)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const abortController = new AbortController()

    const loadProducts = async () => {
      setIsLoadingProducts(true)
      setProductsLoadError(false)

      try {
        const response = await fetch(productsApiUrl, { signal: abortController.signal })

        let responsePayload: unknown = null
        try {
          responsePayload = await response.json()
        } catch {
          responsePayload = null
        }

        if (!response.ok) {
          throw new Error(getApiMessage(responsePayload) ?? copy.productsLoadErrorMessage)
        }

        const parsedProducts = parseProductsFromResponse(responsePayload)
        if (parsedProducts.length === 0) {
          throw new Error(copy.productsLoadErrorMessage)
        }

        setApiProducts(parsedProducts)
        const mappedInitialProductId = mapInitialProductIdToApiProductId(
          initialProductId,
          productOptions,
          parsedProducts,
        )
        setSelectedProductId(mappedInitialProductId)
        setIsProductPreselected(mappedInitialProductId.length > 0)
      } catch (error) {
        if (abortController.signal.aborted) {
          return
        }

        setApiProducts([])
        setProductsLoadError(true)
        setSelectedProductId('')
        setIsProductPreselected(false)
        const fallbackMessage =
          error instanceof Error && error.message.trim()
            ? error.message
            : copy.productsLoadErrorMessage
        showAlert('error', copy.errorTitle, fallbackMessage)
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingProducts(false)
        }
      }
    }

    void loadProducts()

    return () => {
      abortController.abort()
    }
  }, [copy.errorTitle, copy.productsLoadErrorMessage, initialProductId, isOpen, productOptions])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAndReset()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    if (isLoadingProducts) {
      showAlert('error', copy.errorTitle, copy.productsLoadingMessage)
      return
    }

    if (productsLoadError || selectableProducts.length === 0) {
      showAlert('error', copy.errorTitle, copy.productsLoadErrorMessage)
      return
    }

    if (!selectedProductId || !customerName.trim() || !phoneNumber.trim() || !email.trim() || !quantity.trim() || !shippingCountry) {
      showAlert('error', copy.errorTitle, copy.requiredMessage)
      return
    }

    const normalizedQuantity = Number(quantity.trim())
    const normalizedProductId = Number(selectedProductId)

    if (!Number.isInteger(normalizedProductId) || normalizedProductId < 1 || !Number.isInteger(normalizedQuantity) || normalizedQuantity < 1) {
      showAlert('error', copy.errorTitle, copy.requiredMessage)
      return
    }

    setIsSubmitting(true)

    try {
      const normalizedNotes = additionalNotes.trim()

      const response = await fetch(priceRequestsApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: normalizedProductId,
          client_name: customerName.trim(),
          phone_number: phoneNumber.trim(),
          email: email.trim(),
          quantity: normalizedQuantity,
          shipping_country: shippingCountry,
          additional_notes: normalizedNotes.length > 0 ? normalizedNotes : null,
        }),
      })

      let responsePayload: unknown = null
      try {
        responsePayload = await response.json()
      } catch {
        responsePayload = null
      }

      if (!response.ok) {
        throw new Error(getApiMessage(responsePayload) ?? copy.errorMessage)
      }

      showAlert('success', copy.successTitle, copy.successMessage)
      closeAndReset()
    } catch (error) {
      const fallbackMessage =
        error instanceof Error && error.message.trim() ? error.message : copy.errorMessage
      showAlert('error', copy.errorTitle, fallbackMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isProductSelectDisabled =
    isProductPreselected ||
    isLoadingProducts ||
    productsLoadError ||
    selectableProducts.length === 0

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#05070D]/80 px-4 py-6 backdrop-blur-[2px]"
      role="presentation"
      onClick={closeAndReset}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        dir={isArabic ? 'rtl' : 'ltr'}
        className="relative w-full max-w-[680px] overflow-hidden rounded-[22px] border border-[#D39B5299] bg-[linear-gradient(155deg,rgba(14,18,24,0.98),rgba(9,12,17,0.99))] p-5 text-[#F8F9FC] shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label={copy.closeLabel}
          onClick={closeAndReset}
          className={`absolute top-3 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/5 text-[#F4D9A4] transition-all duration-200 hover:border-[#F0CE96] hover:bg-white/10 ${isArabic ? 'left-3' : 'right-3'}`}
        >
          <FiX />
        </button>

        <div className={`mb-5 ${isArabic ? 'text-right' : 'text-left'}`}>
          <h3 className="text-[24px] font-extrabold leading-[1.2] text-[#F8F9FC] sm:text-[28px]">
            {copy.title}
          </h3>
          <p className="mt-2 text-sm leading-7 text-[#D4DBE8]">{copy.subtitle}</p>
        </div>

        <form className="grid gap-3 sm:grid-cols-2 sm:gap-4" onSubmit={handleSubmit} noValidate>
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-[#E6BF80]">{copy.productLabel}</span>
            <select
              value={selectedProductId}
              onChange={(event) => setSelectedProductId(event.target.value)}
              disabled={isProductSelectDisabled}
              required
              className={`h-[52px] rounded-[12px] border px-4 text-sm text-[#FFFFFF] focus:outline-none ${
                isProductSelectDisabled
                  ? 'cursor-not-allowed border-[#D39B5266] bg-[#111620] text-[#E7DFC9]'
                  : 'border-white/15 bg-[#0A0D12] focus:border-[#D8A45C]'
              }`}
            >
              <option value="">{copy.productPlaceholder}</option>
              {selectableProducts.map((productOption) => (
                <option key={productOption.id} value={productOption.id}>
                  {productOption.title}
                </option>
              ))}
            </select>
            {isProductPreselected ? (
              <p className="text-xs leading-5 text-[#DAB277]">{copy.selectedProductLockedHint}</p>
            ) : null}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#E6BF80]">{copy.customerNameLabel}</span>
            <input
              type="text"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              autoComplete="name"
              maxLength={120}
              required
              className="h-[52px] rounded-[12px] border border-white/15 bg-[#0A0D12] px-4 text-sm text-[#FFFFFF] placeholder:text-[#8F97A8] focus:border-[#D8A45C] focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#E6BF80]">{copy.phoneLabel}</span>
            <PhoneNumberInput
              id="quote-phone-number"
              value={phoneNumber}
              onChange={setPhoneNumber}
              language={language}
              placeholder={copy.phoneLabel}
              autoComplete="tel"
              maxLength={20}
              required
              disabled={isSubmitting}
              containerClassName="h-[52px]"
              selectClassName="min-w-[108px] sm:min-w-[120px]"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#E6BF80]">{copy.emailLabel}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              maxLength={180}
              required
              className="h-[52px] rounded-[12px] border border-white/15 bg-[#0A0D12] px-4 text-sm text-[#FFFFFF] placeholder:text-[#8F97A8] focus:border-[#D8A45C] focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#E6BF80]">{copy.quantityLabel}</span>
            <input
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              min={1}
              step={1}
              required
              className="h-[52px] rounded-[12px] border border-white/15 bg-[#0A0D12] px-4 text-sm text-[#FFFFFF] placeholder:text-[#8F97A8] focus:border-[#D8A45C] focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-[#E6BF80]">{copy.shippingCountryLabel}</span>
            <select
              value={shippingCountry}
              onChange={(event) => setShippingCountry(event.target.value)}
              required
              className="h-[52px] rounded-[12px] border border-white/15 bg-[#0A0D12] px-4 text-sm text-[#FFFFFF] focus:border-[#D8A45C] focus:outline-none"
            >
              <option value="">{copy.shippingCountryPlaceholder}</option>
              {countriesOptions.map((countryOption) => (
                <option key={countryOption.code} value={countryOption.label}>
                  {countryOption.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-[#E6BF80]">{copy.additionalNotesLabel}</span>
            <textarea
              value={additionalNotes}
              onChange={(event) => setAdditionalNotes(event.target.value)}
              rows={3}
              maxLength={600}
              placeholder={copy.additionalNotesPlaceholder}
              className="min-h-[108px] rounded-[12px] border border-white/15 bg-[#0A0D12] px-4 py-3 text-sm text-[#FFFFFF] placeholder:text-[#8F97A8] focus:border-[#D8A45C] focus:outline-none"
            />
          </label>

          <div className="mt-2 flex flex-wrap items-center justify-end gap-2.5 sm:col-span-2">
            <button
              type="button"
              onClick={closeAndReset}
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-[#F6F7F9] transition-all duration-200 hover:border-[#E7C58D] hover:text-[#FFE7BC]"
            >
              {copy.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingProducts || productsLoadError || selectableProducts.length === 0}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-l from-[#FBEF9D] via-[#D39B52] to-[#A96522] px-5 py-2.5 text-sm font-semibold text-[#FFFDF4] shadow-[0_12px_22px_rgba(0,0,0,0.32)] transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? copy.sending : copy.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuoteRequestModal
