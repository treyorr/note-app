import { AppShell } from '@mantine/core'

import { NavbarSearch } from './components/NavBar/NabarSearch'

function App() {
  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: 'sm' }} padding="lg">
      <AppShell.Header>
        <div>Logo</div>
      </AppShell.Header>

      <AppShell.Navbar>
        <NavbarSearch />
      </AppShell.Navbar>

      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  )
}
export default App
