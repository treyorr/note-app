const { ipcMain } = require('electron')
const path = require('path')
const { execSync } = require('child_process')
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
  },
  ghRepo: {
    type: 'string',
    default: ''
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

ipcMain.handle('generate-ssh-key', async (event, ...args) => {
  generateSSHKeyPair()
    .then((publicKey) => {
      store.set('pubKey', publicKey)
      return { success: true, data: publicKey }
    })
    .catch((error) => {
      console.error('Error:', error.message)
    })
})

async function generateSSHKeyPair() {
  //check for existing ssh key

  const privateKeyPath = path.resolve(process.env.HOME, '.ssh', 'note-key')

  try {
    // Generate SSH key pair
    execSync(`ssh-keygen -t rsa -b 4096 -f ${privateKeyPath} -N '' -C 'note-app'`)
    console.log('SSH key pair generated successfully.')

    const publicKeyPath = `${privateKeyPath}.pub`
    const publicKey = execSync(`cat ${publicKeyPath}`, { encoding: 'utf-8' })

    console.log('Public key:', publicKey)
    return publicKey
  } catch (error) {
    console.error('Error generating SSH key pair:', error.message)
    throw error
  }
}
