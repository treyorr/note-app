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
import CreateRepository from './CreateRepository'
import GenerateSSH from './GenerateSSH'
import ConnectGit from './ConnectGit'

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

  function isNextDisabled() {
    if (active == 0) {
      return config.ghRepo.length == 0
    } else if (active == 1) {
      return config.sshKey.length == 0
    } else if (active == 2) {
      return config.gitConnected == false
    }
  }
  console.log(config)
  return (
    <ScrollArea h="100vh">
      <form onSubmit={form.onSubmit((values) => applyConfiguration(values))}>
        <Center>
          <div
            style={{
              width: '75%',
              marginTop: '30px',
              border: '1px solid gray',
              borderRadius: '7px',
              padding: '20px'
            }}
          >
            <Stepper active={active}>
              <Stepper.Step label="First step" description="Create Repository">
                <CreateRepository form={form} config={config} />
              </Stepper.Step>
              <Stepper.Step label="Second step" description="Get SSH Key">
                <GenerateSSH />
              </Stepper.Step>
              <Stepper.Step label="Final step" description="Connect">
                <ConnectGit />
              </Stepper.Step>
              <Stepper.Completed>
                Setup completed! You can back up your notes any time.
              </Stepper.Completed>
            </Stepper>

            <Group justify="right" mt="xl">
              {active > 0 && (
                <Button leftSection={<IconArrowLeft />} variant="default" onClick={prevStep}>
                  Back
                </Button>
              )}
              {active < 3 && (
                <Button
                  disabled={isNextDisabled()}
                  rightSection={<IconArrowRight />}
                  onClick={nextStep}
                >
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
