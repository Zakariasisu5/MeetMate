import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AIChatbot from '../components/ui/AIChatbot'
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Calendar, 
  MessageCircle, 
  Heart,
  Download,
  Filter,
  Sparkles,
  Target,
  Award,
  Activity,
  Globe,
  Clock
} from 'lucide-react'

interface Metric {
  label: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: any
}

interface ChartData {
  name: string
  matches: number
  meetings: number
  connections: number
}

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedMetric, setSelectedMetric] = useState('all')

  // --- LocalStorage Dashboard Stats ---
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('stats-dashboard');
    return saved ? JSON.parse(saved) : {
      matches: 47,
      meetings: 23,
      connections: 34,
      responseRate: 78
    };
  });
  useEffect(() => {
    const saved = localStorage.getItem('stats-dashboard');
    if (saved) setStats(JSON.parse(saved));
  }, []);

  const metrics: Metric[] = [
    {
      label: 'Total Matches',
      value: String(stats.matches ?? 47),
      change: '+12%',
      changeType: 'positive',
      icon: Users
    },
    {
      label: 'Scheduled Meetings',
      value: String(stats.meetings ?? 23),
      change: '+8%',
      changeType: 'positive',
      icon: Calendar
    },
    {
      label: 'Active Connections',
      value: String(stats.connections ?? 34),
      change: '+15%',
      changeType: 'positive',
      icon: Heart
    },
    {
      label: 'Response Rate',
      value: (stats.responseRate ?? 78) + '%',
      change: '+5%',
      changeType: 'positive',
      icon: MessageCircle
    }
  ];

  const chartData: ChartData[] = [
    { name: 'Mon', matches: 8, meetings: 4, connections: 6 },
    { name: 'Tue', matches: 12, meetings: 7, connections: 9 },
    { name: 'Wed', matches: 15, meetings: 9, connections: 12 },
    { name: 'Thu', matches: 10, meetings: 6, connections: 8 },
    { name: 'Fri', matches: 6, meetings: 3, connections: 5 },
    { name: 'Sat', matches: 4, meetings: 2, connections: 3 },
    { name: 'Sun', matches: 2, meetings: 1, connections: 2 }
  ]

  const topMatches = [
    { name: 'Anna Chen', score: 94, company: 'DeFi Labs', status: 'Connected' },
    { name: 'Marcus Rodriguez', score: 87, company: 'Ethereum Foundation', status: 'Meeting Scheduled' },
    { name: 'Sarah Kim', score: 82, company: 'Web3 Startup', status: 'Pending' },
    { name: 'David Thompson', score: 78, company: 'AI Research Lab', status: 'Connected' },
    { name: 'Lisa Wang', score: 75, company: 'Blockchain Corp', status: 'Meeting Scheduled' }
  ]

  const engagementHeatmap = [
    { time: '9:00 AM', activity: 'high' },
    { time: '10:00 AM', activity: 'very-high' },
    { time: '11:00 AM', activity: 'medium' },
    { time: '12:00 PM', activity: 'low' },
    { time: '1:00 PM', activity: 'medium' },
    { time: '2:00 PM', activity: 'high' },
    { time: '3:00 PM', activity: 'very-high' },
    { time: '4:00 PM', activity: 'medium' },
    { time: '5:00 PM', activity: 'low' }
  ]

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'very-high': return 'bg-green-500'
      case 'high': return 'bg-green-400'
      case 'medium': return 'bg-yellow-400'
      case 'low': return 'bg-gray-300'
      default: return 'bg-gray-200'
    }
  }

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const userData = topMatches.map(u => ({
    name: u.name,
    score: u.score,
    company: u.company,
    status: u.status
  }));

  const exportData = (format: 'csv' | 'json') => {
    let dataStr = '';
    let filename = '';
    if (format === 'json') {
      dataStr = JSON.stringify(userData, null, 2);
      filename = 'user_data.json';
    } else {
      // CSV
      const header = Object.keys(userData[0]).join(',');
      const rows = userData.map(u => Object.values(u).map(v => `"${v}"`).join(',')).join('\n');
      dataStr = `${header}\n${rows}`;
      filename = 'user_data.csv';
    }
    const blob = new Blob([dataStr], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Analytics Dashboard
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Track your networking success and engagement metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          
          <button
            onClick={() => exportData('csv')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              className="card space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                  {metric.change}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.label}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="card space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Weekly Activity</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedMetric('matches')}
                  className={`px-3 py-1 rounded-2xl text-sm font-medium transition-colors ${
                    selectedMetric === 'matches'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Matches
                </button>
                <button
                  onClick={() => setSelectedMetric('meetings')}
                  className={`px-3 py-1 rounded-2xl text-sm font-medium transition-colors ${
                    selectedMetric === 'meetings'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Meetings
                </button>
                <button
                  onClick={() => setSelectedMetric('connections')}
                  className={`px-3 py-1 rounded-2xl text-sm font-medium transition-colors ${
                    selectedMetric === 'connections'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Connections
                </button>
              </div>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="space-y-4">
              {chartData.map((day) => {
                const value = selectedMetric === 'all' 
                  ? day.matches + day.meetings + day.connections
                  : day[selectedMetric as keyof ChartData] as number
                const maxValue = Math.max(...chartData.map(d => 
                  selectedMetric === 'all' 
                    ? d.matches + d.meetings + d.connections
                    : d[selectedMetric as keyof ChartData] as number
                ))
                
                return (
                  <div key={day.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{day.name}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(value / maxValue) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Top Matches */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">Top Matches</h2>
          
          <div className="space-y-3">
            {topMatches.map((match, index) => (
              <motion.div
                key={match.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="card p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground text-sm">
                      {match.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {match.company}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-primary">
                      {match.score}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {match.status}
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${match.score}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Engagement Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Engagement Heatmap</h2>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Very High</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-9 gap-2">
          {engagementHeatmap.map((slot, index) => (
            <div key={slot.time} className="text-center space-y-2">
              <div className="text-xs text-muted-foreground">
                {slot.time}
              </div>
              <div className={`w-8 h-8 rounded-lg ${getActivityColor(slot.activity)}`}></div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="card bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-start space-x-3">
            <Target className="h-6 w-6 text-primary mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">AI Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Based on your engagement patterns, we recommend:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Schedule meetings during 10:00 AM - 11:00 AM (peak activity)</li>
                <li>• Follow up with matches within 24 hours</li>
                <li>• Focus on high-match-score connections (90%+)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-secondary/5 to-primary/5 border-secondary/20">
          <div className="flex items-start space-x-3">
            <Award className="h-6 w-6 text-secondary mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Performance Goals</h3>
              <p className="text-sm text-muted-foreground">
                You're on track to achieve:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 50+ total matches this week</li>
                <li>• 30+ scheduled meetings</li>
                <li>• 80%+ response rate</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="card bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20"
      >
        <div className="flex items-start space-x-3">
          <Sparkles className="h-6 w-6 text-primary mt-1" />
          <div className="space-y-4 flex-1">
            <div>
              <h3 className="font-semibold text-foreground">Quick Actions</h3>
              <p className="text-sm text-muted-foreground">
                Optimize your networking strategy with these quick actions
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button className="btn-secondary text-sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Follow-ups
              </button>
              <button className="btn-secondary text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meetings
              </button>
              <button className="btn-secondary text-sm">
                <Users className="h-4 w-4 mr-2" />
                Find Matches
              </button>
              <button className="btn-secondary text-sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </motion.div>
       <AIChatbot/>
    </div>
  )
}

export default Dashboard
