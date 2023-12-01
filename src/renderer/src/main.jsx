import React from 'react'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ContextMenuProvider } from 'mantine-contextmenu'
import ReactDOM from 'react-dom/client'
import App from './App'
import { FileProvider } from './context/FileContext'
import { ConfigProvider } from './context/ConfigContext'
import '@mantine/core/styles.css'
import 'mantine-contextmenu/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/tiptap/styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <ContextMenuProvider shadow="md">
        <FileProvider>
          <ConfigProvider>
            <Notifications />
            <App />
          </ConfigProvider>
        </FileProvider>
      </ContextMenuProvider>
    </MantineProvider>
  </React.StrictMode>
)
