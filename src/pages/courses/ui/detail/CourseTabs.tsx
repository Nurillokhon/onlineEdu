import { useRef } from 'react'

export interface Tab {
  id: string
  label: string
}

interface CourseTabsProps {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
  /** Ties each tab to its panel via `${baseId}-tab-*` / `${baseId}-panel-*`. */
  baseId: string
}

/**
 * Tab bar following the ARIA tabs pattern: one stop in the tab order, with the
 * arrow keys moving between tabs from there.
 */
export function CourseTabs({ tabs, active, onChange, baseId }: CourseTabsProps) {
  const listRef = useRef<HTMLDivElement>(null)

  function onKeyDown(event: React.KeyboardEvent) {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (step === 0) return

    event.preventDefault()
    const index = tabs.findIndex((tab) => tab.id === active)
    const next = tabs[(index + step + tabs.length) % tabs.length]
    onChange(next.id)
    listRef.current
      ?.querySelector<HTMLButtonElement>(`#${CSS.escape(`${baseId}-tab-${next.id}`)}`)
      ?.focus()
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Kurs bo'limlari"
      onKeyDown={onKeyDown}
      className="-mx-4 flex gap-6 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0"
    >
      {tabs.map((tab) => {
        const selected = tab.id === active
        return (
          <button
            key={tab.id}
            id={`${baseId}-tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={selected}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={`shrink-0 border-b-2 pb-3 text-sm font-medium transition-colors ${
              selected
                ? 'border-brand text-ink'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
