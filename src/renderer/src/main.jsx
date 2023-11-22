import React from 'react'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ContextMenuProvider } from 'mantine-contextmenu'
import ReactDOM from 'react-dom/client'
import App from './App'
import { FileProvider } from './FileContext'
import '@mantine/core/styles.css'
import 'mantine-contextmenu/styles.css'
import '@mantine/notifications/styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <ContextMenuProvider shadow="md">
        <FileProvider>
          <Notifications />
          <App />
        </FileProvider>
      </ContextMenuProvider>
    </MantineProvider>
  </React.StrictMode>
)
