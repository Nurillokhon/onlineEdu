import { useEffect, useRef, useState } from 'react'

export type SaveStatus = 'idle' | 'saving' | 'saved'

/** How long "saqlanmoqda" stays up even when the request is faster. */
const MIN_VISIBLE_MS = 800
const SAVED_MS = 2000

/**
 * The mock save answers in a few hundred milliseconds, which makes a raw
 * `isPending` flag flash on and off. This holds the label still long enough to
 * read, then lets it settle on "Saqlandi" before fading out.
 */
export function useSaveIndicator(isPending: boolean): SaveStatus {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const startedAt = useRef(0)

  useEffect(() => {
    if (isPending) {
      startedAt.current = Date.now()
      setStatus('saving')
      return
    }
    if (status !== 'saving') return

    const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt.current))
    const timer = setTimeout(() => setStatus('saved'), wait)
    return () => clearTimeout(timer)
  }, [isPending, status])

  useEffect(() => {
    if (status !== 'saved') return
    const timer = setTimeout(() => setStatus('idle'), SAVED_MS)
    return () => clearTimeout(timer)
  }, [status])

  return status
}
