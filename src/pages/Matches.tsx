import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AIChatbot from "../components/ui/AIChatbot"
import { Users, MessageCircle, Calendar, Search } from "lucide-react"
import toast from "react-hot-toast"

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
  const [matches] = useState<Match[]>([
    {
      id: "1",
      name: "Anna Chen",
      title: "Product Designer",
      company: "DeFi Labs",
      location: "San Francisco, CA",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      matchScore: 94,
      skills: ["Product Design", "UX Research", "Figma", "DeFi"],
      interests: ["DeFi", "Product Design", "AI/ML"],
      goals: ["Build meaningful connections", "Learn from industry experts"],
      bio: "Product designer passionate about creating intuitive DeFi experiences. Looking to connect with developers and product managers.",
      isConnected: false,
      isPending: false,
    },
    {
      id: "2",
      name: "Marcus Rodriguez",
      title: "Smart Contract Developer",
      company: "Ethereum Foundation",
      location: "Berlin, Germany",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      matchScore: 87,
      skills: ["Solidity", "Ethereum", "DeFi Protocols", "Rust"],
      interests: ["DeFi", "Blockchain", "Zero Knowledge"],
      goals: ["Collaborate on DeFi projects", "Share knowledge"],
      bio: "Smart contract developer working on DeFi protocols. Interested in ZK proofs and cross-chain solutions.",
      isConnected: false,
      isPending: false,
    },
    {
      id: "3",
      name: "Sarah Kim",
      title: "Growth Marketing Manager",
      company: "Web3 Startup",
      location: "Seoul, South Korea",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      matchScore: 82,
      skills: ["Growth Marketing", "Community Building", "Web3", "Analytics"],
      interests: ["Web3", "Community", "Growth"],
      goals: ["Learn about Web3 marketing", "Build community"],
      bio: "Growth marketer focused on Web3 projects. Building communities and driving user acquisition.",
      isConnected: false,
      isPending: false,
    },
    {
      id: "4",
      name: "David Thompson",
      title: "AI Research Engineer",
      company: "AI Research Lab",
      location: "London, UK",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      matchScore: 78,
      skills: ["Machine Learning", "Python", "AI Research", "Neural Networks"],
      interests: ["AI/ML", "Research", "Innovation"],
      goals: ["Collaborate on AI projects", "Share research insights"],
      bio: "AI researcher working on neural network architectures. Interested in AI applications in Web3.",
      isConnected: false,
      isPending: false,
    },
    {
      id: "5",
      name: "Emily Carter",
      title: "Community Lead",
      company: "DAO Collective",
      location: "Toronto, Canada",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      matchScore: 85,
      skills: ["Community Management", "DAO Governance", "Public Speaking"],
      interests: ["DAO", "Community", "Web3"],
      goals: ["Grow DAO membership", "Host engaging events"],
      bio: "Community lead for a DAO, passionate about decentralized governance and building strong member engagement.",
      isConnected: false,
      isPending: false,
    },
    {
      id: "6",
      name: "James Lee",
      title: "Full Stack Developer",
      company: "Startup Hub",
      location: "Singapore",
      avatar: "https://randomuser.me/api/portraits/men/65.jpg",
      matchScore: 80,
      skills: ["React", "Node.js", "TypeScript", "UI/UX"],
      interests: ["Startups", "Tech", "Design"],
      goals: ["Build scalable apps", "Network with founders"],
      bio: "Full stack developer building scalable web apps for startups. Interested in design and founder networking.",
      isConnected: false,
      isPending: false,
    },
  ])

  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "high" | "medium" | "pending"
  >("all")
  const [searchTerm, setSearchTerm] = useState<string>("")

  const filters = [
    { id: "all", label: "All Matches", count: matches.length },
    {
      id: "high",
      label: "High Match (90%+)",
      count: matches.filter((m) => m.matchScore >= 90).length,
    },
    {
      id: "medium",
      label: "Medium Match (70-89%)",
      count: matches.filter((m) => m.matchScore >= 70 && m.matchScore < 90).length,
    },
    {
      id: "pending",
      label: "Pending",
      count: matches.filter((m) => m.isPending).length,
    },
  ]

  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "high" && match.matchScore >= 90) ||
      (selectedFilter === "medium" &&
        match.matchScore >= 70 &&
        match.matchScore < 90) ||
      (selectedFilter === "pending" && match.isPending)
    return matchesSearch && matchesFilter
  })

  const [connections, setConnections] = useState<{
    [key: string]: "default" | "pending" | "connected"
  }>(() => {
    const saved = localStorage.getItem("connections")
    return saved ? JSON.parse(saved) : {}
  })

  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingUser, setPendingUser] = useState<Match | null>(null)

  useEffect(() => {
    localStorage.setItem("connections", JSON.stringify(connections))
  }, [connections])

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100"
    if (score >= 80) return "text-blue-600 bg-blue-100"
    if (score >= 70) return "text-yellow-600 bg-yellow-100"
    return "text-gray-600 bg-gray-100"
  }

  const disconnectMatch = (matchId: string) => {
    setConnections((prev) => {
      const updated = { ...prev, [matchId]: "default" }
      localStorage.setItem("connections", JSON.stringify(updated))
      toast.success("Disconnected successfully")
      return updated
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-2 sm:px-4 md:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          AI-Powered Matches
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover people who share your interests and goals at this conference
        </p>
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-6"
      >
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
              onClick={() =>
                setSelectedFilter(filter.id as typeof selectedFilter)
              }
              className={`px-4 py-2 rounded-2xl text-sm font-medium ${
                selectedFilter === filter.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        <AnimatePresence>
          {filteredMatches.map((match, index) => {
            const connectState = connections[match.id] || "default"
            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card space-y-4 p-4 sm:p-6"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <img
                      src={match.avatar}
                      alt={match.name}
                      className="w-12 h-12 rounded-2xl object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{match.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {match.title}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(
                      match.matchScore
                    )}`}
                  >
                    {match.matchScore}%
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {match.bio}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  {connectState === "connected" ? (
                    <>
                      <button className="flex-1 rounded-lg py-2 px-4 font-semibold bg-green-500 text-white">
                        Connected
                      </button>
                      <button
                        onClick={() => disconnectMatch(match.id)}
                        className="flex-1 rounded-lg py-2 px-4 font-semibold bg-red-500 text-white hover:bg-red-600"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      className={`flex-1 rounded-lg py-2 px-4 font-semibold shadow transition-all duration-200
                      ${
                        connectState === "pending"
                          ? "bg-yellow-400 text-white"
                          : "bg-primary text-white hover:bg-primary/80"
                      }`}
                      onClick={() => {
                        setPendingUser(match)
                        setShowConfirm(true)
                      }}
                      disabled={connectState === "pending"}
                    >
                      {connectState === "pending" ? "Pending" : "Connect"}
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      <AIChatbot />
    </div>
  )
}

export default Matches
