import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AIChatbot from "../components/ui/AIChatbot"
import ChatPopup from "../components/ui/ChatPopup"
import { Search } from "lucide-react"
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

type ConnectionStatus = "default" | "pending" | "connected"

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
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
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
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
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
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
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

  const [selectedFilter, setSelectedFilter] = useState<"all" | "high" | "medium" | "pending">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [connections, setConnections] = useState<{ [key: string]: ConnectionStatus }>(() => {
    try {
      const saved = localStorage.getItem("connections")
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingUser, setPendingUser] = useState<Match | null>(null)

  useEffect(() => {
    localStorage.setItem("connections", JSON.stringify(connections))
  }, [connections])

  const filters = [
    { id: "all", label: "All Matches", count: matches.length },
    { id: "high", label: "High Match (90%+)", count: matches.filter((m) => m.matchScore >= 90).length },
    { id: "medium", label: "Medium Match (70-89%)", count: matches.filter((m) => m.matchScore >= 70 && m.matchScore < 90).length },
    { id: "pending", label: "Pending", count: matches.filter((m) => connections[m.id] === "pending").length },
  ]

  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "high" && match.matchScore >= 90) ||
      (selectedFilter === "medium" && match.matchScore >= 70 && match.matchScore < 90) ||
      (selectedFilter === "pending" && connections[match.id] === "pending")
    return matchesSearch && matchesFilter
  })

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100"
    if (score >= 80) return "text-blue-600 bg-blue-100"
    if (score >= 70) return "text-yellow-600 bg-yellow-100"
    return "text-gray-600 bg-gray-100"
  }

  const disconnectMatch = (matchId: string) => {
    setConnections((prev) => {
      const updated: typeof prev = { ...prev, [matchId]: "default" }
      toast.success("Disconnected successfully")
      return updated
    })
  }

  const acceptConnection = (matchId: string) => {
    setConnections((prev) => ({ ...prev, [matchId]: "connected" }))
    const matched = matches.find((m) => m.id === matchId)
    toast.success(`You're now connected with ${matched?.name ?? "user"}`)
  }

  const cancelRequest = (matchId: string) => {
    setConnections((prev) => ({ ...prev, [matchId]: "default" }))
    const matched = matches.find((m) => m.id === matchId)
    toast(`Cancelled request to ${matched?.name ?? "user"}`)
  }

  const messageUser = (match: Match) => {
    setActiveChat(match)
  }

  const [profileModal, setProfileModal] = useState<Match | null>(null)

  // Chat state (persisted)
  const [activeChat, setActiveChat] = useState<Match | null>(null)
  const [chats, setChats] = useState<Record<string, { id: string; from: "me" | "them"; text: string; ts: number }[]>>(() => {
    try {
      const saved = localStorage.getItem("chats")
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats))
  }, [chats])

  const closeChat = () => setActiveChat(null)

  const sendMessage = (matchId: string, text: string) => {
    const msg = { id: String(Date.now()), from: "me" as const, text, ts: Date.now() }
    setChats((prev) => {
      const userMsgs = prev[matchId] ? [...prev[matchId], msg] : [msg]
      return { ...prev, [matchId]: userMsgs }
    })
    toast.success("Message sent")
  }

  const confirmConnect = () => {
    if (!pendingUser) return
    setConnections((prev) => ({ ...prev, [pendingUser.id]: "pending" }))
    toast.success(`Connection request sent to ${pendingUser.name}`)
    setShowConfirm(false)
    setPendingUser(null)
  }

  const cancelConnect = () => {
    setShowConfirm(false)
    setPendingUser(null)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-2 sm:px-4 md:px-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">AI-Powered Matches</h1>
        <p className="text-lg text-muted-foreground">Discover people who share your interests and goals at this conference</p>
      </motion.div>

      {/* Search + Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-6">
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
              onClick={() => setSelectedFilter(filter.id as typeof selectedFilter)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium ${
                selectedFilter === filter.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Matches Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                      className="w-12 h-12 rounded-2xl object-cover cursor-pointer"
                      onClick={() => setProfileModal(match)}
                    />
                    <div>
                      <h3 className="font-semibold cursor-pointer" onClick={() => setProfileModal(match)}>{match.name}</h3>
                      <p className="text-sm text-muted-foreground">{match.title}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(match.matchScore)}`}>
                    {match.matchScore}%
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">{match.bio}</p>

                {/* Company & Location */}
                <div className="mt-2 text-sm text-muted-foreground flex items-center gap-3">
                  <span className="font-medium">{match.company}</span>
                  <span>•</span>
                  <span>{match.location}</span>
                </div>

                {/* Skills */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {match.skills.slice(0, 6).map((s, i) => (
                    <span key={i} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">{s}</span>
                  ))}
                </div>

                {/* Interests & Goals (small) */}
                <div className="mt-3 text-xs text-muted-foreground flex flex-col gap-1">
                  <div>
                    <strong className="text-sm text-foreground">Interests:</strong> {match.interests.join(", ")}
                  </div>
                  <div>
                    <strong className="text-sm text-foreground">Goals:</strong> {match.goals.join(" • ")}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  {connectState === "connected" ? (
                    <>
                      <button onClick={() => messageUser(match)} className="flex-1 rounded-lg py-2 px-4 font-semibold bg-indigo-600 text-white hover:bg-indigo-700">Message</button>
                      <button className="flex-1 rounded-lg py-2 px-4 font-semibold bg-green-500 text-white">Connected</button>
                      <button onClick={() => disconnectMatch(match.id)} className="flex-1 rounded-lg py-2 px-4 font-semibold bg-red-500 text-white hover:bg-red-600">Disconnect</button>
                    </>
                  ) : connectState === "pending" ? (
                    <>
                      <button onClick={() => acceptConnection(match.id)} className="flex-1 rounded-lg py-2 px-4 font-semibold bg-primary text-white hover:bg-primary/80">Accept</button>
                      <button onClick={() => cancelRequest(match.id)} className="flex-1 rounded-lg py-2 px-4 font-semibold bg-gray-200 text-gray-800">Cancel Request</button>
                    </>
                  ) : (
                    <button
                      aria-label={`Send connection request to ${match.name}`}
                      title={`Send connection request to ${match.name}`}
                      className={`flex-1 rounded-lg py-2 px-4 font-semibold shadow transition-all duration-200 bg-primary text-white hover:bg-primary/80`}
                      onClick={() => {
                        setPendingUser(match)
                        setShowConfirm(true)
                      }}
                    >
                      Connect
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Connect Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && pendingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: -50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-gray rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4"
            >
              {/* User Info */}
              <div className="flex items-center space-x-4" >
                <img src={pendingUser.avatar} alt={pendingUser.name} className="w-14 h-14 rounded-2xl object-cover" />
                <div>
                  <h3 className="text-lg font-semibold">{pendingUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{pendingUser.title}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Are you sure you want to send a connection request to <strong>{pendingUser.name}</strong>?
              </p>

              <div className="flex justify-end gap-3 mt-2">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#E5E7EB" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelConnect}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium transition"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#2563EB" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmConnect}
                  className="px-4 py-2 rounded-lg bg-primary text-white font-medium transition"
                >
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {profileModal && (
          <motion.div className="fixed inset-0 bg-gray bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
              <div className="flex items-center gap-4">
                <img src={profileModal.avatar} alt={profileModal.name} className="w-20 h-20 rounded-2xl object-cover" />
                <div>
                  <h3 className="text-xl font-bold">{profileModal.name}</h3>
                  <p className="text-sm text-muted-foreground">{profileModal.title} • {profileModal.company}</p>
                  <p className="text-sm text-muted-foreground">{profileModal.location}</p>
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">{profileModal.bio}</p>

              <div className="mt-4">
                <h4 className="text-sm font-semibold">Skills</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileModal.skills.map((s, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">{s}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button onClick={() => setProfileModal(null)} className="px-4 py-2 rounded-lg bg-gray-200">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Popup */}
      {activeChat && (
        <ChatPopup
          match={{ id: activeChat.id, name: activeChat.name, avatar: activeChat.avatar }}
          messages={chats[activeChat.id] || []}
          onSend={(text) => sendMessage(activeChat.id, text)}
          onClose={closeChat}
        />
      )}

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  )
}

export default Matches
