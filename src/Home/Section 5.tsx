import { useState } from 'react'
import africaMap from '../assets/Africa Map.png'
import asiaMap from '../assets/Asia Map.png'
import europeMap from '../assets/Europe Map.png'
import { useLanguage, type Language } from '../i18n/language'

type ContinentCard = {
  id: string
  name: string
  mapImage: string
  countries: string[]
  mapImageClassName?: string
}

const goldGradient = 'bg-gradient-to-l from-[#FBEF9D] to-[#A96522]'
const sectionTitleGradient = `${goldGradient} bg-clip-text text-transparent`
const cardBorderGradient = 'bg-gradient-to-br from-[#FBEF9D] via-[#D39B52] to-[#A96522]'
const cardBodyGradient = 'bg-[#07090D]'
const cardFrontGradient = 'bg-gradient-to-br from-[#c18b44] via-[#75461E] to-[#5E3715]'

const continentsByLanguage: Record<Language, ReadonlyArray<ContinentCard>> = {
  en: [
    {
      id: 'africa',
      name: 'Africa',
      mapImage: africaMap,
      mapImageClassName: 'max-w-[220px] sm:max-w-[235px]',
      countries: [
        'Egypt',
        'Algeria',
        'Morocco',
        'Tunisia',
        'Nigeria',
        'South Africa',
        'Kenya',
        'Ethiopia',
        'Ghana',
        'Senegal',
      ],
    },
    {
      id: 'asia',
      name: 'Asia',
      mapImage: asiaMap,
      mapImageClassName: 'max-w-[255px] sm:max-w-[270px]',
      countries: [
        'Saudi Arabia',
        'United Arab Emirates',
        'Qatar',
        'Kuwait',
        'China',
        'India',
        'Japan',
        'South Korea',
        'Indonesia',
        'Malaysia',
      ],
    },
    {
      id: 'europe',
      name: 'Europe',
      mapImage: europeMap,
      mapImageClassName: 'max-w-[245px] sm:max-w-[260px]',
      countries: [
        'Germany',
        'France',
        'Italy',
        'Spain',
        'Netherlands',
        'Belgium',
        'Sweden',
        'Norway',
        'Poland',
        'Greece',
      ],
    },
  ],
  ar: [
    {
      id: 'africa',
      name: 'أفريقيا',
      mapImage: africaMap,
      mapImageClassName: 'max-w-[220px] sm:max-w-[235px]',
      countries: [
        'مصر',
        'الجزائر',
        'المغرب',
        'تونس',
        'نيجيريا',
        'جنوب أفريقيا',
        'كينيا',
        'إثيوبيا',
        'غانا',
        'السنغال',
      ],
    },
    {
      id: 'asia',
      name: 'آسيا',
      mapImage: asiaMap,
      mapImageClassName: 'max-w-[255px] sm:max-w-[270px]',
      countries: [
        'السعودية',
        'الإمارات',
        'قطر',
        'الكويت',
        'الصين',
        'الهند',
        'اليابان',
        'كوريا الجنوبية',
        'إندونيسيا',
        'ماليزيا',
      ],
    },
    {
      id: 'europe',
      name: 'أوروبا',
      mapImage: europeMap,
      mapImageClassName: 'max-w-[245px] sm:max-w-[260px]',
      countries: [
        'ألمانيا',
        'فرنسا',
        'إيطاليا',
        'إسبانيا',
        'هولندا',
        'بلجيكا',
        'السويد',
        'النرويج',
        'بولندا',
        'اليونان',
      ],
    },
  ],
}

const sectionCopyByLanguage: Record<Language, {
  title: string
  countriesInsideContinent: string
  hoverToShowCountries: string
  tapToShowCountries: string
  cardAriaPrefix: string
  mapAltPrefix: string
}> = {
  en: {
    title: 'Our Markets Worldwide',
    countriesInsideContinent: 'Countries within this continent',
    hoverToShowCountries: 'Hover to show countries',
    tapToShowCountries: 'Tap to show countries',
    cardAriaPrefix: 'Card for',
    mapAltPrefix: 'Map of',
  },
  ar: {
    title: 'أسواقنا حول العالم',
    countriesInsideContinent: 'الدول داخل القارة',
    hoverToShowCountries: 'مرر المؤشر لعرض الدول',
    tapToShowCountries: 'اضغط لعرض الدول',
    cardAriaPrefix: 'بطاقة',
    mapAltPrefix: 'خريطة',
  },
}

type CountriesListProps = {
  countries: string[]
}

function CountriesList({ countries }: CountriesListProps) {
  return (
    <ul className="grid grid-cols-2 gap-2 text-[13px] text-[#ECECEC] sm:text-sm">
      {countries.map((country) => (
        <li
          key={country}
          className="rounded-[8px] border border-white/15 bg-white/[0.05] px-2 py-1.5 text-center leading-relaxed sm:px-2.5"
        >
          {country}
        </li>
      ))}
    </ul>
  )
}

type ContinentCardItemProps = ContinentCard & {
  countriesInsideContinent: string
  hoverToShowCountries: string
  tapToShowCountries: string
  cardAriaPrefix: string
  mapAltPrefix: string
}

function ContinentCardItem({
  name,
  mapImage,
  countries,
  mapImageClassName,
  countriesInsideContinent,
  hoverToShowCountries,
  tapToShowCountries,
  cardAriaPrefix,
  mapAltPrefix,
}: ContinentCardItemProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const mobileSlideClass = isMobileOpen ? '-translate-y-full lg:translate-y-0' : 'translate-y-0'
  const handleCardToggle = () => setIsMobileOpen((prev) => !prev)

  return (
    <article
      className={`group relative isolate cursor-pointer overflow-hidden rounded-[8px] ${cardBorderGradient} p-px shadow-[0_14px_35px_rgba(0,0,0,0.3)] md:cursor-default`}
      tabIndex={0}
      aria-label={`${cardAriaPrefix} ${name}`}
      onClick={handleCardToggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleCardToggle()
        }
      }}
    >
      <div
        className={`relative min-h-[430px] rounded-[8px] ${cardBodyGradient} sm:min-h-[450px] md:h-[430px] md:min-h-0`}
      >
        <div className="flex h-full flex-col p-4 sm:p-5">
          <div className="mb-4 text-center">
            <h3 className={`${sectionTitleGradient} text-2xl font-extrabold`}>{name}</h3>
            <p className="mt-2 text-sm text-[#D5D5D5]">{countriesInsideContinent}</p>
          </div>

          <CountriesList countries={countries} />
        </div>

        <div
          className={`absolute inset-0 z-20 flex h-full flex-col items-center rounded-[8px] ${cardFrontGradient} px-4 py-5 text-white transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileSlideClass} md:px-6 md:py-6 lg:group-hover:-translate-y-full lg:group-focus-within:-translate-y-full`}
        >
          <h3 className="text-2xl font-extrabold">{name}</h3>

          <div className="my-5 flex flex-1 items-center justify-center">
            <img
              src={mapImage}
              alt={`${mapAltPrefix} ${name}`}
              className={`h-[145px] w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)] sm:h-[160px] md:h-[175px] ${mapImageClassName ?? ''}`}
              loading="lazy"
            />
          </div>

          <p className="hidden text-sm text-[#EFEFEF] lg:block">{hoverToShowCountries}</p>
          <span
            className={`mt-3 hidden h-[3px] w-28 rounded-full ${goldGradient} lg:block`}
            aria-hidden="true"
          />

          <p className="mt-4 text-sm text-[#EFEFEF] lg:hidden">{tapToShowCountries}</p>
          <span
            className={`mt-3 block h-[3px] w-28 rounded-full ${goldGradient} lg:hidden`}
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  )
}

function Section5() {
  const { language, isArabic } = useLanguage()
  const continents = continentsByLanguage[language]
  const copy = sectionCopyByLanguage[language]

  return (
    <section id="markets-section" className="bg-[#07090D] py-10 sm:py-12 lg:py-16" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="mb-8 flex items-center justify-center gap-3 sm:mb-10 sm:gap-4 md:mb-12 md:gap-6">
          <span className={`h-[3px] w-[52px] ${goldGradient} sm:w-[88px] md:w-[150px]`} />
          <h2
            className={`${sectionTitleGradient} text-center text-2xl font-extrabold leading-tight sm:text-3xl lg:text-[2.1rem]`}
          >
            {copy.title}
          </h2>
          <span className={`h-[3px] w-[52px] ${goldGradient} sm:w-[88px] md:w-[150px]`} />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {continents.map((continent) => (
            <ContinentCardItem
              key={continent.id}
              {...continent}
              countriesInsideContinent={copy.countriesInsideContinent}
              hoverToShowCountries={copy.hoverToShowCountries}
              tapToShowCountries={copy.tapToShowCountries}
              cardAriaPrefix={copy.cardAriaPrefix}
              mapAltPrefix={copy.mapAltPrefix}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Section5
