'use client'

import { SectionContainer } from './SectionContainer'
import { FeatureCard } from './FeatureCard'
import { AnimatedHeading } from './AnimatedHeading'
import {
  Zap,
  BarChart3,
  Users,
  Lock,
  Smartphone,
  Settings,
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Real-time Detection',
    description: 'AI-powered analysis for uploaded media and live camera frames',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive reporting and insights on your inventory distribution',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Seamless coordination across your entire moving operations team',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with industry standards',
  },
  {
    icon: Smartphone,
    title: 'Mobile Ready',
    description: 'Full-featured mobile app for on-site inventory management',
  },
  {
    icon: Settings,
    title: 'Easy Integration',
    description: 'Seamless integration with your existing business systems',
  },
]

export function FeaturesGrid() {
  return (
    <SectionContainer id="features">
      <div className="flex flex-col items-center gap-12">
        {/* Heading */}
        <div className="text-center max-w-2xl">
          <AnimatedHeading>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Powerful Features Built for You
            </h2>
          </AnimatedHeading>
          <AnimatedHeading delay={0.1}>
            <p className="text-lg text-gray-400">
              Everything you need to revolutionize your moving business operations
            </p>
          </AnimatedHeading>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {features.map((feature, i) => (
            <FeatureCard
              key={i}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={i * 0.05}
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  )
}
