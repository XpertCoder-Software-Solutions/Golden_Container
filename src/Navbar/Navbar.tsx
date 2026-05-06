import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { LuPhoneCall } from 'react-icons/lu'
import { MdTranslate } from 'react-icons/md'
import logo from '../assets/Logo.png'

const links = ['الرئيسية', 'من نحن', 'المنتجات', 'خدمتنا', 'اراء عملائنا']

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="bg-[#090909] bg-opacity-35 text-[14px] md:text-[15px] lg:text-base" dir="rtl">
      <nav className="relative mx-auto w-full max-w-[1440px] px-[25px] md:px-[50px] lg:px-[100px]">
        <div className="flex h-[86px] items-center justify-between gap-3 sm:h-[96px] md:h-[108px] lg:h-[120px]">
          <a href="#" className="shrink-0" onClick={closeMobileMenu}>
            <img
              src={logo}
              alt="Golden Container"
              className="h-[54px] w-[54px] object-contain sm:h-[62px] sm:w-[62px] lg:h-[72px] lg:w-[72px]"
            />
          </a>

          <ul className="hidden min-w-0 flex-1 items-center justify-center gap-5 px-2 md:flex lg:gap-10 lg:px-3 2xl:gap-8">
            {links.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="whitespace-nowrap text-[12px] font-semibold leading-none text-[#ffffff] transition-colors duration-200 hover:text-[#dbc06f] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-lg"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-l from-[#F2E89B] to-[#B4742B] px-3 py-2 text-[11px] font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-opacity duration-200 hover:opacity-95 md:text-xs lg:gap-2 lg:px-4 lg:py-2.5 lg:text-[13px] xl:px-5 xl:py-3 xl:text-[15px]"
            >
              <LuPhoneCall className="text-sm lg:text-base xl:text-lg" />
              <span className="leading-none">تواصل معنا</span>
            </a>

            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-medium leading-none text-[#f5f5f5] transition-colors duration-200 hover:text-[#dbc06f] lg:text-sm xl:text-lg"
              aria-label="Switch language"
            >
              <MdTranslate className="text-sm lg:text-base xl:text-lg" />
              <span>EN</span>
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-base font-medium leading-none text-[#f5f5f5] transition-colors duration-200 hover:text-[#dbc06f]"
              aria-label="Switch language"
            >
              <MdTranslate className="text-base" />
              <span>EN</span>
            </button>

            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#d2b060]/45 text-[#f5f5f5] transition-colors duration-200 hover:text-[#dbc06f]"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        <div
          className={`absolute left-0 right-0 top-full z-40 overflow-hidden rounded-b-2xl border border-white/10 bg-[#0b0b0b]/95 shadow-[0_12px_30px_rgba(0,0,0,0.4)] transition-all duration-300 md:hidden ${
            isMobileMenuOpen
              ? 'pointer-events-auto max-h-[420px] opacity-100'
              : 'pointer-events-none max-h-0 opacity-0'
          }`}
        >
          <ul className="flex flex-col gap-2 px-3 pb-2 pt-3">
            {links.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  onClick={closeMobileMenu}
                  className="block rounded-xl px-3 py-2 text-[15px] font-semibold text-[#f5f5f5] transition-colors duration-200 hover:bg-white/5 hover:text-[#dbc06f]"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#"
            onClick={closeMobileMenu}
            className="mx-3 mb-4 inline-flex w-[calc(100%-1.5rem)] items-center justify-center gap-2 rounded-full bg-gradient-to-l from-[#F2E89B] to-[#B4742B] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-opacity duration-200 hover:opacity-95"
          >
            <LuPhoneCall className="text-base" />
            <span className="leading-none">تواصل معنا</span>
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
