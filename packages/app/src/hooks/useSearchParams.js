import { useSearch } from 'wouter'

export const useSearchParams = () => {
  const searchString = useSearch()
  const urlSearchParams = new URLSearchParams(searchString)
  const searchParams = Object.fromEntries(urlSearchParams.entries())
  return searchParams
}
