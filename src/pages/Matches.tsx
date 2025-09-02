import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AIChatbot from '../components/ui/AIChatbot'
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Star, 
  MapPin, 
  Building,
  Sparkles,
  Filter,
  Search,
  Heart,
  X,
  CheckCircle,
  Clock
} from 'lucide-react'

import toast from 'react-hot-toast'
import ApiService from '../services/api'
import { useFirebaseAuth } from '../hooks/useFirebaseAuth'

interface Match {
  id: string
  name: string
  title: string
  company: string
  location: string
  avatar: string
  matchScore: number
  skills: string[]
  interests: string[]
  goals: string[]
  bio: string
  isConnected: boolean
  isPending: boolean
}

const Matches = () => {
  const { user, userProfile } = useFirebaseAuth();
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [matches, setMatches] = useState<Match[]>([
    {
      id: '1',
      name: 'Anna Chen',
      title: 'Product Designer',
      company: 'DeFi Labs',
      location: 'San Francisco, CA',
  avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      matchScore: 94,
      skills: ['Product Design', 'UX Research', 'Figma', 'DeFi'],
      interests: ['DeFi', 'Product Design', 'AI/ML'],
      goals: ['Build meaningful connections', 'Learn from industry experts'],
      bio: 'Product designer passionate about creating intuitive DeFi experiences. Looking to connect with developers and product managers.',
      isConnected: false,
      isPending: false,
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      title: 'Smart Contract Developer',
      company: 'Ethereum Foundation',
      location: 'Berlin, Germany',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      matchScore: 87,
      skills: ['Solidity', 'Ethereum', 'DeFi Protocols', 'Rust'],
      interests: ['DeFi', 'Blockchain', 'Zero Knowledge'],
      goals: ['Collaborate on DeFi projects', 'Share knowledge'],
      bio: 'Smart contract developer working on DeFi protocols. Interested in ZK proofs and cross-chain solutions.',
      isConnected: false,
      isPending: false,
    },
    {
      id: '3',
      name: 'Sarah Kim',
      title: 'Growth Marketing Manager',
      company: 'Web3 Startup',
      location: 'Seoul, South Korea',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      matchScore: 82,
      skills: ['Growth Marketing', 'Community Building', 'Web3', 'Analytics'],
      interests: ['Web3', 'Community', 'Growth'],
      goals: ['Learn about Web3 marketing', 'Build community'],
      bio: 'Growth marketer focused on Web3 projects. Building communities and driving user acquisition.',
      isConnected: false,
      isPending: false,
    },
    {
      id: '4',
      name: 'David Thompson',
      title: 'AI Research Engineer',
      company: 'AI Research Lab',
      location: 'London, UK',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      matchScore: 78,
      skills: ['Machine Learning', 'Python', 'AI Research', 'Neural Networks'],
      interests: ['AI/ML', 'Research', 'Innovation'],
      goals: ['Collaborate on AI projects', 'Share research insights'],
      bio: 'AI researcher working on neural network architectures. Interested in AI applications in Web3.',
      isConnected: false,
      isPending: false,
    },
    {
      id: '5',
      name: 'Emily Carter',
      title: 'Community Lead',
      company: 'DAO Collective',
      location: 'Toronto, Canada',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      matchScore: 85,
      skills: ['Community Management', 'DAO Governance', 'Public Speaking'],
      interests: ['DAO', 'Community', 'Web3'],
      goals: ['Grow DAO membership', 'Host engaging events'],
      bio: 'Community lead for a DAO, passionate about decentralized governance and building strong member engagement.',
      isConnected: false,
      isPending: false,
    },
    {
      id: '6',
      name: 'James Lee',
      title: 'Full Stack Developer',
      company: 'Startup Hub',
      location: 'Singapore',
      avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
      matchScore: 80,
      skills: ['React', 'Node.js', 'TypeScript', 'UI/UX'],
      interests: ['Startups', 'Tech', 'Design'],
      goals: ['Build scalable apps', 'Network with founders'],
      bio: 'Full stack developer building scalable web apps for startups. Interested in design and founder networking.',
      isConnected: false,
      isPending: false,
    },
  ])

  const filters = [
    { id: 'all', label: 'All Matches', count: matches.length },
    { id: 'high', label: 'High Match (90%+)', count: matches.filter(m => m.matchScore >= 90).length },
    { id: 'medium', label: 'Medium Match (70-89%)', count: matches.filter(m => m.matchScore >= 70 && m.matchScore < 90).length },
    { id: 'pending', label: 'Pending', count: matches.filter(m => m.isPending).length },
  ]

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.company.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'high' && match.matchScore >= 90) ||
                         (selectedFilter === 'medium' && match.matchScore >= 70 && match.matchScore < 90) ||
                         (selectedFilter === 'pending' && match.isPending)
    
    return matchesSearch && matchesFilter
  })

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  const isProfileComplete = userProfile && userProfile.name && userProfile.bio && userProfile.avatar;
  const connectWithMatch = async (matchId: string) => {
    setLoadingId(matchId);
    setErrorId(null);
    if (!user) {
      toast.error('You must be logged in to connect. Please log in or complete your profile.');
      setLoadingId(null);
      return;
    }
    if (!isProfileComplete) {
      toast.error('Please complete your profile before connecting with others.');
      setLoadingId(null);
      return;
    }
    const senderId = localStorage.getItem('senderId') || '';
    try {
      localStorage.setItem('receiverId', matchId);
      setMatches(matches => matches.map(match =>
        match.id === matchId
          ? { ...match, isPending: true }
          : match
      ));
      toast.success('Connection request sent!');
      window.dispatchEvent(new CustomEvent('connection:added', { detail: { receiverId: matchId } }));
    } catch (err) {
      setErrorId(matchId);
      toast.error('Failed to send connection request.');
    } finally {
      setLoadingId(null);
    }
  }

  const messageMatch = async (matchId: string) => {
    setLoadingId(matchId);
    setErrorId(null);
    try {
      // Backend: send message
      await ApiService.chatWithAI({ prompt: `Hi ${matches.find(m => m.id === matchId)?.name}!`, context: matchId });
      toast.success('Message sent!');
    } catch (err) {
      setErrorId(matchId);
      toast.error('Failed to send message.');
    } finally {
      setLoadingId(null);
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            AI-Powered Matches
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Discover people who share your interests and goals at this conference
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-6"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, title, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                selectedFilter === filter.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Matches Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredMatches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="card space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={match.avatar}
                    alt={match.name}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">{match.name}</h3>
                    <p className="text-sm text-muted-foreground">{match.title}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(match.matchScore)}`}>
                  {match.matchScore}%
                </div>
              </div>

              {/* Company and Location */}
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Building className="h-4 w-4" />
                  <span>{match.company}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{match.location}</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {match.bio}
              </p>

              {/* Skills */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {match.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-xl"
                    >
                      {skill}
                    </span>
                  ))}
                  {match.skills.length > 3 && (
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-xl">
                      +{match.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Match Reasons */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Why you match</h4>
                <div className="space-y-1">
                  {match.interests.slice(0, 2).map((interest) => (
                    <div key={interest} className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-primary" />
                      <span>Both interested in {interest}</span>
                    </div>
                  ))}
                  {match.goals.slice(0, 1).map((goal) => (
                    <div key={goal} className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-primary" />
                      <span>Similar goal: {goal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                {match.isConnected ? (
                  <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-100 px-3 py-2 rounded-2xl w-full justify-center">
                    <CheckCircle className="h-4 w-4" />
                    <span>Connected</span>
                  </div>
                ) : match.isPending ? (
                  <div className="flex items-center space-x-2 text-sm text-yellow-600 bg-yellow-100 px-3 py-2 rounded-2xl w-full justify-center">
                    <Clock className="h-4 w-4" />
                    <span>Pending</span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => connectWithMatch(match.id)}
                      disabled={loadingId === match.id}
                      className={`btn-primary flex-1 flex items-center justify-center space-x-2 rounded-2xl px-4 py-2 font-semibold transition-all duration-200 ${loadingId === match.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Heart className="h-4 w-4" />
                      <span>{loadingId === match.id ? 'Connecting...' : 'Connect'}</span>
                    </button>
                    <button
                      onClick={() => messageMatch(match.id)}
                      disabled={loadingId === match.id}
                      className={`btn-secondary flex-1 flex items-center justify-center space-x-2 rounded-2xl px-4 py-2 font-semibold transition-all duration-200 ${loadingId === match.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{loadingId === match.id ? 'Sending...' : 'Message'}</span>
                    </button>
                    {errorId === match.id && (
                      <div className="text-xs text-red-500 mt-2 w-full text-center">Action failed. Try again.</div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredMatches.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No matches found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters to find more matches.
          </p>
        </motion.div>
      )}

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="card bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20"
      >
        <div className="flex items-start space-x-3">
          <Sparkles className="h-6 w-6 text-primary mt-1" />
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">AI Matchmaking Insights</h3>
            <p className="text-sm text-muted-foreground">
              Our AI analyzes your profile, skills, interests, and goals to find the most relevant connections. 
              Match scores are based on skill overlap, shared interests, and complementary goals.
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>• 90%+ = Excellent match</span>
              <span>• 80-89% = Very good match</span>
              <span>• 70-79% = Good match</span>
            </div>
          </div>
        </div>
      </motion.div>
       <AIChatbot/>
    </div>
  )
}

export default Matches
