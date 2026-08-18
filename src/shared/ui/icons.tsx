interface IconProps {
  size?: number
}

function icon(size: number) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
}

export function GraduationCapIcon({ size = 24 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <path d="M12 4 2 9l10 5 10-5-10-5z" />
      <path d="M6 11.5V17c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-5.5" />
    </svg>
  )
}

export function PhoneIcon({ size = 18 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
    </svg>
  )
}

export function LockIcon({ size = 18 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

export function EyeIcon({ size = 18 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function EyeOffIcon({ size = 18 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <path d="M9.9 5.2A9.9 9.9 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2M6.6 6.7A17.5 17.5 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 4.2-.9" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
  )
}

export function ShieldIcon({ size = 18 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z" />
    </svg>
  )
}

export function LoginIcon({ size = 18 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  )
}

export function FingerprintIcon({ size = 18 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <path d="M12 11v3a9 9 0 0 1-1.2 4.5" />
      <path d="M8.5 5.6a7 7 0 0 1 10.4 5.9v2" />
      <path d="M5 8.5A7 7 0 0 0 4.1 12v2c0 1.4-.3 2.7-.9 3.9" />
      <path d="M8 12a4 4 0 0 1 8 0v2c0 1.6-.3 3.1-.9 4.5" />
      <path d="M19 17.5c.3-1.2.4-2.4.4-3.5v-2" />
    </svg>
  )
}

export function AlertIcon({ size = 18 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

export function RefreshIcon({ size = 18 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" />
      <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" />
      <polyline points="3 21 3 16 8 16" />
      <polyline points="21 3 21 8 16 8" />
    </svg>
  )
}

export function CheckBadgeIcon({ size = 18 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <path d="m12 2 2.4 2.1 3.2-.3.6 3.1 2.7 1.7-1.4 2.9 1.4 2.9-2.7 1.7-.6 3.1-3.2-.3L12 21l-2.4-2.1-3.2.3-.6-3.1L3.1 14.4 4.5 11.5 3.1 8.6l2.7-1.7.6-3.1 3.2.3z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

export function MailIcon({ size = 18 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <polyline points="3 7 12 13 21 7" />
    </svg>
  )
}

export function IdCardIcon({ size = 18 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8.5" cy="11" r="2" />
      <path d="M5 16c.6-1.5 2-2.2 3.5-2.2S11.4 14.5 12 16" />
      <line x1="15" y1="10" x2="19" y2="10" />
      <line x1="15" y1="14" x2="19" y2="14" />
    </svg>
  )
}

export function HomeIcon({ size = 24 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z" />
    </svg>
  )
}

export function BookIcon({ size = 24 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v4H6.5A2.5 2.5 0 0 1 4 19.5z" />
    </svg>
  )
}

export function PersonIcon({ size = 24 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  )
}

export function ArrowLeftIcon({ size = 20 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <line x1="20" y1="12" x2="4" y2="12" />
      <polyline points="10 6 4 12 10 18" />
    </svg>
  )
}

export function LogoutIcon({ size = 20 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

export function PlayIcon({ size = 18 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <polygon points="6 4 20 12 6 20" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ClockIcon({ size = 18 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  )
}

export function MenuIcon({ size = 22 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  )
}

export function CloseIcon({ size = 22 }: IconProps) {
  return (
    <svg {...icon(size)}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  )
}
