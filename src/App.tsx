import { auth } from './lib/firebase'
import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import Header from './components/header/Header'
import ThemeProvider from "@/components/ui/theme-provider"
import Login from './components/login/Login'
import Register from './components/register/Register'
import UserContext from './components/contexts/UserContext'
import AuthGuard from './route-guard/AuthGuard'
import Dashboard from './components/home/Dashboard'
import LandingPage from '@/components/home/LandingPage'

function App() {
  const [loggedIn, setLoggedIn] = useState(auth.currentUser);
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setLoggedIn(user));
    return () => unsubscribe();
  }, [])
  const logout = async () => {
    try {
      await auth.signOut();
      navigate('/')
    } catch (error) {
      console.error('Logout error: ', error);
    }
  }
  return (
    <UserContext.Provider value={loggedIn}>
      <ThemeProvider defaultTheme="dark" >
        <Header logout={logout} />
        <Routes>
          {loggedIn
            ? <Route path='/' element={<Dashboard />} />
            : <Route path='/' element={<LandingPage />} />}
          <Route path='/login' element=
            {
              <AuthGuard user={loggedIn} ><Login /></AuthGuard>
            }
          />
          <Route path='/register' element=
            {
              <AuthGuard user={loggedIn} ><Register /></AuthGuard>
            }
          />
        </Routes>
      </ThemeProvider>
    </UserContext.Provider>
  )
}

export default App
