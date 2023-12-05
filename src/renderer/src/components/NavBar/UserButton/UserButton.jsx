import { UnstyledButton, Group, Avatar, Text, rem } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import classes from './UserButton.module.css'
import { useFileContext } from '../../../context/FileContext'
import { useConfigContext } from '../../../context/ConfigContext'

export function UserButton() {
  const { config } = useConfigContext()
  const { setFile } = useFileContext()

  return (
    <UnstyledButton onClick={() => setFile(null)} className={classes.user}>
      <Group>
        <Avatar radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {config.firstName} {config.lastName}
          </Text>
        </div>

        <IconChevronRight style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
      </Group>
    </UnstyledButton>
  )
}
