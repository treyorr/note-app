import { Tabs } from '@mantine/core'
import { UserConfig } from './UserConfig'
import { BackupConfig } from './BackupConfig'
import { IconCloud, IconDeviceFloppy, IconUser } from '@tabler/icons-react'

export function Settings() {
  return (
    <Tabs defaultValue="userConfig" orientation="vertical">
      <Tabs.List>
        <Tabs.Tab style={{ borderRadius: 0 }} leftSection={<IconUser />} value="userConfig">
          User Config
        </Tabs.Tab>
        <Tabs.Tab style={{ borderRadius: 0 }} leftSection={<IconCloud />} value="backupConfig">
          Backup Config
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="userConfig">
        <UserConfig />
      </Tabs.Panel>
      <Tabs.Panel value="backupConfig">
        <BackupConfig />
      </Tabs.Panel>
    </Tabs>
  )
}
