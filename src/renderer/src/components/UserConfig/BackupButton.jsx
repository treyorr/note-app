import { Button } from '@mantine/core'
import { IconCloudUpload } from '@tabler/icons-react'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'

export default function BackupButton() {
  const [loading, setLoading] = useState(false)
  async function handleClick() {
    try {
      setLoading(true)
      const response = await window.electron.ipcRenderer.invoke('backup-notes')
      if (response.success) {
        setLoading(false)
        notifications.show({
          id: 'success',
          withCloseButton: true,
          autoClose: 5000,
          title: 'Backup successful',
          message: `Your files are now synced in GitHub!`,
          color: 'green',
          className: 'my-notification-class',
          loading: false
        })
      } else {
        throw response.error
      }
      setLoading(false)
    } catch (error) {
      console.error(`Error backing up: ${error}`)
      setLoading(false)
      notifications.show({
        id: 'failure',
        withCloseButton: true,
        autoClose: 5000,
        title: 'Error during backup to GitHub',
        message: error,
        color: 'red',
        className: 'my-notification-class',
        loading: false
      })
    }
  }
  return (
    <Button
      size="lg"
      style={{ marginTop: 'auto' }}
      color="green"
      radius={0}
      mb={1}
      leftSection={<IconCloudUpload />}
      loading={loading}
      onClick={handleClick}
    >
      Backup
    </Button>
  )
}
