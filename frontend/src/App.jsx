import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import NavBar from './components/Navbar'

import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'

import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'

import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

const App = () => {

  const {authUser, checkAuth, isCheckingAuth, onlineUsers}= useAuthStore();
  console.log({onlineUsers});

  const {theme}= useThemeStore();

  useEffect(()=>{
    checkAuth();
  },[]);

  console.log({authUser});

  if(isCheckingAuth && !authUser)
  {
    return(
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    );
  }

  return (
    <div data-theme= {theme}>
      <NavBar/>

      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to='/login'/>}/>
        <Route path='/signup' element={!authUser ? <SignupPage/> : <Navigate to='/'/>}/>
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to='/'/>}/>
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to='/login'/>}/>
        <Route path='/settings' element={<SettingsPage/>}/>
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App
