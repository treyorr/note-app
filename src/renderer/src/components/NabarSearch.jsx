import {
  TextInput,
  Code,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  rem,
  Button,
  Drawer
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconSearch, IconPlus } from '@tabler/icons-react'
import { UserButton } from './UserButton/UserButton'
import classes from './NavbarSearch.module.css'
import React, { useEffect, useState } from 'react'
import { AddCollectionForm } from './AddCollectionForm/AddCollectionForm'

export function NavbarSearch() {
  const [opened, { open, close }] = useDisclosure(false)
  const [noteFileNames, setNoteFileNames] = useState([])

  const fetchNoteFileNames = async () => {
    try {
      const fileNames = await window.electron.ipcRenderer.invoke('getNoteFileNames')
      console.log(fileNames)
      setNoteFileNames(fileNames)
    } catch (error) {
      console.error('Error fetching note file names:', error)
    }
  }

  useEffect(() => {
    fetchNoteFileNames()
  }, []) // Run once on component mount

  window.electron.ipcRenderer.on('new-collection', () => fetchNoteFileNames())

  const collectionLinks = noteFileNames.map((collection) => (
    <Button
      fullWidth
      justify="left"
      variant="transparent"
      size="compact-md"
      onClick={(event) => event.preventDefault()}
      key={collection.label}
      className={classes.collectionButton}
    >
      {collection}
    </Button>
  ))

  return (
    <>
      <Drawer opened={opened} size="xs" onClose={close} title="Create A New Collection">
        <AddCollectionForm collections={noteFileNames} />
      </Drawer>
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
            <Tooltip onClick={open} label="Create collection" withArrow position="right">
              <ActionIcon variant="default" size={18}>
                <IconPlus style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <div className={classes.collections}>{collectionLinks}</div>
        </div>
      </nav>
    </>
  )
}
