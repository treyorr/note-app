import { Tabs } from '@mantine/core'
import { UserConfig } from './UserConfig'
import { Backup } from './Backup'
import { IconCloud, IconUser } from '@tabler/icons-react'

export function Settings() {
  return (
    <Tabs defaultValue="userConfig" orientation="vertical">
      <Tabs.List>
        <Tabs.Tab leftSection={<IconUser />} value="userConfig">
          User Config
        </Tabs.Tab>
        <Tabs.Tab leftSection={<IconCloud />} value="backup">
          Backup Notes
        </Tabs.Tab>
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
