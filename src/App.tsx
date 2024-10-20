import Home from '@/components/home/Home'
import { Header } from './components/header/Header'
import { ThemeProvider } from "@/components/ui/theme-provider"
import Login from './components/login/Login'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Register from './components/register/Register'
import UserContext from './components/contexts/UserContext'
import { auth } from './lib/firebase'
import { useEffect, useState } from 'react'
function App() {
  const [loggedIn, setLoggedIn] = useState(auth.currentUser);
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setLoggedIn(user));
    return () => unsubscribe();
  }, [])
  return (
    <UserContext.Provider value={loggedIn}>
      <ThemeProvider defaultTheme="dark" >
        <Header />
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={< Login />} />
            <Route path='/register' element={< Register />} />
          </Routes>
        </main>

      </ThemeProvider>
    </UserContext.Provider>
  )
}

export default App
