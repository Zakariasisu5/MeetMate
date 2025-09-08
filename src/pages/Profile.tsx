import React, { useState, useEffect } from "react"
// import { useForm } from "react-hook-form"
import { Linkedin, Github, Globe, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Simple local form state for Profile
// Remove react-hook-form and use useState for form fields

type ProfileFormData = {
  name: string
  bio: string
  location: string
  website: string
  email: string
  linkedin: string
  github: string
}

const defaultProfile: ProfileFormData = {
  name: "",
  bio: "",
  location: "",
  website: "",
  email: "",
  linkedin: "",
  github: ""
}

const Profile: React.FC = () => {
  const [form, setForm] = useState<ProfileFormData>(defaultProfile)
  const [savedProfile, setSavedProfile] = useState<ProfileFormData | null>(null)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [isEditing, setIsEditing] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("userProfile")
    if (stored) {
      const parsed = JSON.parse(stored)
      setSavedProfile(parsed)
      setForm(parsed)
      if (parsed.avatar) setAvatar(parsed.avatar)
      if (parsed.skills) setSkills(parsed.skills)
      setIsEditing(false)
    }
  }, [])

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPreview(base64String)
        setAvatar(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setSkills((prev) => [...prev, skillInput.trim()])
      setSkillInput("")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const profileData = { ...form, avatar: avatar || preview, skills }
    localStorage.setItem("userProfile", JSON.stringify(profileData))
    setSavedProfile(profileData)
    setAvatar(profileData.avatar || null)
    setIsEditing(false)
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-2xl rounded-2xl p-6 overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
              Edit Profile
            </h2>
            <form onSubmit={onSubmit} className="space-y-5 text-black">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatar}
                  className="hidden"
                  id="avatarUpload"
                />
                <label
                  htmlFor="avatarUpload"
                  className="cursor-pointer w-28 h-28 rounded-full overflow-hidden border-4 border-blue-500 flex items-center justify-center shadow-md hover:shadow-lg transition"
                >
                  {preview || avatar ? (
                    <motion.img
                      key={preview || avatar}
                      src={preview || avatar || ""}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  ) : (
                    <span className="text-sm text-gray-500">Upload</span>
                  )}
                </label>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold mb-1">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Write something about yourself"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold mb-1">Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Where are you from?"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold mb-1">Website</label>
                <input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-semibold mb-1">LinkedIn</label>
                <input
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-sm font-semibold mb-1">GitHub</label>
                <input
                  name="github"
                  value={form.github}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/username"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-semibold mb-1">Skills</label>
                <div className="flex space-x-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a skill"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm shadow"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>

              <motion.button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save Profile
              </motion.button>
            </form>
          </motion.div>
        ) : (
          savedProfile && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="bg-white shadow-2xl rounded-2xl p-6 text-center"
            >
              {avatar && (
                <motion.img
                  src={avatar}
                  alt="Profile"
                  className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-blue-500 shadow-md"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
              <h2 className="text-2xl font-bold mt-4 text-blue-600">{savedProfile.name}</h2>
              <p className="text-gray-600 mt-2">{savedProfile.bio}</p>
              <p className="text-gray-500 mt-1">{savedProfile.location}</p>

              {/* Social Links */}
              <div className="flex justify-center gap-4 mt-4">
                {savedProfile.website && (
                  <motion.a
                    href={savedProfile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                    title="Website"
                    whileHover={{ scale: 1.2 }}
                  >
                    <Globe className="w-6 h-6" />
                  </motion.a>
                )}
                {savedProfile.email && (
                  <motion.a
                    href={`mailto:${savedProfile.email}`}
                    className="text-red-500 hover:text-red-700"
                    title="Email"
                    whileHover={{ scale: 1.2 }}
                  >
                    <Mail className="w-6 h-6" />
                  </motion.a>
                )}
                {savedProfile.linkedin && (
                  <motion.a
                    href={savedProfile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-700 hover:text-blue-900"
                    title="LinkedIn"
                    whileHover={{ scale: 1.2 }}
                  >
                    <Linkedin className="w-6 h-6" />
                  </motion.a>
                )}
                {savedProfile.github && (
                  <motion.a
                    href={savedProfile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-800 hover:text-black"
                    title="GitHub"
                    whileHover={{ scale: 1.2 }}
                  >
                    <Github className="w-6 h-6" />
                  </motion.a>
                )}
              </div>

              {/* Skills */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Skills</h3>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm shadow"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={() => setIsEditing(true)}
                className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Edit Profile
              </motion.button>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  )
}

export default Profile

