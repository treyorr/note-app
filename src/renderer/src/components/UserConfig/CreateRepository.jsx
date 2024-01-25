import { Button, TextInput } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

export default function CreateRepository({ form, config }) {
  return (
    <>
      <TextInput
        mt="sm"
        label="Create a private Github Repository and paste the SSH URL here"
        placeholder="git@github.com:username/notes.git"
        description="If you have sensitive information, you should make the notes private"
        {...form.getInputProps('ghRepo')}
      />
      <Button
        disabled={form.values.ghRepo == config.ghRepo}
        color="green"
        mt="md"
        type="submit"
        rightSection={<IconPlus />}
      >
        Set Repository
      </Button>
    </>
  )
}
