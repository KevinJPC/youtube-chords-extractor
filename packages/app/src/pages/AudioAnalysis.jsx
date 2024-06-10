import './AudioAnalysis.css'
import React, { useRef, useState } from 'react'
import { getAudioAnalysisByYoutubeId } from '../services/audioAnalyses'
import { YoutubePlayer, YoutubePlayerProvider } from '../components/YoutubePlayer'
import { useQuery } from '@tanstack/react-query'
import { Tabs } from '../components/Tabs'
import { BookMarkIcon } from '../components/icons/BookMarkIcon'
import { useTrackElementsDimentions } from '../hooks/useTrackElementsDimentions'
import { CustomizedChordsPerBeatsProvider } from '../components/CustomizedChordsPerBeatsContext'
import { GeneralToolbar, GeneralView } from '../components/ChordsViewsGeneral'
import { EditViewProvider } from '../components/chords-view-edit/Context'
import { EditView } from '../components/chords-view-edit/EditView'
import { EditedChordsPerBeatsProvider } from '../components/EditedChordsPerBeatsContext'
import { DetailsList } from '../components/DetailsList'
import { Modal } from '../components/Modal'

export const AudioAnalysis = ({ params }) => {
  const { youtubeId } = params

  const { isLoading: isLoadingAudioAnalysis, error: audioAnalysisError, data: audioAnalysisData } = useQuery({
    queryKey: ['chords', youtubeId],
    queryFn: () => getAudioAnalysisByYoutubeId({ youtubeId }),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })

  const headerElementRef = useRef(null)
  const playerElementRef = useRef(null)
  const viewsNavElementRef = useRef(null)
  const mainElementRef = useRef(null)

  useTrackElementsDimentions({
    elementsRefs: [headerElementRef, playerElementRef, viewsNavElementRef],
    onDimentionsChange: ([headerDimentions, playerDimentions, viewsNavDimentions]) => {
      if (!mainElementRef.current) return
      mainElementRef.current.style.setProperty('--header-height', `${headerDimentions.height}px`)
      mainElementRef.current.style.setProperty('--player-height', `${playerDimentions.height}px`)
    },
    deps: [audioAnalysisData]
  })

  const [createEditModalIsOpen, setCreateEditModalIsOpen] = useState(false)

  const closeCreateEditModal = () => {
    setCreateEditModalIsOpen(false)
  }

  const openCreateEditModal = () => {
    setCreateEditModalIsOpen(true)
  }

  if (isLoadingAudioAnalysis) {
    return (
      <h1>
        loading...
      </h1>
    )
  }

  const VIEWS_INDEXES = {
    GENERAL: 0,
    EDIT: 1,
    TEST: 2
  }

  return (
    <>
      <Modal isOpen={createEditModalIsOpen} onClose={closeCreateEditModal}>
        <Modal.Header><h1>Create an edit</h1> <Modal.CloseButton /></Modal.Header>
        <Modal.Body>
          <p>You are about to create an edit from this version, are you sure?</p>
        </Modal.Body>
        <Modal.Footer>
          <Modal.CancelButton>Cancel</Modal.CancelButton>
          <Modal.ConfirmButton>Create</Modal.ConfirmButton>
        </Modal.Footer>
      </Modal>
      <main
        className='audio-analysis'
        ref={mainElementRef}
      >
        <header
          ref={headerElementRef}
          className='audio-analysis__header'
        >
          <div className='audio-analysis__title-wrapper'>
            <h1 className='audio-analysis__title'>{audioAnalysisData?.title}</h1>
            <button className='audio-analysis__save-button'><BookMarkIcon /></button>
          </div>
        </header>

        <DetailsList className='audio-analysis__details'>
          <DetailsList.Item>C Am G F</DetailsList.Item>
          <DetailsList.Item>121 bpm</DetailsList.Item>
        </DetailsList>

        <YoutubePlayerProvider>
          <div
            className='audio-analysis__player-container'
            ref={playerElementRef}
          >
            <YoutubePlayer youtubeId={audioAnalysisData.youtubeId} />
          </div>

          <Tabs>
            <div className='audio-analysis__nav'>
              <Tabs.Labels ref={viewsNavElementRef}>
                <Tabs.Label index={VIEWS_INDEXES.GENERAL}>General
                </Tabs.Label>
                <Tabs.Label
                  index={VIEWS_INDEXES.EDIT}
                  switchOnClick={false}
                  onClick={() => openCreateEditModal()}
                >Edit
                </Tabs.Label>
                {/* <Tabs.Label
                  index={VIEWS_INDEXES.TEST}
                  switchOnClick onClick={() => console.log('test tab clicked')}
                >test
                </Tabs.Label> */}
              </Tabs.Labels>

              <aside className='audio-analysis__edit'>
                <nav className='audio-analysis__edit-navigation'>
                  <h2 className='audio-analysis__current-edit'>Original</h2>
                </nav>
              </aside>
            </div>

            <CustomizedChordsPerBeatsProvider initialChordsPerBeats={audioAnalysisData.chordsPerBeats}>
              <EditedChordsPerBeatsProvider initialChordsPerBeats={audioAnalysisData.chordsPerBeats}>
                <Tabs.Views className='chords-tabs__views'>
                  <Tabs.View index={VIEWS_INDEXES.GENERAL}>
                    <div className='chords-tabs__toolbar-wrapper'>
                      <GeneralToolbar />
                    </div>
                    <div className='chords-tabs__chords-list-wrapper'>
                      <GeneralView />
                    </div>
                  </Tabs.View>
                  <Tabs.View index={VIEWS_INDEXES.EDIT}>
                    <EditViewProvider>
                      <div className='chords-tabs__toolbar-wrapper'>
                        <GeneralToolbar />
                      </div>
                      <div className='chords-tabs__chords-list-wrapper'>
                        <EditView />
                      </div>
                    </EditViewProvider>
                  </Tabs.View>
                </Tabs.Views>
              </EditedChordsPerBeatsProvider>
            </CustomizedChordsPerBeatsProvider>
          </Tabs>
        </YoutubePlayerProvider>
      </main>
    </>
  )
}
