import React, { useState } from 'react';
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Users, 
  Sparkles, 
  Calendar, 
  Shield, 
  Zap, 
  TrendingUp,
  ArrowRight,
  Wallet,
  Linkedin,
  Target,
  Award,
  Clock
} from 'lucide-react'
import AnimatedBackground from '../components/ui/AnimatedBackground'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import AIChatbot from '../components/ui/AIChatbot'
import ProfileCard from '../components/ui/ProfileCard'
import ConnectModal from '../components/ConnectModal'
import MessageModal from '../components/MessageModal'
import CalendarModal from '../components/CalendarModal'

const Home = () => {
  // Modal state
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const features = [
    {
      icon: Users,
      title: 'AI Matchmaking',
      description: 'Discover relevant connections based on skills, interests, and goals using advanced AI algorithms.'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Automatically schedule coffee chats and meetings with your matches during the conference.'
    },
    {
      icon: Shield,
      title: 'Web3 Security',
      description: 'Secure wallet-based authentication and decentralized profile storage for privacy and control.'
    },
    {
      icon: Zap,
      title: 'Instant Connections',
      description: 'Real-time notifications and instant messaging to keep conversations flowing.'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '2,500+', icon: Users },
    { label: 'Successful Matches', value: '15,000+', icon: TrendingUp },
    { label: 'Conferences', value: '50+', icon: Calendar },
    { label: 'Countries', value: '25+', icon: Target }
  ]

  const sampleUsers = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'AI Research Lead',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      bio: 'Passionate about AI and blockchain. Building the future of decentralized applications.',
      interests: ['AI/ML', 'Blockchain', 'Web3', 'Startups'],
      rating: 4.8,
      isOnline: true,
      lastActive: '2 min ago'
    },
    {
      id: '2',
      name: 'Alex Rodriguez',
      role: 'Product Manager',
      company: 'InnovateLab',
      location: 'New York, NY',
      bio: 'Product strategist with 8+ years in fintech. Love connecting with fellow innovators.',
      interests: ['Fintech', 'Product Strategy', 'UX Design', 'Innovation'],
      rating: 4.9,
      isOnline: false,
      lastActive: '1 hour ago'
    }
  ];

  return (
    <>
      <AnimatedBackground />
      
      <div className="relative z-10 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-12 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg"></div>

              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight font-heading">
              Turn Passive Networking into
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent block">
                Meaningful Connections
              </span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed font-body">
              MeetMate uses AI to match you with the right people at conferences. 
              Connect, schedule, and follow up automatically with Web3-powered security.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <NeonButton
                onClick={() => window.location.href = '/profile'}
                size="lg"
                className="text-lg px-10 py-5"
              >
                <span>Get Started</span>
                
              </NeonButton>
              
              <NeonButton
                onClick={() => window.location.href = '/matches'}
                variant="secondary"
                size="lg"
                className="text-lg px-10 py-5"
              >
                View Matches
              </NeonButton>
            </div>
          </motion.div>

            
        </section>

        {/* Features Section */}
        <section className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
              Why Choose MeetMate?
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto font-body">
              Experience the future of conference networking with AI-powered matching and Web3 security.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <GlassCard className="text-center space-y-6 hover:scale-105 transition-transform duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mx-auto border border-white/20">
                      <Icon className="h-10 w-10 text-blue-400" />
                    </div>
                    <h3 className="text-xl text-white font-semibold font-heading">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed font-body">
                      {feature.description}
                    </p>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative">
          <GlassCard className="p-12 md:p-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center space-y-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent font-heading">
                Trusted by thousands of conference attendees
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                        <Icon className="h-8 w-8 text-blue-400" />
                      </div>
                      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                        {stat.value}
                      </div>
                      <div className="text-white/60">
                        {stat.label}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </GlassCard>
        </section>

        {/* Sample Profiles Section */}
        <section className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
              Meet Your Potential Matches
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto font-body">
              AI-powered matching connects you with professionals who share your interests and goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {sampleUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <ProfileCard
                  user={user}
                  onConnect={() => {
                    const senderId = localStorage.getItem('senderId') || '';
                    if (!senderId) {
                      alert('You must be logged in to connect. Please log in or complete your profile.');
                      // Optionally redirect to login/profile page:
                      // window.location.href = '/login';
                      return;
                    }
                    localStorage.setItem('receiverId', user.id);
                    setSelectedUser(user);
                    setShowConnectModal(true);
                  }}
                  onMessage={() => {
                    const senderId = localStorage.getItem('senderId') || '';
                    if (!senderId) {
                      alert('You must be logged in to message. Please log in or complete your profile.');
                      // Optionally redirect to login/profile page:
                      // window.location.href = '/login';
                      return;
                    }
                    localStorage.setItem('receiverId', user.id);
                    setSelectedUser(user);
                    setShowMessageModal(true);
                  }}
                  onSchedule={() => {
                    setSelectedUser(user);
                    setShowCalendarModal(true);
                  }}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent font-heading">
              Ready to transform your conference experience?
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed font-body">
              Join thousands of professionals who are already using MeetMate to build meaningful connections.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <NeonButton
              onClick={() => window.location.href = '/profile'}
              size="lg"
              className="text-lg px-12 py-5"
            >
              <span>Start Building Connections</span>
              <TrendingUp className="h-6 w-6 ml-2" />
            </NeonButton>
          </motion.div>
        </section>
      </div>

      {/* Modals */}
      {showConnectModal && selectedUser && (
        <ConnectModal
          user={selectedUser}
          onClose={() => setShowConnectModal(false)}
          onSendRequest={() => {
            setShowConnectModal(false);
            alert(`Connection request sent to ${selectedUser.name}`);
          }}
        />
      )}
      {showMessageModal && selectedUser && (
        <MessageModal
          user={selectedUser}
          onClose={() => setShowMessageModal(false)}
          onSendMessage={(msg) => {
            setShowMessageModal(false);
            alert(`Message sent to ${selectedUser.name}: ${msg}`);
          }}
        />
      )}
      {showCalendarModal && selectedUser && (
        <CalendarModal
          user={selectedUser}
          onClose={() => setShowCalendarModal(false)}
          onSchedule={(date) => {
            setShowCalendarModal(false);
            alert(`Meeting scheduled with ${selectedUser.name} on ${date}`);
          }}
        />
      )}
      {/* AI Chatbot */}
      <AIChatbot />
    </>
  )
}

export default Home
