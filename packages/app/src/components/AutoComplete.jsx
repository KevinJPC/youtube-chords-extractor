import { createContext, useContext, useRef, useState } from 'react'
import { PopOver } from './PopOver'

const AutoCompleteContext = createContext(null)

const useAutoCompleteContext = () => useContext(AutoCompleteContext)

export const AutoComplete = ({ children, initialSuggestedValues = [], initialValue = '', onChange: onChangeCb }) => {
  const refs = useRef({ inputWrapper: null, itemsList: null, input: null })

  const [{ currentValue, showSuggestedItems, hoveredItemIndex, suggestedValues }, setState] = useState({
    currentValue: initialValue,
    showSuggestedItems: false,
    hoveredItemIndex: -1,
    suggestedValues: initialSuggestedValues
  })

  const updateState = (newState) => {
    setState(prev => ({ ...prev, ...newState }))
  }

  const handleOnInputChange = (e) => {
    const value = e.currentTarget.value
    const newFilteredValues = value !== '' ? initialSuggestedValues.filter(suggestedValue => suggestedValue.indexOf(value) !== -1) : initialSuggestedValues
    updateState({ currentValue: value, showSuggestedItems: true, suggestedValues: newFilteredValues, hoveredItemIndex: -1 })
    onChangeCb?.(value)
  }

  const handleOnClose = (e) => {
    updateState({ showSuggestedItems: false, hoveredItemIndex: -1 })
  }

  const handleOnSelectItem = (newValue) => {
    onChangeCb?.(newValue)
    updateState({ currentValue: newValue, showSuggestedItems: false, hoveredItemIndex: -1 })
  }

  const handleOnInputFocus = () => {
    updateState({ showSuggestedItems: true })
  }

  const handleOnInputKeyDown = (e) => {
    if (e.key === 'Enter') return handleOnInputKeyEnter(e)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') return handleOnInputKeyUpOrDown(e)
  }

  const handleOnInputKeyEnter = (e) => {
    if (hoveredItemIndex === -1) return
    e.preventDefault()
    const itemValue = suggestedValues[hoveredItemIndex]
    handleOnSelectItem(itemValue)
  }

  const handleOnInputKeyUpOrDown = (e) => {
    e.preventDefault()
    const isArrowDown = e.key === 'ArrowDown'
    const isArrowUp = e.key === 'ArrowUp'

    const itemsElements = Array.from(refs.current.itemsList?.children)

    const lastItemIndex = itemsElements.length - 1
    const noneHovered = hoveredItemIndex === -1
    const isOnLastItem = hoveredItemIndex === lastItemIndex
    const isOnFirstItem = hoveredItemIndex === 0

    if ((isArrowDown && isOnLastItem) || (isArrowUp && isOnFirstItem)) return

    let nextItem
    if (isArrowDown) {
      nextItem = hoveredItemIndex + 1
    }

    if (isArrowUp && !noneHovered) {
      nextItem = hoveredItemIndex - 1
    }

    if (isArrowUp && noneHovered) {
      nextItem = lastItemIndex
    }

    itemsElements[nextItem]?.scrollIntoView({
      behaviour: 'instant',
      block: 'nearest',
      inline: 'nearest'
    })
    const itemValue = suggestedValues[nextItem]
    updateState({ hoveredItemIndex: nextItem, currentValue: itemValue })
  }

  const handleOnHoverItem = (index) => {
    updateState({ hoveredItemIndex: index })
  }

  return (
    <AutoCompleteContext.Provider value={{
      refs,
      showSuggestedItems,
      currentValue,
      suggestedValues,
      handleOnInputChange,
      handleOnSelectItem,
      handleOnInputFocus,
      handleOnInputKeyDown,
      hoveredItemIndex,
      handleOnHoverItem,
      handleOnClose
    }}
    >
      {children}
    </AutoCompleteContext.Provider>
  )
}

AutoComplete.Input = ({ label: labelText, classNames: { wrapper = '', label = '', input = '' } = {}, name = '' }) => {
  const { refs, currentValue, handleOnInputChange, handleOnInputFocus, handleOnInputKeyDown } = useAutoCompleteContext()
  const inputId = `auto-complete-input-${labelText}`

  return (
    <div className={`${wrapper}`} ref={(instance) => { refs.current.inputWrapper = instance }}>
      {labelText && <label htmlFor={inputId} className={`${label}`}>{labelText}</label>}
      <input
        name={name}
        ref={(instance) => { refs.current.input = instance }}
        value={currentValue}
        onChange={handleOnInputChange}
        type='text' id={inputId}
        className={`${input}`}
        onFocus={handleOnInputFocus}
        autoComplete='off'
        onKeyDown={handleOnInputKeyDown}
      />
    </div>
  )
}

AutoComplete.Items = ({ children, classNames: { wrapper = '', list = '' } = {}, offset = 0, rootBoundaryEl }) => {
  const { refs, showSuggestedItems, suggestedValues, hoveredItemIndex, handleOnClose } = useAutoCompleteContext()
  return (
    <PopOver
      className={`${wrapper}`}
      anchorEl={refs.current?.inputWrapper}
      isOpen={showSuggestedItems && suggestedValues.length > 0}
      offset={offset}
      rootBoundaryEl={rootBoundaryEl}
      onClose={handleOnClose}
      shouldCloseOnClickOutside={(e) => e.target !== refs.current.inputWrapper && e.target !== refs.current.input}
    >
      <ul className={`${list}`} ref={instance => { refs.current.itemsList = instance }} tabIndex={-1}>
        {suggestedValues.map((item, index) => children(item, { index, isHovered: hoveredItemIndex === index }))}
      </ul>
    </PopOver>
  )
}

AutoComplete.Item = ({ children, className = '', value = '', index }) => {
  const { handleOnSelectItem, handleOnHoverItem, refs } = useAutoCompleteContext()
  return (
    <li
      tabIndex={-1}
      className={`${className}`}
      onMouseDown={(e) => {
        e.preventDefault()
      }}
      onMouseUp={() => handleOnSelectItem(value)}
      onMouseEnter={() => handleOnHoverItem(index)}
      onTouchMove={() => refs.current.input.blur()}
    >
      {children}
    </li>
  )
}
