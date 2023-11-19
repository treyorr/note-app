import React from 'react'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { ContextMenuProvider } from 'mantine-contextmenu'
import ReactDOM from 'react-dom/client'
import App from './App'

import '@mantine/core/styles.layer.css'
import 'mantine-contextmenu/styles.layer.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <ContextMenuProvider shadow="md">
        <App />
      </ContextMenuProvider>
    </MantineProvider>
  </React.StrictMode>
)
