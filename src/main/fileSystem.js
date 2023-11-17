const { app, ipcMain } = require('electron')
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
