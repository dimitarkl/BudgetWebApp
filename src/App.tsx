import { auth } from './lib/firebase'
import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import Header from './components/header/Header'
import ThemeProvider from "@/components/contexts/theme-provider"
import Login from './components/login/Login'
import Register from './components/register/Register'
import UserContext from './components/contexts/UserContext'
import AuthGuard from './components/route-guard/AuthGuard'
import Dashboard from './components/home/Dashboard'
import LandingPage from '@/components/home/LandingPage'
import NotFoundPage from './components/not-found/NotFound'
import RouteGuard from './components/route-guard/RouteGuard'
import AllTransactionsPage from './components/all-transactions/AllTransactionsPage'
import { ErrorProvider } from './components/contexts/ErrorContext'

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
			<ErrorProvider>
				<ThemeProvider defaultTheme="dark" >
					<Header logout={logout} />
					<Routes>

						<Route path='/dashboard' element={
							<RouteGuard user={loggedIn} ><Dashboard /></RouteGuard>
						} />
						<Route path='/' element=
							{
								<AuthGuard user={loggedIn} ><LandingPage /></AuthGuard>
							} />
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
						<Route path='/transactions' element=
							{
								<RouteGuard user={loggedIn} ><AllTransactionsPage /></RouteGuard>
							}
						/>
						<Route path='*' element={<NotFoundPage />} />
					</Routes>
				</ThemeProvider>
			</ErrorProvider>
		</UserContext.Provider >
	)
}

export default App
