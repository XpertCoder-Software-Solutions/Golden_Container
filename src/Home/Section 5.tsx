import { useEffect, useMemo, useState } from 'react'
import africaMap from '../assets/Africa Map.webp'
import asiaMap from '../assets/Asia Map.webp'
import europeMap from '../assets/Europe Map.webp'
import { useLanguage, type Language } from '../i18n/language'

type ContinentId = 'africa' | 'asia' | 'europe'

type ContinentCard = {
  id: ContinentId
  name: string
  mapImage: string
  mapImageClassName?: string
}

type CountryApiItem = {
  id: number | string
  name_ar: string
  name_en: string
  continent: string
}

type CountriesApiResponse = {
  data?: unknown
}

const goldGradient = 'bg-gradient-to-l from-[#FBEF9D] to-[#A96522]'
const sectionTitleGradient = `bg-gradient-to-t from-[#FBEF9D] to-[#A96522] bg-clip-text text-transparent`
const cardBorderGradient = 'bg-gradient-to-br from-[#FBEF9D] via-[#D39B52] to-[#A96522]'
const cardBodyGradient = 'bg-[#07090D]'
const cardFrontGradient = 'bg-gradient-to-br from-[#c18b44] via-[#75461E] to-[#5E3715]'
const countriesApiUrl = `${((import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? '').replace(/\/$/, '')}/api/countries`

const continentsByLanguage: Record<Language, ReadonlyArray<ContinentCard>> = {
  en: [
    {
      id: 'africa',
      name: 'Africa',
      mapImage: africaMap,
      mapImageClassName: 'max-w-[220px] sm:max-w-[235px]',
    },
    {
      id: 'asia',
      name: 'Asia',
      mapImage: asiaMap,
      mapImageClassName: 'max-w-[255px] sm:max-w-[270px]',
    },
    {
      id: 'europe',
      name: 'Europe',
      mapImage: europeMap,
      mapImageClassName: 'max-w-[245px] sm:max-w-[260px]',
    },
  ],
  ar: [
    {
      id: 'africa',
      name: 'أفريقيا',
      mapImage: africaMap,
      mapImageClassName: 'max-w-[220px] sm:max-w-[235px]',
    },
    {
      id: 'asia',
      name: 'آسيا',
      mapImage: asiaMap,
      mapImageClassName: 'max-w-[255px] sm:max-w-[270px]',
    },
    {
      id: 'europe',
      name: 'أوروبا',
      mapImage: europeMap,
      mapImageClassName: 'max-w-[245px] sm:max-w-[260px]',
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
  loadingCountries: string
  noCountriesInContinent: string
  countriesLoadError: string
}> = {
  en: {
    title: 'Our Markets Worldwide',
    countriesInsideContinent: 'Countries within this continent',
    hoverToShowCountries: 'Hover to show countries',
    tapToShowCountries: 'Tap to show countries',
    cardAriaPrefix: 'Card for',
    mapAltPrefix: 'Map of',
    loadingCountries: 'Loading countries...',
    noCountriesInContinent: 'No countries available for this continent yet.',
    countriesLoadError: 'Unable to load countries right now.',
  },
  ar: {
    title: 'أسواقنا حول العالم',
    countriesInsideContinent: 'الدول داخل القارة',
    hoverToShowCountries: 'مرر المؤشر لعرض الدول',
    tapToShowCountries: 'اضغط لعرض الدول',
    cardAriaPrefix: 'بطاقة',
    mapAltPrefix: 'خريطة',
    loadingCountries: 'جاري تحميل الدول...',
    noCountriesInContinent: 'لا توجد دول مضافة لهذه القارة حتى الآن.',
    countriesLoadError: 'تعذر تحميل الدول حاليًا.',
  },
}

const createEmptyCountriesByContinent = (): Record<ContinentId, string[]> => ({
  africa: [],
  asia: [],
  europe: [],
})

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const normalizeContinent = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, '')
}

const mapContinentToId = (continent: string): ContinentId | null => {
  const normalizedContinent = normalizeContinent(continent)

  if (normalizedContinent === 'افريقيا' || normalizedContinent === 'africa') {
    return 'africa'
  }

  if (normalizedContinent === 'اسيا' || normalizedContinent === 'asia') {
    return 'asia'
  }

  if (normalizedContinent === 'اوروبا' || normalizedContinent === 'europe') {
    return 'europe'
  }

  return null
}

const toCountryApiItem = (value: unknown): CountryApiItem | null => {
  if (!isRecord(value)) {
    return null
  }

  const nameAr = typeof value.name_ar === 'string' ? value.name_ar.trim() : ''
  const nameEn = typeof value.name_en === 'string' ? value.name_en.trim() : ''
  const continent = typeof value.continent === 'string' ? value.continent.trim() : ''
  const id = typeof value.id === 'number' || typeof value.id === 'string' ? value.id : `${nameEn}-${nameAr}-${continent}`

  if (!nameAr || !nameEn || !continent) {
    return null
  }

  return {
    id,
    name_ar: nameAr,
    name_en: nameEn,
    continent,
  }
}

const parseCountriesFromResponse = (payload: unknown): CountryApiItem[] => {
  let rawCountries: unknown[] = []

  if (Array.isArray(payload)) {
    rawCountries = payload
  } else if (isRecord(payload) && Array.isArray((payload as CountriesApiResponse).data)) {
    rawCountries = (payload as CountriesApiResponse).data as unknown[]
  }

  return rawCountries.map(toCountryApiItem).filter((country): country is CountryApiItem => country !== null)
}

type CountriesListProps = {
  countries: string[]
}

function CountriesList({ countries }: CountriesListProps) {
  return (
    <ul className="grid grid-cols-2 gap-2 text-[13px] text-[#ECECEC] sm:text-sm">
      {countries.map((country, index) => (
        <li
          key={`${country}-${index}`}
          className="rounded-[8px] border border-white/15 bg-white/[0.05] px-2 py-1.5 text-center leading-relaxed sm:px-2.5"
        >
          {country}
        </li>
      ))}
    </ul>
  )
}

type ContinentCardItemProps = ContinentCard & {
  countries: string[]
  isLoadingCountries: boolean
  countriesLoadError: boolean
  countriesInsideContinent: string
  hoverToShowCountries: string
  tapToShowCountries: string
  cardAriaPrefix: string
  mapAltPrefix: string
  loadingCountries: string
  noCountriesInContinent: string
  countriesLoadErrorText: string
  revealDelayClass: string
}

function ContinentCardItem({
  name,
  mapImage,
  countries,
  mapImageClassName,
  isLoadingCountries,
  countriesLoadError,
  countriesInsideContinent,
  hoverToShowCountries,
  tapToShowCountries,
  cardAriaPrefix,
  mapAltPrefix,
  loadingCountries,
  noCountriesInContinent,
  countriesLoadErrorText,
  revealDelayClass,
}: ContinentCardItemProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const mobileSlideClass = isMobileOpen ? '-translate-y-full lg:translate-y-0' : 'translate-y-0'
  const handleCardToggle = () => setIsMobileOpen((prev) => !prev)

  return (
    <article
      data-reveal="up"
      className={`premium-card-hover ${revealDelayClass} z-10 group relative isolate cursor-pointer overflow-hidden rounded-[8px] ${cardBorderGradient} p-px shadow-[0_14px_35px_rgba(0,0,0,0.3)] md:cursor-default`}
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
        className={`z-10 relative min-h-[410px] rounded-[8px] ${cardBodyGradient} sm:min-h-[430px] md:h-[430px] md:min-h-0`}
      >
        <div className="z-10 flex h-full flex-col p-4 sm:p-5">
          <div className="mb-4 text-center">
            <h3 className={`${sectionTitleGradient} text-2xl font-extrabold`}>{name}</h3>
            <p className="mt-2 text-sm text-[#D5D5D5]">{countriesInsideContinent}</p>
          </div>

          {isLoadingCountries ? (
            <p className="rounded-[8px] border border-white/15 bg-white/[0.05] px-2.5 py-3 text-center text-sm text-[#ECECEC]">
              {loadingCountries}
            </p>
          ) : countriesLoadError ? (
            <p className="rounded-[8px] border border-[#D08080]/45 bg-[#2B1111] px-2.5 py-3 text-center text-sm text-[#FFCBCB]">
              {countriesLoadErrorText}
            </p>
          ) : countries.length === 0 ? (
            <p className="rounded-[8px] border border-white/15 bg-white/[0.05] px-2.5 py-3 text-center text-sm text-[#ECECEC]">
              {noCountriesInContinent}
            </p>
          ) : (
            <CountriesList countries={countries} />
          )}
        </div>

        <div
          className={`z-10 absolute inset-0 z-20 flex h-full flex-col items-center rounded-[8px] ${cardFrontGradient} px-4 py-5 text-white transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileSlideClass} sm:px-5 sm:py-6 md:px-6 md:py-6 lg:group-hover:-translate-y-full lg:group-focus-within:-translate-y-full`}
        >
          <h3 className="text-2xl font-extrabold">{name}</h3>

          <div className="my-5 flex flex-1 items-center justify-center">
            <img
              src={mapImage}
              alt={`${mapAltPrefix} ${name}`}
              className={`premium-float-soft h-[145px] w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)] sm:h-[160px] md:h-[175px] ${mapImageClassName ?? ''}`}
              loading="lazy"
              decoding="async"
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
  const [countries, setCountries] = useState<CountryApiItem[]>([])
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)
  const [countriesLoadError, setCountriesLoadError] = useState(false)
  const continents = continentsByLanguage[language]
  const copy = sectionCopyByLanguage[language]

  useEffect(() => {
    let isCancelled = false
    const abortController = new AbortController()

    const loadCountries = async () => {
      setIsLoadingCountries(true)
      setCountriesLoadError(false)

      try {
        const response = await fetch(countriesApiUrl, { signal: abortController.signal })

        if (!response.ok) {
          throw new Error(`Failed to load countries: ${response.status}`)
        }

        const responsePayload = (await response.json()) as unknown
        const parsedCountries = parseCountriesFromResponse(responsePayload)

        if (isCancelled) {
          return
        }

        setCountries(parsedCountries)
      } catch {
        if (abortController.signal.aborted || isCancelled) {
          return
        }

        setCountries([])
        setCountriesLoadError(true)
      } finally {
        if (!abortController.signal.aborted && !isCancelled) {
          setIsLoadingCountries(false)
        }
      }
    }

    void loadCountries()

    return () => {
      isCancelled = true
      abortController.abort()
    }
  }, [])

  const countriesByContinent = useMemo<Record<ContinentId, string[]>>(() => {
    const groupedCountries = createEmptyCountriesByContinent()

    for (const country of countries) {
      const continentId = mapContinentToId(country.continent)
      if (!continentId) {
        continue
      }

      const countryName = language === 'ar' ? country.name_ar : country.name_en
      if (!countryName || groupedCountries[continentId].includes(countryName)) {
        continue
      }

      groupedCountries[continentId].push(countryName)
    }

    return groupedCountries
  }, [countries, language])

  return (
    <section id="markets-section" className="z-10 bg-[#07090D] py-9 sm:py-11 md:py-14 lg:py-16" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mx-auto w-full max-w-[1440px] px-[25px] md:px-[50px] lg:px-[100px]">
        <div data-reveal="up" className="mb-7 flex items-center justify-center gap-2.5 sm:mb-9 sm:gap-4 md:mb-12 md:gap-6">
          <span className={`premium-shimmer-line h-[3px] w-[44px] bg-gradient-to-l from-[#FBEF9D] to-[#A96522] sm:w-[88px] md:w-[120px]`} />
          <h2
            className={`${sectionTitleGradient} text-center text-2xl font-extrabold leading-tight sm:text-3xl lg:text-[2.1rem]`}
          >
            {copy.title}
          </h2>
          <span className={`premium-shimmer-line h-[3px] w-[44px] bg-gradient-to-r from-[#FBEF9D] to-[#A96522] sm:w-[88px] md:w-[120px]`} />
        </div>

        <div className="z-10 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:gap-4 lg:gap-6">
          {continents.map((continent, index) => (
            <ContinentCardItem
              key={continent.id}
              {...continent}
              countries={countriesByContinent[continent.id]}
              isLoadingCountries={isLoadingCountries}
              countriesLoadError={countriesLoadError}
              countriesInsideContinent={copy.countriesInsideContinent}
              hoverToShowCountries={copy.hoverToShowCountries}
              tapToShowCountries={copy.tapToShowCountries}
              cardAriaPrefix={copy.cardAriaPrefix}
              mapAltPrefix={copy.mapAltPrefix}
              loadingCountries={copy.loadingCountries}
              noCountriesInContinent={copy.noCountriesInContinent}
              countriesLoadErrorText={copy.countriesLoadError}
              revealDelayClass={index === 0 ? 'reveal-delay-1' : index === 1 ? 'reveal-delay-2' : 'reveal-delay-3'}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Section5
