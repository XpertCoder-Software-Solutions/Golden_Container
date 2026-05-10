import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Language = 'en' | 'ar'

type LanguageContextValue = {
  language: Language
  isArabic: boolean
  toggleLanguage: () => void
  setLanguage: (language: Language) => void
}

const DEFAULT_LANGUAGE: Language = 'en'
const SUPPORTED_LANGUAGES: readonly Language[] = ['en', 'ar']

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const isLanguage = (value: string): value is Language => {
  return SUPPORTED_LANGUAGES.includes(value as Language)
}

const normalizePathname = (pathname: string) => {
  if (!pathname) return '/'
  return pathname.startsWith('/') ? pathname : `/${pathname}`
}

const getLanguageFromPathname = (pathname: string): Language | null => {
  const normalizedPathname = normalizePathname(pathname)
  const firstSegment = normalizedPathname.split('/').filter(Boolean)[0]?.toLowerCase()
  if (!firstSegment || !isLanguage(firstSegment)) return null
  return firstSegment
}

const removeLanguagePrefix = (pathname: string) => {
  const normalizedPathname = normalizePathname(pathname)
  const pathSegments = normalizedPathname.split('/').filter(Boolean)

  if (pathSegments.length === 0) return '/'

  const [firstSegment, ...remainingSegments] = pathSegments
  if (!isLanguage(firstSegment.toLowerCase())) return normalizedPathname

  if (remainingSegments.length === 0) return '/'
  return `/${remainingSegments.join('/')}`
}

const buildLocalizedPathname = (pathname: string, language: Language) => {
  const pathWithoutLanguage = removeLanguagePrefix(pathname)
  if (pathWithoutLanguage === '/') return `/${language}`
  return `/${language}${pathWithoutLanguage}`
}

const updateUrlLanguage = (language: Language, mode: 'replace' | 'push') => {
  if (typeof window === 'undefined') return

  const localizedPathname = buildLocalizedPathname(window.location.pathname, language)
  const nextUrl = `${localizedPathname}${window.location.search}${window.location.hash}`
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (nextUrl === currentUrl) return

  if (mode === 'push') {
    window.history.pushState(null, '', nextUrl)
    return
  }

  window.history.replaceState(null, '', nextUrl)
}

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE

  const languageFromPathname = getLanguageFromPathname(window.location.pathname)
  if (languageFromPathname) return languageFromPathname

  return DEFAULT_LANGUAGE
}

type LanguageProviderProps = {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => getInitialLanguage())
  const isArabic = language === 'ar'

  useEffect(() => {
    if (typeof window === 'undefined') return

    const languageFromPathname = getLanguageFromPathname(window.location.pathname)
    if (!languageFromPathname) {
      updateUrlLanguage(language, 'replace')
      return
    }

    const normalizedPathname = buildLocalizedPathname(window.location.pathname, languageFromPathname)
    if (normalizedPathname !== window.location.pathname) {
      updateUrlLanguage(languageFromPathname, 'replace')
    }
  }, [language])

  useEffect(() => {
    if (typeof window === 'undefined') return

    document.documentElement.lang = language
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
    document.documentElement.dataset.language = language
  }, [language, isArabic])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handlePopState = () => {
      const languageFromPathname = getLanguageFromPathname(window.location.pathname)
      if (!languageFromPathname) {
        setLanguageState(DEFAULT_LANGUAGE)
        updateUrlLanguage(DEFAULT_LANGUAGE, 'replace')
        return
      }

      setLanguageState(languageFromPathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    updateUrlLanguage(newLanguage, 'push')
    setLanguageState(newLanguage)
  }

  const toggleLanguage = () => {
    const nextLanguage = language === 'en' ? 'ar' : 'en'
    setLanguage(nextLanguage)
  }

  const value = useMemo(
    () => ({ language, isArabic, toggleLanguage, setLanguage }),
    [language, isArabic],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }

  return context
}
