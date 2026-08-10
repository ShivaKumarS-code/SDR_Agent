import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Layers,
  History,
  Menu,
  X,
  LogOut,
  Loader2,
} from 'lucide-react'
import Dashboard from '@/pages/Dashboard'
import Generations from '@/pages/Generations'
import HistoryPage from '@/pages/HistoryPage'
import Auth from '@/pages/Auth'
import { fetchMeApi, logoutApi, type User, type BackendGeneration } from '@/services/api'

type Page = 'dashboard' | 'generations' | 'history'

const navItems: { label: string; icon: typeof LayoutDashboard; page: Page }[] = [
  { label: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
  { label: 'Generations', icon: Layers, page: 'generations' },
  { label: 'History', icon: History, page: 'history' },
]

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activePage, setActivePage] = useState<Page>('dashboard')
  const [user, setUser] = useState<User | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [selectedGeneration, setSelectedGeneration] = useState<BackendGeneration | null>(null)

  useEffect(() => {
    fetchMeApi()
      .then((u) => {
        setUser(u)
        setLoadingAuth(false)
      })
      .catch(() => {
        setUser(null)
        setLoadingAuth(false)
      })
  }, [])

  const handleLogout = () => {
    logoutApi()
    setUser(null)
    setActivePage('dashboard')
  }

  const navigateTo = (page: Page) => {
    if (page === 'generations') {
      setSelectedGeneration(null)
    }
    setActivePage(page)
    setSidebarOpen(false)
  }

  const handleSelectHistoryItem = (gen: BackendGeneration) => {
    setSelectedGeneration(gen)
    setActivePage('generations')
    setSidebarOpen(false)
  }

  if (loadingAuth) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#080808] text-white gap-3">
        <Loader2 className="h-8 w-8 text-violet-400 animate-spin-slow" />
        <p className="text-sm text-[#888]">Loading SDR Agent...</p>
      </div>
    )
  }

  if (!user) {
    return <Auth onSuccess={(u) => setUser(u)} />
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} />
      case 'generations':
        return <Generations initialGeneration={selectedGeneration} />
      case 'history':
        return (
          <HistoryPage
            onSelectGeneration={handleSelectHistoryItem}
            onNavigateToNew={() => navigateTo('generations')}
          />
        )
      default:
        return <Dashboard onNavigate={navigateTo} />
    }
  }

  const avatarInitial = user.name ? user.name[0].toUpperCase() : 'U'

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#080808' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: '#0c0c0c',
          borderRight: '1px solid #1c1c1c',
        }}
      >
        {/* Sidebar header / branding */}
        <div
          className="flex h-16 shrink-0 items-center justify-between px-6 box-border"
          style={{ borderBottom: '1px solid #1c1c1c' }}
        >
          <div className="flex items-center gap-3">
            <img
              src="/icon.png"
              alt="SDR Agent Logo"
              className="h-11 w-11 rounded-full object-cover shrink-0 shadow-lg border border-[#2a2a2a]"
            />
            <span className="text-lg font-extrabold tracking-tight text-white">
              SDR Agent
            </span>
          </div>
          <button
            className="p-1 rounded-lg text-[#888] hover:bg-[#181818] lg:hidden cursor-pointer transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activePage === item.page
            return (
              <button
                key={item.label}
                onClick={() => navigateTo(item.page)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#000000' : '#888888',
                  boxShadow: isActive
                    ? '0 1px 3px rgba(0,0,0,0.3)'
                    : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#181818'
                    e.currentTarget.style.color = '#ffffff'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#888888'
                  }
                }}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* User footer */}
        <div
          className="p-4 flex items-center justify-between"
          style={{
            borderTop: '1px solid #1c1c1c',
            backgroundColor: '#0a0a0a',
          }}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-black text-sm font-extrabold uppercase shrink-0 shadow-sm">
              {avatarInitial}
            </div>
            <div className="overflow-hidden space-y-0.5">
              <p className="text-sm font-extrabold text-white truncate leading-tight">
                {user.name}
              </p>
              <p className="text-xs font-medium text-[#888] truncate leading-tight">
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            className="p-2 rounded-lg text-[#888] hover:text-red-400 hover:bg-[#181818] cursor-pointer transition-colors shrink-0"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Mobile menu toggle button */}
        <button
          type="button"
          className="fixed top-4 left-4 z-40 p-2 rounded-lg text-[#888] bg-[#141414] border border-[#262626] hover:bg-[#181818] lg:hidden cursor-pointer transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Page content viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}