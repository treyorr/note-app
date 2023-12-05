import React, { createContext, useContext, useState } from 'react'

const FileContext = createContext()

export const FileProvider = ({ children }) => {
  const [currentOpenFile, setCurrentOpenFile] = useState([])

  const setFile = (filePath) => {
    setCurrentOpenFile(filePath)
  }

  return (
    <FileContext.Provider value={{ currentOpenFile, setFile }}>{children}</FileContext.Provider>
  )
}

export const useFileContext = () => {
  const context = useContext(FileContext)
  if (!context) {
    throw new Error('useFileContext must be used within a FileProvider')
  }
  return context
}
