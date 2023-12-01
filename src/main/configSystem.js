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
