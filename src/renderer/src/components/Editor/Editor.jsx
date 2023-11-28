import { RichTextEditor, Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import Highlight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import { useState, useEffect } from 'react'
import { useFileContext } from '../../FileContext'
import { Button, Text } from '@mantine/core'

export function NoteEditor() {
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

  async function handleSave() {
    if (editor) {
      setEditable((prevEditable) => !prevEditable)
      try {
        let args = {
          nPath: currentOpenFile,
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
  //initial content load of note
  useEffect(() => {
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

    if ((!noteContentLoaded && editor) || currentOpenFile != filePath) {
      fetchNoteContent()
    }
  }, [editor, noteContentLoaded, currentOpenFile])

  // we change the ability to edit a note in reaction to state change
  useEffect(() => {
    if (!editor) {
      return undefined
    }

    editor.setEditable(editable)
  }, [editor, editable])

  if (!editor) {
    return null
  }
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        overflow: 'auto'
      }}
    >
      <RichTextEditor w={'85%'} editor={editor}>
        <RichTextEditor.Toolbar sticky w={'100%'} style={{ justifyContent: 'center' }}>
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
                onClick={() => handleSave()}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Text>{getPathText()}</Text>
              <Text style={{ marginLeft: 'auto' }}>{date}</Text>
              <Button
                size="compact-sm"
                variant="outline"
                color="gray"
                onClick={() => setEditable(true)}
              >
                Edit
              </Button>
            </>
          )}
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </div>
  )
}
