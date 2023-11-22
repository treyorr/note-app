import { useForm } from '@mantine/form'
import { Group, Button, TextInput } from '@mantine/core'
export function AddNewSectionForm({ path, close, updateContents, openOnAdd }) {
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
      sname: values.name
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
    <form onSubmit={form.onSubmit((values) => createSection(values))}>
      <TextInput
        label="Name"
        data-autofocus
        placeholder="General Relativity"
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
