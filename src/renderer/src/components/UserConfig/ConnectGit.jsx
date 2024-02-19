import React, { useState } from 'react'
import { Button, Center, Text } from '@mantine/core'
import { IconPlugConnected } from '@tabler/icons-react'
import { useConfigContext } from '../../context/ConfigContext'
import { notifications } from '@mantine/notifications'
export default function ConnectGit() {
  const { config, setConfig } = useConfigContext()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    try {
      setLoading(true)
      const response = await window.electron.ipcRenderer.invoke('connect-github')
      if (response.success) {
        setConfig({ gitConnected: true })
        setLoading(false)
        notifications.show({
          id: 'success',
          withCloseButton: true,
          autoClose: 5000,
          title: 'GitHub connected successfully',
          message: `Your files are now backed up`,
          color: 'green',
          className: 'my-notification-class',
          loading: false
        })
      } else {
        throw response.error
      }
    } catch (error) {
      console.error(`Error connecting to github: ${error}`)
      setLoading(false)
      notifications.show({
        id: 'failure',
        withCloseButton: true,
        autoClose: 5000,
        title: 'Error connecting to GitHub',
        message: `There was an error connecting to GitHub`,
        color: 'red',
        className: 'my-notification-class',
        loading: false
      })
    }
  }
  return (
    <Center>
      {config.gitConnected ? (
        <>
          <Text>Your github is connected already!</Text>
        </>
      ) : (
        <>
          <Button
            mt="sm"
            size="lg"
            color="green"
            onClick={handleClick}
            rightSection={<IconPlugConnected />}
          >
            Connect GitHub
          </Button>
        </>
      )}
    </Center>
  )
}
