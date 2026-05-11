import { useEffect } from 'react'

const REVEAL_SELECTOR = '[data-reveal]'
const REVEAL_CLASS = 'is-revealed'

function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function usePremiumReveal() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))

    if (targets.length === 0) {
      return
    }

    if (shouldReduceMotion()) {
      targets.forEach((target) => target.classList.add(REVEAL_CLASS))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          entry.target.classList.add(REVEAL_CLASS)
          observer.unobserve(entry.target)
        })
      },
      {
        root: null,
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.2,
      },
    )

    targets.forEach((target) => observer.observe(target))

    return () => {
      observer.disconnect()
    }
  }, [])
}
