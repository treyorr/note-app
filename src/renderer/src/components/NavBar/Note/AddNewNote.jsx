import { useForm } from '@mantine/form'
import { Group, Button, TextInput } from '@mantine/core'
export function AddNewNoteForm({ directory = [] }) {
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: ''
    },
    validate: {
      name: (name) =>
        name.length > 20
          ? 'Name must be 20 characters or less'
          : directory.includes(name)
            ? 'Collection already exists'
            : null
    }
  })

  async function createCollection(values) {
    try {
      const response = await window.electron.ipcRenderer.invoke('createCollection', values)
      if (response.success) {
        close()
      } else {
        throw response.error
      }
    } catch (error) {
      form.setErrors({ name: error })
    }
  }

  return (
    <form onSubmit={form.onSubmit((values) => createCollection(values))}>
      <TextInput
        label="Name"
        data-autofocus
        placeholder="Quantum Tunneling"
        {...form.getInputProps('name')}
      />
      <Group justify="flex-end" mt="md">
        <Button disabled={form.getTransformedValues().name.length == 0} color="teal" type="submit">
          Create
        </Button>
      </Group>
    </form>
  )
}
