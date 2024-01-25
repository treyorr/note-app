import { Button, Center, Text } from '@mantine/core'
import { IconPlugConnected } from '@tabler/icons-react'
import { useConfigContext } from '../../context/ConfigContext'
export default function ConnectGit() {
  const { config, setConfig } = useConfigContext()
  return (
    <Center>
      {config.gitConnected ? (
        <>
          <Text>Your github is connected already!</Text>
        </>
      ) : (
        <>
          <Button mt="sm" size="lg" color="green" rightSection={<IconPlugConnected />}>
            Connect GitHub
          </Button>
        </>
      )}
    </Center>
  )
}
