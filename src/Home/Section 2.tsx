import aboutUsImage from '../assets/Aboutus_Image.png'
import { useLanguage, type Language } from '../i18n/language'

type AboutStat = {
  id: string
  value: string
  label: string
}

const goldGradient = 'bg-gradient-to-l from-[#FBEF9D] to-[#A96522]'
const sectionTitleGradient = `${goldGradient} bg-clip-text text-transparent`

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

  return (
    <section
      id="about-section"
      className="relative overflow-hidden bg-[#04070E] py-12 sm:py-16 lg:py-20"
      dir={isArabic ? 'rtl' : 'ltr'}
      aria-labelledby="about-us-heading"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-10 lg:px-[100px]">
        <div className="mb-10 flex items-center justify-center gap-3 sm:mb-12 sm:gap-5 lg:mb-16 lg:gap-8">
          <span
            className="h-[3px] w-[64px] bg-gradient-to-r from-[#FBEF9D] to-[#A96522] sm:w-[110px] md:w-[170px] lg:w-[260px]"
            aria-hidden="true"
          />
          <h2
            id="about-us-heading"
            className={`${sectionTitleGradient} text-center text-[30px] font-extrabold sm:text-[34px] md:text-[36px] lg:text-[40px]`}
          >
            {copy.title}
          </h2>
          <span
            className="h-[3px] w-[64px] bg-gradient-to-l from-[#FBEF9D] to-[#A96522] sm:w-[110px] md:w-[170px] lg:w-[260px]"
            aria-hidden="true"
          />
        </div>

        <div
          className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.03fr)_minmax(0,1fr)] xl:gap-16"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <div className="relative">
            <div className="relative overflow-hidden rounded-[24px] bg-[#03060C] shadow-[0_36px_80px_rgba(0,0,0,0.56)] sm:rounded-[30px]">
              <img
                src={aboutUsImage}
                alt={copy.imageAlt}
                className="aspect-[1160/956] w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <article className={`space-y-5 sm:space-y-6 lg:space-y-7 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <h3 className="text-[40px] font-extrabold leading-tight text-[#F4F7FB]">
              {copy.heading}
            </h3>

            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-[#EDF0F3]">
                {paragraph}
              </p>
            ))}
          </article>
        </div>

        <div
          className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 md:grid-cols-2 xl:mt-14 xl:grid-cols-4"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          {aboutStats.map(({ id, value, label }) => (
            <article
              key={id}
              className="rounded-[8px] border border-[#E9EDEF] bg-[#04070E] px-5 py-8 text-center shadow-[0_16px_34px_rgba(0,0,0,0.28)] sm:px-6 sm:py-10"
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              <p className="text-[56px] font-bold leading-none text-[#F4F6F8]">
                {value}
              </p>
              <p className="mt-3 text-[24px] font-medium text-[#F0F3F6]">
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
