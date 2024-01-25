const { ipcMain } = require('electron')
const path = require('path')
const { execSync } = require('child_process')
const Store = require('electron-store')
const fs = require('fs')
const os = require('os')

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
  },
  sshKey: {
    type: 'string',
    default: ''
  },
  gitConnected: {
    type: 'boolean',
    default: false
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

ipcMain.handle('get-ssh-key', async (event, ...args) => {
  const sshDir = path.join(os.homedir(), '.ssh')
  const keyTypes = ['id_rsa.pub', 'id_ecdsa.pub', 'id_ed25519.pub']

  for (let keyType of keyTypes) {
    const keyPath = path.join(sshDir, keyType)
    try {
      if (fs.existsSync(keyPath)) {
        const publicKey = fs.readFileSync(keyPath, 'utf8')
        store.set('pubKey', publicKey)
        return { success: true, data: publicKey }
      }
    } catch (error) {
      generateSSHKeyPair()
        .then((publicKey) => {
          store.set('pubKey', publicKey)
          return { success: true, data: publicKey }
        })
        .catch((error) => {
          return { success: false, error: error.message }
        })
    }
  }
})

async function generateSSHKeyPair() {
  const privateKeyPath = path.resolve(process.env.HOME, '.ssh', 'my-key')

  try {
    // Generate SSH key pair with email as a comment
    execSync(`ssh-keygen -t rsa -b 4096 -f ${privateKeyPath} -N '' -C 'note-app`)
    console.log('SSH key pair generated successfully.')

    // Retrieve public key
    const publicKeyPath = `${privateKeyPath}.pub`
    const publicKey = execSync(`cat ${publicKeyPath}`, { encoding: 'utf-8' })

    console.log('Public key:', publicKey)

    // In a real application, you would probably want to return or use the public key for further actions.
    return publicKey
  } catch (error) {
    console.error('Error generating SSH key pair:', error.message)
    throw error
  }
}
