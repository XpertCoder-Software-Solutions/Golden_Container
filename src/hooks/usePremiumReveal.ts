import { useEffect } from 'react'

const REVEAL_SELECTOR = '[data-reveal]'
const REVEAL_CLASS = 'is-revealed'

function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function usePremiumReveal(revealCycleKey?: string) {
  useEffect(() => {
    if (shouldReduceMotion()) {
      const reducedMotionTargets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))
      reducedMotionTargets.forEach((target) => target.classList.add(REVEAL_CLASS))
      return
    }

    const observedTargets = new WeakSet<HTMLElement>()

    const observeTarget = (observer: IntersectionObserver, target: HTMLElement) => {
      if (target.classList.contains(REVEAL_CLASS)) return
      if (observedTargets.has(target)) return

      observedTargets.add(target)
      observer.observe(target)
    }

    const observeRevealTargetsInsideNode = (observer: IntersectionObserver, node: Element) => {
      if (node.matches(REVEAL_SELECTOR)) {
        observeTarget(observer, node as HTMLElement)
      }

      const nestedTargets = Array.from(node.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))
      nestedTargets.forEach((target) => observeTarget(observer, target))
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

    const initialTargets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))
    initialTargets.forEach((target) => observeTarget(observer, target))

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return
          observeRevealTargetsInsideNode(observer, node)
        })
      })
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      mutationObserver.disconnect()
      observer.disconnect()
    }
  }, [revealCycleKey])
}
