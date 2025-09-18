import React from 'react'

type Tier = 'Sponsor'

interface SponsorCardProps {
  name: string
  logoUrl: string
  tier: Tier
  Icon: React.ComponentType<any>
  url?: string
}

const SponsorCard: React.FC<SponsorCardProps> = ({ name, logoUrl, tier, Icon, url }) => {
  // With tier categories simplified, use a single neutral sponsor card style.
  const tierClass = 'sponsor-card--neutral'

  const content = (
    <div
      className={`sponsor-card ${tierClass} w-72 h-44 p-4 rounded-2xl flex flex-col items-center justify-between`} 
      role="group"
      aria-label={`${name} — ${tier} Sponsor`}
    >
      <div className="w-full flex items-start justify-between">
        <div className="industry-icon inline-flex items-center justify-center p-1 rounded-md bg-transparent">
          <Icon className="h-5 w-5 stroke-current text-white/90" />
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center gap-2">
        <div className="logo-wrapper relative w-full flex items-center justify-center">
          <img
            src={logoUrl}
            alt={`${name} logo`}
            className="max-h-16 object-contain"
            loading="lazy"
            decoding="async"
            onError={(e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = '/sponsor-fallback.svg'; }}
          />

          <div className="sponsor-name-overlay pointer-events-none absolute inset-0 flex items-end justify-center p-3">
            <div className="sponsor-name-overlay-text text-sm font-semibold px-3 py-1 rounded-md">{name}</div>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-center">
        <span className="tier-label text-sm font-semibold tracking-wide">{tier === 'Sponsor' ? 'Sponsor' : `${tier} Sponsor`}</span>
      </div>
    </div>
  )

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="no-underline" aria-label={`${name} — opens in a new tab`}>
        {content}
      </a>
    )
  }

  return content
}

export default SponsorCard
