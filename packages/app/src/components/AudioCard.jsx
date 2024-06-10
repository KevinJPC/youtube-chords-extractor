import './AudioCard.css'
import { FakeProgressBar } from './FakeProgressBar'
import { ConditionalLink } from './ConditionalLink'
import { LoadingBar } from './LoadingBar'
import { DetailsList } from './DetailsList'

export const AudioCard = ({ children, isDisabled = false, isSelected = false, isNavigable = false, to, ...props }) => {
  return (
    <article
      className={`audio-card ${isDisabled ? 'audio-card--disabled' : ''} ${isSelected ? 'audio-card--selected' : ''}`}
      {...props}
    >
      <ConditionalLink isNavigable={isNavigable} to={to}>
        <div className='audio-card__container'>
          {children}
        </div>
      </ConditionalLink>
    </article>
  )
}

AudioCard.Thumbnail = ({ children, id, ...props }) => {
  return (
    <picture id='audio-card-picture' className='audio-card__thumbnail' {...props}>
      {children}
    </picture>
  )
}

AudioCard.ThumbnailImg = ({ src, ...props }) => {
  return (
    <img src={src} className='audio-card__img' {...props} />
  )
}

AudioCard.Content = ({ children, ...props }) => {
  return (
    <div className='audio-card__content' {...props}>
      {children}
    </div>
  )
}

AudioCard.Title = ({ children, ...props }) => {
  return (
    <h1 className='audio-card__title'>
      {children}
    </h1>
  )
}

AudioCard.Body = ({ children, ...props }) => {
  return (
    <div className='audio-card__body' {...props}>
      {children}
    </div>
  )
}

AudioCard.DetailsList = ({ children }) => {
  return (
    <DetailsList className='audio-card__details'>
      {children}
    </DetailsList>
  )
}

AudioCard.DetailsItem = ({ children }) => {
  return (
    <DetailsList.Item>
      {children}
    </DetailsList.Item>
  )
}

AudioCard.Status = ({ isAnalyzed, ...props }) => {
  const statusText = isAnalyzed ? 'Analyzed' : 'Not analyzed'
  const statusClass = isAnalyzed ? 'audio-card__status--analyzed' : 'audio-card__status--not-analyzed'
  return (
    <footer className={`audio-card__status ${statusClass}`} {...props}>
      <span>
        {statusText}
      </span>
    </footer>
  )
}

AudioCard.Button = ({ children, ...props }) => {
  return (
    <button type='submit' className='audio-card__analyze-button' {...props}>
      {children}
    </button>
  )
}

AudioCard.JobStatus = ({ isProcessing, isCompleted, isInQueue }) => {
  const jobStatusText = (() => {
    if (isCompleted) return 'Redirecting'
    if (isProcessing) return 'Processing'
    if (isInQueue) return 'In queue'
  })()

  const showProgressBar = isProcessing || isCompleted

  return (
    <div className='audio-card__job-status'>
      {showProgressBar && <FakeProgressBar hasFinished={isCompleted} className='audio-card__job-progress-bar' />}
      {isInQueue && <LoadingBar />}
      <div className='audio-card__job-status-text'>{jobStatusText}</div>
    </div>
  )
}
