import { TextInput, Code, Text, Group, ActionIcon, Tooltip, rem } from '@mantine/core'
import { IconSearch, IconPlus } from '@tabler/icons-react'
import { UserButton } from './UserButton/UserButton'
import classes from './NavbarSearch.module.css'
import React, { useEffect, useState } from 'react'

const collections = [
  { emoji: '👍', label: 'Sales' },
  { emoji: '🚚', label: 'Deliveries' },
  { emoji: '💸', label: 'Discounts' },
  { emoji: '💰', label: 'Profits' },
  { emoji: '✨', label: 'Reports' },
  { emoji: '🛒', label: 'Orders' },
  { emoji: '📅', label: 'Events' },
  { emoji: '🙈', label: 'Debts' },
  { emoji: '💁‍♀️', label: 'Customers' }
]

export function NavbarSearch() {
  const [noteFileNames, setNoteFileNames] = useState([])

  useEffect(() => {
    const fetchNoteFileNames = async () => {
      try {
        const fileNames = await window.electron.ipcRenderer.invoke('getNoteFileNames')
        console.log(fileNames)
        setNoteFileNames(fileNames)
      } catch (error) {
        console.error('Error fetching note file names:', error)
      }
    }

    fetchNoteFileNames()
  }, []) // Run once on component mount

  const collectionLinks = collections.map((collection) => (
    <a
      href="#"
      onClick={(event) => event.preventDefault()}
      key={collection.label}
      className={classes.collectionLink}
    >
      <span style={{ marginRight: rem(9), fontSize: rem(16) }}>{collection.emoji}</span>{' '}
      {collection.label}
    </a>
  ))

  return (
    <nav className={classes.navbar}>
      <div className={classes.section}>
        <UserButton />
      </div>

      <TextInput
        placeholder="Search"
        size="xs"
        leftSection={<IconSearch style={{ width: rem(12), height: rem(12) }} stroke={1.5} />}
        rightSectionWidth={70}
        rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
        styles={{ section: { pointerEvents: 'none' } }}
        mb="sm"
      />

      <div className={classes.section}>
        <Group className={classes.collectionsHeader} justify="space-between">
          <Text size="xs" fw={500} c="dimmed">
            Collections
          </Text>
          <Tooltip label="Create collection" withArrow position="right">
            <ActionIcon variant="default" size={18}>
              <IconPlus style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <div className={classes.collections}>{collectionLinks}</div>
      </div>
    </nav>
  )
}
