import { useEffect } from 'react'
import { useLanguage, type Language } from '../i18n/language'

type SeoContent = {
  title: string
  description: string
  keywords: string
  ogTitle: string
  ogDescription: string
}

const DEFAULT_SITE_URL = 'https://goldencontainereg.com'
const DEFAULT_OG_IMAGE_PATH = '/footer-reference.png'
const ORGANIZATION_LOGO_PATH = '/footer-logo.png'
const ORGANIZATION_EMAIL = 'info@goldencontainereg.com'
const ORGANIZATION_PHONE = '+20 1009631733'

const ogLocaleByLanguage: Record<Language, string> = {
  en: 'en_US',
  ar: 'ar_EG',
}

const seoByLanguage: Record<Language, SeoContent> = {
  en: {
    title: 'Golden Container | Egyptian Charcoal Exporter',
    description:
      'Golden Container is an Egyptian charcoal exporter delivering premium lump charcoal, hookah charcoal, and private-label packaging to global markets.',
    keywords:
      'charcoal exporter Egypt, premium charcoal, hookah charcoal supplier, lump charcoal wholesale, private label charcoal packaging, charcoal shipping',
    ogTitle: 'Golden Container | Egyptian Charcoal Exporter',
    ogDescription:
      'Premium charcoal export solutions with reliable quality, custom packaging, and international shipping.',
  },
  ar: {
    title: 'جولدن كونتينر | تصدير الفحم النباتي المصري',
    description:
      'جولدن كونتينر شركة مصرية متخصصة في تصدير الفحم النباتي بجودة عالية مع حلول تعبئة مخصصة وخدمات شحن للأسواق العالمية.',
    keywords:
      'تصدير الفحم النباتي, فحم نباتي مصري, فحم شيشة للتصدير, تعبئة فحم خاصة, شحن دولي للفحم, مورد فحم جملة',
    ogTitle: 'جولدن كونتينر | تصدير الفحم النباتي المصري',
    ogDescription:
      'حلول تصدير فحم نباتي بجودة ثابتة، تعبئة مخصصة، وشحن دولي للأسواق العالمية.',
  },
}

const sanitizeSiteUrl = (siteUrl: string) => siteUrl.replace(/\/+$/, '')

const getSiteUrl = () => {
  const envSiteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim()
  if (envSiteUrl) return sanitizeSiteUrl(envSiteUrl)

  if (typeof window !== 'undefined') {
    return sanitizeSiteUrl(window.location.origin)
  }

  return DEFAULT_SITE_URL
}

const removeLanguagePrefix = (pathname: string) => {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  const segments = normalizedPath.split('/').filter(Boolean)

  if (segments.length === 0) return '/'
  if (segments[0] !== 'en' && segments[0] !== 'ar') return normalizedPath

  const remainingSegments = segments.slice(1)
  if (remainingSegments.length === 0) return '/'
  return `/${remainingSegments.join('/')}`
}

const buildLocalizedPath = (pathnameWithoutLanguage: string, language: Language) => {
  if (pathnameWithoutLanguage === '/') return `/${language}`
  return `/${language}${pathnameWithoutLanguage}`
}

const toAbsoluteUrl = (siteUrl: string, pathname: string) => {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  return new URL(normalizedPath, siteUrl).toString()
}

const upsertMetaByName = (name: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('name', name)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

const upsertMetaByProperty = (property: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

const upsertLink = (rel: string, href: string, hreflang?: string) => {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`

  let element = document.head.querySelector<HTMLLinkElement>(selector)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    if (hreflang) element.setAttribute('hreflang', hreflang)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
}

const upsertStructuredData = (
  siteUrl: string,
  language: Language,
  canonicalUrl: string,
  pageDescription: string,
) => {
  const scriptId = 'site-seo-structured-data'
  let script = document.getElementById(scriptId) as HTMLScriptElement | null

  if (!script) {
    script = document.createElement('script')
    script.id = scriptId
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Golden Container',
        url: siteUrl,
        logo: toAbsoluteUrl(siteUrl, ORGANIZATION_LOGO_PATH),
        email: ORGANIZATION_EMAIL,
        telephone: ORGANIZATION_PHONE,
        areaServed: ['Africa', 'Asia', 'Europe'],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: 'Golden Container',
        url: siteUrl,
        inLanguage: ['en', 'ar'],
        publisher: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: document.title,
        description: pageDescription,
        inLanguage: language,
        isPartOf: { '@id': `${siteUrl}/#website` },
      },
    ],
  }

  script.textContent = JSON.stringify(data)
}

export function useSiteSeo() {
  const { language } = useLanguage()

  useEffect(() => {
    const siteUrl = getSiteUrl()
    const seo = seoByLanguage[language]
    const alternateLanguage: Language = language === 'en' ? 'ar' : 'en'
    const pathWithoutLanguage = removeLanguagePrefix(window.location.pathname)

    const localizedPath = buildLocalizedPath(pathWithoutLanguage, language)
    const englishPath = buildLocalizedPath(pathWithoutLanguage, 'en')
    const arabicPath = buildLocalizedPath(pathWithoutLanguage, 'ar')

    const canonicalUrl = toAbsoluteUrl(siteUrl, localizedPath)
    const englishUrl = toAbsoluteUrl(siteUrl, englishPath)
    const arabicUrl = toAbsoluteUrl(siteUrl, arabicPath)
    const ogImageUrl = toAbsoluteUrl(siteUrl, DEFAULT_OG_IMAGE_PATH)

    document.title = seo.title

    upsertMetaByName('description', seo.description)
    upsertMetaByName('keywords', seo.keywords)
    upsertMetaByName('author', 'Golden Container')
    upsertMetaByName(
      'robots',
      'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    )
    upsertMetaByName('language', language)
    upsertMetaByName('theme-color', '#07090D')

    upsertMetaByProperty('og:type', 'website')
    upsertMetaByProperty('og:site_name', 'Golden Container')
    upsertMetaByProperty('og:title', seo.ogTitle)
    upsertMetaByProperty('og:description', seo.ogDescription)
    upsertMetaByProperty('og:url', canonicalUrl)
    upsertMetaByProperty('og:image', ogImageUrl)
    upsertMetaByProperty('og:image:alt', 'Golden Container charcoal export products')
    upsertMetaByProperty('og:locale', ogLocaleByLanguage[language])
    upsertMetaByProperty('og:locale:alternate', ogLocaleByLanguage[alternateLanguage])

    upsertMetaByName('twitter:card', 'summary_large_image')
    upsertMetaByName('twitter:title', seo.ogTitle)
    upsertMetaByName('twitter:description', seo.ogDescription)
    upsertMetaByName('twitter:image', ogImageUrl)

    upsertLink('canonical', canonicalUrl)
    upsertLink('alternate', englishUrl, 'en')
    upsertLink('alternate', arabicUrl, 'ar')
    upsertLink('alternate', englishUrl, 'x-default')

    upsertStructuredData(siteUrl, language, canonicalUrl, seo.description)
  }, [language])
}
