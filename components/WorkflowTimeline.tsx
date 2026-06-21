'use client'

import { motion } from 'framer-motion'
import { SectionContainer } from './SectionContainer'
import { AnimatedHeading } from './AnimatedHeading'
import { Camera, Zap, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: Camera,
    title: 'Capture',
    description: 'Take photos of household items from multiple angles',
  },
  {
    icon: Zap,
    title: 'Analyze',
    description: 'AI instantly processes and identifies each item',
  },
  {
    icon: CheckCircle,
    title: 'Generate',
    description: 'Automatic inventory report with categories and weight',
  },
]

export function WorkflowTimeline() {
  return (
    <SectionContainer id="workflow">
      <div className="flex flex-col items-center gap-12">
        {/* Heading */}
        <div className="text-center max-w-2xl">
          <AnimatedHeading>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              How PackAI Works
            </h2>
          </AnimatedHeading>
          <AnimatedHeading delay={0.1}>
            <p className="text-lg text-gray-400">
              Three simple steps to transform your inventory management
            </p>
          </AnimatedHeading>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative">
          {/* Connection line (desktop only) */}
          <div className="hidden md:block absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0" />

          {/* Timeline steps */}
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="relative flex flex-col items-center"
              >
                {/* Step number circle */}
                <motion.div
                  className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 relative z-10"
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Step content */}
                <div className="flex flex-col items-center gap-3">
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-gray-400 text-center text-sm max-w-xs">
                    {step.description}
                  </p>
                </div>

                {/* Arrow indicator (mobile) */}
                {i < steps.length - 1 && (
                  <div className="md:hidden mt-6 text-blue-400 text-2xl">↓</div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </SectionContainer>
  )
}
