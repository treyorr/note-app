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

ipcMain.handle('create-note', async (event, ...args) => {
  try {
    const { fpath, fname } = args[0]
    const notePath = path.join(getNoteDir(), fpath, fname + '.json')
    fs.writeFileSync(notePath, '', { flag: 'ax' })
    console.log(`Note "${fname}" created.`)
    return { success: true }
  } catch (error) {
    console.error(`Error creating note: ${error.message}`)
    if (error.code === 'EEXIST') {
      return { success: false, error: 'A note with the same name already exists.' }
    }

    return { success: false, error: error.message }
  }
})

ipcMain.handle('get-dir-contents', async (event, ...args) => {
  try {
    const { dpath } = args[0]
    console.log(dpath)
    const dirPath = path.join(getNoteDir(), dpath)
    const response = await fs.readdirSync(dirPath, { withFileTypes: true })
    return response.map((dirent) => dirent.name)
  } catch (error) {
    console.error(`Error reading directory: ${error.message}`)
    return { success: false, error: error.message }
  }
})
