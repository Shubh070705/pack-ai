'use client'

import { SectionContainer } from './SectionContainer'
import { KPICard } from './KPICard'
import { AnimatedHeading } from './AnimatedHeading'

export function StatisticsSection() {
  return (
    <SectionContainer id="statistics" className="bg-gradient-to-b from-slate-900/20 to-transparent rounded-3xl">
      <div className="flex flex-col items-center gap-12">
        {/* Heading */}
        <div className="text-center max-w-2xl">
          <AnimatedHeading>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Trusted by Leading Moving Companies
            </h2>
          </AnimatedHeading>
          <AnimatedHeading delay={0.1}>
            <p className="text-lg text-gray-400">
              NEXTGEN is transforming the moving industry with cutting-edge AI technology
            </p>
          </AnimatedHeading>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <KPICard
            number="Live"
            label="Scan Activity"
            description="Start Demo activity comes from completed scan actions"
            delay={0}
          />
          <KPICard
            number="Image"
            label="Images Processed"
            description="Image totals are recorded after backend detection succeeds"
            delay={0.1}
          />
          <KPICard
            number="Video"
            label="Videos Processed"
            description="Video totals are recorded after backend detection succeeds"
            delay={0.2}
          />
          <KPICard
            number="Time"
            label="Average Detection"
            description="Timing is calculated from returned inference duration"
            delay={0.3}
          />
        </div>
      </div>
    </SectionContainer>
  )
}
