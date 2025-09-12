import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AIChatbot from '../components/ui/AIChatbot'
import {
  Users,
  MessageCircle,
  Calendar,
  MapPin,
  Building,
  Search,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import ApiService from '../services/api'

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
}

const Matches = () => {
  const [matches] = useState<Match[]>([
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
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      title: 'Smart Contract Developer',
      company: 'Ethereum Foundation',
      location: 'Berlin, Germany',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      matchScore: 87,
      skills: ['Solidity', 'Ethereum', 'DeFi Protocols', 'Rust'],
      interests: ['DeFi', 'Blockchain', 'Zero Knowledge'],
      goals: ['Collaborate on DeFi projects', 'Share knowledge'],
      bio: 'Smart contract developer working on DeFi protocols. Interested in ZK proofs and cross-chain solutions.',
    },
    {
      id: '3',
      name: 'Sarah Kim',
      title: 'Growth Marketing Manager',
      company: 'Web3 Startup',
      location: 'Seoul, South Korea',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      matchScore: 82,
      skills: ['Growth Marketing', 'Community Building', 'Web3', 'Analytics'],
      interests: ['Web3', 'Community', 'Growth'],
      goals: ['Learn about Web3 marketing', 'Build community'],
      bio: 'Growth marketer focused on Web3 projects. Building communities and driving user acquisition.',
    },
    {
      id: '4',
      name: 'David Park',
      title: 'AI Researcher',
      company: 'OpenAI',
      location: 'New York, USA',
      avatar:
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face',
      matchScore: 91,
      skills: ['AI/ML', 'NLP', 'Deep Learning', 'Python'],
      interests: ['AI', 'Ethics', 'Web3'],
      goals: ['Collaborate on AI x Web3 projects'],
      bio: 'AI researcher exploring intersections of artificial intelligence and decentralized technologies.',
    },
    {
      id: '5',
      name: 'Emily Johnson',
      title: 'Investor',
      company: 'Crypto Capital',
      location: 'London, UK',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      matchScore: 76,
      skills: ['Investing', 'Venture Capital', 'Crypto'],
      interests: ['DeFi', 'NFTs', 'Startups'],
      goals: ['Find promising founders to invest in'],
      bio: 'Investor focusing on early-stage crypto and Web3 startups.',
    },
    {
      id: '6',
      name: 'James Wilson',
      title: 'Community Manager',
      company: 'DAO Collective',
      location: 'Toronto, Canada',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      matchScore: 84,
      skills: ['Community Management', 'DAO Governance', 'Content Creation'],
      interests: ['DAOs', 'Community', 'Web3'],
      goals: ['Learn new DAO models', 'Build stronger communities'],
      bio: 'Community manager helping DAOs thrive with effective governance and engagement.',
    },
  ])

  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [connections, setConnections] = useState<{ [key: string]: 'default' | 'connected' }>({})

  const filters = [
    { id: 'all', label: 'All Matches', count: matches.length },
    { id: 'high', label: 'High Match (90%+)', count: matches.filter(m => m.matchScore >= 90).length },
    { id: 'medium', label: 'Medium Match (70-89%)', count: matches.filter(m => m.matchScore >= 70 && m.matchScore < 90).length },
  ]

  const filteredMatches = matches.filter((match) => {
    const lower = searchTerm.toLowerCase()
    const matchesSearch =
      match.name.toLowerCase().includes(lower) ||
      match.title.toLowerCase().includes(lower) ||
      match.company.toLowerCase().includes(lower)
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'high' && match.matchScore >= 90) ||
      (selectedFilter === 'medium' && match.matchScore >= 70 && match.matchScore < 90)
    return matchesSearch && matchesFilter
  })

  const messageMatch = async (matchId: string) => {
    try {
      await ApiService.chatWithAI({
        prompt: `Hi ${matches.find((m) => m.id === matchId)?.name}!`,
        context: matchId,
      })
      toast.success('Message sent!')
    } catch {
      toast.error('Failed to send message.')
    }
  }

  const disconnectMatch = (matchId: string) => {
    setConnections((prev) => ({ ...prev, [matchId]: 'default' }))
    toast('Disconnected from the match.')
  }

  const scheduleMeeting = (matchId: string) => {
    toast(`Schedule meeting with ${matches.find((m) => m.id === matchId)?.name}`)
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-primary">AI-Powered Matches</h1>
        <p className="text-muted-foreground">Discover people who share your interests and goals at this conference</p>
      </motion.div>

      {/* Search and Filters */}
      <div className="space-y-6">
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
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                selectedFilter === filter.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Matches Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence>
          {filteredMatches.map((match, index) => {
            const connectState = connections[match.id] || 'default'
            return (
              <motion.div key={match.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: index * 0.1 }} className="card space-y-4 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <img src={match.avatar} alt={match.name} className="w-12 h-12 rounded-2xl object-cover" />
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-muted-foreground gap-1 sm:gap-0">
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
                <p className="text-sm text-muted-foreground line-clamp-3">{match.bio}</p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  {connectState === 'connected' ? (
                    <>
                      {/* Disconnect */}
                      <div className="relative group flex-1">
                        <button className="w-full rounded-lg py-2 px-4 font-semibold bg-red-500 text-white shadow hover:bg-red-600 flex items-center justify-center gap-2" onClick={() => disconnectMatch(match.id)}>
                          <X className="h-5 w-5" />
                          Disconnect
                        </button>
                        <span className="absolute bottom-full mb-2 hidden group-hover:block text-xs bg-gray-800 text-white py-1 px-2 rounded">Disconnect from this user</span>
                      </div>
                      {/* Message */}
                      <div className="relative group flex-1">
                        <button className="w-full rounded-lg py-2 px-4 font-semibold bg-primary text-white shadow hover:bg-primary/80 flex items-center justify-center gap-2" onClick={() => messageMatch(match.id)}>
                          <MessageCircle className="h-5 w-5" />
                          Message
                        </button>
                        <span className="absolute bottom-full mb-2 hidden group-hover:block text-xs bg-gray-800 text-white py-1 px-2 rounded">Send a message</span>
                      </div>
                      {/* Schedule */}
                      <div className="relative group flex-1">
                        <button className="w-full rounded-lg py-2 px-4 font-semibold bg-blue-600 text-white shadow hover:bg-blue-700 flex items-center justify-center gap-2" onClick={() => scheduleMeeting(match.id)}>
                          <Calendar className="h-5 w-5" />
                          Schedule
                        </button>
                        <span className="absolute bottom-full mb-2 hidden group-hover:block text-xs bg-gray-800 text-white py-1 px-2 rounded">Schedule a meeting</span>
                      </div>
                    </>
                  ) : (
                    <button className="flex-1 rounded-lg py-2 px-4 font-semibold shadow bg-primary text-white hover:bg-primary/80" onClick={() => setConnections((prev) => ({ ...prev, [match.id]: 'connected' }))}>
                      Connect
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredMatches.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center py-12">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No matches found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms or filters to find more matches.</p>
        </motion.div>
      )}

      {/* AI Insights */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="card bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <div className="flex items-start space-x-3">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">AI Matchmaking Insights</h3>
            <p className="text-sm text-muted-foreground">
              Our AI analyzes your profile, skills, interests, and goals to find the most relevant connections. Match scores are based on skill overlap, shared interests, and complementary goals.
            </p>
          </div>
        </div>
      </motion.div>

      <AIChatbot />
    </div>
  )
}

export default Matches
