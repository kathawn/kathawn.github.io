import { education } from '../data/content'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function Education() {
  const ref = useScrollReveal<HTMLDivElement>('[data-reveal]')

  return (
    <section id="education" className="border-b border-line bg-paper">
      <div ref={ref} className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-xs tracking-[0.25em] text-brand uppercase">Education</p>
        <div
          data-reveal
          className="mt-6 flex flex-col justify-between gap-4 rounded-xl border border-line bg-paper-soft p-6 md:flex-row md:items-start"
        >
          <div>
            <h3 className="text-xl font-bold text-ink">{education.school}</h3>
            <p className="mt-1 text-sm text-muted">{education.degree}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm font-semibold text-ink-soft">{education.location}</p>
            <p className="text-sm text-muted">{education.graduation}</p>
          </div>
        </div>
        <dl data-reveal className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {education.details.map((d) => (
            <div key={d.label} className="rounded-lg border border-line p-4">
              <dt className="font-mono text-xs uppercase tracking-wide text-muted">{d.label}</dt>
              <dd className="mt-1 text-sm font-medium text-ink-soft">{d.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
