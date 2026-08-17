import { ImageIcon } from './icons'

interface ImagePlaceholderProps {
  src?: string
  alt: string
  className?: string
}

export function ImagePlaceholder({ src, alt, className = '' }: ImagePlaceholderProps) {
  if (src) {
    return <img src={src} alt={alt} className={`object-cover ${className}`} />
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex items-center justify-center bg-brand-soft text-brand/40 ${className}`}
    >
      <ImageIcon />
    </div>
  )
}
