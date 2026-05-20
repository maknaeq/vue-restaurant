export function useApi() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase as string

  return {
    get: <T>(path: string, query?: Record<string, string>) =>
      $fetch<T>(path, { baseURL, ...(query ? { query } : {}) }),
    post: <T>(path: string, body: unknown) =>
      $fetch<T>(path, { method: 'POST', body, baseURL }),
    patch: <T>(path: string, body: unknown) =>
      $fetch<T>(path, { method: 'PATCH', body, baseURL }),
  }
}