import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Zap, Crown, Medal } from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  unlocked: boolean
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  progress?: number
}

interface Achievement {
  id: string
  name: string
  description: string
  progress: number
  target: number
  reward: string
}

const Gamification = () => {
  const badges: Badge[] = [
    {
      id: '1',
      name: 'First Connection',
      description: 'Make your first meaningful connection',
      icon: TrendingUp,
      unlocked: true,
      rarity: 'common'
    },
    {
      id: '2',
      name: 'Networking Pro',
      description: 'Connect with 10+ professionals',
      icon: TrendingUp,
      unlocked: true,
      rarity: 'rare',
      progress: 15
    },
    {
      id: '3',
      name: 'Conference Master',
      description: 'Attend 5+ conferences',
      icon: Crown,
      unlocked: false,
      rarity: 'epic',
      progress: 3
    },
    {
      id: '4',
      name: 'AI Matchmaker',
      description: 'Get 95%+ match accuracy',
      icon: Zap,
      unlocked: false,
      rarity: 'legendary',
      progress: 87
    },
    {
      id: '5',
      name: 'Schedule Champion',
      description: 'Schedule 20+ meetings',
      icon: TrendingUp,
      unlocked: false,
      rarity: 'rare',
      progress: 12
    },
    {
      id: '6',
      name: 'Community Leader',
      description: 'Help 50+ people connect',
      icon: Medal,
      unlocked: false,
      rarity: 'epic',
      progress: 28
    }
  ]

  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'Connection Streak',
      description: 'Connect with professionals for 7 consecutive days',
      progress: 5,
      target: 7,
      reward: '50 XP + Connection Badge'
    },
    {
      id: '2',
      name: 'Meeting Master',
      description: 'Schedule and complete 10 meetings',
      progress: 7,
      target: 10,
      reward: '100 XP + Meeting Badge'
    },
    {
      id: '3',
      name: 'Skill Sharer',
      description: 'Share your expertise in 5 different areas',
      progress: 3,
      target: 5,
      reward: '75 XP + Expertise Badge'
    }
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500'
      case 'rare': return 'from-blue-400 to-blue-500'
      case 'epic': return 'from-purple-400 to-purple-500'
      case 'legendary': return 'from-yellow-400 to-orange-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'shadow-gray-400/25'
      case 'rare': return 'shadow-blue-400/25'
      case 'epic': return 'shadow-purple-400/25'
      case 'legendary': return 'shadow-yellow-400/25'
      default: return 'shadow-gray-400/25'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto space-y-8"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-background/80 to-secondary/20 backdrop-blur-xl border border-border/30 rounded-3xl p-6 text-center hover:border-primary/50 transition-all duration-300"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">2,847</h3>
          <p className="text-sm text-muted-foreground">Total XP</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-background/80 to-secondary/20 backdrop-blur-xl border border-border/30 rounded-3xl p-6 text-center hover:border-primary/50 transition-all duration-300"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent/30">
            <Crown className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Level 24</h3>
          <p className="text-sm text-muted-foreground">Current Level</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-background/80 to-secondary/20 backdrop-blur-xl border border-border/30 rounded-3xl p-6 text-center hover:border-primary/50 transition-all duration-300"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-background/40 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-secondary/30">
            <TrendingUp className="w-6 h-6 text-secondary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">156</h3>
          <p className="text-sm text-muted-foreground">Connections</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-background/80 to-secondary/20 backdrop-blur-xl border border-border/30 rounded-3xl p-6 text-center hover:border-primary/50 transition-all duration-300"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
            <Medal className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">12</h3>
          <p className="text-sm text-muted-foreground">Badges Earned</p>
        </motion.div>
      </div>

      {/* Badges Section */}
      <div className="bg-gradient-to-br from-background/80 to-secondary/20 backdrop-blur-xl border border-border/30 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-yellow-500/30">
            <Medal className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Achievement Badges</h2>
            <p className="text-muted-foreground">Unlock badges by completing milestones</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-background/60 to-secondary/20 border-primary/30 hover:border-primary/50'
                    : 'bg-gradient-to-br from-secondary/20 to-background/40 border-border/30'
                }`}
              >
                {/* Badge icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getRarityColor(badge.rarity)} rounded-2xl flex items-center justify-center shadow-lg ${getRarityGlow(badge.rarity)}`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  {badge.unlocked && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Badge info */}
                <h3 className={`text-lg font-bold mb-2 ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {badge.name}
                </h3>
                <p className={`text-sm mb-4 ${badge.unlocked ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                  {badge.description}
                </p>

                {/* Progress bar for locked badges */}
                {!badge.unlocked && badge.progress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{badge.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary/20 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${badge.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Rarity indicator */}
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getRarityColor(badge.rarity)}`}>
                    {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-gradient-to-br from-background/80 to-secondary/20 backdrop-blur-xl border border-border/30 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center border border-primary/30">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Current Challenges</h2>
            <p className="text-muted-foreground">Complete challenges to earn XP and rewards</p>
          </div>
        </div>

        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-secondary/20 to-background/40 border border-border/30 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-accent">
                    <Medal className="w-3 h-3" />
                    <span>{achievement.reward}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {achievement.progress}/{achievement.target}
                  </div>
                  <div className="text-sm text-muted-foreground">Progress</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-secondary/20 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="bg-gradient-to-r from-primary to-accent h-3 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* NFT/POAP Placeholder */}
      <div className="bg-gradient-to-br from-background/80 to-secondary/20 backdrop-blur-xl border border-border/30 rounded-3xl p-8 shadow-2xl text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
          <Medal className="w-10 h-10 text-purple-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Collectible NFTs & POAPs</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Earn unique collectible NFTs and POAPs for your achievements. These digital collectibles represent your networking journey and can be displayed in your Web3 wallet.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-2xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center space-x-3 mx-auto"
        >
          <Medal className="w-5 h-5" />
          <span>View Collection</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default Gamification
