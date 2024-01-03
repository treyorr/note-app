import {
  TextInput,
  Pill,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  rem,
  Drawer,
  CloseButton
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconSearch, IconPlus, IconX } from '@tabler/icons-react'
import { UserButton } from './UserButton/UserButton'
import classes from './NavbarSearch.module.css'
import React, { useEffect, useState } from 'react'
import { AddNewCollection } from './Forms/AddNewCollection'
import { Entity } from './Entity/Entity'
import data from '@emoji-mart/data'
import { init } from 'emoji-mart'

init({ data })

export function NavbarSearch() {
  const [opened, { open, close }] = useDisclosure(false)
  const [collections, setCollections] = useState([])
  const [filter, setFilter] = useState('')

  const filteredCollections = collections.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  )

  const fetchCollections = async () => {
    try {
      let args = {
        dPath: []
      }
      const response = await window.electron.ipcRenderer.invoke('get-dir-contents', args)
      setCollections(response)
    } catch (error) {
      console.error('Error fetching collections:', error)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, []) // Run once on component mount

  return (
    <>
      <Drawer opened={opened} size="xs" onClose={close} title="Create A New Collection">
        <AddNewCollection
          collections={collections}
          close={close}
          fetchCollections={fetchCollections}
        />
      </Drawer>
      <nav className={classes.navbar}>
        <div className={classes.section}>
          <UserButton />
        </div>

        <TextInput
          placeholder="Search"
          size="xs"
          value={filter}
          onChange={(event) => setFilter(event.currentTarget.value)}
          leftSection={<IconSearch style={{ width: rem(12), height: rem(12) }} stroke={1.5} />}
          rightSection={
            filter.length > 0 ? <CloseButton size="sm" onClick={() => setFilter('')} /> : null
          }
          mb="sm"
        />

        <div className={classes.section}>
          <Group className={classes.collectionsHeader} justify="space-between">
            <Text size="xs" fw={500} c="dimmed">
              Collections{' '}
              {filter.length > 0 ? (
                <Pill>
                  {filteredCollections.length} / {collections.length}{' '}
                </Pill>
              ) : null}
            </Text>
            <Tooltip onClick={open} label="Create collection" withArrow position="right">
              <ActionIcon variant="default" size={18}>
                <IconPlus style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <div className={classes.collections}>
            {filteredCollections.map((collection) => (
              <Entity
                key={collection.name}
                path={[]}
                self={collection}
                updateParent={fetchCollections}
              />
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}
