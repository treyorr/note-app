import { useForm } from '@mantine/form'
import { useConfigContext } from '../../context/ConfigContext'
import {
  Button,
  Center,
  Fieldset,
  TextInput,
  Text,
  UnstyledButton,
  Box,
  Stepper,
  Group,
  ScrollArea
} from '@mantine/core'
import { IconArrowLeft, IconArrowRight, IconDeviceFloppy } from '@tabler/icons-react'
import { useState } from 'react'

export function BackupConfig() {
  const [active, setActive] = useState(0)
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current))
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current))
  const { config, setConfig } = useConfigContext()

  const form = useForm({
    initialValues: {
      ghRepo: config.ghRepo
    },
    validateInputOnChange: true,
    validate: {
      ghRepo: (repo) => (repo.length > 70 ? 'GitHub Repo URL must be 70 characters or less' : null)
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
            <Stepper active={active}>
              <Stepper.Step label="First step" description="Generate SSH Key">
                Step 1 content: Create an account
              </Stepper.Step>
              <Stepper.Step label="Second step" description="Create Repository">
                Step 2 content: Verify email
              </Stepper.Step>
              <Stepper.Step label="Final step" description="Connect">
                Step 3 content: Get full access
              </Stepper.Step>
              <Stepper.Completed>
                Completed, click back button to get to previous step
              </Stepper.Completed>
            </Stepper>

            <Group justify="right" mt="xl">
              {active > 0 && (
                <Button leftSection={<IconArrowLeft />} variant="default" onClick={prevStep}>
                  Back
                </Button>
              )}
              {active < 3 && (
                <Button rightSection={<IconArrowRight />} onClick={nextStep}>
                  Next step
                </Button>
              )}
            </Group>
          </div>
        </Center>
      </form>
    </ScrollArea>
  )
}
