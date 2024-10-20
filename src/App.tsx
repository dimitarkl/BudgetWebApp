import { Header } from './components/header/Header'
import { ThemeProvider } from "@/components/ui/theme-provider"
function App() {

  return (
    <>
      <ThemeProvider defaultTheme="dark" >
        <Header />
      </ThemeProvider>
    </>
  )
}

export default App
