import { useEffect, useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { LuPhoneCall } from 'react-icons/lu'
import { MdTranslate } from 'react-icons/md'
import logo from '../assets/Logo.png'
import { useLanguage, type Language } from '../i18n/language'

type NavItem = {
  label: string
  href: string
}

type ContactButtonProps = {
  className: string
  label: string
  onClick?: () => void
  iconClassName?: string
}

type LanguageButtonProps = {
  className: string
  iconClassName: string
  label: string
  onClick: () => void
  ariaLabel: string
}

const navItemsByLanguage: Record<Language, NavItem[]> = {
  en: [
    { label: 'Home', href: '#home-section' },
    { label: 'About Us', href: '#about-section' },
    { label: 'Products', href: '#products-section' },
    { label: 'Services', href: '#services-section' },
    { label: 'Markets', href: '#markets-section' },
  ],
  ar: [
    { label: 'الرئيسية', href: '#home-section' },
    { label: 'من نحن', href: '#about-section' },
    { label: 'المنتجات', href: '#products-section' },
    { label: 'خدماتنا', href: '#services-section' },
    { label: 'أسواقنا', href: '#markets-section' },
  ],
}

const contactLabelByLanguage: Record<Language, string> = {
  en: 'Contact Us',
  ar: 'تواصل معنا',
}

const mainNavigationLabelByLanguage: Record<Language, string> = {
  en: 'Main navigation',
  ar: 'التنقل الرئيسي',
}

const mobileMenuToggleLabelByLanguage: Record<Language, string> = {
  en: 'Toggle navigation menu',
  ar: 'تبديل قائمة التنقل',
}

const contactLink = '#contact-section'

const styles = {
  headerBase: 'sticky top-2 z-50 text-[14px] md:top-3 md:text-[15px] lg:text-base transition-[padding,background-color] duration-500',
  headerAtTop:
    'bg-gradient-to-b from-[#05070D]/90 via-[#05070D]/58 to-transparent pb-2 pt-2 sm:pt-3',
  headerScrolled:
    '',
  navContainer: 'relative mx-auto w-full max-w-[1440px] px-[18px] sm:px-[25px] md:px-[50px] lg:px-[100px]',
  navShell:
    'relative flex items-center justify-between gap-3 overflow-hidden rounded-[22px] border transition-[height,border-color,background-color,box-shadow,padding] duration-500',
  navShellAtTop:
    'h-[70px] border-[#FBEF9D2A] bg-[linear-gradient(120deg,rgba(11,15,24,0.78),rgba(6,9,15,0.54))] px-2.5 shadow-[0_14px_30px_rgba(0,0,0,0.3)] sm:h-[80px] sm:px-3 md:h-[88px] lg:h-[96px] lg:px-3.5',
  navShellScrolled:
    'h-[70px] border-[#FBEF9D57] bg-[linear-gradient(120deg,rgba(9,13,20,0.95),rgba(5,8,14,0.84))] px-2.5 shadow-[0_24px_46px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-2xl sm:h-[80px] sm:px-3 md:h-[88px] lg:h-[96px] lg:px-3.5',
  topGlow:
    'pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#FBEF9D] to-transparent transition-opacity duration-500',
  sideGlow:
    'pointer-events-none absolute -left-24 top-0 h-full w-44 bg-[radial-gradient(circle_at_center,rgba(251,239,157,0.16),transparent_72%)] blur-2xl',
  logoLink:
    'relative shrink-0 rounded-full transition-transform duration-300 hover:scale-[1.02] lg:flex lg:min-w-[190px] lg:justify-start',
  logo: 'object-contain transition-[height,width,filter] duration-500',
  logoAtTop: 'h-[44px] w-[44px] sm:h-[50px] sm:w-[50px] lg:h-[58px] lg:w-[58px]',
  logoScrolled: 'h-[44px] w-[44px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] sm:h-[50px] sm:w-[50px] lg:h-[58px] lg:w-[58px]',
  desktopLinks: 'hidden min-w-0 flex-1 items-center justify-center gap-1.5 md:flex lg:gap-3',
  desktopNavLinkBase:
    'relative inline-flex items-center rounded-full px-3.5 py-2 text-[11px] font-semibold tracking-[0.05em] leading-none transition-all duration-300 lg:px-4 lg:text-[12px] xl:text-[13px]',
  desktopNavLinkInactive: 'text-[#FFFFFF] hover:text-[#FFF1BC]',
  desktopNavLinkActive:
    'text-[#FFF8D6] after:absolute after:inset-x-3 after:-bottom-1 after:h-[2px] after:rounded-full after:bg-gradient-to-r after:from-[#FBEF9D] after:to-[#A96522] after:shadow-[0_0_14px_rgba(251,239,157,0.55)]',
  desktopControls: 'hidden shrink-0 items-center gap-2 md:flex lg:min-w-[190px] lg:justify-end',
  contactButton:
    'inline-flex items-center gap-1.5 rounded-full bg-gradient-to-l from-[#F2E89B] via-[#D39B52] to-[#A96522] px-3 py-2 text-[11px] font-semibold text-[#FFFDF4] shadow-[0_14px_24px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_18px_30px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.25)] md:text-xs lg:gap-2 lg:px-4 lg:py-2.5 lg:text-[13px] xl:px-5 xl:py-3 xl:text-[14px]',
  languageDesktop:
    'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-[#F5F6F8] transition-colors duration-300 hover:text-[#FFF1BC] lg:text-sm xl:text-base',
  languageMobile:
    'inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium text-[#F5F6F8] transition-colors duration-300 hover:text-[#FFF1BC]',
  mobileControls: 'flex items-center gap-2 md:hidden',
  mobileMenuToggle:
    'grid h-10 w-10 place-items-center rounded-full border border-[#FBEF9D62] bg-[#0D121B]/78 text-[#F5F6F8] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-300 hover:border-[#FBEF9D] hover:text-[#FFF1BC]',
  mobileMenu:
    'absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-[18px] border border-[#FBEF9D38] bg-[linear-gradient(150deg,rgba(9,13,21,0.98),rgba(6,9,15,0.94))] backdrop-blur-2xl shadow-[0_24px_40px_rgba(0,0,0,0.5)] transition-all duration-300 md:hidden',
  mobileMenuVisible: 'pointer-events-auto max-h-[430px] opacity-100',
  mobileMenuHidden: 'pointer-events-none max-h-0 opacity-0',
  mobileLinksList: 'flex flex-col gap-2 px-3 pb-2 pt-3',
  mobileNavLinkBase:
    'block rounded-xl border px-3 py-2.5 text-[15px] font-semibold tracking-[0.02em] transition-all duration-300',
  mobileNavLinkInactive: 'border-transparent text-[#F5F6F8] hover:border-[#FBEF9D3D] hover:bg-[#151A23] hover:text-[#FFF1BC]',
  mobileNavLinkActive:
    'relative text-[#FFF8D6] shadow-[inset_0_0_0_1px_rgba(251,239,157,0.2)] before:absolute before:bottom-0 before:left-3 before:right-3 before:h-[2px] before:rounded-full before:bg-gradient-to-r before:from-[#FBEF9D] before:to-[#A96522]',
  mobileContactButton:
    'inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-l from-[#F2E89B] via-[#D39B52] to-[#A96522] px-4 py-3 text-sm font-semibold text-[#FFFDF4] shadow-[0_14px_24px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.24)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_18px_30px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.24)]',
} as const

function ContactButton({
  className,
  label,
  onClick,
  iconClassName = 'text-sm lg:text-base xl:text-lg',
}: ContactButtonProps) {
  return (
    <a href={contactLink} onClick={onClick} className={className}>
      <LuPhoneCall className={iconClassName} />
      <span className="leading-none">{label}</span>
    </a>
  )
}

function LanguageButton({ className, iconClassName, label, onClick, ariaLabel }: LanguageButtonProps) {
  return (
    <button type="button" onClick={onClick} className={className} aria-label={ariaLabel}>
      <MdTranslate className={iconClassName} />
      <span>{label}</span>
    </button>
  )
}

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeHref, setActiveHref] = useState<string | null>('#home-section')
  const [isContactSectionReached, setIsContactSectionReached] = useState(false)
  const { language, isArabic, toggleLanguage } = useLanguage()
  const mobileMenuId = 'main-navigation-mobile'

  const navItems = navItemsByLanguage[language]
  const contactLabel = contactLabelByLanguage[language]
  const languageToggleLabel = isArabic ? 'EN' : 'AR'
  const languageToggleAriaLabel = isArabic ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18)

      const contactSection = document.querySelector<HTMLElement>(contactLink)

      if (contactSection) {
        const contactTriggerPoint = window.innerHeight * 0.52
        const hasReachedContact = contactSection.getBoundingClientRect().top <= contactTriggerPoint

        setIsContactSectionReached(hasReachedContact)

        if (hasReachedContact) {
          setActiveHref(null)
          return
        }
      }

      if (window.scrollY < 40) {
        setActiveHref('#home-section')
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (isContactSectionReached) {
      return
    }

    const sections = navItems
      .map(({ href }) => document.querySelector<HTMLElement>(href))
      .filter((section): section is HTMLElement => section !== null)

    if (sections.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleSections.length === 0) {
          return
        }

        setActiveHref(`#${visibleSections[0].target.id}`)
      },
      {
        root: null,
        rootMargin: '-35% 0px -50% 0px',
        threshold: [0.15, 0.35, 0.65],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      observer.disconnect()
    }
  }, [isContactSectionReached, navItems])

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleNavItemClick = (href: string) => {
    setIsContactSectionReached(false)
    setActiveHref(href)
    closeMobileMenu()
  }

  const getDesktopLinkClassName = (href: string) => {
    const stateClass = activeHref === href ? styles.desktopNavLinkActive : styles.desktopNavLinkInactive

    return `${styles.desktopNavLinkBase} ${stateClass}`
  }

  const getMobileLinkClassName = (href: string) => {
    const stateClass = activeHref === href ? styles.mobileNavLinkActive : styles.mobileNavLinkInactive

    return `${styles.mobileNavLinkBase} ${stateClass}`
  }

  return (
    <header
      className={`${styles.headerBase} ${isScrolled ? styles.headerScrolled : styles.headerAtTop}`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <nav className={styles.navContainer} aria-label={mainNavigationLabelByLanguage[language]}>
        <div className={`${styles.navShell} ${isScrolled ? styles.navShellScrolled : styles.navShellAtTop}`}>
          <span className={`${styles.topGlow} ${isScrolled ? 'opacity-90' : 'opacity-0'}`} aria-hidden="true" />
          <span className={styles.sideGlow} aria-hidden="true" />

          <a href="#home-section" className={styles.logoLink} onClick={() => handleNavItemClick('#home-section')}>
            <img
              src={logo}
              alt="Golden Container"
              className={`${styles.logo} ${isScrolled ? styles.logoScrolled : styles.logoAtTop}`}
            />
          </a>

          <ul className={styles.desktopLinks}>
            {navItems.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className={getDesktopLinkClassName(href)} onClick={() => handleNavItemClick(href)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.desktopControls}>
            <LanguageButton
              className={styles.languageDesktop}
              iconClassName="text-sm lg:text-base xl:text-lg"
              label={languageToggleLabel}
              onClick={toggleLanguage}
              ariaLabel={languageToggleAriaLabel}
            />
            <ContactButton
              className={styles.contactButton}
              iconClassName="text-sm lg:text-base xl:text-lg"
              label={contactLabel}
            />
          </div>

          <div className={styles.mobileControls}>
            <LanguageButton
              className={styles.languageMobile}
              iconClassName="text-base"
              label={languageToggleLabel}
              onClick={toggleLanguage}
              ariaLabel={languageToggleAriaLabel}
            />

            <button
              type="button"
              className={styles.mobileMenuToggle}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-label={mobileMenuToggleLabelByLanguage[language]}
              aria-controls={mobileMenuId}
            >
              {isMobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        <div
          id={mobileMenuId}
          className={`${styles.mobileMenu} ${
            isMobileMenuOpen ? styles.mobileMenuVisible : styles.mobileMenuHidden
          }`}
        >
          <ul className={styles.mobileLinksList}>
            {navItems.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={() => handleNavItemClick(href)}
                  className={getMobileLinkClassName(href)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="px-3 pb-4">
            <ContactButton
              className={styles.mobileContactButton}
              onClick={closeMobileMenu}
              iconClassName="text-base"
              label={contactLabel}
            />
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
