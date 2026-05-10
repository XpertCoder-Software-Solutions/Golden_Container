import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaSnapchatGhost,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from 'react-icons/fa'
import type { IconType } from 'react-icons'
import logo from '../assets/Logo.png'
import { useLanguage, type Language } from '../i18n/language'

type FooterLink = {
  label: string
  href: string
}

type NavigationSection = {
  title: string
  links: FooterLink[]
}

type SocialLink = {
  icon: IconType
  label: string
  href: string
}

type ContactItem = {
  id: string
  icon: IconType
  text: string
  href?: string
}

const contactIconGradientId = 'footer-contact-icon-gradient'

const companyDescriptionByLanguage: Record<Language, string> = {
  en:
    'Golden Container is your trusted partner in trading and exporting premium-quality charcoal. With years of experience in local and global markets, we provide end-to-end export solutions built on quality, commitment, and professionalism to ensure our products reach every destination at the highest standards. With Golden Container, quality is never optional; it is a promise we always keep.',
  ar:
    'Golden Container شريكك الموثوق في تجارة وتصدير الفحم النباتي عالي الجودة. بخبرة تمتد لسنوات في الأسواق المحلية والعالمية، نقدم حلول تصدير متكاملة تجمع بين الجودة، الالتزام، والاحترافية لضمان وصول منتجاتنا بأعلى المعايير إلى مختلف أنحاء العالم. مع Golden Container، الجودة ليست خيارًا… بل وعد نلتزم به دائمًا.',
}

const newsletterDescriptionByLanguage: Record<Language, string> = {
  en: 'Stay connected for updates and new releases. Follow us on social media and stay informed.',
  ar: 'لا تفوت أي أخبار أو إصدارات، تابعنا على وسائل التواصل الاجتماعي وكن على اطلاع دائم...',
}

const navigationSectionsByLanguage: Record<Language, NavigationSection[]> = {
  en: [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', href: '#home-section' },
        { label: 'About Us', href: '#about-section' },
        { label: 'Products', href: '#products-section' },
        { label: 'Services', href: '#services-section' },
        { label: 'Contact Us', href: '#contact-section' },
      ],
    },
  ],
  ar: [
    {
      title: 'روابط سريعة',
      links: [
        { label: 'الرئيسية', href: '#home-section' },
        { label: 'من نحن', href: '#about-section' },
        { label: 'المنتجات', href: '#products-section' },
        { label: 'خدماتنا', href: '#services-section' },
        { label: 'تواصل معنا', href: '#contact-section' },
      ],
    },
  ],
}

const socialLinksByLanguage: Record<Language, SocialLink[]> = {
  en: [
    { icon: FaSnapchatGhost, label: 'Snapchat', href: '#' },
    { icon: FaTwitter, label: 'Twitter', href: '#' },
    { icon: FaInstagram, label: 'Instagram', href: '#' },
    { icon: FaFacebookF, label: 'Facebook', href: '#' },
  ],
  ar: [
    { icon: FaSnapchatGhost, label: 'سناب شات', href: '#' },
    { icon: FaTwitter, label: 'تويتر', href: '#' },
    { icon: FaInstagram, label: 'إنستجرام', href: '#' },
    { icon: FaFacebookF, label: 'فيسبوك', href: '#' },
  ],
}

const contactsByLanguage: Record<Language, ContactItem[]> = {
  en: [
    {
      id: 'address',
      icon: FaMapMarkerAlt,
      text: 'Maadi - Cairo - Egypt',
    },
    {
      id: 'email',
      icon: FaEnvelope,
      text: 'info@goldencontainereg.com',
      href: 'mailto:info@goldencontainereg.com',
    },
    {
      id: 'phone',
      icon: FaPhoneAlt,
      text: '+20 1009631733',
      href: 'tel:+201009631733',
    },
  ],
  ar: [
    {
      id: 'address',
      icon: FaMapMarkerAlt,
      text: 'المعادي - القاهرة - جمهورية مصر العربية',
    },
    {
      id: 'email',
      icon: FaEnvelope,
      text: 'info@goldencontainereg.com',
      href: 'mailto:info@goldencontainereg.com',
    },
    {
      id: 'phone',
      icon: FaPhoneAlt,
      text: '+20 1009631733',
      href: 'tel:+201009631733',
    },
  ],
}

const footerCopyByLanguage: Record<Language, {
  newsletterTitle: string
  footerAriaLabel: string
  contactAriaLabel: string
  designedByPrefix: string
  copyrightPrefix: string
}> = {
  en: {
    newsletterTitle: 'Newsletter',
    footerAriaLabel: 'Site footer',
    contactAriaLabel: 'Contact information',
    designedByPrefix: 'Designed and developed by',
    copyrightPrefix: 'Copyright ©',
  },
  ar: {
    newsletterTitle: 'النشرة الإخبارية',
    footerAriaLabel: 'تذييل الموقع',
    contactAriaLabel: 'معلومات التواصل',
    designedByPrefix: 'صمم وطوّر بواسطة',
    copyrightPrefix: 'حقوق النشر ©',
  },
}

const styles = {
  NewsletterText: 'text-[13px] leading-7 text-[#DEDEDE] md:text-[15px] md:leading-8 lg:text-base',
  mutedText: 'text-[13px] leading-7 text-[#DEDEDE] md:text-[15px] md:leading-6 lg:text-[12px]',
  companySection: 'space-y-7 sm:space-y-6 md:space-y-8',
  sectionHeader: 'space-y-4',
  sectionHeaderCompact: 'space-y-4',
  sectionTitle: 'text-[15px] font-semibold md:text-base lg:text-lg',
  sectionLine: 'block h-1 w-28 bg-gradient-to-l from-[#A96522] to-[#FBEF9D] sm:w-36',
  navList: 'mt-3 space-y-2 sm:mt-4 sm:space-y-2.5',
  navLink: 'text-[14px] transition-colors duration-200 hover:text-[#d6ac57] md:text-[15px] lg:text-base',
  socialList: 'flex flex-wrap justify-center gap-3.5 pt-1 sm:justify-start sm:gap-5',
  newsletterSection: 'flex h-full flex-col gap-4 sm:gap-5',
  socialLink:
    'grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#A96522] to-[#FBEF9D] text-[15px] text-white transition-transform duration-200 hover:scale-110 sm:h-10 sm:w-10 sm:text-lg',
  contactsGrid:
    'mt-7 grid w-full gap-x-6 gap-y-3 pt-5 sm:mt-8 sm:gap-y-4 sm:pt-6 md:mt-10 md:grid-cols-3 md:pt-7 xl:grid-cols-3',
  contactItem:
    'flex items-start gap-3 text-[13px] text-[#DEDEDE] md:text-[14px] lg:text-[15px] sm:items-center sm:gap-4',
  contactIcon:
    'mt-0.5 grid h-5 w-5 shrink-0 place-items-center text-base md:h-6 md:w-6 md:text-lg sm:mt-0',
  contactText: 'break-words leading-relaxed',
  contactInteractive:
    'break-words leading-relaxed transition-colors duration-200 hover:text-[#d6ac57]',
} as const

const isPhoneLink = (href: string) => href.startsWith('tel:')

function SectionHeader({ title }: { title: string }) {
  return (
    <div className={styles.sectionHeader}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <span className={styles.sectionLine} />
    </div>
  )
}

function FooterLinksSection({ title, links }: NavigationSection) {
  return (
    <nav aria-label={title}>
      <div className={styles.sectionHeaderCompact}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <span className={styles.sectionLine} />
      </div>

      <ul className={styles.navList}>
        {links.map(({ label, href }) => (
          <li key={label}>
            <a href={href} className={styles.navLink}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Footer() {
  const year = new Date().getFullYear()
  const { language, isArabic } = useLanguage()

  const companyDescription = companyDescriptionByLanguage[language]
  const newsletterDescription = newsletterDescriptionByLanguage[language]
  const navigationSections = navigationSectionsByLanguage[language]
  const socialLinks = socialLinksByLanguage[language]
  const orderedSocialLinks = isArabic ? socialLinks : [...socialLinks].reverse()
  const contacts = contactsByLanguage[language]
  const copy = footerCopyByLanguage[language]

  return (
    <footer
      className="bg-[#07090D] py-8 sm:py-10 md:py-12 lg:py-[50px]"
      dir={isArabic ? 'rtl' : 'ltr'}
      aria-label={copy.footerAriaLabel}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-10 lg:px-[100px]">
        <svg className="h-0 w-0" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient
              id={contactIconGradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#A96522" />
              <stop offset="100%" stopColor="#FBEF9D" />
            </linearGradient>
          </defs>
        </svg>

        <div className="grid grid-cols-1 gap-y-9 sm:gap-y-10 md:grid-cols-2 md:gap-x-[2.75rem] md:gap-y-10 lg:grid-cols-[minmax(355px,1.2fr)_minmax(220px,0.84fr)_minmax(260px,0.96fr)] lg:gap-x-[6.5rem] lg:gap-y-14">
          <section className={`${styles.companySection} md:col-span-2 lg:col-span-1`}>
            <img
              src={logo}
              alt="Golden Container"
              className="h-[110px] w-[110px] object-contain sm:h-[132px] sm:w-[132px] md:h-[145px] md:w-[145px]"
            />

            <p className={styles.mutedText}>{companyDescription}</p>
          </section>

          {navigationSections.map(({ title, links }) => (
            <FooterLinksSection key={title} title={title} links={links} />
          ))}

          <section className={`${styles.newsletterSection} lg:col-span-1`}>
            <SectionHeader title={copy.newsletterTitle} />

            <p className={styles.NewsletterText}>{newsletterDescription}</p>

            <div className={styles.socialList}>
              {orderedSocialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={styles.socialLink}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </section>
        </div>

        <address className={`${styles.contactsGrid} not-italic`} aria-label={copy.contactAriaLabel}>
          {contacts.map(({ id, icon: Icon, text, href }) => (
            <div key={id} className={styles.contactItem}>
              <span className={styles.contactIcon}>
                <Icon style={{ fill: `url(#${contactIconGradientId})` }} />
              </span>

              {href ? (
                <a
                  href={href}
                  className={styles.contactInteractive}
                  dir={isPhoneLink(href) ? 'ltr' : undefined}
                  style={isPhoneLink(href) ? { unicodeBidi: 'plaintext' } : undefined}
                >
                  {text}
                </a>
              ) : (
                <span className={styles.contactText}>{text}</span>
              )}
            </div>
          ))}
        </address>

        <div
          className={`mt-6 border-t border-[#4d4d4d] pt-6 text-center text-[12px] leading-6 text-[#DEDEDE] sm:mt-7 sm:pt-7 sm:text-sm md:text-[15px] md:leading-7 ${
            isArabic ? 'lg:text-right' : 'lg:text-left'
          } lg:text-base`}
        >
          <div className="flex flex-col-reverse items-center gap-2.5 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <p>
              {copy.designedByPrefix}{' '}
              <a
                href="https://xpertcodersolutions.com"
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-gradient-to-t from-[#FBEF9D] to-[#A96522] bg-clip-text text-transparent transition-all duration-200 hover:from-[#d6ac57] hover:to-[#FBEF9D]"
              >
                XpertCoder Software Solutions
              </a>
              .
            </p>
            <p>
              {copy.copyrightPrefix} {year}. {isArabic ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
