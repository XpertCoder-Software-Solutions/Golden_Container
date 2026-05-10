import coalImage from '../assets/Coal.png'
import coalPackageImage from '../assets/Coal Package.png'
import exportingImage from '../assets/Exporting.png'
import packagingImage from '../assets/Packaging.png'
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
        'ننتج فحم نباتي عالي الجودة باستخدام أفضل الخامات، و أحدث تقنيات الإنتاج لضمان أعلى معايير الجودة و الأداء',
      image: coalImage,
      borderBaseClassName: 'bg-[#EEEEEE]',
    },
    {
      id: 'packaging',
      title: 'التعبئة والتغليف',
      description:
        'تعبئة احترافية و مخصصة تحافظ على جودة الفحم النباتي و تلبي جميع متطلبات الشحن و التصدير الدولية',
      image: packagingImage,
      borderBaseClassName: 'bg-[#EEEEEE]',
    },
    {
      id: 'shipping-export',
      title: 'الشحن و التصدير',
      description:
        'إدارة متكاملة لعمليات الشحن و التصدير إلى مختلف دول أوروبا و أفريقيا و آسيا بأعلى مستويات الأمان و السرعة',
      image: exportingImage,
      borderBaseClassName: 'bg-[#EEEEEE]',
    },
    {
      id: 'wholesale',
      title: 'التوريد بالجملة',
      description:
        'نوفر كميات كبيرة من الفحم النباتي بأسعار تنافسية و جودة ثابتة لتلبية احتياجات الأسواق العالمية والشركاء التجاريين',
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
      'نقدم مجموعة متكاملة من الخدمات لضمان أفضل جودة للفحم النباتي من الإنتاج حتى وصوله إلى عملائنا حول العالم',
  },
}

function Section4() {
  const { language, isArabic } = useLanguage()
  const serviceCards = serviceCardsByLanguage[language]
  const copy = sectionCopyByLanguage[language]

  return (
    <section
      id="services-section"
      className="bg-[#07090D] py-10 sm:py-12 lg:py-16"
      dir={isArabic ? 'rtl' : 'ltr'}
      aria-labelledby="services-heading"
    >
      <div className="mx-auto w-full max-w-[1440px] px-[25px] md:px-[50px] lg:px-[100px]">
        <div className="mb-7 flex items-center justify-center gap-3 sm:mb-9 sm:gap-4 md:mb-11 md:gap-6">
          <span
            className="h-[3px] w-[56px] bg-gradient-to-l from-[#FBEF9D] to-[#A96522] sm:w-[88px] md:w-[120px] lg:w-[168px]"
            aria-hidden="true"
          />
          <h2
            id="services-heading"
            className={`${sectionTitleGradient} text-center text-3xl font-extrabold leading-none md:text-[36px] lg:text-[40px]`}
          >
            {copy.title}
          </h2>
          <span
            className="h-[3px] w-[56px] bg-gradient-to-r from-[#FBEF9D] to-[#A96522] sm:w-[88px] md:w-[120px] lg:w-[168px]"
            aria-hidden="true"
          />
        </div>

        <h3 className="text-center text-[24px] font-extrabold leading-tight text-white md:text-[28px] lg:text-[32px]">
          {copy.heading}
        </h3>

        <p className="mx-auto mt-4 max-w-[1240px] text-center text-base leading-[1.85] text-[#E4E9EE] sm:mt-5 md:text-base lg:text-lg">
          {copy.description}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 md:grid-cols-2 xl:mt-12 xl:grid-cols-4">
          {serviceCards.map(({ id, title, description, image, borderBaseClassName }) => (
            <article
              key={id}
              className={`h-full overflow-hidden rounded-[10px] p-[2px] transition-all duration-300 ${borderBaseClassName} hover:bg-gradient-to-tr hover:from-[#FBEF9D] hover:to-[#A96522]`}
            >
              <div className="flex h-full flex-col rounded-[8px] bg-[#07090D]">
                <img
                  src={image}
                  alt={title}
                  className="aspect-[1160/774] w-full object-cover"
                  loading="lazy"
                />

                <div className="flex flex-1 flex-col items-center px-3 pb-6 pt-5 text-center sm:pb-8 sm:pt-6">
                  <h4 className="text-[24px] font-semibold leading-tight text-white">
                    {title}
                  </h4>
                  <span
                    className="mt-3 h-[3px] w-[62px] rounded-[2px] bg-gradient-to-tl from-[#FBEF9D] to-[#A96522] sm:mt-4"
                    aria-hidden="true"
                  />
                  <p className="mt-4 text-[15px] leading-[1.8] text-[#E7E9ED] sm:mt-6">
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
