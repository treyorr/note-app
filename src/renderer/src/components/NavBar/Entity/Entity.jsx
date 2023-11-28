import { Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import classes from './Collection.module.css'
import { useState } from 'react'
import { useContextMenu } from 'mantine-contextmenu'
import { IconFile, IconFolder, IconTrash } from '@tabler/icons-react'
import { AddNewNoteForm } from '../Forms/AddNewNote'
import { useFileContext } from '../../../FileContext'
import { AddNewSectionForm } from '../Forms/AddNewSection'
import { notifications } from '@mantine/notifications'

export function Entity({ path = [], self: entitySelf = null, updateParent }) {
  const [addNoteOpened, addNoteHandlers] = useDisclosure(false)
  const [addSectionOpened, addSectionHandlers] = useDisclosure(false)
  const { showContextMenu } = useContextMenu()
  const [isOpen, setIsOpen] = useState(false)
  const [dirContents, setDirContents] = useState([])
  const { currentOpenFile, setFile } = useFileContext()

  function getShowName() {
    if (entitySelf.type == 'file') {
      const parts = entitySelf.name.split('.')
      const filenameWithoutExtension = parts.slice(0, -1).join('.')
      return filenameWithoutExtension
    }
    return entitySelf.name
  }
  function isThisCurrentOpenFile() {
    const combinedSelfString = [...path, entitySelf.name].join('')
    const combinedOpenString = currentOpenFile.join('')

    return combinedSelfString == combinedOpenString
  }
  async function updateContents() {
    let args = {
      dPath: [...path, entitySelf.name]
    }
    const response = await window.electron.ipcRenderer.invoke('get-dir-contents', args)
    setDirContents(response)
    if (!isOpen) {
      setIsOpen(true)
    }
  }
  async function deleteEntity() {
    let response = null
    if (entitySelf.type == 'directory') {
      let args = {
        sPath: [...path, entitySelf.name]
      }
      response = await window.electron.ipcRenderer.invoke('delete-section', args)
    } else {
      let args = {
        nPath: [...path, entitySelf.name]
      }
      response = await window.electron.ipcRenderer.invoke('delete-note', args)
    }
    if (response.success) {
      notifications.show({
        id: 'success',
        withCloseButton: true,
        autoClose: 5000,
        title: 'Successful delete',
        message: `You've deleted ${entitySelf.name} successfully`,
        color: 'green',
        className: 'my-notification-class',
        loading: false
      })
      if (isThisCurrentOpenFile()) {
        setFile([])
      }
      updateParent()
    } else {
      notifications.show({
        id: 'failure',
        withCloseButton: true,
        autoClose: 5000,
        title: 'Error during delete',
        message: `There was an error deleting ${entitySelf.name}`,
        color: 'red',
        className: 'my-notification-class',
        loading: false
      })
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
        leftSection={
          entitySelf.type == 'directory' ? (
            entitySelf.ecode ? (
              <p style={{ px: 6 }}>
                <em-emoji size={18} shortcodes={entitySelf.ecode}></em-emoji>
              </p>
            ) : (
              <IconFolder size={24} />
            )
          ) : (
            <IconFile size={24} />
          )
        }
        variant={
          (entitySelf.type == 'directory' && isOpen) || isThisCurrentOpenFile()
            ? 'filled'
            : 'subtle'
        }
        size="compact-md"
        key={path.label}
        className={classes.collectionButton}
        onClick={handleClick}
        color={isThisCurrentOpenFile() ? 'green' : 'gray'}
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
            },
            { key: 'divider' },
            {
              key: 'delete',
              title: 'Delete',
              color: 'red',
              icon: <IconTrash size={20} />,
              onClick: () => deleteEntity(),
              style: () => ({ color: 'red' })
            }
          ],
          {
            styles: {
              item: { padding: '4px' }
            }
          }
        )}
      >
        {getShowName()}
      </Button>
      {isOpen &&
        dirContents.map((dirContent, i) => {
          return (
            <div key={i} style={{ borderLeft: '1px solid white', marginLeft: '10px' }}>
              <Entity
                path={[...path, entitySelf.name]}
                self={dirContent}
                updateParent={updateContents}
              />
            </div>
          )
        })}
    </>
  )
}
