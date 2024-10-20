import Home from '@/components/home/Home'
import { Header } from './components/header/Header'
import { ThemeProvider } from "@/components/ui/theme-provider"
function App() {

  return (

    <ThemeProvider defaultTheme="dark" >
      <Header />
      <main>
        <Home />
      </main>
    </ThemeProvider>
  )
}

export default App
