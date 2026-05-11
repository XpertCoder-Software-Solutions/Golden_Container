import type { IconType } from 'react-icons'
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiGlobe,
  FiTruck,
} from 'react-icons/fi'
import coalImage from '../assets/Coal.webp'
import packagingImage from '../assets/Packaging.webp'
import { useLanguage, type Language } from '../i18n/language'

type HeroHighlight = {
  id: string
  icon: IconType
  label: string
}

type HeroStat = {
  id: string
  value: string
  label: string
}

type HeroCopy = {
  eyebrow: string
  headingLineOne: string
  headingLineTwo: string
  description: string
  primaryCtaLabel: string
  secondaryCtaLabel: string
  highlights: HeroHighlight[]
  stats: HeroStat[]
  heroImageAlt: string
  floatingCardTitle: string
  floatingCardSubtitle: string
  visualBadge: string
}

const sectionTitleGradient = 'bg-gradient-to-t from-[#FBEF9D] to-[#A96522] bg-clip-text text-transparent'
const primaryButtonGradient = 'bg-gradient-to-l from-[#F2E89B] via-[#D39B52] to-[#A96522]'

const heroCopyByLanguage: Record<Language, HeroCopy> = {
  en: {
    eyebrow: 'Egyptian Charcoal Export Specialist',
    headingLineOne: 'Premium Charcoal for',
    headingLineTwo: 'Global Markets',
    description:
      'Golden Container supplies natural charcoal with reliable quality, private-label packaging, and export-ready logistics across Europe, Africa, and Asia.',
    primaryCtaLabel: 'Request a Quote',
    secondaryCtaLabel: 'Explore Products',
    highlights: [
      { id: 'global-shipping', icon: FiGlobe, label: 'Export to 20+ countries' },
      { id: 'delivery', icon: FiTruck, label: 'Coordinated shipping and delivery' },
    ],
    stats: [
      { id: 'years', value: '10+', label: 'Years Experience' },
      { id: 'shipments', value: '1500+', label: 'Shipments Completed' },
      { id: 'clients', value: '100+', label: 'Global Clients' },
    ],
    heroImageAlt: 'Premium charcoal ready for export',
    floatingCardTitle: 'Export-Ready Packaging',
    floatingCardSubtitle: 'Designed for wholesale and retail orders.',
    visualBadge: 'Quality Checked',
  },
  ar: {
    eyebrow: 'متخصصون في تصدير الفحم النباتي المصري',
    headingLineOne: 'فحم نباتي فاخر',
    headingLineTwo: 'للأسواق العالمية',
    description:
      'جولدن كونتينر توفر فحمًا طبيعيًا بجودة ثابتة، وتعبئة مخصصة، وخدمات شحن وتصدير جاهزة للأسواق في أوروبا وأفريقيا وآسيا.',
    primaryCtaLabel: 'اطلب عرض سعر',
    secondaryCtaLabel: 'استكشف المنتجات',
    highlights: [
      { id: 'global-shipping', icon: FiGlobe, label: 'تصدير إلى أكثر من 20 دولة' },
      { id: 'delivery', icon: FiTruck, label: 'تنسيق كامل للشحن والتسليم' },
    ],
    stats: [
      { id: 'years', value: '+10', label: 'سنوات خبرة' },
      { id: 'shipments', value: '+1500', label: 'شحنة مكتملة' },
      { id: 'clients', value: '+100', label: 'عميل حول العالم' },
    ],
    heroImageAlt: 'فحم نباتي فاخر جاهز للتصدير',
    floatingCardTitle: 'تعبئة جاهزة للتصدير',
    floatingCardSubtitle: 'مناسبة لطلبات الجملة والتجزئة.',
    visualBadge: 'جودة معتمدة',
  },
}

function Section1() {
  const { language, isArabic } = useLanguage()
  const copy = heroCopyByLanguage[language]
  const ArrowIcon = isArabic ? FiArrowLeft : FiArrowRight
  const headingLineHeightClass = isArabic ? 'leading-[1.38]' : 'leading-[1.12]'
  const descriptionLineHeightClass = isArabic ? 'leading-[1.95]' : 'leading-[1.8]'
  const textAlignClass = isArabic ? 'text-right' : 'text-left'
  const badgePositionClass = isArabic ? 'right-3 sm:right-4' : 'left-3 sm:left-4'
  const cardPositionClass = isArabic ? 'left-2 sm:left-4 md:left-6' : 'right-2 sm:right-4 md:right-6'

  return (
    <section
      id="home-section"
      className="relative overflow-x-clip overflow-visible bg-[#07090D] pb-10 pt-[110px] sm:pb-12 sm:pt-[122px] md:pb-14 md:pt-[136px] lg:pb-16 lg:pt-[152px]"
      dir={isArabic ? 'rtl' : 'ltr'}
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* <img src={coalImage} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
        <video
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={coalImage}
        >
          <source src={heroBackgroundVideoWebm} type="video/webm" />
          <source src={heroBackgroundVideoMp4} type="video/mp4" />
        </video>
        <span className="absolute inset-0 bg-[#05070D]/72" /> */}
        <span className="absolute inset-0 premium-glow-breathe bg-[radial-gradient(circle_at_82%_18%,rgba(230,176,100,0.22),transparent_48%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-[25px] md:px-[50px] lg:px-[100px]">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-10 xl:gap-14">
          <article className={`${textAlignClass}`}>
            <span data-reveal="left" className="inline-flex rounded-full border border-[#E3B36E]/40 bg-[#151916]/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.11em] text-[#F5D89D] reveal-delay-1 sm:px-4 sm:text-xs">
              {copy.eyebrow}
            </span>

            <h1
              id="hero-heading"
              data-reveal="left"
              className={`mt-4 text-[30px] font-extrabold text-[#F7F9FC] reveal-delay-1 sm:text-[36px] md:text-[42px] lg:text-[48px] ${headingLineHeightClass}`}
            >
              <span className="block">{copy.headingLineOne}</span>
              <span className={`mt-1.5 block ${sectionTitleGradient}`}>{copy.headingLineTwo}</span>
            </h1>

            <p data-reveal="left" className={`mt-4 max-w-[720px] text-[14px] text-[#D8DFEA] reveal-delay-2 sm:text-[15px] md:text-base ${descriptionLineHeightClass}`}>
              {copy.description}
            </p>

            <div data-reveal="left" className="mt-6 flex flex-wrap items-center gap-3 reveal-delay-2 sm:gap-4">
              <a
                href="#contact-section"
                className={`inline-flex items-center gap-2 rounded-full ${primaryButtonGradient} px-5 py-2.5 text-[13px] font-semibold text-[#FFFDF4] shadow-[0_16px_28px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.22)] transition-all duration-300 hover:brightness-110 sm:px-6 sm:py-3 sm:text-[14px]`}
              >
                <span>{copy.primaryCtaLabel}</span>
                <ArrowIcon className="text-base" />
              </a>

              <a
                href="#products-section"
                className="inline-flex items-center gap-2 rounded-full border border-[#D39B52] bg-[#0B1017] px-5 py-2.5 text-[13px] font-semibold text-[#F3F6FA] transition-all duration-300 hover:border-[#F5D89D] hover:text-[#FCE8BA] sm:px-6 sm:py-3 sm:text-[14px]"
              >
                {copy.secondaryCtaLabel}
              </a>
            </div>

            <ul data-reveal="left" className="mt-6 grid gap-2.5 reveal-delay-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {copy.highlights.map(({ id, icon: Icon, label }) => (
                <li
                  key={id}
                  className="premium-card-hover flex items-center gap-2.5 rounded-[12px] border border-white/10 bg-[#0A0E14]/90 px-3.5 py-3 text-[13px] text-[#E5EAF1] sm:text-[14px]"
                >
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E3B36E1E] text-[#F0C880]">
                    <Icon />
                  </span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>

            <div data-reveal="left" className="mt-6 grid grid-cols-3 gap-2.5 reveal-delay-4 sm:gap-3 md:max-w-full">
              {copy.stats.map(({ id, value, label }) => (
                <article
                  key={id}
                  className="premium-card-hover rounded-[12px] border border-white/10 bg-[#0A0D12]/85 px-2.5 py-3 text-center sm:px-3 sm:py-3.5"
                >
                  <p className="text-[20px] font-extrabold text-[#F6D89F] sm:text-[24px]">{value}</p>
                  <p className="mt-1 text-[11px] leading-[1.55] text-[#D9E0EB] sm:text-[12px]">{label}</p>
                </article>
              ))}
            </div>
          </article>

          <div data-reveal="right" className="relative mx-auto w-full max-w-[560px]">
            <div className="premium-float-soft overflow-hidden rounded-[22px] border border-[#D39B5257] bg-[#0A0E14] p-2.5 shadow-[0_26px_55px_rgba(0,0,0,0.46)] sm:rounded-[26px] sm:p-3">
              <div className="relative overflow-hidden rounded-[16px] sm:rounded-[20px]">
                <img
                  src={coalImage}
                  alt={copy.heroImageAlt}
                  className="aspect-[1160/774] w-full object-cover"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070D]/70 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div
              className={`absolute top-3 inline-flex items-center gap-1.5 rounded-full border border-[#FBEF9D70] bg-[#070A10DB] px-2.5 py-1 text-[11px] font-medium text-[#F7DFAC] sm:top-4 sm:text-[12px] ${badgePositionClass}`}
            >
              <FiCheckCircle className="text-[13px]" />
              {copy.visualBadge}
            </div>

            <article
              className={`premium-float-soft absolute -bottom-5 ${cardPositionClass} w-[245px] rounded-[14px] border border-[#FBEF9D40] bg-[#090D14]/95 p-2.5 shadow-[0_20px_36px_rgba(0,0,0,0.45)] backdrop-blur-md sm:w-[270px] sm:p-3`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={packagingImage}
                  alt={copy.floatingCardTitle}
                  className="h-14 w-14 rounded-[10px] object-cover sm:h-16 sm:w-16"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <p className="text-[13px] font-semibold text-[#F6E2B5] sm:text-[14px]">{copy.floatingCardTitle}</p>
                  <p className="mt-1 text-[11px] leading-[1.55] text-[#D6DEE9] sm:text-[12px]">
                    {copy.floatingCardSubtitle}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Section1
