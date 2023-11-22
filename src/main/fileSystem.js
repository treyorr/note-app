const { app, ipcMain, BrowserWindow } = require('electron')
const userDataPath = app.getPath('userData')
const fs = require('fs').promises // Using fs.promises for Promise-based API
const path = require('path')
const { rimraf, rimrafSync, native, nativeSync } = require('rimraf')

export function getNoteDir() {
  return path.join(userDataPath, 'notes')
}

const noteDirectory = getNoteDir()

export async function setUpFileSystem() {
  try {
    await fs.access(noteDirectory)
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Directory does not exist, create it
      try {
        await fs.mkdir(noteDirectory, { recursive: true })
        console.log(`Directory "${noteDirectory}" created.`)
      } catch (mkdirError) {
        console.error(`Error creating directory: ${mkdirError.message}`)
      }
    } else {
      console.error(`Error accessing directory: ${error.message}`)
    }
  }
}

ipcMain.handle('create-note', async (event, ...args) => {
  try {
    const { fpath, fname } = args[0]
    const notePath = path.join(noteDirectory, ...fpath, fname + '.json')
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

ipcMain.handle('create-section', async (event, ...args) => {
  try {
    const { spath, sname } = args[0]
    const sectionPath = path.join(noteDirectory, ...spath, sname)
    try {
      await fs.access(sectionPath)
      throw new Error(`Section "${sname}" already exists.`)
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }

    await fs.mkdir(sectionPath)
    console.log(`Section "${sname}" created.`)
    return { success: true }
  } catch (error) {
    console.error(`Error creating directory: ${error.message}`)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('get-dir-contents', async (event, ...args) => {
  try {
    const { dPath } = args[0]
    const dirPath = path.join(noteDirectory, ...dPath)
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

ipcMain.handle('delete-section', async (event, ...args) => {
  try {
    const { sPath } = args[0]
    const dirPath = path.join(noteDirectory, ...sPath)
    rimraf(dirPath, { glob: false })
    console.log(`Section "${dirPath}" deleted.`)
    return { success: true }
  } catch (error) {
    console.error(`Error deleting section: ${error.message}`)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('delete-note', async (event, ...args) => {
  try {
    const { nPath } = args[0]
    const notePath = path.join(noteDirectory, ...nPath)
    fs.unlink(notePath)
    console.log(`Note "${notePath}" deleted.`)
    return { success: true }
  } catch (error) {
    console.error(`Error deleting note: ${error.message}`)
    return { success: false, error: error.message }
  }
})
