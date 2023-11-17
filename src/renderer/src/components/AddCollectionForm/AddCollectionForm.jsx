/* eslint-disable react/prop-types */
import { useState } from 'react'
import { TextInput, Group, Button } from '@mantine/core'
import { useForm } from '@mantine/form'

export function AddCollectionForm({ collections }) {
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
    try {
      const response = await window.electron.ipcRenderer.invoke('createCollection', values)
    } catch (error) {
      console.error('Error fetching note file names:', error)
    }
  }

  return (
    <form onSubmit={form.onSubmit((values) => createCollection(values))}>
      <TextInput label="Name" placeholder="Organic Chemistry" {...form.getInputProps('name')} />
      <Group justify="flex-end" mt="md">
        <Button type="submit">Create</Button>
      </Group>
    </form>
  )
}
