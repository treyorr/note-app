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

ipcMain.handle('get-collections', async () => {
  const notesDirectory = getNoteDir()

  try {
    const response = await fs.promises.readdir(notesDirectory, { withFileTypes: true })
    return response.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name)
  } catch (error) {
    console.error('Error reading collection names:', error)
    return []
  }
})

ipcMain.handle('createCollection', async (event, collection) => {
  try {
    const notesDirectory = getNoteDir()
    const newDirPath = path.join(notesDirectory, collection.name)

    if (fs.existsSync(newDirPath)) {
      throw new Error(`Collection "${collection.name}" already exists.`)
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
