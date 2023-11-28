import { useForm } from '@mantine/form'
import { Group, Button, TextInput, Modal, Text } from '@mantine/core'
import { IconFolder } from '@tabler/icons-react'
import { EmojiSelect } from './EmojiSelect'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
export function AddNewSectionForm({ path, close, updateContents }) {
  const [emojiOpened, emojiHanders] = useDisclosure(false)
  const [emojiCode, setEmojiCode] = useState(null)
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: ''
    },
    validate: {
      name: (name) => (name.length > 20 ? 'Name must be 20 characters or less' : null)
    }
  })

  async function createSection(values) {
    let args = {
      spath: path,
      sname: values.name,
      ecode: emojiCode
    }
    try {
      const response = await window.electron.ipcRenderer.invoke('create-section', args)
      if (response.success) {
        updateContents()
        close()
      } else {
        throw response.error
      }
    } catch (error) {
      form.setErrors({ name: error })
    }
  }

  return (
    <>
      <Modal opened={emojiOpened} onClose={emojiHanders.close} size="auto" title="Select Your Icon">
        <EmojiSelect setCode={setEmojiCode} close={emojiHanders.close} />
      </Modal>
      <form onSubmit={form.onSubmit((values) => createSection(values))}>
        <TextInput
          label="Name"
          data-autofocus
          placeholder="General Relativity"
          {...form.getInputProps('name')}
        />
        <Group mt="20" gap="sm" justify="flex-start">
          <Text fw={500} size="sm">
            Icon:
          </Text>
          {emojiCode ? <em-emoji shortcodes={emojiCode}></em-emoji> : <IconFolder size={20} />}

          <Button onClick={emojiHanders.open} variant="outline" color="gray" size="compact-sm">
            Change
          </Button>
          <Button
            onClick={() => setEmojiCode(null)}
            variant="outline"
            color="red"
            size="compact-sm"
          >
            Reset
          </Button>
        </Group>
        <Group justify="flex-end" mt="md">
          <Button
            disabled={form.getTransformedValues().name.length == 0}
            color="green"
            type="submit"
          >
            Create
          </Button>
        </Group>
      </form>
    </>
  )
}
