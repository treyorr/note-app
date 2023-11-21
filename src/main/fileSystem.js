const { app, ipcMain, BrowserWindow } = require('electron')
const userDataPath = app.getPath('userData')
const fs = require('fs').promises // Using fs.promises for Promise-based API
const path = require('path')

export function getNoteDir() {
  return path.join(userDataPath, 'notes')
}

export async function setUpFileSystem() {
  const notesDirectory = getNoteDir()

  try {
    await fs.access(notesDirectory)
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Directory does not exist, create it
      try {
        await fs.mkdir(notesDirectory, { recursive: true })
        console.log(`Directory "${notesDirectory}" created.`)
      } catch (mkdirError) {
        console.error(`Error creating directory: ${mkdirError.message}`)
      }
    } else {
      console.error(`Error accessing directory: ${error.message}`)
    }
  }
}

ipcMain.handle('get-collections', async () => {
  try {
    const notesDirectory = getNoteDir()
    const dirents = await fs.readdir(notesDirectory, { withFileTypes: true })
    const files = dirents
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => ({
        name: dirent.name,
        type: dirent.isDirectory() ? 'directory' : 'file'
      }))
    return files
  } catch (error) {
    console.error('Error reading collection names:', error)
    return []
  }
})

ipcMain.handle('createCollection', async (event, collection) => {
  try {
    const notesDirectory = getNoteDir()
    const newDirPath = path.join(notesDirectory, collection.name)

    try {
      await fs.access(newDirPath)
      throw new Error(`Collection "${collection.name}" already exists.`)
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }

    await fs.mkdir(newDirPath)
    console.log(`Directory "${collection.name}" created.`)
    event.sender.send('new_collection')
    return { success: true }
  } catch (error) {
    console.error(`Error creating directory: ${error.message}`)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('create-note', async (event, ...args) => {
  try {
    const { fpath, fname } = args[0]
    const notePath = path.join(getNoteDir(), ...fpath, fname + '.json')
    await fs.writeFile(notePath, '', { flag: 'ax' })
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
    const { dPath } = args[0]
    const dirPath = path.join(getNoteDir(), ...dPath)
    const dirents = await fs.readdir(dirPath, { withFileTypes: true })

    const files = dirents.map((dirent) => ({
      name: dirent.name,
      type: dirent.isDirectory() ? 'directory' : 'file'
    }))
    return files
  } catch (error) {
    console.error(`Error reading directory: ${error.message}`)
    return { success: false, error: error.message }
  }
})
