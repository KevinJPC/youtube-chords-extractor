import './Search.css'
import { SearchListResults } from '../components/SearchListResults'
import { useSearchYoutubeQuery } from '../hooks/useSearchYoutubeQuery'
import { AudioCardSkeleton } from '../components/AudioCardSkeleton'
import { useSearchParams } from '../hooks/useSearchParams'

export const Search = () => {
  const { q } = useSearchParams()
  const { results, isLoading } = useSearchYoutubeQuery(q)
  return (
    <>
      <main className='container'>
        <SearchListResults>
          <ul className='results'>
            {isLoading &&
              <>
                {Array(10).fill().map((_, index) =>
                  <li key={`skeleton-${index}`}><AudioCardSkeleton /></li>)}
              </>}
            {!isLoading && results?.length === 0 && <div>No results</div>}
            {!isLoading && results?.length > 0 &&
              <>
                {results.map(({ youtubeId, title, duration, audioAnalysis, isAnalyzed }) =>
                  <li key={youtubeId}>
                    <SearchListResults.Item
                      youtubeId={youtubeId}
                      title={title}
                      duration={duration}
                      isAnalyzed={isAnalyzed}
                      audioAnalysis={audioAnalysis}
                    />
                  </li>)}
              </>}
          </ul>
        </SearchListResults>
      </main>
    </>
  )
}
