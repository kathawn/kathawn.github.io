import { profile } from '../data/content'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function Contact() {
  const ref = useScrollReveal<HTMLDivElement>('[data-reveal]')

  return (
    <section id="contact" className="bg-ink">
      <div ref={ref} className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p data-reveal className="font-mono text-xs tracking-[0.25em] text-brand-soft uppercase">
          Contact
        </p>
        <h2 data-reveal className="mt-3 text-3xl font-bold text-white md:text-4xl">
          Let's talk about your next project
        </h2>
        <p data-reveal className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
          Open to Business Analyst internships and entry-level roles where I can turn ambiguous requirements into
          clear, actionable specifications.
        </p>

        <div data-reveal className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            {profile.email}
          </a>
          <a
            href={`tel:${profile.phone.replace(/\s/g, '')}`}
            className="rounded-md border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-brand-soft hover:text-brand-soft"
          >
            {profile.phone}
          </a>
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-brand-soft hover:text-brand-soft"
          >
            LinkedIn
          </a>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-brand-soft hover:text-brand-soft"
          >
            GitHub
          </a>
        </div>

        <p className="mt-16 font-mono text-xs text-slate-500">
          © {new Date().getFullYear()} {profile.name}. Built with React, React Three Fiber &amp; GSAP.
        </p>
      </div>
    </section>
  )
}
