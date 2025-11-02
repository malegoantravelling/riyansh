import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Shield, Lock, User, Loader2, AlertCircle } from 'lucide-react'
import { api } from '@/lib/api'

interface LoginProps {
  onLogin: () => void
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await api.post('/api/auth/admin/login', { username, password })

      if (data.token) {
        localStorage.setItem('admin_token', data.token)
        onLogin()
      } else {
        setError('Invalid credentials')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#27AE60] via-[#229954] to-[#1E8449] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md px-6 relative z-10">
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 animate-scale-in">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#27AE60] to-[#229954] rounded-2xl mb-4 shadow-lg shadow-green-500/30">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-[#2C3E50]">RIY</span>
              <span className="text-[#27AE60]">ANSH</span>
            </h1>
            <p className="text-gray-600 font-medium">Admin Panel</p>
            <p className="text-sm text-gray-500 mt-1">Secure access to your dashboard</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2 animate-slide-in">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <Label htmlFor="username" className="text-gray-700 font-semibold">
                Username
              </Label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-11 h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-gray-700 font-semibold">
                Password
              </Label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-11 pr-11 h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#27AE60] border-gray-300 rounded focus:ring-[#27AE60] focus:ring-2"
                />
                <span className="text-sm text-gray-600 font-medium">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#27AE60] hover:text-[#229954] font-semibold transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#27AE60] to-[#229954] hover:from-[#229954] hover:to-[#1E8449] text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] btn-shine"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Default Credentials Info */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
            <p className="text-xs font-semibold text-gray-700 mb-2 text-center">
              🔐 Default Credentials
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Username</p>
                <p className="font-mono font-semibold text-gray-900 bg-white px-3 py-1 rounded-lg">
                  admin
                </p>
              </div>
              <div className="text-gray-300">|</div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Password</p>
                <p className="font-mono font-semibold text-gray-900 bg-white px-3 py-1 rounded-lg">
                  admin123
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm mt-6">
          © 2024 Riyansh. All rights reserved.
        </p>
      </div>
    </div>
  )
}
