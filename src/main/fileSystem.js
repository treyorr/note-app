const { app, ipcMain, BrowserWindow } = require('electron')
const userDataPath = app.getPath('userData')
const fs = require('fs').promises // Using fs.promises for Promise-based API
const path = require('path')
const { rimraf } = require('rimraf')

export function getNoteDir() {
  return path.join(userDataPath, 'notes')
}

async function getConfigData(configPath) {
  try {
    const data = await fs.readFile(configPath, 'utf8')
    const jsonData = JSON.parse(data)
    return jsonData
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {}
    } else {
      console.error(`Error reading or parsing JSON file: ${error.message}`)
    }
  }
}

async function writeEmoji(ecode, configPath, sname) {
  try {
    const configData = await getConfigData(configPath)
    if (
      typeof configData.emojis === 'object' &&
      !Array.isArray(configData.emojis) &&
      configData.emojis !== null
    ) {
      configData.emojis[sname] = ecode
    } else {
      configData.emojis = {}
      configData.emojis[sname] = ecode
    }
    await fs.writeFile(configPath, JSON.stringify(configData), { flag: 'w' })
  } catch (error) {
    console.error(`Error writing to config file: ${error.message}`)
  }
}

async function deleteEmoji(configPath, sname) {
  try {
    const configData = await getConfigData(configPath)
    delete configData.emojis[sname]
    await fs.writeFile(configPath, JSON.stringify(configData), { flag: 'w' })
  } catch (error) {
    console.error(`Error deleting emoji: ${error.message}`)
  }
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
    const { fpath, fname, fheader } = args[0]
    const notePath = path.join(noteDirectory, ...fpath, fname + '.html')
    await fs.writeFile(notePath, fheader, { flag: 'ax' })
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
    const { spath, sname, ecode } = args[0]
    console.log(ecode)
    const sectionPath = path.join(noteDirectory, ...spath, sname)
    const configPath = path.join(noteDirectory, ...spath, 'config.json')
    try {
      await fs.access(sectionPath)
      throw new Error(`Section "${sname}" already exists.`)
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }

    await fs.mkdir(sectionPath)
    if (ecode !== null) {
      writeEmoji(ecode, configPath, sname)
    }
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
    const configPath = path.join(dirPath, 'config.json')
    const configData = await getConfigData(configPath)
    const files = dirents
      .filter((dirent) => dirent.name !== 'config.json')
      .map((dirent) => ({
        name: dirent.name,
        type: dirent.isDirectory() ? 'directory' : 'file',
        ecode:
          configData.emojis && dirent.name in configData.emojis
            ? configData.emojis[dirent.name]
            : null
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
    let configPath = ''
    if (sPath.length > 1) {
      configPath = path.join(noteDirectory, path.join(...sPath.slice(0, -1)), 'config.json')
    } else {
      configPath = path.join(noteDirectory, 'config.json')
    }
    deleteEmoji(configPath, sPath.at(-1))
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

ipcMain.handle('save-note-content', async (event, ...args) => {
  try {
    const { nPath, content } = args[0]
    const notePath = path.join(noteDirectory, ...nPath)
    await fs.writeFile(notePath, content)
    return { success: true }
  } catch (error) {
    console.log(`Error getting note contents: ${error.message}`)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('get-note-content', async (event, ...args) => {
  try {
    const { nPath } = args[0]
    const notePath = path.join(noteDirectory, ...nPath)
    const response = await fs.readFile(notePath)
    const fileContentString = response.toString('utf-8')
    const stats = await fs.stat(notePath)
    const mtimeDate = new Date(stats.mtime)
    const formattedDate = mtimeDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
    return { success: true, data: fileContentString, date: formattedDate }
  } catch (error) {
    console.log(`Error getting note contents: ${error.message}`)
    return { success: false, error: error.message }
  }
})
