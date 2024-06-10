import { createContext, useContext, useState } from 'react'

const initialSelectChordState = {
  isSelecting: false,
  currentSelectedElement: null,
  currentSelectedBeatTimestamp: null,
  isEditing: false
}

const EditViewContext = createContext({
  isSelecting: true,
  virtualListEl: null,
  currentSelectedElement: null,
  currentSelectedBeatTimestamp: null,
  isEditing: false,
  setCurrentSelected: () => {},
  resetCurrentSelected: () => {},
  toggleEditing: () => {}
})

export const useEditViewContext = () => useContext(EditViewContext)

export const EditViewProvider = ({ children }) => {
  const [{
    isSelecting,
    currentSelectedElement,
    currentSelectedBeatTimestamp,
    isEditing
  },
  setEditState] = useState(() => ({ ...initialSelectChordState }))
  const updateState = (newState) => {
    setEditState(prev => ({ ...prev, ...newState }))
  }

  const setCurrentSelected = ({ element, timestamp, isEditing = false }) => {
    // if (index === currentSelectedBeatTimestamp && isEditing === newIsEditing) return resetCurrentSelected()
    updateState({ currentSelectedElement: element, currentSelectedBeatTimestamp: timestamp, isSelecting: true, isEditing })
  }

  const toggleEditing = () => {
    updateState({ isEditing: !isEditing })
  }

  const resetCurrentSelected = () => {
    updateState({ currentSelectedElement: null, currentSelectedBeatTimestamp: null, isEditing: false, isSelecting: false })
  }

  return (
    <EditViewContext.Provider value={{
      currentSelectedElement,
      currentSelectedBeatTimestamp,
      isEditing,
      isSelecting,
      resetCurrentSelected,
      setCurrentSelected,
      toggleEditing
    }}
    >
      {children}
    </EditViewContext.Provider>
  )
}
