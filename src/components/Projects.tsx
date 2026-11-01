import { projects } from '../data/content'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { ProjectFlow } from './ProjectFlow'

export function Projects() {
  const ref = useScrollReveal<HTMLDivElement>('[data-reveal]')

  return (
    <section id="projects" className="border-b border-line bg-paper-soft">
      <div ref={ref} className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-xs tracking-[0.25em] text-brand uppercase">Projects</p>
        <h2 className="mt-2 text-3xl font-bold text-ink">Business analysis in practice</h2>

        <div className="mt-10 flex flex-col gap-8">
          {projects.map((p) => (
            <article
              key={p.id}
              data-reveal
              className="rounded-xl border border-line bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:p-8"
            >
              <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
                <div>
                  <h3 className="text-xl font-bold text-ink">{p.name}</h3>
                  <p className="text-sm font-medium text-brand">{p.tagline}</p>
                  <p className="mt-1 text-sm text-muted">{p.role}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-mono text-xs text-muted">{p.period}</p>
                  {p.link?.url ? (
                    <a
                      href={p.link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-brand hover:underline"
                    >
                      {p.link.label}
                    </a>
                  ) : (
                    <p className="text-sm text-muted">{p.link?.label}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-line bg-paper-soft px-2.5 py-1 font-mono text-xs text-ink-soft"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <ul className="mt-5 space-y-2.5">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-line pt-5">
                <p className="mb-3 font-mono text-xs uppercase tracking-wide text-muted">Workflow</p>
                <ProjectFlow steps={p.flow} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
