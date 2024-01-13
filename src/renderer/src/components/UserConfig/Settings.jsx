import {
  Button,
  Flex,
  Tabs,
  Center,
  Fieldset,
  TextInput,
  ScrollArea,
  PasswordInput
} from '@mantine/core'
import { UserConfig } from './UserConfig'
import { Backup } from './Backup'
import { IconCloud, IconDeviceFloppy, IconUser } from '@tabler/icons-react'
import { useForm } from '@mantine/form'
import { useConfigContext } from '../../context/ConfigContext'

export function Settings() {
  const { config, setConfig } = useConfigContext()

  const form = useForm({
    initialValues: {
      ghUsername: config.ghUsername,
      ghPassword: config.ghPassword,
      ghRepo: config.ghRepo
    },
    validateInputOnChange: true,
    validate: {
      ghUsername: (username) =>
        username.length < 3
          ? ''
          : username.length > 25
            ? 'Username must be 25 characters or less'
            : null,
      ghPassword: (password) =>
        password.length < 3
          ? ''
          : password.length > 25
            ? 'Password must be 25 characters or less'
            : null,
      ghRepo: (url) => (url.length < 3 ? '' : null)
    }
  })

  function applyConfiguration(values) {
    setConfig(values)
    form.setInitialValues(values)
  }
  return (
    <Tabs defaultValue="userConfig" orientation="vertical">
      <Tabs.List>
        <Tabs.Tab style={{ borderRadius: 0 }} leftSection={<IconUser />} value="userConfig">
          User Config
        </Tabs.Tab>
        <Tabs.Tab style={{ borderRadius: 0 }} leftSection={<IconCloud />} value="backup">
          Backup Config
        </Tabs.Tab>
        <Button
          leftSection={<IconDeviceFloppy />}
          style={{ borderRadius: 0, height: 44 }}
          color="green"
        >
          Save Changes
        </Button>
      </Tabs.List>

      <Tabs.Panel value="userConfig">
        <UserConfig />
      </Tabs.Panel>
      <Tabs.Panel value="backup">
        <Backup />
      </Tabs.Panel>
    </Tabs>
  )
}
