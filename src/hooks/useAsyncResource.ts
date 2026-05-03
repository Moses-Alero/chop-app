import { useEffect, useMemo, useState, type DependencyList } from 'react'

type AsyncState<T> = {
  data: T | null
  error: string | null
  loading: boolean
  refresh: () => Promise<void>
}

export function useAsyncResource<T>(loader: () => Promise<T>, deps: DependencyList): AsyncState<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshIndex, setRefreshIndex] = useState(0)
  const depsKey = useMemo(() => JSON.stringify(deps), [deps])

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await loader()
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [depsKey, loader, refreshIndex])

  return {
    data,
    error,
    loading,
    refresh: async () => {
      setRefreshIndex((current) => current + 1)
    },
  }
}
