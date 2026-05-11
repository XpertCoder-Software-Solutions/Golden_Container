import aboutUsImage from '../assets/Aboutus_Image.webp'
import { useLanguage, type Language } from '../i18n/language'

type AboutStat = {
  id: string
  value: string
  label: string
}

const sectionTitleGradient = `bg-gradient-to-t from-[#FBEF9D] to-[#A96522] bg-clip-text text-transparent`

const aboutStatsByLanguage: Record<Language, ReadonlyArray<AboutStat>> = {
  en: [
    { id: 'clients', value: '100+', label: 'Clients Worldwide' },
    { id: 'countries', value: '20+', label: 'Export Destinations' },
    { id: 'shipments', value: '1500+', label: 'Completed Shipments' },
    { id: 'experience', value: '10+', label: 'Years of Experience' },
  ],
  ar: [
    { id: 'clients', value: '100+', label: 'عميل حول العالم' },
    { id: 'countries', value: '20+', label: 'دولة نصدر إليها' },
    { id: 'shipments', value: '1500+', label: 'شحنة تم تصديرها' },
    { id: 'experience', value: '10+', label: 'سنوات من الخبرة' },
  ],
}

const sectionCopyByLanguage: Record<Language, {
  title: string
  heading: string
  imageAlt: string
  paragraphs: string[]
}> = {
  en: {
    title: 'About Us',
    heading: 'Who We Are',
    imageAlt: 'Golden Container charcoal products',
    paragraphs: [
      'Golden Container is an Egyptian company specialized in exporting premium-quality charcoal to global markets across Europe, Africa, and Asia.',
      'We deliver products with exceptional standards and close attention to every stage, from production to shipping, to ensure consistent quality and a reliable customer experience.',
      'We believe excellence in details is what makes the difference, so we always strive to deliver a level that matches the trust of our partners worldwide.',
    ],
  },
  ar: {
    title: 'من نحن',
    heading: 'نبذة عنا',
    imageAlt: 'منتجات Golden Container من الفحم النباتي',
    paragraphs: [
      'جولدن كونتينر هي شركة مصرية متخصصة في تصدير الفحم النباتي عالي الجودة إلى الأسواق العالمية في أوروبا وأفريقيا وآسيا.',
      'نقدم منتجات بمعايير استثنائية، مع اهتمام دقيق بكل مرحلة من الإنتاج حتى الشحن، لضمان جودة ثابتة وتجربة موثوقة لعملائنا.',
      'نؤمن أن التميز في التفاصيل هو ما يصنع الفرق، لذلك نسعى دائمًا لتقديم مستوى يليق بثقة شركائنا حول العالم.',
    ],
  },
}

function Section2() {
  const { language, isArabic } = useLanguage()
  const aboutStats = aboutStatsByLanguage[language]
  const copy = sectionCopyByLanguage[language]
  const headingLineHeightClass = isArabic ? 'leading-[1.42]' : 'leading-[1.2]'
  const paragraphLineHeightClass = isArabic ? 'leading-[1.95]' : 'leading-[1.8]'
  const imageShadowClass = isArabic
    ? 'md:shadow-[80px_80px_50px_-50px_rgba(251,239,157,0.2)]'
    : 'md:shadow-[-80px_80px_50px_-50px_rgba(251,239,157,0.2)]'
  const imagePositionClass = isArabic ? 'lg:justify-self-end' : 'lg:justify-self-start'
  const sectionGlowPositionClass = isArabic
    ? '-bottom-36 -left-24 sm:bottom-20 sm:-left-32'
    : '-bottom-36 -right-24 sm:bottom-20 sm:-right-32'

  return (
    <section
      id="about-section"
      className="relative overflow-x-clip overflow-visible bg-[#07090D] py-8 sm:py-10 md:py-12 lg:py-16 xl:py-16"
      dir={isArabic ? 'rtl' : 'ltr'}
      aria-labelledby="about-us-heading"
    >
      <span
        className={`pointer-events-none absolute z-20 h-[320px] w-[320px] premium-glow-breathe rounded-full bg-[radial-gradient(circle_at_center,rgba(251,239,157,0.4)_0%,rgba(211,155,82,0.28)_38%,rgba(169,101,34,0.12)_62%,transparent_80%)] blur-[90px] sm:h-[420px] sm:w-[420px] ${sectionGlowPositionClass}`}
        aria-hidden="true"
      />
      <div className="relative z-30 mx-auto w-full max-w-[1440px] px-[25px] md:px-[50px] lg:px-[100px]">
        <div data-reveal="up" className="mb-7 flex items-center justify-center gap-2.5 sm:mb-9 sm:gap-4 md:mb-11 md:gap-6 lg:mb-14 lg:gap-8">
          <span
            className="premium-shimmer-line h-[3px] w-[44px] bg-gradient-to-l from-[#FBEF9D] to-[#A96522] sm:w-[88px] md:w-[120px]"
            aria-hidden="true"
          />
          <h2
            id="about-us-heading"
            className={`${sectionTitleGradient} text-center text-[28px] font-extrabold lg:leading-[1.2] sm:text-[32px] md:text-[36px] lg:text-[40px]`}
          >
            {copy.title}
          </h2>
          <span
            className="premium-shimmer-line h-[3px] w-[44px] bg-gradient-to-r from-[#FBEF9D] to-[#A96522] sm:w-[88px] md:w-[120px]"
            aria-hidden="true"
          />
        </div>

        <div
          className="mb-10 grid items-center gap-7 sm:mb-12 sm:gap-9 md:mb-14 md:gap-10 lg:mb-16 lg:grid-cols-[minmax(0,500px)_minmax(0,1fr)] lg:gap-12 xl:gap-16"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <div data-reveal={isArabic ? 'right' : 'left'} className={`relative mx-auto w-full max-w-[500px] ${imagePositionClass}`}>
            <div
              className={`premium-card-hover relative overflow-hidden rounded-[20px] bg-[#03060C] shadow-[0_26px_60px_rgba(0,0,0,0.52)] sm:rounded-[24px] lg:h-[398px] lg:w-[500px] lg:rounded-[30px] ${imageShadowClass}`}
            >
              <img
                src={aboutUsImage}
                alt={copy.imageAlt}
                className="aspect-[1160/956] h-auto w-full object-cover lg:h-[398px] lg:w-[500px] lg:aspect-auto"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <article
            data-reveal={isArabic ? 'left' : 'right'}
            className={`space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7 ${isArabic ? 'text-right' : 'text-left'}`}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <h3 className={`text-[28px] font-extrabold text-[#F4F7FB] sm:text-[32px] md:text-[36px] lg:text-[40px] ${headingLineHeightClass}`}>
              {copy.heading}
            </h3>

            {copy.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className={`text-[14px] text-[#EDF0F3] sm:text-[15px] md:text-base ${paragraphLineHeightClass}`}
              >
                {paragraph}
              </p>
            ))}
          </article>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-2 lg:gap-5 xl:grid-cols-4" dir={isArabic ? 'rtl' : 'ltr'}>
          {aboutStats.map(({ id, value, label }, index) => (
            <article
              key={id}
              data-reveal="up"
              className={`premium-card-hover rounded-[8px] border border-[#E9EDEF] bg-[#04070E] px-4 py-6 text-center shadow-[0_16px_34px_rgba(0,0,0,0.28)] sm:px-5 sm:py-8 md:px-6 md:py-9 ${
                index === 0
                  ? 'reveal-delay-1'
                  : index === 1
                    ? 'reveal-delay-2'
                    : index === 2
                      ? 'reveal-delay-3'
                      : 'reveal-delay-4'
              }`}
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              <p className="font-bold leading-none text-[#F4F6F8] sm:text-[44px] md:text-[50px] lg:text-[56px]">
                {value}
              </p>
              <p className="mt-2.5 font-medium leading-[1.45] text-[#F0F3F6] sm:mt-3 sm:text-[20px] md:text-[22px] lg:text-[24px]">
                {label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Section2
