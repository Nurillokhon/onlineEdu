import { useSyncExternalStore } from 'react'

export interface WatchProgress {
  get: () => number
  set: (fraction: number) => void
  subscribe: (listener: () => void) => () => void
}

/**
 * The fraction of the open lesson watched so far, 0–1, as the player measures
 * it. It changes every second of playback, so it is kept outside React state:
 * the player writes it, and only the components that read it re-render.
 */
export function createWatchProgress(): WatchProgress {
  let fraction = 0
  const listeners = new Set<() => void>()

  return {
    get: () => fraction,
    set(next) {
      if (next === fraction) return
      fraction = next
      listeners.forEach((listener) => listener())
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

/**
 * Reads a value derived from the watched fraction. The component re-renders
 * only when that value changes, so `select` should return a primitive: a whole
 * percent moves a hundred times per video, a boolean gate once.
 */
export function useWatchProgress<T>(progress: WatchProgress, select: (fraction: number) => T): T {
  return useSyncExternalStore(progress.subscribe, () => select(progress.get()))
}
