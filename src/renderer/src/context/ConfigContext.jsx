import React, { createContext, useContext, useState } from 'react'

const ConfigContext = createContext()

export const ConfigProvider = ({ children }) => {
  const [config, setConfiguration] = useState({})

  const setConfig = (config) => {
    setConfiguration(config)
  }

  return <ConfigContext.Provider value={{ config, setConfig }}>{children}</ConfigContext.Provider>
}

export const useConfigContext = () => {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigProvider')
  }
  return context
}
