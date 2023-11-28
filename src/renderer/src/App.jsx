import { AppShell } from '@mantine/core'

import { NavbarSearch } from './components/NavBar/NabarSearch'
import { useFileContext } from './FileContext'
import { NoteEditor } from './components/Editor/Editor'

function App() {
  const { currentOpenFile, setFile } = useFileContext()
  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: 'sm' }}>
      <AppShell.Header>
        <div>Logo</div>
      </AppShell.Header>

      <AppShell.Navbar>
        <NavbarSearch />
      </AppShell.Navbar>

      <AppShell.Main>{currentOpenFile.length > 0 ? <NoteEditor /> : null}</AppShell.Main>
    </AppShell>
  )
}
export default App
