import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Home, 
  User, 
  Heart, 
  Calendar, 
  BarChart3,
  LogOut,
  Settings,
  Bell
} from 'lucide-react'
import { useFirebaseAuth } from '../hooks/useFirebaseAuth'
import Logo from './Logo'
import ThemeToggle from './ui/ThemeToggle'
import Footer from './Footer'
//import AIChat from './AIChat'
import AIChatbot from './AIChatbot'
import SettingsModal from './SettingsModal'
import { SettingsProvider, useSettings } from '../contexts/SettingsContext'



const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  // Demo notifications (two items)
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'New match with Alex', time: '2m ago', read: false },
    { id: 'n2', title: 'Event reminder: Team Sync', time: '1h ago', read: false }
  ])
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, userProfile, signOut } = useFirebaseAuth()
  const { settings } = useSettings()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Matches', href: '/matches', icon: Heart },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/auth')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const isActive = (path: string) => location.pathname === path



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Logo />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MeetMate
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />
              {/* Settings button */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {/* Notifications */}
              <div className="relative">
                <button
                  className={`relative p-2 ${settings.notificationsEnabled ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-white/30 cursor-not-allowed'} rounded-lg transition-all duration-200`}
                  onClick={() => {
                    if (!settings.notificationsEnabled) return
                    setIsNotifOpen(!isNotifOpen)
                    // mark all demo notifications as read when opening
                    if (!isNotifOpen) setNotifications((prev) => prev.map(n => ({ ...n, read: true })))
                  }}
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {/* Unread badge */}
                  {settings.notificationsEnabled && notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] px-1.5 py-0.5">{notifications.filter(n => !n.read).length}</span>
                  )}
                </button>
                <AnimatePresence>
                  {isNotifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 py-2 z-50"
                    >
                      <div className="px-4 py-2 text-sm text-white/80">Notifications</div>
                      <div className="border-t border-white/10 my-1" />
                      <div className="max-h-56 overflow-y-auto">
                        {notifications.length === 0 && (
                          <div className="px-4 py-2 text-sm text-white/60">No notifications.</div>
                        )}
                        {notifications.map((n) => (
                          <div key={n.id} className={`px-4 py-3 text-sm ${n.read ? 'text-white/60' : 'text-white'} hover:bg-white/5 cursor-default`}>
                            <div className="font-semibold">{n.title}</div>
                            <div className="text-xs mt-1 text-white/50">{n.time}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {userProfile?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-white">
                    {userProfile?.name || user?.email || 'User'}
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 py-2 z-50"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <div className="border-t border-white/10 my-1" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full transition-all duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-white/10 bg-white/5 backdrop-blur-md"
            >
              <div className="px-4 py-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                          : 'text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
                <div className="border-t border-white/10 my-2" />
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
  <SettingsModal open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <AIChatbot />
      {/*<AIChat />*/}
     
    </div>
  )
}

export default Layout
