import coalImage from '../assets/Coal.webp'
import coalPackageImage from '../assets/Coal Package.webp'
import exportingImage from '../assets/Exporting.webp'
import packagingImage from '../assets/Packaging.webp'
import { useLanguage, type Language } from '../i18n/language'

type ServiceCard = {
  id: string
  title: string
  description: string
  image: string
  borderBaseClassName: string
}

const sectionTitleGradient = 'bg-gradient-to-t from-[#FBEF9D] to-[#A96522] bg-clip-text text-transparent'

const serviceCardsByLanguage: Record<Language, ReadonlyArray<ServiceCard>> = {
  en: [
    {
      id: 'coal-production',
      title: 'Charcoal Production',
      description:
        'We produce high-quality charcoal using premium raw materials and modern production techniques to ensure superior standards and performance.',
      image: coalImage,
      borderBaseClassName: 'bg-[#EEEEEE]',
    },
    {
      id: 'packaging',
      title: 'Packaging',
      description:
        'Professional and customized packaging that preserves product quality and meets all international shipping and export requirements.',
      image: packagingImage,
      borderBaseClassName: 'bg-[#EEEEEE]',
    },
    {
      id: 'shipping-export',
      title: 'Shipping & Export',
      description:
        'End-to-end management of shipping and export operations to Europe, Africa, and Asia with high levels of safety and speed.',
      image: exportingImage,
      borderBaseClassName: 'bg-[#EEEEEE]',
    },
    {
      id: 'wholesale',
      title: 'Wholesale Supply',
      description:
        'We provide large charcoal quantities at competitive prices and consistent quality to serve global market demands and trade partners.',
      image: coalPackageImage,
      borderBaseClassName: 'bg-[#EEEEEE]',
    },
  ],
  ar: [
    {
      id: 'coal-production',
      title: 'إنتاج الفحم',
      description:
        'ننتج فحمًا نباتيًا عالي الجودة باستخدام أفضل الخامات وأحدث تقنيات الإنتاج لضمان أعلى معايير الجودة والأداء.',
      image: coalImage,
      borderBaseClassName: 'bg-[#EEEEEE]',
    },
    {
      id: 'packaging',
      title: 'التعبئة والتغليف',
      description:
        'تعبئة احترافية ومخصصة تحافظ على جودة الفحم النباتي وتلبي جميع متطلبات الشحن والتصدير الدولية.',
      image: packagingImage,
      borderBaseClassName: 'bg-[#EEEEEE]',
    },
    {
      id: 'shipping-export',
      title: 'الشحن والتصدير',
      description:
        'إدارة متكاملة لعمليات الشحن والتصدير إلى مختلف دول أوروبا وأفريقيا وآسيا بأعلى مستويات الأمان والسرعة.',
      image: exportingImage,
      borderBaseClassName: 'bg-[#EEEEEE]',
    },
    {
      id: 'wholesale',
      title: 'التوريد بالجملة',
      description:
        'نوفر كميات كبيرة من الفحم النباتي بأسعار تنافسية وجودة ثابتة لتلبية احتياجات الأسواق العالمية والشركاء التجاريين.',
      image: coalPackageImage,
      borderBaseClassName: 'bg-[#EEEEEE]',
    },
  ],
}

const sectionCopyByLanguage: Record<Language, {
  title: string
  heading: string
  description: string
}> = {
  en: {
    title: 'Our Services',
    heading: 'Integrated Solutions with Global Quality',
    description:
      'We provide a complete range of services to guarantee top charcoal quality from production until delivery to our clients worldwide.',
  },
  ar: {
    title: 'خدماتنا',
    heading: 'حلول متكاملة بجودة عالمية',
    description:
      'نقدم مجموعة متكاملة من الخدمات لضمان أفضل جودة للفحم النباتي من الإنتاج حتى وصوله إلى عملائنا حول العالم.',
  },
}

function Section4() {
  const { language, isArabic } = useLanguage()
  const serviceCards = serviceCardsByLanguage[language]
  const copy = sectionCopyByLanguage[language]
  const headingLineHeightClass = isArabic ? 'leading-[1.45]' : 'leading-tight'
  const titleLineHeightClass = isArabic ? 'leading-[1.5]' : 'leading-[1.35]'
  const cardDescriptionLineHeightClass = isArabic ? 'leading-[2]' : 'leading-[1.8]'
  const bottomGlowPositionClass = isArabic
    ? '-bottom-40 -left-28 sm:-bottom-44 sm:-left-36'
    : '-bottom-40 -right-28 sm:-bottom-44 sm:-right-36'
  const topGlowPositionClass = isArabic
    ? '-top-80 -right-28 sm:-top-44 sm:-right-36'
    : '-top-80 -left-28 sm:-top-44 sm:-left-36'

  return (
    <section
      id="services-section"
      className="relative overflow-x-clip overflow-y-visible bg-[#07090D] py-9 sm:py-11 lg:py-14 xl:py-16"
      dir={isArabic ? 'rtl' : 'ltr'}
      aria-labelledby="services-heading"
    >
      <span
        className={`pointer-events-none absolute z-0 h-[360px] w-[360px] premium-glow-breathe rounded-full bg-[radial-gradient(circle_at_center,rgba(251,239,157,0.42)_0%,rgba(211,155,82,0.3)_38%,rgba(169,101,34,0.14)_62%,transparent_80%)] blur-[100px] sm:h-[470px] sm:w-[470px] ${bottomGlowPositionClass}`}
        aria-hidden="true"
      />
      <span
        className={`pointer-events-none absolute z-0 h-[360px] w-[360px] premium-glow-breathe rounded-full bg-[radial-gradient(circle_at_center,rgba(251,239,157,0.42)_0%,rgba(211,155,82,0.3)_38%,rgba(169,101,34,0.14)_62%,transparent_80%)] blur-[100px] sm:h-[470px] sm:w-[470px] ${topGlowPositionClass}`}
        aria-hidden="true"
      />
      <div className="mx-auto w-full max-w-[1440px] px-[25px] md:px-[50px] lg:px-[100px]">
        <div data-reveal="up" className="mb-7 flex items-center justify-center gap-2.5 sm:mb-9 sm:gap-4 md:mb-10 md:gap-6">
          <span
            className="premium-shimmer-line h-[3px] w-[44px] bg-gradient-to-l from-[#FBEF9D] to-[#A96522] sm:w-[88px] md:w-[120px]"
            aria-hidden="true"
          />
          <h2
            id="services-heading"
            className={`${sectionTitleGradient} text-center text-[30px] font-extrabold leading-none sm:text-[34px] md:text-[36px] lg:text-[40px]`}
          >
            {copy.title}
          </h2>
          <span
            className="premium-shimmer-line h-[3px] w-[44px] bg-gradient-to-r from-[#FBEF9D] to-[#A96522] sm:w-[88px] md:w-[120px]"
            aria-hidden="true"
          />
        </div>

        <h3
          data-reveal="up"
          className={`mx-auto max-w-[920px] text-center text-[24px] font-extrabold text-white sm:text-[28px] md:text-[30px] lg:text-[32px] ${headingLineHeightClass}`}
        >
          {copy.heading}
        </h3>

        <p data-reveal="up" className="mx-auto mt-4 max-w-[920px] text-center text-sm leading-7 text-[#D8DEE8] reveal-delay-1 sm:mt-5 sm:text-[15px] sm:leading-8 md:text-base">
          {copy.description}
        </p>

        <div className="z-10 mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2 xl:mt-12 xl:grid-cols-4">
          {serviceCards.map(({ id, title, description, image, borderBaseClassName }, index) => (
            <article
              key={id}
              data-reveal="up"
              className={`premium-card-hover z-10 h-full overflow-hidden rounded-[12px] p-[2px] transition-all duration-300 ${borderBaseClassName} ${
                index === 0
                  ? 'reveal-delay-1'
                  : index === 1
                    ? 'reveal-delay-2'
                    : index === 2
                      ? 'reveal-delay-3'
                      : 'reveal-delay-4'
              } hover:bg-gradient-to-tr hover:from-[#FBEF9D] hover:to-[#A96522]`}
            >
              <div className="flex h-full flex-col rounded-[10px] bg-[#07090D]">
                <img
                  src={image}
                  alt={title}
                  className="aspect-[1160/774] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />

                <div className="flex flex-1 flex-col items-center px-4 pb-6 pt-5 text-center sm:px-3 sm:pb-7 sm:pt-6">
                  <h4 className={`text-[22px] font-bold text-white sm:text-[23px] ${titleLineHeightClass}`}>
                    {title}
                  </h4>
                  <span
                    className="mt-3 h-[3px] w-16 rounded-[2px] bg-gradient-to-tl from-[#FBEF9D] to-[#A96522] sm:mt-4"
                    aria-hidden="true"
                  />
                  <p className={`mt-4 text-[14px] text-[#E4E8EF] sm:mt-5 sm:text-[15px] ${cardDescriptionLineHeightClass}`}>
                    {description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Section4
