import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaSnapchatGhost,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaPaperPlane,
} from 'react-icons/fa'
import type { IconType } from 'react-icons'
import { useLanguage, type Language } from '../i18n/language'

type ContactInfoItem = {
  id: string
  icon: IconType
  label: string
  href?: string
}

type SocialItem = {
  id: string
  icon: IconType
  label: string
  href: string
}

type ContactFormField = {
  id: string
  name: string
  type: 'text' | 'tel' | 'email'
  placeholder: string
  autoComplete?: string
}

const contactInfoByLanguage: Record<Language, ContactInfoItem[]> = {
  en: [
    {
      id: 'address',
      icon: FaMapMarkerAlt,
      label: 'Maadi - Cairo - Arab Republic of Egypt',
    },
    {
      id: 'email',
      icon: FaEnvelope,
      label: 'info@goldencontainereg.com',
      href: 'mailto:info@goldencontainereg.com',
    },
    {
      id: 'phone',
      icon: FaPhoneAlt,
      label: '+20 1009631733',
      href: 'tel:+201009631733',
    },
  ],
  ar: [
    {
      id: 'address',
      icon: FaMapMarkerAlt,
      label: 'المعادي - القاهرة - جمهورية مصر العربية',
    },
    {
      id: 'email',
      icon: FaEnvelope,
      label: 'info@goldencontainereg.com',
      href: 'mailto:info@goldencontainereg.com',
    },
    {
      id: 'phone',
      icon: FaPhoneAlt,
      label: '+20 1009631733',
      href: 'tel:+201009631733',
    },
  ],
}

const socialLinksByLanguage: Record<Language, SocialItem[]> = {
  en: [
    { id: 'facebook', icon: FaFacebookF, label: 'Facebook', href: '#' },
    { id: 'instagram', icon: FaInstagram, label: 'Instagram', href: '#' },
    { id: 'twitter', icon: FaTwitter, label: 'Twitter', href: '#' },
    { id: 'snapchat', icon: FaSnapchatGhost, label: 'Snapchat', href: '#' },
  ],
  ar: [
    { id: 'snapchat', icon: FaSnapchatGhost, label: 'سناب شات', href: '#' },
    { id: 'twitter', icon: FaTwitter, label: 'تويتر', href: '#' },
    { id: 'instagram', icon: FaInstagram, label: 'إنستجرام', href: '#' },
    { id: 'facebook', icon: FaFacebookF, label: 'فيسبوك', href: '#' },
  ],
}

const contactFormFieldsByLanguage: Record<Language, ContactFormField[]> = {
  en: [
    {
      id: 'contact-name',
      name: 'name',
      type: 'text',
      placeholder: 'Full Name',
      autoComplete: 'name',
    },
    {
      id: 'contact-phone',
      name: 'phone',
      type: 'tel',
      placeholder: 'Phone Number',
      autoComplete: 'tel',
    },
    {
      id: 'contact-subject',
      name: 'subject',
      type: 'text',
      placeholder: 'Subject',
    },
  ],
  ar: [
    {
      id: 'contact-name',
      name: 'name',
      type: 'text',
      placeholder: 'الاسم بالكامل',
      autoComplete: 'name',
    },
    {
      id: 'contact-phone',
      name: 'phone',
      type: 'tel',
      placeholder: 'رقم الهاتف',
      autoComplete: 'tel',
    },
    {
      id: 'contact-subject',
      name: 'subject',
      type: 'text',
      placeholder: 'الموضوع',
    },
  ],
}

const sectionCopyByLanguage: Record<
  Language,
  {
    title: string
    subtitle: string
    contactDetailsTitle: string
    contactDetailsDescription: string
    followUs: string
    formTitle: string
    formDescription: string
    message: string
    submit: string
    supportLabel: string
    contactAriaLabel: string
  }
> = {
  en: {
    title: 'Contact Us',
    subtitle: 'Ready for your next shipment? Let us build the right charcoal export plan for your market.',
    contactDetailsTitle: 'Contact Information',
    contactDetailsDescription:
      'Reach our team directly for pricing, packaging options, and full export coordination.',
    followUs: 'Follow Us',
    formTitle: 'Share Your Requirement',
    formDescription: 'Leave your details and our sales team will prepare a custom quotation for your business.',
    message: 'Message',
    submit: 'Send Request Now',
    supportLabel: 'Priority Support',
    contactAriaLabel: 'Contact information',
  },
  ar: {
    title: 'تواصل معنا',
    subtitle: 'جاهز للشحنة القادمة؟ دعنا نجهز لك خطة التصدير المناسبة لسوقك.',
    contactDetailsTitle: 'معلومات التواصل',
    contactDetailsDescription:
      'تواصل مباشرة مع فريقنا للحصول على الأسعار، خيارات التعبئة، وتنظيم كامل لعمليات التصدير.',
    followUs: 'تابعنا على',
    formTitle: 'شاركنا طلبك',
    formDescription: 'اترك بياناتك وسيقوم فريق المبيعات بإعداد عرض سعر مناسب لطبيعة نشاطك.',
    message: 'الرسالة',
    submit: 'إرسال الطلب الآن',
    supportLabel: 'دعم أولوية',
    contactAriaLabel: 'معلومات التواصل',
  },
}

const goldGradientBackground = 'bg-gradient-to-l from-[#FBEF9D] to-[#A96522]'
const sectionTitleGradient = `bg-gradient-to-t from-[#FBEF9D] to-[#A96522] bg-clip-text text-transparent`
const fieldBaseStyles =
  'h-[54px] w-full rounded-[14px] border border-white/15 bg-[#0A0D12] px-4 text-sm text-[#FFFFFF] placeholder:text-[#8F97A8] transition-all duration-200 focus:border-[#D8A45C] focus:ring-2 focus:ring-[#D8A45C]/20 focus:outline-none sm:h-[58px] sm:px-5'
const messageBaseStyles =
  'min-h-[180px] w-full rounded-[14px] border border-white/15 bg-[#0A0D12] px-4 py-4 text-sm text-[#FFFFFF] placeholder:text-[#8F97A8] transition-all duration-200 focus:border-[#D8A45C] focus:ring-2 focus:ring-[#D8A45C]/20 focus:outline-none sm:min-h-[220px] sm:px-5'

const styles = {
  section: 'relative overflow-hidden bg-[#07090D] py-9 sm:py-11 md:py-14 lg:py-16',
  container: 'mx-auto w-full max-w-[1440px] px-[25px] md:px-[50px] lg:px-[100px]',
  headingRow: 'relative z-10 mb-7 flex items-center justify-center gap-2.5 sm:mb-9 sm:gap-4 md:mb-10 md:gap-7',
  divider: `h-[3px] w-[44px] ${goldGradientBackground} sm:w-[88px] md:w-[120px]`,
  heading: `${sectionTitleGradient} text-center text-3xl font-extrabold leading-[1.15] sm:text-4xl`,
  subtitle:
    'relative z-10 mx-auto mb-7 max-w-[760px] text-center text-sm leading-7 text-[#D3DAE6] sm:mb-9 sm:text-[15px] md:mb-12 md:text-base',
  contentGrid:
    'relative grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 lg:grid-cols-[minmax(300px,0.88fr)_minmax(0,1.22fr)] lg:gap-5',
  infoCard:
    'rounded-[20px] border border-[#D4A25F]/35 bg-[linear-gradient(155deg,rgba(41,30,17,0.72),rgba(15,18,24,0.95)_55%,rgba(10,13,18,0.98))] p-5 sm:p-6 md:p-7',
  infoLabel:
    'inline-flex rounded-full border border-[#E3B36E]/55 bg-[#17140F] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F0CE96]',
  infoList: 'mt-6 space-y-3',
  infoItem:
    'group flex items-center gap-3 rounded-[12px] border border-white/10 bg-white/[0.03] px-3.5 py-3 text-sm text-[#F6F7FA] transition-all duration-200 hover:border-[#D8A45C]/70 hover:bg-white/[0.07] sm:px-4 sm:text-[15px]',
  iconBubble:
    `grid h-9 w-9 shrink-0 place-items-center rounded-full ${goldGradientBackground} text-[#0A0B0F] sm:h-10 sm:w-10`,
  supportCard:
    'mt-6 flex items-start gap-3 rounded-[14px] border border-[#E3B36E]/40 bg-[#121418]/80 px-4 py-3.5 sm:mt-7',
  supportIcon:
    `grid h-9 w-9 shrink-0 place-items-center rounded-full ${goldGradientBackground} text-[#0A0B0F]`,
  socialRow: 'mt-5 flex flex-wrap items-center gap-3',
  socialLink:
    'grid h-10 w-10 place-items-center rounded-full border border-[#E0B377] bg-[#090C11] text-[#F1D089] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F4D8A2] hover:text-[#FFE5B5]',
  formCard:
    'rounded-[20px] border border-white/10 bg-[linear-gradient(160deg,rgba(16,20,27,0.95),rgba(9,12,17,0.99))] p-4 sm:p-6 md:p-7',
  tagsRow: 'mt-4 flex flex-wrap gap-2.5',
  tag:
    'inline-flex items-center gap-1.5 rounded-full border border-[#C68A42] bg-[#14120F] px-3 py-1.5 text-xs font-medium text-[#F4D9A4]',
  form: 'mt-6',
  submitButton:
    `mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[14px] ${goldGradientBackground} px-7 py-3.5 text-sm font-semibold text-[#FFFFFF] transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto sm:text-base`,
  responseRow: 'mt-4 flex items-center gap-2 text-sm text-[#D5DCEA]',
} as const

const isPhoneLink = (href: string) => href.startsWith('tel:')

type ContactInfoListProps = {
  contactInfo: ContactInfoItem[]
}

function ContactInfoList({ contactInfo }: ContactInfoListProps) {
  return (
    <ul className={styles.infoList}>
      {contactInfo.map(({ id, icon: Icon, label, href }) => (
        <li key={id} className={styles.infoItem}>
          <span className={styles.iconBubble}>
            <Icon aria-hidden="true" />
          </span>

          {href ? (
            <a
              href={href}
              className="leading-relaxed text-[#F7F7FA] transition-colors duration-200 hover:text-[#F8DFAE]"
              dir={isPhoneLink(href) ? 'ltr' : undefined}
              style={isPhoneLink(href) ? { unicodeBidi: 'plaintext' } : undefined}
            >
              {label}
            </a>
          ) : (
            <span className="leading-relaxed">{label}</span>
          )}
        </li>
      ))}
    </ul>
  )
}

type SocialLinksListProps = {
  socialLinks: SocialItem[]
}

function SocialLinksList({ socialLinks }: SocialLinksListProps) {
  return (
    <div className={styles.socialRow}>
      {socialLinks.map(({ id, icon: Icon, label, href }) => (
        <a key={id} href={href} aria-label={label} className={styles.socialLink}>
          <Icon aria-hidden="true" />
        </a>
      ))}
    </div>
  )
}

type ContactFormProps = {
  contactFormFields: ContactFormField[]
  messageLabel: string
  submitLabel: string
  isArabic: boolean
}

function ContactForm({
  contactFormFields,
  messageLabel,
  submitLabel,
  isArabic,
}: ContactFormProps) {
  const fieldStyles = `${fieldBaseStyles} ${isArabic ? 'text-right' : 'text-left'}`
  const messageStyles = `${messageBaseStyles} ${isArabic ? 'text-right' : 'text-left'}`

  return (
    <form className={styles.form} onSubmit={(event) => event.preventDefault()} noValidate>
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
        {contactFormFields.map(({ id, name, type, placeholder, autoComplete }) => (
          <div key={id} className={name === 'subject' ? 'md:col-span-2' : ''}>
            <label htmlFor={id} className="sr-only">
              {placeholder}
            </label>
            <input
              id={id}
              name={name}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className={fieldStyles}
            />
          </div>
        ))}

        <div className="md:col-span-2">
          <label htmlFor="contact-message" className="sr-only">
            {messageLabel}
          </label>
          <textarea
            id="contact-message"
            name="message"
            placeholder={messageLabel}
            className={messageStyles}
          />
        </div>
      </div>

      <button type="submit" className={styles.submitButton}>
        <FaPaperPlane aria-hidden="true" />
        {submitLabel}
      </button>
    </form>
  )
}

function Section6() {
  const { language, isArabic } = useLanguage()
  const contactInfo = contactInfoByLanguage[language]
  const socialLinks = socialLinksByLanguage[language]
  const contactFormFields = contactFormFieldsByLanguage[language]
  const copy = sectionCopyByLanguage[language]

  return (
    <section
      id="contact-section"
      className={styles.section}
      dir={isArabic ? 'rtl' : 'ltr'}
      aria-labelledby="contact-section-heading"
    >
      <div className={styles.container}>
        <div className={styles.headingRow}>
          <span className={styles.divider} />
          <h2 id="contact-section-heading" className={styles.heading}>
            {copy.title}
          </h2>
          <span className="h-[3px] w-[44px] bg-gradient-to-r from-[#FBEF9D] to-[#A96522] sm:w-[88px] md:w-[120px]" />
        </div>

        <div className={styles.contentGrid}>
          <aside
            className={`${styles.infoCard} ${isArabic ? 'text-right' : 'text-left'}`}
            aria-label={copy.contactAriaLabel}
          >
            <h3 className=" text-[22px] font-bold text-[#F8F9FC] sm:text-[26px]">
              {copy.contactDetailsTitle}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#D4DBE8]">{copy.contactDetailsDescription}</p>

            <ContactInfoList contactInfo={contactInfo} />

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#E6BF80]">
              {copy.followUs}
            </p>
            <SocialLinksList socialLinks={socialLinks} />
          </aside>

          <div className={`${styles.formCard} ${isArabic ? 'text-right' : 'text-left'}`}>
            <h3 className="text-[22px] font-bold text-[#F8F9FC] sm:text-[26px]">{copy.formTitle}</h3>
            <p className="mt-3 text-sm leading-7 text-[#D4DBE8]">{copy.formDescription}</p>

            <ContactForm
              contactFormFields={contactFormFields}
              messageLabel={copy.message}
              submitLabel={copy.submit}
              isArabic={isArabic}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Section6
