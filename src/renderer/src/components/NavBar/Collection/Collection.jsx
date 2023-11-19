import { Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import classes from './Collection.module.css'
import { useState } from 'react'
import { useContextMenu } from 'mantine-contextmenu'
import { IconFile, IconFolder } from '@tabler/icons-react'
import { AddNewNoteForm } from '../Note/AddNewNote'

export function Collection({ collection }) {
  const [opened, { open, close }] = useDisclosure(false)
  const { showContextMenu } = useContextMenu()
  const [isOpen, setIsOpen] = useState(false)

  function handleClick() {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <Modal opened={opened} onClose={close} title="New Note">
        <AddNewNoteForm />
      </Modal>
      <Button
        fullWidth
        justify="left"
        variant="transparent"
        size="compact-md"
        key={collection.label}
        className={classes.collectionButton}
        onClick={handleClick}
        onContextMenu={showContextMenu(
          [
            {
              key: 'newfile',
              title: 'New Note',
              icon: <IconFile size={20} />,
              onClick: () => open()
            },
            {
              key: 'newfolder',
              title: 'New Folder',
              icon: <IconFolder size={20} />,
              onClick: () => console.log('download')
            }
          ],
          {
            styles: {
              item: { padding: '4px', c: 'grey.2' }
            }
          }
        )}
      >
        {collection}
      </Button>
      {isOpen && <div>trey</div>}
    </>
  )
}
