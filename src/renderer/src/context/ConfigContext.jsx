import React, { createContext, useContext, useEffect, useState } from 'react'

const ConfigContext = createContext()

export const ConfigProvider = ({ children }) => {
  const [config, setConfiguration] = useState({})

  const setConfig = async (config) => {
    const response = await window.electron.ipcRenderer.invoke('save-config-data', config)
    if (response.success) {
      setConfiguration(config)
    }
  }

  useEffect(() => {
    async function getConfigData() {
      const response = await window.electron.ipcRenderer.invoke('get-config-data')
      if (response.success) {
        setConfiguration(response.data)
      }
    }
    getConfigData()
  }, [])

  return <ConfigContext.Provider value={{ config, setConfig }}>{children}</ConfigContext.Provider>
}

export const useConfigContext = () => {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigProvider')
  }
  return context
}
