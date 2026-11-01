import { skills } from '../data/content'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function Skills() {
  const ref = useScrollReveal<HTMLDivElement>('[data-reveal]')

  return (
    <section id="skills" className="border-b border-line bg-paper">
      <div ref={ref} className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-xs tracking-[0.25em] text-brand uppercase">Skills</p>
        <h2 className="mt-2 text-3xl font-bold text-ink">Toolkit</h2>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} data-reveal className="rounded-xl border border-line p-6">
              <h3 className="text-sm font-semibold text-ink">{category}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand-dark"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
