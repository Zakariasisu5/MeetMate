import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight,
  CheckCircle,
  Shield,
  Calendar,
  Wallet,
  Linkedin,
  Zap,
  Users
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useFirebaseAuth } from '../hooks/useFirebaseAuth'
import Logo from '../components/Logo'

const Auth = () => {
  const navigate = useNavigate()
  const { signUp, signIn, signInWithGoogle, resetPassword } = useFirebaseAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [emailForm, setEmailForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })

  const [isSignUp, setIsSignUp] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (isSignUp && emailForm.password !== emailForm.confirmPassword) {
      toast.error('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      if (isSignUp) {
        await signUp(emailForm.email, emailForm.password, emailForm.name)
        toast.success('Account created successfully!')
      } else {
        await signIn(emailForm.email, emailForm.password)
        toast.success('Logged in successfully!')
      }
      
      navigate('/')
    } catch (error: any) {
      const errorMessage = error.message || 'Authentication failed'
      toast.error(errorMessage)
      console.error('Auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!emailForm.email) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)
    try {
      await resetPassword(emailForm.email)
      toast.success('Password reset email sent to your email!')
    } catch (error) {
      toast.error('Failed to send password reset email')
      console.error('Password reset error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletConnect = () => {
    toast('Connecting wallet...', { icon: '🔗' })
    // TODO: Implement actual wallet connection
  }

  const handleLinkedInSignIn = () => {
    toast('LinkedIn sign-in coming soon!', { icon: '💼' })
    // TODO: Implement LinkedIn OAuth with Firebase
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signInWithGoogle()
      toast.success('Signed in with Google successfully!')
      navigate('/')
    } catch (error: any) {
      toast.error('Failed to sign in with Google')
      console.error('Google sign-in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Enterprise-grade security with Web3 wallet support and OAuth integration'
    },
    {
      icon: Zap,
      title: 'One-Click Onboarding',
      description: 'Connect your wallet or LinkedIn profile in seconds'
    },
    {
      icon: Users,
      title: 'AI-Powered Matching',
      description: 'Advanced algorithms find the perfect connections for your goals'
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="w-full max-w-md p-8 bg-background rounded-2xl shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to MeetMate</h1>
          <p className="text-muted-foreground">Sign in or create an account to continue</p>
        </div>
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input
                id="name"
                type="text"
                value={emailForm.name}
                onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-secondary/20 border border-border/30 rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                placeholder="Enter your full name"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-3 bg-secondary/20 border border-border/30 rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={emailForm.password}
                onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                required
                className="w-full pr-10 pl-4 py-3 bg-secondary/20 border border-border/30 rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={emailForm.confirmPassword}
                onChange={(e) => setEmailForm({ ...emailForm, confirmPassword: e.target.value })}
                required
                className="w-full px-4 py-3 bg-secondary/20 border border-border/30 rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                placeholder="Confirm your password"
              />
            </div>
          )}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 px-6 rounded-2xl font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
          
        </form>
        <div className="flex flex-col items-center mt-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-500 to-yellow-500 text-white py-3 px-6 rounded-2xl font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed mb-2"
          >
            <span>Sign in with Google</span>
          </button>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:text-primary/80 transition-colors duration-300 mt-2"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth
