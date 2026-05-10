import { useState } from 'react'
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
import coalImage from '../assets/Coal.png'
import coalPackageImage from '../assets/Coal Package.png'
import packagingImage from '../assets/Packaging.png'
import exportingImage from '../assets/Exporting.png'
import { useLanguage, type Language } from '../i18n/language'

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

type SlideDirection = 'next' | 'previous'

const sectionTitleGradient = 'bg-gradient-to-t from-[#FBEF9D] to-[#A96522] bg-clip-text text-transparent'

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
  },
}

function Section3() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState<SlideDirection>('next')
  const { language, isArabic } = useLanguage()

  const products = productsByLanguage[language]
  const copy = sectionCopyByLanguage[language]
  const activeProduct = products[activeIndex]
  const isEvenCard = activeIndex % 2 === 0

  const gridClassName = isEvenCard
    ? 'lg:grid-cols-[minmax(260px,0.95fr)_minmax(0,1.35fr)]'
    : 'lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.95fr)]'
  const cardAnimationClass =
    slideDirection === 'next'
      ? 'motion-safe:animate-[section3-card-next_460ms_cubic-bezier(0.22,1,0.36,1)]'
      : 'motion-safe:animate-[section3-card-prev_460ms_cubic-bezier(0.22,1,0.36,1)]'

  const showPrevious = () => {
    setSlideDirection('previous')
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1))
  }

  const showNext = () => {
    setSlideDirection('next')
    setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1))
  }

  const showProductByIndex = (index: number) => {
    if (index === activeIndex) return

    setSlideDirection(index > activeIndex ? 'next' : 'previous')
    setActiveIndex(index)
  }

  return (
    <section
      className="relative overflow-hidden bg-[#07090D] py-8 sm:py-10 lg:py-14 xl:py-16"
      dir={isArabic ? 'rtl' : 'ltr'}
      aria-labelledby="products-heading"
      id="products-section"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-[100px]">
        <div className="relative mb-6 flex items-center justify-center sm:mb-8 md:mb-10">
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 md:gap-6">
            <span className="h-[3px] w-12 bg-gradient-to-l from-[#FBEF9D] to-[#A96522] sm:w-20 md:w-[130px]" />
            <h2
              id="products-heading"
              className={`${sectionTitleGradient} text-center text-[30px] font-extrabold leading-none sm:text-[34px] md:text-[36px] lg:text-[40px]`}
            >
              {copy.title}
            </h2>
            <span className="h-[3px] w-12 bg-gradient-to-r from-[#FBEF9D] to-[#A96522] sm:w-20 md:w-[130px]" />
          </div>

          <a
            href="#"
            className={`absolute hidden items-center justify-center rounded-full border border-[#D39B52] bg-[#0A0D13] px-5 py-2.5 text-[13px] font-semibold text-[#F6F7F9] transition-all duration-300 hover:bg-gradient-to-l hover:from-[#FBEF9D] hover:to-[#A96522] hover:text-white md:inline-flex ${isArabic ? 'left-0' : 'right-0'}`}
          >
            {copy.viewAllProducts}
          </a>
        </div>

        <div className="-mt-2 mb-5 flex justify-center sm:mb-6 md:hidden">
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-full border border-[#D39B52] bg-[#0A0D13] px-4 py-2 text-[11px] font-semibold text-[#F6F7F9] transition-all duration-300 hover:bg-gradient-to-l hover:from-[#FBEF9D] hover:to-[#A96522] hover:text-white sm:px-5 sm:py-2.5 sm:text-[13px]"
          >
            {copy.viewAllProducts}
          </a>
        </div>

        <article
          key={activeProduct.id}
          className={`group mx-auto w-full max-w-[1440px] overflow-hidden rounded-[14px] border border-[#B9782F66] bg-[#080B10] shadow-[0_14px_34px_rgba(0,0,0,0.34)] sm:rounded-[18px] ${cardAnimationClass}`}
        >
          <div className="relative p-2.5 sm:p-4">
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

            <div className={`grid gap-2.5 ${gridClassName} sm:gap-3 lg:gap-4`}>
              <div
                className={`relative min-h-[220px] overflow-hidden rounded-[14px] border border-[#D39B523D] sm:min-h-[280px] lg:min-h-0 lg:aspect-auto ${
                  isEvenCard ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <img
                  src={activeProduct.image}
                  alt={activeProduct.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                />
                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
                  aria-hidden="true"
                />
                <span className={`absolute top-3 inline-flex items-center gap-1.5 rounded-full border border-[#FBEF9D70] bg-[#040506C7] px-2.5 py-1 text-[11px] text-[#FBEF9D] ${isArabic ? 'right-3' : 'left-3'}`}>
                  <FiCheckCircle className="text-xs" />
                  {activeProduct.category}
                </span>
              </div>

              <div className={`z-10 space-y-2.5 sm:space-y-3 ${isEvenCard ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="rounded-[14px] border border-[#FFFFFF1B] bg-[#0A0F15] p-3 sm:p-4">
                  <h3 className="mt-1 text-[20px] font-extrabold leading-tight text-white sm:mt-2 sm:text-[25px]">
                    {activeProduct.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-[1.8] text-[#DCE2EA] sm:text-[14px]">
                    {activeProduct.description}
                  </p>
                </div>

                <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[14px] border border-[#FFFFFF1B] bg-[#0B1017] p-3 sm:p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <h4 className="text-[17px] font-extrabold text-[#F0CB77]">{copy.specifications}</h4>
                    </div>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {activeProduct.specs.map(({ id, icon: Icon, title, description }) => (
                        <div key={id} className="rounded-[10px] border border-[#FFFFFF18] bg-[#FFFFFF08] p-2.5 sm:p-3">
                          <div className="mb-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#E0B46824] text-[#EAC170]">
                            <Icon className="text-[13px]" />
                          </div>
                          <p className="text-[12px] font-semibold text-[#F2F5F8] sm:text-[13px]">{title}</p>
                          <p className="mt-0.5 text-[11px] leading-relaxed text-[#BAC4D0]">{description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex h-full flex-col justify-between rounded-[14px] border border-[#FFFFFF1B] bg-[#0B1017] p-3 sm:p-4">
                    <div>
                      <p className="text-[13px] font-semibold text-[#F0CB77]">{copy.suitableFor}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {activeProduct.suitableFor.map((item) => (
                          <span
                            key={`${activeProduct.id}-${item}`}
                            className="rounded-full border border-[#FFFFFF2A] bg-[#0A0D13] px-2.5 py-1 text-[11px] text-[#EAF0F6]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <p className="mt-3 text-[13px] font-semibold text-[#F0CB77]">{copy.sizesAndShipping}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {activeProduct.sizes.map((size) => (
                          <span
                            key={`${activeProduct.id}-${size}`}
                            className="rounded-full border border-[#FFFFFF2A] bg-[#0A0D13] px-2.5 py-1 text-[11px] text-[#EAF0F6]"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>

                    <a
                      href="#"
                      className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D39B52] bg-[#0A0D13] px-4 py-2.5 text-[12px] font-semibold text-[#F6F7F9] transition-all duration-300 hover:bg-gradient-to-l hover:from-[#FBEF9D] hover:to-[#A96522] hover:text-white sm:w-fit sm:px-5 sm:text-[13px]"
                    >
                      {copy.requestQuote}
                      {isArabic ? (
                        <FiArrowLeft className="text-sm transition-transform duration-300 group-hover:-translate-x-1" />
                      ) : (
                        <FiArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                      )}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:mt-6 sm:gap-3">
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
                aria-label={`${copy.showProductPrefix} ${product.title}`}
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
      </div>
    </section>
  )
}

export default Section3
