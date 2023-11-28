/* eslint-disable react/prop-types */
import { TextInput, Group, Button, Modal, Text } from '@mantine/core'
import { IconFolder } from '@tabler/icons-react'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { EmojiSelect } from './EmojiSelect'
import { useState } from 'react'

export function AddNewCollection({ collections, close, fetchCollections }) {
  const [emojiOpened, emojiHanders] = useDisclosure(false)
  const [emojiCode, setEmojiCode] = useState(null)
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: ''
    },
    validate: {
      name: (name) =>
        name.length > 20
          ? 'Name must be 20 characters or less'
          : collections.includes(name)
            ? 'Collection already exists'
            : null
    }
  })

  async function createCollection(values) {
    let args = {
      spath: [],
      sname: values.name,
      ecode: emojiCode
    }
    try {
      const response = await window.electron.ipcRenderer.invoke('create-section', args)
      if (response.success) {
        fetchCollections()
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
      <form onSubmit={form.onSubmit((values) => createCollection(values))}>
        <TextInput
          label="Name"
          data-autofocus
          placeholder="School"
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
