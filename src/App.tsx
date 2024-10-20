import Home from '@/components/home/Home'
import { Header } from './components/header/Header'
import { ThemeProvider } from "@/components/ui/theme-provider"
import Login from './components/login/Login'
import { Route, Routes } from 'react-router-dom'
function App() {

  return (

    <ThemeProvider defaultTheme="dark" >
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={< Login />} />
        </Routes>
      </main>

    </ThemeProvider>
  )
}

export default App
