import { AppShell } from '@mantine/core'

import { NavbarSearch } from './components/NavBar/NabarSearch'
import { useFileContext } from './context/FileContext'
import { NoteEditor } from './components/Editor/Editor'
import { Settings } from './components/UserConfig/Settings'

function App() {
  const { currentOpenFile } = useFileContext()

  function getMainSection() {
    if (currentOpenFile == null) {
      return <Settings />
    } else if (currentOpenFile.length > 0) {
      return <NoteEditor />
    } else {
      return null
    }
  }
  return (
    <AppShell navbar={{ width: 300, breakpoint: 'sm' }}>
      <AppShell.Navbar>
        <NavbarSearch />
      </AppShell.Navbar>
      <AppShell.Main>{getMainSection()}</AppShell.Main>
    </AppShell>
  )
}
export default App
