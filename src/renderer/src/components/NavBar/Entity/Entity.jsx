import { Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import classes from './Collection.module.css'
import { useState } from 'react'
import { useContextMenu } from 'mantine-contextmenu'
import { IconFile, IconFolder } from '@tabler/icons-react'
import { AddNewNoteForm } from '../Note/AddNewNote'

export function Entity({ path = [], self: entitySelf = null }) {
  const [opened, { open, close }] = useDisclosure(false)
  const { showContextMenu } = useContextMenu()
  const [isOpen, setIsOpen] = useState(false)
  const [dirContents, setDirContents] = useState([])

  async function handleClick() {
    //get the contents of dir if they dont exist
    //if we have a file
    if (entitySelf.type == 'file') {
      setIsOpen(!isOpen)
      return
    }
    //if we have a directory
    if (!isOpen && dirContents.length == 0) {
      let args = {
        dPath: [...path, entitySelf.name]
      }
      const response = await window.electron.ipcRenderer.invoke('get-dir-contents', args)
      setDirContents(response)
    }
    setIsOpen(!isOpen)
  }
  return (
    <>
      <Modal opened={opened} onClose={close} title="New Note">
        <AddNewNoteForm path={[...path, entitySelf.name]} close={close} />
      </Modal>
      <Button
        fullWidth
        justify="left"
        variant={isOpen ? 'light' : 'transparent'}
        size="compact-md"
        key={path.label}
        className={classes.collectionButton}
        onClick={handleClick}
        color={entitySelf.type == 'directory' ? 'gray' : 'indigo'}
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
        {entitySelf.name}
      </Button>
      {isOpen &&
        dirContents.map((dirContent, i) => {
          return (
            <div key={i} style={{ marginLeft: '10px' }}>
              <Entity path={[...path, entitySelf.name]} self={dirContent} />
            </div>
          )
        })}
    </>
  )
}