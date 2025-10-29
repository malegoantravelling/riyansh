import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  CreditCard,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
  onLogout: () => void
}

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/categories', label: 'Categories', icon: FolderTree },
  { path: '/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/users', label: 'Users', icon: Users },
  { path: '/transactions', label: 'Transactions', icon: CreditCard },
]

export default function Layout({ children, onLogout }: LayoutProps) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-72' : 'w-20'
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-xl relative`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 relative">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
          >
            {sidebarOpen ? (
              <X className="h-4 w-4 text-gray-600" />
            ) : (
              <Menu className="h-4 w-4 text-gray-600" />
            )}
          </button>

          {sidebarOpen ? (
            <div>
              <h1 className="text-2xl font-bold">
                <span className="text-[#2C3E50]">RIY</span>
                <span className="text-[#27AE60]">ANSH</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1 font-medium">Admin Panel</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-[#27AE60] to-[#229954] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                R
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${
                  sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-2'
                } py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#27AE60] to-[#229954] text-white shadow-lg shadow-green-500/30'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon
                  className={`${sidebarOpen ? 'h-5 w-5' : 'h-6 w-6'} ${
                    isActive ? 'animate-pulse' : ''
                  }`}
                />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full ml-6 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={onLogout}
            className={`flex items-center ${
              sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-2'
            } py-3 rounded-xl text-red-600 hover:bg-red-50 w-full transition-all duration-200 group relative`}
          >
            <LogOut className={`${sidebarOpen ? 'h-5 w-5' : 'h-6 w-6'}`} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
            {!sidebarOpen && (
              <span className="absolute left-full ml-6 px-2 py-1 bg-red-600 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-end px-8 py-4">
            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Admin User */}
              <div className="flex items-center space-x-3 px-4 py-2">
                <div className="w-9 h-9 bg-gradient-to-br from-[#27AE60] to-[#229954] rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500">admin@riyansh.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
