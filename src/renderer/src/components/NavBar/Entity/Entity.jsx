import { Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import classes from './Collection.module.css'
import { useState } from 'react'
import { useContextMenu } from 'mantine-contextmenu'
import { IconFile, IconFolder } from '@tabler/icons-react'
import { AddNewNoteForm } from '../Note/AddNewNote'
import { useFileContext } from '../../../FileContext'

export function Entity({ path = [], self: entitySelf = null }) {
  const [opened, { open, close }] = useDisclosure(false)
  const { showContextMenu } = useContextMenu()
  const [isOpen, setIsOpen] = useState(false)
  const [dirContents, setDirContents] = useState([])
  const { currentOpenFile, setFile } = useFileContext()

  function isThisCurrentOpenFile() {
    const combinedSelfString = [...path, entitySelf.name].join('')
    const combinedOpenString = currentOpenFile.join('')

    return combinedSelfString == combinedOpenString
  }

  async function handleClick() {
    //get the contents of dir if they dont exist
    //if we have a file
    if (entitySelf.type == 'file') {
      if (isThisCurrentOpenFile()) {
        setFile([])
      } else {
        setFile([...path, entitySelf.name])
      }
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
        variant={
          (entitySelf.type == 'directory' && isOpen) || isThisCurrentOpenFile()
            ? 'light'
            : 'transparent'
        }
        size="compact-md"
        key={path.label}
        className={classes.collectionButton}
        onClick={handleClick}
        color={entitySelf.type == 'directory' ? 'gray' : isThisCurrentOpenFile() ? 'cyan' : ''}
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
            <div key={i} style={{ borderLeft: '1px solid white', marginLeft: '10px' }}>
              <Entity path={[...path, entitySelf.name]} self={dirContent} />
            </div>
          )
        })}
    </>
  )
}
