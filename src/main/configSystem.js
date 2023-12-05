const { ipcMain } = require('electron')
const Store = require('electron-store')

const schema = {
  firstName: {
    type: 'string',
    default: 'John'
  },
  lastName: {
    type: 'string',
    default: 'Doe'
  },

  fileHeader: {
    type: 'number',
    default: 0
  }
}

let store = null
export function setUpStore() {
  store = new Store({ schema })
}

ipcMain.handle('get-config-data', async (event, ...args) => {
  try {
    const configData = store.get()
    console.log(`Got config data: ${JSON.stringify(configData)}`)
    return { success: true, data: configData }
  } catch (error) {
    console.error(`Error getting config data: ${error.message}`)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('save-config-data', async (event, ...args) => {
  console.log(args[0])
  try {
    store.store = args[0]
    console.log(`Saved config data: ${JSON.stringify(args[0])}`)
    return { success: true }
  } catch (error) {
    console.error(`Error saving config data: ${error.message}`)
    return { success: false, error: error.message }
  }
})
