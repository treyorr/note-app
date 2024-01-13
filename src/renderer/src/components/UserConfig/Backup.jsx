import { useForm } from '@mantine/form'
import { useConfigContext } from '../../context/ConfigContext'
import { Button, Center, Fieldset, TextInput, ScrollArea, PasswordInput } from '@mantine/core'

export function Backup() {
  const { config, setConfig } = useConfigContext()

  const form = useForm({
    initialValues: {
      ghUsername: config.ghUsername,
      ghPassword: config.ghPassword,
      ghRepo: config.ghRepo
    },
    validateInputOnChange: true,
    validate: {
      ghUsername: (username) =>
        username.length < 3
          ? ''
          : username.length > 25
            ? 'Username must be 25 characters or less'
            : null,
      ghPassword: (password) =>
        password.length < 3
          ? ''
          : password.length > 25
            ? 'Password must be 25 characters or less'
            : null,
      ghRepo: (url) => (url.length < 3 ? '' : null)
    }
  })

  function applyConfiguration(values) {
    setConfig(values)
    form.setInitialValues(values)
  }

  return (
    <ScrollArea h="100vh">
      <form onSubmit={form.onSubmit((values) => applyConfiguration(values))}>
        <Center>
          <div style={{ width: '75%', marginTop: '30px' }}>
            <Fieldset legend="GitHub Info">
              <TextInput
                label="Username"
                placeholder="Username"
                {...form.getInputProps('ghUsername')}
              />
              <PasswordInput
                label="Password"
                placeholder="Password"
                {...form.getInputProps('ghPassword')}
                mt="sm"
              />
              <TextInput
                label="GitHub Repo URL"
                placeholder="GitHub Repo URL"
                {...form.getInputProps('ghRepo')}
                mt="sm"
              />
            </Fieldset>
            <Button
              size="lg"
              type="submit"
              my="20px"
              disabled={!form.isDirty() || !form.isValid()}
              fullWidth
              color="blue"
            >
              Apply Configuration
            </Button>
          </div>
        </Center>
      </form>
    </ScrollArea>
  )
}
