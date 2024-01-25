import { Button, Stack, Text } from '@mantine/core'
import { IconRecycle } from '@tabler/icons-react'
import { useClipboard } from '@mantine/hooks'
import { useConfigContext } from '../../context/ConfigContext'
export default function GenerateSSH() {
  const clipboard = useClipboard({ timeout: 500 })
  const { config, setConfig } = useConfigContext()
  const generateSSHKey = async () => {
    try {
      const response = await window.electron.ipcRenderer.invoke('get-ssh-key')
      setConfig({ ...config, sshKey: response.data })
    } catch (error) {
      console.error('Error fetching collections:', error)
    }
  }
  console.log(config)
  return (
    <Stack align="center">
      {config.sshKey == '' ? (
        <>
          <Text mt="sm">You have no current SSH key, click below to generate a new one.</Text>
          <Button color="blue" mt="md" onClick={generateSSHKey} rightSection={<IconRecycle />}>
            Generate SSH Key
          </Button>
        </>
      ) : (
        <>
          <Text>On Github, under settings, add the SSH key to your account.</Text>
          <Button
            color={clipboard.copied ? 'teal' : 'blue'}
            onClick={() => clipboard.copy(config.sshKey)}
          >
            {clipboard.copied ? 'Copied' : 'Copy SSH Key'}
          </Button>
        </>
      )}
    </Stack>
  )
}
