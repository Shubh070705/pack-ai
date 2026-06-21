import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'lg'
}

export function GlassCard({
  children,
  className = '',
  variant = 'default',
}: GlassCardProps) {
  const variantClass = variant === 'lg' ? 'glass-lg' : 'glass'

  return (
    <div className={`rounded-2xl p-6 ${variantClass} ${className}`}>
      {children}
    </div>
  )
}
