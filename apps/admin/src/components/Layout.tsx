import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  LogOut,
  Search,
  Bell,
  Settings,
  Menu,
  X,
  ChevronDown,
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
]

export default function Layout({ children, onLogout }: LayoutProps) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

        {/* Settings & Logout */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link
            to="/settings"
            className={`flex items-center ${
              sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-2'
            } py-3 rounded-xl text-gray-600 hover:bg-gray-100 w-full transition-all duration-200 group relative`}
          >
            <Settings className={`${sidebarOpen ? 'h-5 w-5' : 'h-6 w-6'}`} />
            {sidebarOpen && <span className="font-medium">Settings</span>}
            {!sidebarOpen && (
              <span className="absolute left-full ml-6 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                Settings
              </span>
            )}
          </Link>

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
          <div className="flex items-center justify-between px-8 py-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, orders, users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      // Navigate to search results or filter current view
                      console.log('Searching for:', searchQuery)
                      // You can implement navigation here if needed
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 ml-6">
              {/* Notifications */}
              {/* <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">Notifications</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                        <p className="text-sm font-medium text-gray-900">New order received</p>
                        <p className="text-xs text-gray-500 mt-1">Order #12345 - ₹2,499.00</p>
                        <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                        <p className="text-sm font-medium text-gray-900">Product out of stock</p>
                        <p className="text-xs text-gray-500 mt-1">Organic Vegetables Pack</p>
                        <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                        <p className="text-sm font-medium text-gray-900">New user registered</p>
                        <p className="text-xs text-gray-500 mt-1">john.doe@example.com</p>
                        <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                      </div>
                    </div>
                    <div className="px-4 py-3 border-t border-gray-100">
                      <button className="text-sm text-[#27AE60] hover:text-[#229954] font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div> */}

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-[#27AE60] to-[#229954] rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-semibold text-gray-800">Admin User</p>
                    <p className="text-xs text-gray-500">admin@riyansh.com</p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      profileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">Admin User</p>
                      <p className="text-xs text-gray-500">admin@riyansh.com</p>
                    </div>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Profile Settings
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Preferences
                    </button>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={onLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
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
