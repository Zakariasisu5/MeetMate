import React from 'react'
import { useSettings } from '../contexts/SettingsContext'

const SettingsModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { settings, update, reset } = useSettings()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-lg max-w-md w-full p-6 z-50">
        <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>

        <div className="space-y-4 text-sm text-white/90">
          <div>
            <label className="block text-white/80 mb-2">Theme</label>
            <div className="flex items-center space-x-2">
              {(['system', 'light', 'dark'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => update({ theme: t })}
                  className={`px-3 py-1 rounded-lg ${settings.theme === t ? 'bg-blue-500/20 text-white' : 'text-white/60 hover:bg-white/5'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white/80 mb-2">Marquee autoplay</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => update({ marqueeEnabled: !settings.marqueeEnabled })}
                className={`px-3 py-1 rounded-lg ${settings.marqueeEnabled ? 'bg-blue-500/20 text-white' : 'text-white/60 hover:bg-white/5'}`}
              >
                {settings.marqueeEnabled ? 'On' : 'Off'}
              </button>
              <div className="flex-1">
                <label className="block text-white/70 text-xs">Speed</label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={settings.marqueeSpeed}
                  onChange={(e) => update({ marqueeSpeed: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-white/80 mb-2">Notifications</label>
            <div>
              <button
                onClick={() => update({ notificationsEnabled: !settings.notificationsEnabled })}
                className={`px-3 py-1 rounded-lg ${settings.notificationsEnabled ? 'bg-blue-500/20 text-white' : 'text-white/60 hover:bg-white/5'}`}
              >
                {settings.notificationsEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={() => { reset(); onClose() }} className="px-4 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5">Reset</button>
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-blue-500 text-white">Done</button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
