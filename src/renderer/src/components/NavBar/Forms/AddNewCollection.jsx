/* eslint-disable react/prop-types */
import { TextInput, Group, Button } from '@mantine/core'
import { useForm } from '@mantine/form'

export function AddNewCollection({ collections, close, fetchCollections }) {
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
      sname: values.name
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
    <form onSubmit={form.onSubmit((values) => createCollection(values))}>
      <TextInput label="Name" data-autofocus placeholder="School" {...form.getInputProps('name')} />
      <Group justify="flex-end" mt="md">
        <Button disabled={form.getTransformedValues().name.length == 0} color="teal" type="submit">
          Create
        </Button>
      </Group>
    </form>
  )
}
