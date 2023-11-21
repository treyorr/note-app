import { AppShell } from '@mantine/core'

import { NavbarSearch } from './components/NavBar/NabarSearch'
import { useFileContext } from './FileContext'

function App() {
  const { currentOpenFile, setFile } = useFileContext()
  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: 'sm' }} padding="lg">
      <AppShell.Header>
        <div>Logo</div>
      </AppShell.Header>

      <AppShell.Navbar>
        <NavbarSearch />
      </AppShell.Navbar>

      <AppShell.Main>{JSON.stringify(currentOpenFile)}</AppShell.Main>
    </AppShell>
  )
}
export default App
