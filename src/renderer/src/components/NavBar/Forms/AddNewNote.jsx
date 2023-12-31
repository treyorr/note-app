import { useForm } from '@mantine/form'
import { Group, Button, TextInput } from '@mantine/core'
import { useConfigContext } from '../../../context/ConfigContext'
import { getNoteHeader } from './createNoteHelper'

export function AddNewNoteForm({ path, close, updateContents }) {
  const { config } = useConfigContext()
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: ''
    },
    validate: {
      name: (name) => (name.length > 20 ? 'Name must be 20 characters or less' : null)
    }
  })

  async function createNote(values) {
    let args = {
      fpath: path,
      fname: values.name,
      fheader: getNoteHeader(config, values.name)
    }
    try {
      const response = await window.electron.ipcRenderer.invoke('create-note', args)
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
    <form onSubmit={form.onSubmit((values) => createNote(values))}>
      <TextInput
        label="Name"
        data-autofocus
        placeholder="Quantum Tunneling"
        {...form.getInputProps('name')}
      />
      <Group justify="flex-end" mt="md">
        <Button disabled={form.getTransformedValues().name.length == 0} color="green" type="submit">
          Create
        </Button>
      </Group>
    </form>
  )
}
