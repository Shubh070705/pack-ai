'use client'

import { motion } from 'framer-motion'
import { SectionContainer } from './SectionContainer'
import { GlassCard } from './GlassCard'
import { AnimatedHeading } from './AnimatedHeading'

export function DashboardPreview() {
  return (
    <SectionContainer id="dashboard">
      <div className="flex flex-col items-center gap-12">
        {/* Heading */}
        <div className="text-center max-w-2xl">
          <AnimatedHeading>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Enterprise Start Demo Workspace
            </h2>
          </AnimatedHeading>
          <AnimatedHeading delay={0.1}>
            <p className="text-lg text-gray-400">
              Complete control and visibility over all your moving operations
            </p>
          </AnimatedHeading>
        </div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <GlassCard variant="lg" className="p-0 overflow-hidden rounded-3xl">
            <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 p-8">
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm text-gray-400 ml-2">NEXTGEN Start Demo</span>
                </div>
              </div>

              {/* Main content area */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Today's Scans", value: 'Live', color: 'from-blue-500' },
                    { label: 'Images Processed', value: 'Live', color: 'from-sky-500' },
                    { label: 'Videos Processed', value: 'Live', color: 'from-green-500' },
                    { label: 'Average Time', value: 'Live', color: 'from-orange-500' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      className={`bg-gradient-to-br ${stat.color}/20 to-transparent p-4 rounded-lg border border-white/10`}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
                      <p className="text-xl md:text-2xl font-bold text-white">
                        {stat.value}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Charts section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Chart 1 */}
                  <div className="bg-slate-800/30 p-4 rounded-lg border border-white/10">
                    <p className="text-sm font-semibold text-gray-300 mb-4">Scan Activity</p>
                    <div className="h-40 flex items-end gap-1">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-blue-500/40 to-blue-400/20 rounded-t-sm hover:from-blue-500/60 hover:to-blue-400/40 transition-colors cursor-pointer"
                          style={{
                            height: `${Math.random() * 80 + 20}%`,
                          }}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${Math.random() * 80 + 20}%` }}
                          transition={{ duration: 0.6, delay: i * 0.03 }}
                          viewport={{ once: true }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Chart 2 */}
                  <div className="bg-slate-800/30 p-4 rounded-lg border border-white/10">
                    <p className="text-sm font-semibold text-gray-300 mb-4">Detection Status</p>
                    <div className="h-40 flex items-center justify-center">
                      <svg className="w-32 h-32" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#334155"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="8"
                          strokeDasharray="282.74"
                          strokeDashoffset="14.14"
                          strokeLinecap="round"
                          initial={{ strokeDashoffset: 282.74 }}
                          whileInView={{
                            strokeDashoffset: 14.14,
                          }}
                          transition={{ duration: 1.5, delay: 0.2 }}
                          viewport={{ once: true }}
                        />
                        <text
                          x="50"
                          y="55"
                          textAnchor="middle"
                          fontSize="20"
                          fontWeight="bold"
                          fill="#f1f5f9"
                        >
                          Live
                        </text>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Table section */}
                <div className="bg-slate-800/30 p-4 rounded-lg border border-white/10 overflow-x-auto">
                  <p className="text-sm font-semibold text-gray-300 mb-4">Recent Inventories</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 text-gray-400 font-medium">Source</th>
                        <th className="text-left py-2 text-gray-400 font-medium">Objects</th>
                        <th className="text-left py-2 text-gray-400 font-medium">Time</th>
                        <th className="text-left py-2 text-gray-400 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Image scan', 'Video scan', 'Live scan'].map((source) => (
                        <tr
                          key={source}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3 text-gray-300">{source}</td>
                          <td className="py-3 text-gray-300">From scan</td>
                          <td className="py-3 text-gray-300">Backend</td>
                          <td className="py-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </SectionContainer>
  )
}
