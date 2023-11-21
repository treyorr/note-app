import { Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import classes from './Collection.module.css'
import { useState } from 'react'
import { useContextMenu } from 'mantine-contextmenu'
import { IconFile, IconFolder } from '@tabler/icons-react'
import { AddNewNoteForm } from '../Note/AddNewNote'
import { useFileContext } from '../../../FileContext'
import { AddNewSectionForm } from '../Section/AddNewSection'

export function Entity({ path = [], self: entitySelf = null }) {
  const [addNoteOpened, addNoteHandlers] = useDisclosure(false)
  const [addSectionOpened, addSectionHandlers] = useDisclosure(false)
  const { showContextMenu } = useContextMenu()
  const [isOpen, setIsOpen] = useState(false)
  const [dirContents, setDirContents] = useState([])
  const { currentOpenFile, setFile } = useFileContext()

  function isThisCurrentOpenFile() {
    const combinedSelfString = [...path, entitySelf.name].join('')
    const combinedOpenString = currentOpenFile.join('')

    return combinedSelfString == combinedOpenString
  }
  async function updateContents() {
    if (isOpen) {
      let args = {
        dPath: [...path, entitySelf.name]
      }
      const response = await window.electron.ipcRenderer.invoke('get-dir-contents', args)
      setDirContents(response)
    }
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
    if (!isOpen) {
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
      <Modal opened={addNoteOpened} onClose={addNoteHandlers.close} title="New Note">
        <AddNewNoteForm
          path={[...path, entitySelf.name]}
          close={addNoteHandlers.close}
          updateContents={updateContents}
        />
      </Modal>
      <Modal opened={addSectionOpened} onClose={addSectionHandlers.close} title="New Section">
        <AddNewSectionForm
          path={[...path, entitySelf.name]}
          close={addSectionHandlers.close}
          updateContents={updateContents}
        />
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
              hidden: entitySelf.type == 'file',
              icon: <IconFile size={20} />,
              onClick: () => addNoteHandlers.open()
            },
            {
              key: 'newsection',
              title: 'New Section',
              hidden: entitySelf.type == 'file',
              icon: <IconFolder size={20} />,
              onClick: () => addSectionHandlers.open()
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
