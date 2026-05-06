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
  icon: IconType
  text: string
  href?: string
}

const contactIconGradientId = 'footer-contact-icon-gradient'

const navigationSections: NavigationSection[] = [
  {
    title: 'روابط سريعة',
    links: [
      { label: 'الرئيسية', href: '#' },
      { label: 'معلومات عنا', href: '#' },
      { label: 'الرؤية و الرسالة', href: '#' },
      { label: 'سابقة الأعمال', href: '#' },
      { label: 'تواصل معنا', href: '#' },
    ],
  },
  {
    title: 'روابط مهمة',
    links: [
      { label: 'سياسة الخصوصية', href: '#' },
      { label: 'الشروط والأحكام', href: '#' },
      { label: 'شركاء النجاح', href: '#' },
      { label: 'الشهادات', href: '#' },
    ],
  },
]

const socialLinks: SocialLink[] = [
  { icon: FaSnapchatGhost, label: 'Snapchat', href: '#' },
  { icon: FaTwitter, label: 'Twitter', href: '#' },
  { icon: FaInstagram, label: 'Instagram', href: '#' },
  { icon: FaFacebookF, label: 'Facebook', href: '#' },
]

const contacts: ContactItem[] = [
  {
    icon: FaMapMarkerAlt,
    text: 'المعادي - القاهرة - جمهورية مصر العربية',
  },
  {
    icon: FaEnvelope,
    text: 'info@goldencontainereg.com',
    href: 'mailto:info@goldencontainereg.com',
  },
  {
    icon: FaPhoneAlt,
    text: '+20 1009631733',
    href: 'tel:+201009631733',
  },
]

const styles = {
  mutedText: 'text-[15px] leading-8 text-[#DEDEDE] sm:text-base',
  sectionHeader: 'space-y-4',
  sectionTitle: 'text-base font-semibold sm:text-lg',
  sectionLine: 'block h-1 w-28 bg-gradient-to-l from-[#A96522] to-[#FBEF9D] sm:w-36',
  navList: 'mt-3 space-y-3 sm:mt-4 sm:space-y-4',
  navLink: 'transition-colors duration-200 hover:text-[#d6ac57]',
  socialList: 'mt-8 flex flex-wrap justify-center gap-4 pt-1 sm:mt-10 sm:justify-start sm:gap-5',
  socialLink:
    'grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#A96522] to-[#FBEF9D] text-lg text-white transition-transform duration-200 hover:scale-110',
  contactsGrid:
    'mt-8 grid w-full gap-x-6 gap-y-4 pt-6 md:mt-10 md:grid-cols-2 md:pt-7 xl:grid-cols-3',
  contactItem: 'flex items-start gap-3 text-[#DEDEDE] sm:items-center sm:gap-4',
  contactIcon: 'mt-0.5 grid h-6 w-6 shrink-0 place-items-center text-lg sm:mt-0',
  contactText: 'break-words leading-relaxed',
  contactInteractive:
    'break-words leading-relaxed transition-colors duration-200 hover:text-[#d6ac57]',
  bottomBar:
    'mt-7 border-t border-[#4d4d4d] pt-7 text-center text-sm leading-7 text-[#DEDEDE] sm:text-base lg:text-right',
} as const

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
      <SectionHeader title={title} />

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

  return (
    <footer className="bg-[#07090D] py-10 sm:py-12 lg:py-14" dir="rtl">
      <div className="mx-auto w-full max-w-[1240px]">
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

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-y-12 md:gap-x-8 md:gap-y-12 xl:grid-cols-[minmax(320px,1.2fr)_minmax(180px,0.8fr)_minmax(180px,0.8fr)_minmax(320px,1.05fr)] xl:gap-x-10 xl:gap-y-16">
          <section className="col-span-2 space-y-6 md:col-span-2 xl:col-span-1">
            <img
              src={logo}
              alt="Golden Container"
              className="h-[110px] w-[110px] object-contain sm:h-[132px] sm:w-[132px] md:h-[145px] md:w-[145px]"
            />

            <p className={styles.mutedText}>
              Golden Container شريكك الموثوق في تجارة وتصدير الفحم النباتي عالي
              الجودة. بخبرة تمتد لسنوات في الأسواق المحلية والعالمية، نقدم حلول
              تصدير متكاملة تجمع بين الجودة، الالتزام، والاحترافية لضمان وصول
              منتجاتنا بأعلى المعايير إلى مختلف أنحاء العالم. مع Golden
              Container، الجودة ليست خيارًا… بل وعد نلتزم به دائمًا.
            </p>
          </section>

          {navigationSections.map(({ title, links }) => (
            <FooterLinksSection key={title} title={title} links={links} />
          ))}

          <section className="col-span-2 md:col-span-2 xl:col-span-1">
            <SectionHeader title="النشرة الإخبارية" />

            <p className={`mt-4 ${styles.mutedText}`}>
              لا تفوت أي أخبار أو إصدارات، تابعنا على وسائل التواصل الاجتماعي
              وكن على اطلاع دائم...
            </p>

            <div className={styles.socialList} dir="rtl">
              {socialLinks.map(({ icon: Icon, label, href }) => (
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

        <address className={`${styles.contactsGrid} not-italic`}>
          {contacts.map(({ icon: Icon, text, href }) => (
            <div key={text} className={styles.contactItem}>
              <span className={styles.contactIcon}>
                <Icon style={{ fill: `url(#${contactIconGradientId})` }} />
              </span>

              {href ? (
                <a
                  href={href}
                  className={styles.contactInteractive}
                  dir={href.startsWith('tel:') ? 'ltr' : undefined}
                  style={href.startsWith('tel:') ? { unicodeBidi: 'plaintext' } : undefined}
                >
                  {text}
                </a>
              ) : (
                <span className={styles.contactText}>{text}</span>
              )}
            </div>
          ))}
        </address>

        <div className={styles.bottomBar}>
          <div className="flex flex-col-reverse items-center gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p>صمم وطوّر بواسطة XpertCoder Software Solutions.</p>
            <p>حقوق النشر © {year}. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
