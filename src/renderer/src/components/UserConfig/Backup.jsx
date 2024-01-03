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
  Divider,
  ScrollArea
} from '@mantine/core'

export function Backup() {
  const { config, setConfig } = useConfigContext()

  const form = useForm({
    initialValues: {
      firstName: config.firstName,
      lastName: config.lastName,
      fileHeader: config.fileHeader
    },
    validateInputOnChange: true,
    validate: {
      firstName: (name) => (name.length > 25 ? 'Name must be 25 characters or less' : null),
      lastName: (name) => (name.length > 25 ? 'Name must be 25 characters or less' : null)
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
                label="First Name"
                placeholder="First Name"
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Last Name"
                placeholder="Last Name"
                {...form.getInputProps('lastName')}
                mt="sm"
              />
            </Fieldset>
            <Fieldset mt="20px" legend="File Header">
              <UnstyledButton w="100%" onClick={() => form.setFieldValue('fileHeader', 0)}>
                <Box
                  bg={form.values.fileHeader == 0 ? 'green.9' : 'gray.9'}
                  w="100%"
                  p="10px"
                  style={{ borderRadius: 5 }}
                >
                  No Header
                </Box>
              </UnstyledButton>
              <UnstyledButton w="100%" mt={8} onClick={() => form.setFieldValue('fileHeader', 1)}>
                <Box
                  bg={form.values.fileHeader == 1 ? 'green.9' : 'gray.9'}
                  w="100%"
                  p="10px"
                  style={{ borderRadius: 5 }}
                >
                  <Box bg="black" w="100%" p="8px" style={{ borderRadius: 5 }}>
                    <Text size="xl">[File Name]</Text>
                    <Text>[Your Name]</Text>
                    <Text>[Created Date]</Text>
                    <Divider my="xs" />
                  </Box>
                </Box>
              </UnstyledButton>
              <UnstyledButton w="100%" mt={8} onClick={() => form.setFieldValue('fileHeader', 2)}>
                <Box
                  bg={form.values.fileHeader == 2 ? 'green.9' : 'gray.9'}
                  w="100%"
                  p="10px"
                  style={{ borderRadius: 5 }}
                >
                  <Box bg="black" w="100%" p="8px" style={{ borderRadius: 5, textAlign: 'center' }}>
                    <Text size="xl">[File Name]</Text>
                    <Text>[Your Name]</Text>
                    <Text>[Created Date]</Text>
                    <Divider my="xs" />
                  </Box>
                </Box>
              </UnstyledButton>
              <UnstyledButton w="100%" mt={8} onClick={() => form.setFieldValue('fileHeader', 3)}>
                <Box
                  bg={form.values.fileHeader == 3 ? 'green.9' : 'gray.9'}
                  w="100%"
                  p="10px"
                  style={{ borderRadius: 5 }}
                >
                  <Box bg="black" w="100%" p="8px" style={{ borderRadius: 5 }}>
                    <Text size="xl">[File Name]</Text>
                    <Text>[Created Date]</Text>
                    <Divider my="xs" />
                  </Box>
                </Box>
              </UnstyledButton>
              <UnstyledButton w="100%" mt={8} onClick={() => form.setFieldValue('fileHeader', 4)}>
                <Box
                  bg={form.values.fileHeader == 4 ? 'green.9' : 'gray.9'}
                  w="100%"
                  p="10px"
                  style={{ borderRadius: 5 }}
                >
                  <Box
                    bg="black"
                    w="100%"
                    p="16px"
                    style={{ borderRadius: 5, textAlign: 'center' }}
                  >
                    <Text size="xl">[File Name]</Text>
                    <Text>[Created Date]</Text>
                    <Divider my="xs" />
                  </Box>
                </Box>
              </UnstyledButton>
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
