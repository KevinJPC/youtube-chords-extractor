import React, { createContext, forwardRef, useContext, useState } from 'react'
import './Tabs.css'

const TabsContext = createContext({
  activeTabIndex: 0,
  updateActiveTabIndex: () => {}
})

export const useTabsContext = () => useContext(TabsContext)

export const Tabs = ({ children, initialActiveTabIndex = 0 }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(initialActiveTabIndex)
  const updateActiveTabIndex = (index) => {
    setActiveTabIndex(index)
  }
  return (
    <TabsContext.Provider value={{ activeTabIndex, updateActiveTabIndex }}>
      {children}
    </TabsContext.Provider>
  )
}

Tabs.Labels = forwardRef(({ children, className = '' }, ref) => {
  return (
    <nav ref={ref} className={`tabs__labels ${className}`}>
      {children}
    </nav>
  )
})

Tabs.Label = ({ index, children, onClick, switchOnClick = true, classNames: { item = '', button = '' } = {} }) => {
  const { activeTabIndex, updateActiveTabIndex } = useTabsContext(Tabs)
  return (
    <li className={`tabs__label ${item}`}>
      <button
        className={`tabs__label-button ${button}`}
        onClick={() => {
          if (switchOnClick) updateActiveTabIndex(index)
          onClick?.()
        }}
        data-active={index === activeTabIndex ? true : undefined}
      >
        {children}
      </button>
    </li>
  )
}

Tabs.Views = ({ children, className = '' }) => {
  const { activeTabIndex } = useTabsContext(Tabs)
  return (
    <div className={`${className}`}>
      {React.Children.toArray(children).find(child => getIsActiveView(child.props.index, activeTabIndex)) || null}
    </div>
  )
}

Tabs.View = ({ index, children }) => {
  return children
}

const getIsActiveView = (indexes, currentIndex) => {
  if (Array.isArray(indexes) && indexes.includes(currentIndex)) return true
  return indexes === currentIndex
}
