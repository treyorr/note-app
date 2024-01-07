import { RichTextEditor, Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import Highlight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import { useState, useEffect } from 'react'
import { useFileContext } from '../../context/FileContext'
import { Button, Text, Modal, Group, ScrollArea } from '@mantine/core'
import { IconDeviceFloppy, IconEdit } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'

export function NoteEditor() {
  const [opened, { close, open }] = useDisclosure(false)
  const [editable, setEditable] = useState(false)
  const [noteContentLoaded, setNoteContentLoaded] = useState(false)
  const { currentOpenFile } = useFileContext()
  const [filePath, setFilePath] = useState(null)
  const [date, setDate] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: null
  })

  function getPathText() {
    const pathBeforeFile = currentOpenFile.slice(0, -1).join(' / ')
    const fileName = currentOpenFile.at(-1)
    const parts = fileName.split('.')
    const fileNameWithoutExtension = parts.slice(0, -1).join('.')
    return (
      <Text c="gray.6">
        {pathBeforeFile} /{' '}
        <Text span c="white" fw={600} inherit>
          {fileNameWithoutExtension}
        </Text>
      </Text>
    )
  }

  async function handleSave(path) {
    if (editor) {
      setEditable(false)
      try {
        let args = {
          nPath: path,
          content: editor.getHTML()
        }
        const response = await window.electron.ipcRenderer.invoke('save-note-content', args)
        if (response && response.success) {
          setNoteContentLoaded(true)
        }
      } catch (error) {
        console.error('Error fetching note content:', error)
      }
    }
  }

  const fetchNoteContent = async () => {
    try {
      let args = {
        nPath: currentOpenFile
      }
      const response = await window.electron.ipcRenderer.invoke('get-note-content', args)
      if (response && response.success) {
        setFilePath(currentOpenFile)
        editor.commands.setContent(response.data)
        setDate(response.date)
      }
    } catch (error) {
      console.error('Error fetching note content:', error)
    }
  }

  //initial content load of note
  useEffect(() => {
    // if switching notes
    if ((!noteContentLoaded && editor) || currentOpenFile != filePath) {
      // if we have unsaved changes, ask user if they want to save before leaving
      if (editable == true) {
        open()
      } else {
        fetchNoteContent()
        setEditable(false)
      }
    }
  }, [editor, noteContentLoaded, currentOpenFile])

  // we change the ability to edit a note in reaction to state change
  useEffect(() => {
    if (!editor) {
      return undefined
    }
    editor.setEditable(editable)
  }, [editor, editable])

  //handle unsaved changes
  function saveChanges() {
    handleSave(filePath)
    handleClose()
  }
  function handleClose() {
    fetchNoteContent()
    setEditable(false)
    close()
  }

  const handleLinkClick = (event) => {
    const { target } = event

    if (target.tagName.toLowerCase() === 'a') {
      event.preventDefault() // Prevent default behavior (e.g., navigating within the editor)
      const href = target.getAttribute('href')
      window.shell.openExternal(href)
    }
  }

  if (!editor) {
    return null
  }
  return (
    <>
      <Modal opened={opened} onClose={handleClose} title="Unsaved Changes">
        <Text>
          You have unsaved changes, would you like to save them before leaving? If you choose not
          to, your changes to the note will be lost.
        </Text>
        <Group mt={20} justify="center" gap="xl">
          <Button size="compact-xl" color="green" onClick={saveChanges}>
            Save
          </Button>
          <Button size="compact-xl" color="red" onClick={handleClose}>
            Discard
          </Button>
        </Group>
      </Modal>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <RichTextEditor onClick={handleLinkClick} mt="40px" mb="10px" w={'85%'} editor={editor}>
          <RichTextEditor.Toolbar
            sticky
            w={'100%'}
            style={{ justifyContent: 'center', top: 0, zIndex: 100 }}
          >
            {editable ? (
              <>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.Strikethrough />
                  <RichTextEditor.ClearFormatting />
                  <RichTextEditor.Highlight />
                  <RichTextEditor.Code />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                  <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Blockquote />
                  <RichTextEditor.Hr />
                  <RichTextEditor.BulletList />
                  <RichTextEditor.OrderedList />
                  <RichTextEditor.Subscript />
                  <RichTextEditor.Superscript />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Link />
                  <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.AlignLeft />
                  <RichTextEditor.AlignCenter />
                  <RichTextEditor.AlignJustify />
                  <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>
                <Button
                  size="compact-sm"
                  color="green"
                  style={{ marginLeft: 'auto' }}
                  leftSection={<IconDeviceFloppy size={16} />}
                  onClick={() => handleSave(currentOpenFile)}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <Text>{getPathText()}</Text>
                <Text c="gray.6" style={{ marginLeft: 'auto' }}>
                  {date}
                </Text>
                <Button
                  size="compact-sm"
                  variant="outline"
                  color="gray"
                  leftSection={<IconEdit size={16} />}
                  onClick={() => setEditable(true)}
                >
                  Edit
                </Button>
              </>
            )}
          </RichTextEditor.Toolbar>
          <ScrollArea h="84vh">
            <RichTextEditor.Content />
          </ScrollArea>
        </RichTextEditor>
      </div>
    </>
  )
}
