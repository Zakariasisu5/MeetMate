import React, { useState, useEffect } from 'react';
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
import SponsorCard from '../components/SponsorCard'
import { useFirebaseAuth } from '../hooks/useFirebaseAuth'
import ConnectModal from '../components/ConnectModal'
import MessageModal from '../components/MessageModal'
import CalendarModal from '../components/CalendarModal'
import { Cpu, Slack as SlackIcon, FileText, CreditCard, Video, Database, MessageSquare } from 'lucide-react'

const Home = () => {
  // Modal state
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [successType, setSuccessType] = useState<string | null>(null);

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
      icon: Award,
      title: 'Gamified Networking',
      description: 'Earn badges and rewards for making connections, attending events, and engaging.'
    },
    {
      icon: Zap,
      title: 'Instant Connections',
      description: 'Real-time notifications and instant messaging to keep conversations  flowing.'
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
      lastActive: '2 min ago',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen'
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
      lastActive: '1 hour ago',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Rodriguez'
    }
  ];

  const [connections, setConnections] = useState(() => {
    const saved = localStorage.getItem('connections');
    return saved ? JSON.parse(saved) : {};
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('connections', JSON.stringify(connections));
  }, [connections]);

  // Dashboard stat update (example: update connections count)
  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem('stats-dashboard') || '{}');
    stats.connections = Object.values(connections).filter((s: any) => s === 'connected').length;
    localStorage.setItem('stats-dashboard', JSON.stringify(stats));
  }, [connections]);

  const { user, userProfile } = useFirebaseAuth();
  const isProfileComplete = userProfile && userProfile.name && userProfile.bio && userProfile.avatar;

  return (
    <>
      <AnimatedBackground />
      
  <div className="relative z-10 flex flex-col gap-y-24">
        {/* Hero Section */}
  <section className="text-center space-y-12 pt-20 py-20">
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
  <section className="space-y-12 py-20">
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

        {/* Testimonials Section */}
  <section className="relative py-12">
          <GlassCard className="p-8 md:p-10 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent font-heading">
                What attendees are saying
              </h2>
              <p className="text-white/60 mt-2">Real feedback from conference users — rotating in real-time.</p>
            </motion.div>

            <div className="marquee marquee-left">
              <div className="marquee-track">
                {[
                  { id: 1, text: 'MeetMate introduced me to speakers I would never have found.', author: 'Anna C.', avatar: 'https://i.pravatar.cc/100?img=32' },
                  { id: 2, text: 'The AI match suggestions were shockingly accurate.', author: 'Marcus R.', avatar: 'https://i.pravatar.cc/100?img=12' },
                  { id: 3, text: 'Saved so much time between sessions — highly recommend.', author: 'Sarah K.', avatar: 'https://i.pravatar.cc/100?img=7' },
                  { id: 4, text: 'Great tool for follow-ups and scheduling.', author: 'David T.', avatar: 'https://i.pravatar.cc/100?img=14' }
                ].map((t) => (
                  <div key={t.id} className="testimonial-card">
                    <img src={t.avatar} alt={t.author} className="testimonial-avatar" />
                    <div className="testimonial-content min-w-0">
                      <div className="testimonial-text">“{t.text}”</div>
                      <div className="text-xs text-white/60 mt-1 font-semibold testimonial-author">— {t.author}</div>
                    </div>
                  </div>
                ))}
                {[
                  { id: 11, text: 'MeetMate introduced me to speakers I would never have found.', author: 'Anna C.', avatar: 'https://i.pravatar.cc/100?img=32' },
                  { id: 12, text: 'The AI match suggestions were shockingly accurate.', author: 'Marcus R.', avatar: 'https://i.pravatar.cc/100?img=12' },
                  { id: 13, text: 'Saved so much time between sessions — highly recommend.', author: 'Sarah K.', avatar: 'https://i.pravatar.cc/100?img=7' },
                  { id: 14, text: 'Great tool for follow-ups and scheduling.', author: 'David T.', avatar: 'https://i.pravatar.cc/100?img=14' }
                ].map((t) => (
                  <div key={t.id} className="testimonial-card">
                    <img src={t.avatar} alt={t.author} className="testimonial-avatar" />
                    <div className="testimonial-content min-w-0">
                      <div className="testimonial-text">“{t.text}”</div>
                      <div className="text-xs text-white/60 mt-1 font-semibold testimonial-author">— {t.author}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Sponsors Section - New Card Grid */}
  <section className="relative py-12">
          <GlassCard className="p-6 md:p-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white font-heading">Sponsors</h3>
              <p className="text-white/60 mt-1">Proud partners helping make MeetMate possible.</p>
            </motion.div>

            {/* Continuous sponsor queue (left → right) */}
            <div className="sponsor-queue overflow-hidden">
              <div className="sponsor-track">
                {[ 
                  { id: 'sensayai', name: 'SensayAI', logo: '/logos/sensayai.png', tier: 'Sponsor', Icon: MessageSquare, url: 'https://sensay.ai' },
                  { id: 'microsoft', name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com', tier: 'Sponsor', Icon: Cpu, url: 'https://microsoft.com' },
                  { id: 'slack', name: 'Slack', logo: 'https://logo.clearbit.com/slack.com', tier: 'Sponsor', Icon: SlackIcon, url: 'https://slack.com' },
                  { id: 'notion', name: 'Notion', logo: 'https://logo.clearbit.com/notion.so', tier: 'Sponsor', Icon: FileText, url: 'https://www.notion.so' },
                  { id: 'stripe', name: 'Stripe', logo: 'https://logo.clearbit.com/stripe.com', tier: 'Sponsor', Icon: CreditCard, url: 'https://stripe.com' },
                  { id: 'zoom', name: 'Zoom', logo: 'https://logo.clearbit.com/zoom.us', tier: 'Sponsor', Icon: Video, url: 'https://zoom.us' }
                ].concat([
                  { id: 'sensayai2', name: 'SensayAI', logo: '/logos/sensayai.png', tier: 'Sponsor', Icon: MessageSquare, url: 'https://sensay.ai' },
                  { id: 'microsoft2', name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com', tier: 'Sponsor', Icon: Cpu, url: 'https://microsoft.com' },
                  { id: 'slack2', name: 'Slack', logo: 'https://logo.clearbit.com/slack.com', tier: 'Sponsor', Icon: SlackIcon, url: 'https://slack.com' },
                  { id: 'notion2', name: 'Notion', logo: 'https://logo.clearbit.com/notion.so', tier: 'Sponsor', Icon: FileText, url: 'https://www.notion.so' },
                  { id: 'stripe2', name: 'Stripe', logo: 'https://logo.clearbit.com/stripe.com', tier: 'Sponsor', Icon: CreditCard, url: 'https://stripe.com' },
                  { id: 'zoom2', name: 'Zoom', logo: 'https://logo.clearbit.com/zoom.us', tier: 'Sponsor', Icon: Video, url: 'https://zoom.us' }
                ]).map((s) => (
                  <div key={s.id} className="sponsor-queue-item inline-block mr-6">
                    <SponsorCard name={s.name} logoUrl={s.logo} tier={s.tier as any} Icon={s.Icon} />
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Sample Profiles Section */}
  <section className="space-y-12 py-20">
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
                  user={{
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.name}`,
                    role: user.role,
                    company: user.company,
                    location: user.location,
                    bio: user.bio,
                    interests: user.interests,
                    rating: user.rating,
                    isOnline: user.isOnline,
                    lastActive: user.lastActive
                  }}
                  connectStatus={connections[user.id] || 'default'}
                  onConnect={() => {
                    setPendingUser(user);
                    setShowConfirm(true);
                  }}
                  onMessage={() => {
                    setSelectedUser(user);
                    setShowMessageModal(true);
                  }}
                  onSchedule={() => {
                    setSelectedUser(user);
                    setShowCalendarModal(true);
                  }}
                />
                  {/* Success Toast/Popup */}
                  {successType && (
                    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[100]">
                      <div className="bg-gradient-to-br from-green-400/90 to-blue-500/90 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-bounce backdrop-blur-xl border border-white/20">
                        <span className="text-lg font-bold">
                          {successType === 'connect' && 'Connection request sent!'}
                          {successType === 'message' && 'Message sent!'}
                          {successType === 'schedule' && 'Meeting scheduled!'}
                        </span>
                      </div>
                    </div>
                  )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
  <section className="text-center space-y-8 py-20">
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

      {/* Confirmation Modal for Connect */}
      {showConfirm && pendingUser && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-md">
          <div className="bg-black rounded-2xl shadow-2xl p-8 w-full max-w-md border border-primary/20 relative flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-center">Do you want to connect with {pendingUser.name}?</h2>
            <div className="flex space-x-4 mt-4">
              <button
                className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/80"
                onClick={() => {
                  setConnections((prev: any) => {
                    const updated = { ...prev, [pendingUser.id]: 'pending' };
                    localStorage.setItem('connections', JSON.stringify(updated));
                    // Simulate acceptance after 3s
                    setTimeout(() => {
                      const accepted = { ...JSON.parse(localStorage.getItem('connections') || '{}'), [pendingUser.id]: 'connected' };
                      setConnections(accepted);
                      localStorage.setItem('connections', JSON.stringify(accepted));
                    }, 3000);
                    return updated;
                  });
                  setShowConfirm(false);
                }}
              >Confirm</button>
              <button
                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                onClick={() => setShowConfirm(false)}
              >Cancel</button>
            </div>
          </div>
        </div>
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
