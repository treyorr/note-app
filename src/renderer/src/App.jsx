import { AppShell } from '@mantine/core'

import { NavbarSearch } from './components/NavBar/NabarSearch'
import { useFileContext } from './FileContext'
import { NoteEditor } from './components/Editor/Editor'

function App() {
  const { currentOpenFile } = useFileContext()
  return (
    <AppShell navbar={{ width: 300, breakpoint: 'sm' }}>
      <AppShell.Navbar>
        <NavbarSearch />
      </AppShell.Navbar>
      <AppShell.Main>{currentOpenFile.length > 0 ? <NoteEditor /> : null}</AppShell.Main>
    </AppShell>
  )
}
export default App
