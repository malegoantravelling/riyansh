import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
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
  // Desktop: collapsed/expanded icon sidebar. Mobile: hidden until drawer opens.
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Close mobile drawer when clicking outside
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mobileOpen])

  // Prevent body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const currentLabel = menuItems.find((m) => m.path === location.pathname)?.label ?? 'Admin'

  return (
    <div className="flex h-dvh bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar (desktop: always visible / mobile: slide-over drawer) ── */}
      <aside
        ref={drawerRef}
        className={[
          // Base
          'flex flex-col bg-white border-r border-gray-200 shadow-xl transition-all duration-300',
          // Desktop behaviour
          'lg:relative lg:translate-x-0 lg:z-auto lg:flex-shrink-0',
          desktopCollapsed ? 'lg:w-20' : 'lg:w-64',
          // Mobile behaviour: fixed slide-in drawer
          'fixed top-0 left-0 h-full z-40',
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72',
          'lg:translate-x-0',
        ].join(' ')}
      >
        {/* Logo + desktop collapse toggle */}
        <div className="relative flex items-center justify-between p-5 border-b border-gray-200 min-h-[64px]">
          {/* Wordmark — hide when desktop sidebar is collapsed */}
          {!desktopCollapsed && (
            <div>
              <h1 className="text-xl font-bold leading-tight">
                <span className="text-[#1A1A1A]">RIY</span>
                <span className="text-[#5B8C51]">ANSH</span>
              </h1>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">Admin Panel</p>
            </div>
          )}

          {desktopCollapsed && (
            <div className="mx-auto w-9 h-9 bg-gradient-to-br from-[#5B8C51] to-[#4E7A46] rounded-lg flex items-center justify-center text-white font-bold">
              R
            </div>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={() => setDesktopCollapsed((v) => !v)}
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors z-10"
            aria-label={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight
              className={`h-3.5 w-3.5 text-gray-600 transition-transform duration-300 ${desktopCollapsed ? '' : 'rotate-180'}`}
            />
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden ml-auto p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={[
                  'flex items-center py-2.5 rounded-xl transition-all duration-150 group relative',
                  desktopCollapsed ? 'lg:justify-center lg:px-2 px-3' : 'px-3 gap-3',
                  !desktopCollapsed && 'gap-3',
                  isActive
                    ? 'bg-gradient-to-r from-[#5B8C51] to-[#4E7A46] text-white shadow-md shadow-green-500/20'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                ].join(' ')}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {/* Label: always visible in mobile drawer; hidden when desktop collapsed */}
                <span className={`font-medium text-sm whitespace-nowrap ${desktopCollapsed ? 'lg:hidden' : ''}`}>
                  {item.label}
                </span>
                {/* Tooltip on desktop collapsed */}
                {desktopCollapsed && (
                  <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 hidden lg:block">
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={onLogout}
            className={[
              'flex items-center w-full py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-150 group relative',
              desktopCollapsed ? 'lg:justify-center lg:px-2 px-3 gap-3' : 'px-3 gap-3',
            ].join(' ')}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={`font-medium text-sm whitespace-nowrap ${desktopCollapsed ? 'lg:hidden' : ''}`}>
              Logout
            </span>
            {desktopCollapsed && (
              <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 bg-red-600 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 hidden lg:block">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 min-h-[56px] sm:min-h-[64px]">
            {/* Left: hamburger (mobile) + breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Hamburger — only on mobile */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors -ml-1 shrink-0"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Current page label — mobile only */}
              <span className="lg:hidden font-semibold text-sm text-[#013220] truncate">
                {currentLabel}
              </span>
            </div>

            {/* Right: admin avatar */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-gray-800 leading-tight">Admin</p>
                <p className="text-[10px] text-gray-400 leading-tight">admin@riyansh.com</p>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-[#5B8C51] to-[#4E7A46] rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0 select-none">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
