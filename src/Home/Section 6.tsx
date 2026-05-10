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
  type: 'text' | 'tel'
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
      label: 'info@goldencontainer.com',
      href: 'mailto:info@goldencontainer.com',
    },
    {
      id: 'phone',
      icon: FaPhoneAlt,
      label: '+20 1000000000',
      href: 'tel:+201000000000',
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
      label: 'info@goldencontainer.com',
      href: 'mailto:info@goldencontainer.com',
    },
    {
      id: 'phone',
      icon: FaPhoneAlt,
      label: '+20 1000000000',
      href: 'tel:+201000000000',
    },
  ],
}

const socialLinksByLanguage: Record<Language, SocialItem[]> = {
  en: [
    { id: 'snapchat', icon: FaSnapchatGhost, label: 'Snapchat', href: '#' },
    { id: 'twitter', icon: FaTwitter, label: 'Twitter', href: '#' },
    { id: 'instagram', icon: FaInstagram, label: 'Instagram', href: '#' },
    { id: 'facebook', icon: FaFacebookF, label: 'Facebook', href: '#' },
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
      placeholder: 'Name',
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
      placeholder: 'الاسم',
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

const sectionCopyByLanguage: Record<Language, {
  title: string
  contactDetailsTitle: string
  followUs: string
  message: string
  submit: string
  contactAriaLabel: string
}> = {
  en: {
    title: 'Contact Us',
    contactDetailsTitle: 'Contact Details',
    followUs: 'Follow Us',
    message: 'Message',
    submit: 'Send Request Now',
    contactAriaLabel: 'Contact information',
  },
  ar: {
    title: 'تواصل معنا',
    contactDetailsTitle: 'بيانات التواصل',
    followUs: 'تابعنا على',
    message: 'الرسالة',
    submit: 'إرسال الطلب الآن',
    contactAriaLabel: 'معلومات التواصل',
  },
}

const goldGradientId = 'section6-gold-gradient'
const goldGradientBackground = 'bg-gradient-to-l from-[#FBEF9D] to-[#A96522]'
const goldHoverText =
  'transition-colors duration-200 hover:bg-gradient-to-l hover:from-[#FBEF9D] hover:to-[#A96522] hover:bg-clip-text hover:text-transparent'

const fieldBaseStyles =
  'h-[52px] w-full rounded-[8px] border border-[#EEEEEE] bg-transparent px-4 text-sm text-[#FFFFFF] placeholder:text-[#9F9F9F] focus:border-[#A96522] focus:outline-none sm:h-[56px] sm:px-6'
const messageBaseStyles =
  'min-h-[180px] w-full rounded-[8px] border border-[#EEEEEE] bg-transparent px-4 py-4 text-sm text-[#FFFFFF] placeholder:text-[#9F9F9F] focus:border-[#A96522] focus:outline-none sm:min-h-[220px] sm:px-6'

const isPhoneLink = (href: string) => href.startsWith('tel:')

const styles = {
  section:
    'bg-[#07090D] py-10 sm:py-12 md:py-14 lg:py-16',
  container:
    'mx-auto w-full max-w-[1440px] px-[25px] md:px-[50px] lg:px-[100px]',
  headingRow:
    'mb-8 flex items-center justify-center gap-3 sm:mb-10 sm:gap-4 md:mb-12 md:gap-7',
  divider:
    `h-[3px] w-[58px] bg-gradient-to-l from-[#FBEF9D] to-[#A96522] sm:w-[90px] md:w-[120px]`,
  heading:
    `bg-gradient-to-t from-[#FBEF9D] to-[#A96522] bg-clip-text text-transparent leading-[1.3] text-center text-3xl font-extrabold sm:text-4xl`,
  shell: `rounded-[16px] ${goldGradientBackground} p-[1px]`,
  shellInner: 'rounded-[15px] bg-[#07090D] p-4 sm:p-7 md:p-10 lg:p-12',
  contactList: 'mt-6 space-y-4 sm:mt-8 sm:space-y-5',
  socialBubble:
    'grid h-[34px] w-[34px] place-items-center rounded-full bg-[#07090D] transition-colors duration-200 group-hover:bg-[#0D0D0D] sm:h-[38px] sm:w-[38px]',
  form: 'w-full md:min-w-0 md:flex-1 md:max-w-[500px] lg:max-w-[665px]',
  submitButton:
    `mt-6 inline-flex w-full items-center justify-center rounded-[8px] ${goldGradientBackground} px-8 py-3.5 font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 sm:mt-8 sm:w-auto sm:py-4`,
} as const

type ContactInfoListProps = {
  contactInfo: ContactInfoItem[]
}

function ContactInfoList({ contactInfo }: ContactInfoListProps) {
  return (
    <ul className={styles.contactList}>
      {contactInfo.map(({ id, icon: Icon, label, href }) => (
        <li
          key={id}
          className="flex items-center justify-center gap-3 text-sm text-[#FFFFFF] sm:gap-4 sm:text-base md:justify-start lg:text-lg"
        >
          <Icon className="shrink-0" style={{ fill: `url(#${goldGradientId})` }} />
          {href ? (
            <a
              href={href}
              className={goldHoverText}
              dir={isPhoneLink(href) ? 'ltr' : undefined}
              style={isPhoneLink(href) ? { unicodeBidi: 'plaintext' } : undefined}
            >
              {label}
            </a>
          ) : (
            <span>{label}</span>
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
    <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:mt-6 sm:gap-4 md:mt-8 md:justify-start">
      {socialLinks.map(({ id, icon: Icon, label, href }) => (
        <a
          key={id}
          href={href}
          aria-label={label}
          className={`group block rounded-full ${goldGradientBackground} p-[1px]`}
        >
          <span className={styles.socialBubble}>
            <Icon style={{ fill: `url(#${goldGradientId})` }} />
          </span>
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

function ContactForm({ contactFormFields, messageLabel, submitLabel, isArabic }: ContactFormProps) {
  const fieldStyles = `${fieldBaseStyles} ${isArabic ? 'text-right' : 'text-left'}`
  const messageStyles = `${messageBaseStyles} ${isArabic ? 'text-right' : 'text-left'}`

  return (
    <form className={styles.form} onSubmit={(event) => event.preventDefault()} noValidate>
      <div className="space-y-4">
        {contactFormFields.map(({ id, name, type, placeholder, autoComplete }) => (
          <div key={id}>
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

        <div>
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
        <svg className="h-0 w-0" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id={goldGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBEF9D" />
              <stop offset="100%" stopColor="#A96522" />
            </linearGradient>
          </defs>
        </svg>

        <div className={styles.headingRow}>
          <span className={styles.divider} />
          <h2 id="contact-section-heading" className={styles.heading}>
            {copy.title}
          </h2>
          <span className="h-[3px] w-[58px] bg-gradient-to-r from-[#FBEF9D] to-[#A96522] sm:w-[90px] md:w-[120px]" />
        </div>

        <div className={styles.shell}>
          <div className={styles.shellInner}>
            <div
              className="flex flex-col-reverse gap-10 md:flex-row-reverse md:items-start md:justify-between md:gap-16 lg:gap-12"
            >
              <aside
                className={`w-full self-center md:w-[250px] md:shrink-0 lg:w-[360px] ${
                  isArabic ? 'text-center md:text-right' : 'text-center md:text-left'
                }`}
              >
                <h3 className="text-xl font-bold text-[#F4F4F4] sm:text-2xl">{copy.contactDetailsTitle}</h3>

                <ContactInfoList contactInfo={contactInfo} />

                <p className="mt-8 text-base font-semibold text-[#FFFFFF] sm:text-lg">{copy.followUs}</p>

                <SocialLinksList socialLinks={socialLinks} />
              </aside>

              <ContactForm
                contactFormFields={contactFormFields}
                messageLabel={copy.message}
                submitLabel={copy.submit}
                isArabic={isArabic}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Section6
