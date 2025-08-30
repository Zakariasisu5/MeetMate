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

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, userProfile, signOut } = useFirebaseAuth()

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
              
              {/* Notifications */}
              <div className="relative">
                <button
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                >
                  <Bell className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {isNotifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 py-2 z-50"
                    >
                      <div className="px-4 py-2 text-sm text-white/80">Notifications</div>
                      <div className="border-t border-white/10 my-1" />
                      <div className="px-4 py-2 text-sm text-white/60">No new notifications.</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {userProfile?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-white">
                    {userProfile?.name || user?.email || 'User'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isMenuOpen && (
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
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
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
      <br/><br/>
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Layout
