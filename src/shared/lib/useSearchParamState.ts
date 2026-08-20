import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

interface SearchParamOptions {
  /** Read when the param is absent, and the value that clears it again. */
  fallback?: string
  /** Values the URL may carry; anything else reads as the fallback. */
  allowed?: readonly string[]
}

/**
 * useState for a single query-string parameter, so a filtered or searched view
 * can be linked, bookmarked and reached again with the back button.
 *
 * Adding a param pushes a history entry, so back lifts that one filter;
 * changing or clearing it replaces, so typing into a search box does not bury
 * the page under an entry per keystroke.
 */
export function useSearchParamState(key: string, options: SearchParamOptions = {}) {
  const { fallback = '', allowed } = options
  const [searchParams, setSearchParams] = useSearchParams()

  const raw = searchParams.get(key)
  const value = raw !== null && (!allowed || allowed.includes(raw)) ? raw : fallback

  const setValue = useCallback(
    (next: string) => {
      const clearing = next === fallback || next === ''
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current)
          if (clearing) {
            params.delete(key)
          } else {
            params.set(key, next)
          }
          return params
        },
        { replace: clearing || searchParams.has(key) },
      )
    },
    [key, fallback, searchParams, setSearchParams],
  )

  return [value, setValue] as const
}

/** Drops every query param at once, e.g. a "clear filters" action. */
export function useClearSearchParams() {
  const [, setSearchParams] = useSearchParams()
  return useCallback(
    () => setSearchParams(new URLSearchParams(), { replace: true }),
    [setSearchParams],
  )
}
