import { Canvas } from '@react-three/fiber'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Suspense, useRef } from 'react'
import { DataFlowScene } from './scene/DataFlowScene'
import { profile } from '../data/content'

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('[data-hero-eyebrow]', { y: 16, opacity: 0, duration: 0.6 })
        .from('[data-hero-title]', { y: 24, opacity: 0, duration: 0.7 }, '-=0.35')
        .from('[data-hero-sub]', { y: 16, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('[data-hero-cta-item]', { y: 14, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
        .from('[data-hero-canvas]', { opacity: 0, duration: 1.1 }, '-=0.6')
    },
    { scope: rootRef },
  )

  return (
    <section ref={rootRef} className="relative overflow-hidden border-b border-line bg-paper-soft">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pt-28 pb-16 md:grid-cols-2 md:pt-36 md:pb-24">
        <div>
          <p
            data-hero-eyebrow
            className="font-mono text-xs tracking-[0.25em] text-brand uppercase"
          >
            {profile.location} · Business Analysis Portfolio
          </p>
          <h1 data-hero-title className="mt-4 text-4xl font-extrabold leading-tight text-ink md:text-6xl">
            {profile.name}
          </h1>
          <p data-hero-sub className="mt-3 text-lg font-medium text-brand md:text-xl">
            {profile.title}
          </p>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">{profile.objective}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              data-hero-cta-item
              href={profile.resumeUrl}
              download
              className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
            >
              Download CV
            </a>
            <a
              data-hero-cta-item
              href="#contact"
              className="rounded-md border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-brand hover:text-brand"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div data-hero-canvas className="relative h-[320px] md:h-[440px]">
          <Canvas camera={{ position: [0, 0, 7], fov: 42 }} dpr={[1, 1.5]}>
            <Suspense fallback={null}>
              <DataFlowScene />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  )
}
