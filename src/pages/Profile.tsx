import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ApiService from '../services/api'
import AIChatbot from '../components/ui/AIChatbot'
import { 
  User, 
  Briefcase, 
  Target, 
  Globe, 
  Mail, 
  Linkedin,
  Twitter,
  Github,
  Save,
  Sparkles,
  CheckCircle,
  Plus,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  company: z.string().min(2, 'Company must be at least 2 characters'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  email: z.string().email('Invalid email address'),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  goals: z.array(z.string()).min(1, 'At least one goal is required'),
  interests: z.array(z.string()).min(1, 'At least one interest is required'),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface InterestItemProps {
  interest: string;
  onRemove: (interest: string) => void;
}

const InterestItem: React.FC<InterestItemProps> = ({ interest, onRemove }) => (
  <div className="flex items-center space-x-2">
    <CheckCircle className="h-4 w-4 text-primary" />
    <span className="flex-1">{interest}</span>
    <button
      type="button"
      onClick={() => onRemove(interest)}
      className="text-muted-foreground hover:text-destructive"
    >
      <X className="h-4 w-4" />
    </button>
  </div>
);

const Profile = () => {
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Web3'])
  const [newSkill, setNewSkill] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      title: '',
      company: '',
      bio: '',
      email: '',
      linkedin: '',
      twitter: '',
      github: '',
      location: '',
      goals: ['Build meaningful connections', 'Learn from industry experts'],
      interests: ['DeFi', 'Product Design', 'AI/ML'],
    },
  })

  const watchedGoals = watch('goals') || []
  const watchedInterests = watch('interests') || []

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const addGoal = () => {
    const newGoal = prompt('Enter a new goal:')
    if (newGoal?.trim()) {
      setValue('goals', [...watchedGoals, newGoal.trim()])
    }
  }

  const removeGoal = (goalToRemove: string) => {
    setValue('goals', watchedGoals.filter((goal: string) => goal !== goalToRemove))
  }

  const addInterest = () => {
    const newInterest = prompt('Enter a new interest:')
    if (newInterest?.trim()) {
      setValue('interests', [...watchedInterests, newInterest.trim()])
    }
  }

  const removeInterest = (interestToRemove: string) => {
    setValue('interests', watchedInterests.filter((interest: string) => interest !== interestToRemove))
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Check Firebase auth state before saving
      const { auth } = await import('../config/firebase');
      const user = auth.currentUser;
      console.log('Auth user:', user);
      if (!user) {
        toast.error('You must login before completing your profile');
        throw new Error('Please login first');
      }
      // Save profile to backend
      const payload = {
        name: data.name,
        title: data.title,
        company: data.company,
        bio: data.bio,
        email: data.email,
        linkedin: data.linkedin,
        twitter: data.twitter,
        github: data.github,
        location: data.location,
        skills: skills,
        goals: data.goals,
        interests: data.interests,
      };
      // Save and get response
      const savedProfile = await ApiService.createUser(payload);
      // Store senderId and full profile in localStorage for connection system
      if (savedProfile && savedProfile.id) {
        localStorage.setItem('senderId', savedProfile.id);
        localStorage.setItem('userProfile', JSON.stringify(savedProfile));
      }
      toast.success('Profile saved successfully!');
      setIsEditing(false);
      // Show saved data to user
      toast('Profile saved locally!', { icon: '💾', duration: 4000 });
    } catch (error) {
      toast.error('Failed to save profile');
      console.error('Error saving profile:', error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-y-24">
      {/* Header */}
      <section className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Smart Profile
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Create your profile to enable AI-powered matchmaking at conferences
          </p>
        </motion.div>
      </section>

      {/* Profile Form */}
      <section className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="card space-y-6">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Full Name *
                </label>
                <input
                  {...register('name')}
                  className="input"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Professional Title *
                </label>
                <input
                  {...register('title')}
                  className="input"
                  placeholder="Senior Developer"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Company *
                </label>
                <input
                  {...register('company')}
                  className="input"
                  placeholder="Tech Corp"
                />
                {errors.company && (
                  <p className="text-sm text-destructive">{errors.company.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Location *
                </label>
                <input
                  {...register('location')}
                  className="input"
                  placeholder="San Francisco, CA"
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Bio *
              </label>
              <textarea
                {...register('bio')}
                className="input min-h-[100px] resize-none"
                placeholder="Tell us about yourself, your experience, and what you're looking for..."
              />
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
                )}
            </div>
          </div>

          {/* Skills */}
          <div className="card space-y-6">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Skills & Expertise</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="input flex-1"
                  placeholder="Add a skill (e.g., React, Product Management)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-2xl"
                  >
                    <span className="text-sm font-medium">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-primary hover:text-primary/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="card space-y-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Conference Goals</h2>
            </div>
            <div className="space-y-4">
              <button
                type="button"
                onClick={addGoal}
                className="btn-secondary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </button>
              <div className="space-y-2">
                {watchedGoals.map((goal: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="flex-1">{goal}</span>
                    <button
                      type="button"
                      onClick={() => removeGoal(goal)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card space-y-6">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="input"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  LinkedIn
                </label>
                <input
                  {...register('linkedin')}
                  className="input"
                  placeholder="https://linkedin.com/in/johndoe"
                />
                {errors.linkedin && (
                  <p className="text-sm text-destructive">{errors.linkedin.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Twitter
                </label>
                <input
                  {...register('twitter')}
                  className="input"
                  placeholder="https://twitter.com/johndoe"
                />
                {errors.twitter && (
                  <p className="text-sm text-destructive">{errors.twitter.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  GitHub
                </label>
                <input
                  {...register('github')}
                  className="input"
                  placeholder="https://github.com/johndoe"
                />
                {errors.github && (
                  <p className="text-sm text-destructive">{errors.github.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>{isSubmitting ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
          </form>
        </motion.div>
      </section>

      {/* Web3 Integration Notice */}
      <section className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20"
        >
          {/* You can add a notice or info here if needed */}
        </motion.div>
        <AIChatbot/>
      </section>
    </div>
  )
}

export default Profile
