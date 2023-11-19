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
  const [dirContents, setDirContents] = useState([])

  async function handleClick() {
    //get the contents of dir if they dont exist
    if (!isOpen && dirContents.length == 0) {
      console.log(collection)
      let args = {
        dPath: collection
      }
      const response = await window.electron.ipcRenderer.invoke('get-dir-contents', args)
      console.log(response)
    }
    setIsOpen(!isOpen)
  }

  return (
    <>
      <Modal opened={opened} onClose={close} title="New Note">
        <AddNewNoteForm path={collection} close={close} />
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
