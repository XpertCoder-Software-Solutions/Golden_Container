import { useEffect, useMemo, useState } from 'react'
import {
  getCountries,
  getCountryCallingCode,
} from 'libphonenumber-js'
import type { Language } from '../i18n/language'

type CountryDialOption = {
  iso2: string
  dialCode: string
}

type ParsedPhoneValue = {
  countryIso2: string
  localNumber: string
}

type PhoneNumberInputProps = {
  id: string
  value: string
  onChange: (value: string) => void
  language: Language
  placeholder?: string
  name?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  maxLength?: number
  containerClassName?: string
  selectClassName?: string
  inputClassName?: string
  defaultCountryIso2?: string
}

const DEFAULT_COUNTRY_ISO2 = 'EG'

const countryDialOptions: readonly CountryDialOption[] = getCountries()
  .map((countryIso2) => ({
    iso2: countryIso2,
    dialCode: `+${getCountryCallingCode(countryIso2)}`,
  }))
  .sort((firstOption, secondOption) => firstOption.iso2.localeCompare(secondOption.iso2))

const sanitizeLocalNumber = (value: string) => value.replace(/\D/g, '').slice(0, 15)

const getFlagEmoji = (iso2: string) => {
  if (!/^[A-Z]{2}$/.test(iso2)) {
    return '🏳️'
  }

  const codePoints = Array.from(iso2).map((letter) => 127397 + letter.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

const parsePhoneValue = (
  value: string,
  defaultCountryIso2: string,
  options: readonly CountryDialOption[],
  preferredCountryIso2?: string,
): ParsedPhoneValue => {
  const trimmedValue = value.trim()
  if (!trimmedValue) {
    return {
      countryIso2: defaultCountryIso2,
      localNumber: '',
    }
  }

  const matchingOptions = options.filter((option) => trimmedValue.startsWith(option.dialCode))
  if (matchingOptions.length > 0) {
    const longestDialCodeLength = matchingOptions.reduce(
      (longestLength, option) => Math.max(longestLength, option.dialCode.length),
      0,
    )
    const candidateOptions = matchingOptions.filter(
      (option) => option.dialCode.length === longestDialCodeLength,
    )
    const preferredOption = preferredCountryIso2
      ? candidateOptions.find((option) => option.iso2 === preferredCountryIso2)
      : null
    const selectedOption = preferredOption ?? candidateOptions[0]
    const localNumber = sanitizeLocalNumber(trimmedValue.slice(selectedOption.dialCode.length))

    return {
      countryIso2: selectedOption.iso2,
      localNumber,
    }
  }

  return {
    countryIso2: defaultCountryIso2,
    localNumber: sanitizeLocalNumber(trimmedValue),
  }
}

function PhoneNumberInput({
  id,
  value,
  onChange,
  language,
  placeholder,
  name,
  required = false,
  disabled = false,
  autoComplete = 'tel',
  maxLength = 15,
  containerClassName,
  selectClassName,
  inputClassName,
  defaultCountryIso2 = DEFAULT_COUNTRY_ISO2,
}: PhoneNumberInputProps) {
  const availableIso2Codes = useMemo(
    () => new Set(countryDialOptions.map((option) => option.iso2)),
    [],
  )
  const normalizedDefaultCountryIso2 = availableIso2Codes.has(defaultCountryIso2.toUpperCase())
    ? defaultCountryIso2.toUpperCase()
    : DEFAULT_COUNTRY_ISO2

  const [selectedCountryIso2, setSelectedCountryIso2] = useState(normalizedDefaultCountryIso2)
  const [localNumber, setLocalNumber] = useState('')

  useEffect(() => {
    const parsedValue = parsePhoneValue(
      value,
      normalizedDefaultCountryIso2,
      countryDialOptions,
      selectedCountryIso2,
    )
    setSelectedCountryIso2(parsedValue.countryIso2)
    setLocalNumber(parsedValue.localNumber)
  }, [normalizedDefaultCountryIso2, selectedCountryIso2, value])

  const selectedCountry =
    countryDialOptions.find((option) => option.iso2 === selectedCountryIso2) ??
    countryDialOptions[0]

  const localNumberMaxLength = Math.max(1, maxLength)

  const updatePhoneValue = (countryIso2: string, nextLocalNumber: string) => {
    const currentCountry =
      countryDialOptions.find((option) => option.iso2 === countryIso2) ??
      selectedCountry
    const sanitizedLocalNumber = sanitizeLocalNumber(nextLocalNumber).slice(0, localNumberMaxLength)
    const fullPhoneNumber = sanitizedLocalNumber
      ? `${currentCountry.dialCode}${sanitizedLocalNumber}`
      : ''
    onChange(fullPhoneNumber)
  }

  return (
    <>
      <div
        dir="ltr"
        className={`flex items-center overflow-hidden rounded-[12px] border border-white/15 bg-[#0A0D12] transition-all duration-200 focus-within:border-[#D8A45C] focus-within:ring-2 focus-within:ring-[#D8A45C]/20 ${
          language === 'ar' ? 'flex-row-reverse' : 'flex-row'
        } ${containerClassName ?? ''}`}
      >
        <label htmlFor={`${id}-country`} className="sr-only">
          {language === 'ar' ? 'كود الدولة المختصر' : 'Country short code'}
        </label>
        <select
          id={`${id}-country`}
          value={selectedCountryIso2}
          onChange={(event) => {
            const nextCountryIso2 = event.target.value
            setSelectedCountryIso2(nextCountryIso2)
            updatePhoneValue(nextCountryIso2, localNumber)
          }}
          disabled={disabled}
          className={`h-full shrink-0 border-white/15 bg-[#111620] px-2 text-xs text-[#F6F7F9] outline-none sm:px-2.5 sm:text-sm ${
            language === 'ar' ? 'border-l' : 'border-r'
          } ${disabled ? 'cursor-not-allowed opacity-70' : ''} ${selectClassName ?? ''}`}
          dir="ltr"
        >
          {countryDialOptions.map((option) => (
            <option key={option.iso2} value={option.iso2}>
              {`${getFlagEmoji(option.iso2)} ${option.dialCode} ${option.iso2}`}
            </option>
          ))}
        </select>

        <label htmlFor={id} className="sr-only">
          {language === 'ar' ? 'رقم الهاتف' : 'Phone number'}
        </label>
        <input
          id={id}
          type="tel"
          value={localNumber}
          onChange={(event) => {
            const nextLocalNumber = sanitizeLocalNumber(event.target.value).slice(
              0,
              localNumberMaxLength,
            )
            setLocalNumber(nextLocalNumber)
            updatePhoneValue(selectedCountryIso2, nextLocalNumber)
          }}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode="tel"
          pattern={`[0-9]{4,${localNumberMaxLength}}`}
          maxLength={localNumberMaxLength}
          required={required}
          disabled={disabled}
          className={`h-full w-full bg-transparent px-3 text-sm text-[#FFFFFF] placeholder:text-[#8F97A8] outline-none sm:px-4 ${disabled ? 'cursor-not-allowed opacity-70' : ''} ${inputClassName ?? ''}`}
          dir="ltr"
        />
      </div>

      {name ? <input type="hidden" name={name} value={value} /> : null}
    </>
  )
}

export default PhoneNumberInput
