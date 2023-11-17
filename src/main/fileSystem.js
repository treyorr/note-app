const { app, ipcMain, BrowserWindow } = require('electron')
const userDataPath = app.getPath('userData')
const fs = require('fs')
const path = require('path')

export function getNoteDir() {
  const notesDirectory = path.join(userDataPath, 'notes')
  return notesDirectory
}

export function setUpFileSystem() {
  const notesDirectory = getNoteDir()
  if (!fs.existsSync(notesDirectory)) {
    fs.mkdirSync(notesDirectory)
  }
}

ipcMain.handle('getNoteFileNames', async () => {
  const notesDirectory = getNoteDir()

  try {
    const fileNames = await fs.promises.readdir(notesDirectory)
    return fileNames
  } catch (error) {
    console.error('Error reading note file names:', error)
    return []
  }
})

ipcMain.handle('createCollection', async (event, collection) => {
  try {
    console.log(collection)
    const notesDirectory = getNoteDir()
    const newDirPath = path.join(notesDirectory, collection.name)

    if (fs.existsSync(newDirPath)) {
      throw new Error(`Directory "${collection.name}" already exists.`)
    }

    fs.mkdirSync(newDirPath)
    console.log(`Directory "${collection.name}" created.`)
    BrowserWindow.getFocusedWindow().webContents.send('new-collection')
    return { success: true }
  } catch (error) {
    console.error(`Error creating directory: ${error.message}`)
    return { success: false, error: error.message }
  }
})
