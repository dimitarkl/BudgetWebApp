import { Header } from './components/header/Header'
import { ThemeProvider } from "@/components/ui/theme-provider"
import Login from './components/login/Login'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Register from './components/register/Register'
import UserContext from './components/contexts/UserContext'
import { auth } from './lib/firebase'
import { useEffect, useState } from 'react'
import GuestHome from '@/components/home/GuestHome'
import { ExpenseEntry } from './components/expense-entry/ExpenseEntry'
import { RouteGuard } from './route-guard/RouteGuard'
import { AuthGuard } from './route-guard/AuthGuard'
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
        <main>
          <Routes>
            <Route path='/' element={<GuestHome />} />
            <Route path='/login' element=
              {
                <AuthGuard user={loggedIn} >
                  <Login />
                </AuthGuard>
              }
            />
            <Route path='/register' element={
              <AuthGuard user={loggedIn} >
                <Register />
              </AuthGuard>
            } />
            <Route path='/expense' element={
              <RouteGuard user={loggedIn} >
                <ExpenseEntry />
              </RouteGuard>
            } />
          </Routes>
        </main>
      </ThemeProvider>
    </UserContext.Provider>
  )
}

export default App
