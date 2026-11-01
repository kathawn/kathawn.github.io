import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveal<T extends HTMLElement>(selector: string) {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>(selector)
      targets.forEach((el, i) => {
        gsap.from(el, {
          y: 28,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          delay: (i % 4) * 0.08,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        })
      })
    },
    { scope: ref },
  )

  return ref
}
