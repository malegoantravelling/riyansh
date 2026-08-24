import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Orders from './pages/Orders'
import Users from './pages/Users'
import Logs from './pages/Logs'
import Layout from './components/Layout'
import { ADMIN_AUTH_EXPIRED_EVENT, api } from './lib/api'

function App() {
  const [authReady, setAuthReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    let cancelled = false

    const syncAuth = async () => {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        if (!cancelled) {
          setIsAuthenticated(false)
          setAuthReady(true)
        }
        return
      }

      const valid = await api.validateAdminSession()
      if (!cancelled) {
        setIsAuthenticated(valid)
        setAuthReady(true)
      }
    }

    void syncAuth()

    const onExpired = () => setIsAuthenticated(false)
    window.addEventListener(ADMIN_AUTH_EXPIRED_EVENT, onExpired)
    return () => {
      cancelled = true
      window.removeEventListener(ADMIN_AUTH_EXPIRED_EVENT, onExpired)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
  }

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f5f2] text-sm text-[#80866e]">
        Checking admin session…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Layout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/users" element={<Users />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
