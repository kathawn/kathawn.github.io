export function ProjectFlow({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-3">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <span className="rounded-full border border-brand/30 bg-brand-soft px-3 py-1 text-xs font-medium text-brand-dark">
            {step}
          </span>
          {i < steps.length - 1 && (
            <svg width="20" height="10" viewBox="0 0 20 10" className="mx-1 shrink-0 text-muted/50">
              <line x1="0" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 2 L17 5 L12 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}
