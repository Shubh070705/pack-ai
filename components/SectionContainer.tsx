import { ReactNode } from 'react'

interface SectionContainerProps {
  children: ReactNode
  className?: string
  id?: string
}

export function SectionContainer({
  children,
  className = '',
  id,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8 lg:py-32 ${className}`}
    >
      {children}
    </section>
  )
}
